import { PrismaClient } from "@prisma/client";
import { CHAT_ID } from "./constants.js";

const prisma = new PrismaClient({
    log: ["query"]
});

await prisma.$connect();
console.log("connected to db");

console.log("Retrieving document using nested 'take'...")

console.time("Document retrieved using nested 'take' took")
const result1 = await prisma.chat.findUnique({
    where: {
        id: CHAT_ID
    },
    include: {
        messages: {
            take: 3
        }
    }
})
console.timeEnd("Document retrieved using nested 'take' took")

console.time("equivalent query with findUnique & aggregateRaw combination took")
const chat = await prisma.chat.findUnique({
    where: {
        id: CHAT_ID
    }
});

const messages = await prisma.message.aggregateRaw({
    pipeline: [
        { $match: { chatId: CHAT_ID }, },
        { $sort: { _id: 1, }, },
        { $limit: 3 },
        { $project: { _id: 1, chatId: 1, authorId: 1, content: 1, deleted: 1, createdAt: 1, }, },
    ]
});
chat.messages = messages;
console.timeEnd("equivalent query with findUnique & aggregateRaw combination took")

if(process.argv.includes("result")) {
    console.log("result from nested `take`", result1)
    console.log()
    console.log("result from equivalent aggregateRaw and findUnique query", chat);
}