import { PrismaClient, ChatType } from "@prisma/client";
import randomSentence from "random-sentence";
import { USER_1_ID, USER_2_ID, CHAT_ID } from "./constants.js";

const prisma = new PrismaClient();
await prisma.$connect();

console.log("Creating chat...")

const chat = await prisma.chat.create({
    data: {
        id: CHAT_ID,
        chatType: ChatType.Direct,
        recipients: [
            {
                userId: USER_1_ID,
                nickname: "Test subject #1498"
            },
            {
                userId: USER_2_ID,
                nickname: "someone"
            }
        ],

    }
});

console.log("Chat created:")
console.log(chat);


let messages = [];
for(let i = 0; i < 100_000; i++) {
    messages.push({
        chatId: CHAT_ID,
        authorId: [USER_1_ID, USER_2_ID][Math.floor(Math.random() * 2)],
        content: randomSentence({ min: 10, max: 100 }),
    })
}

console.log("Saving 100k messages...");
await prisma.message.createMany({
    data: messages
});
console.log("Done!")
