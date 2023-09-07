import { OpenAI } from "openai";
import { config } from "dotenv";
import readlineSync from "readline-sync";
config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const messages = [
    { role: "system", content: "you are a drunk pirate with a foul temper" },
];

async function chat() {
    while (true) {
        const input = readlineSync.question("You: ");
        messages.push({ role: "user", content: input });

        const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        const reply = result.choices[0].message;
        console.log(`GPT: ${reply.content}`);

        messages.push(reply);
    }
}

chat();
