import { OpenAI } from "openai";
import { config } from "dotenv";
import readlineSync from "readline-sync";
config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages = [];

async function chat() {
    while (true) {
        const input = readlineSync.question("You: ");
        messages.push({ role: "user", content: input });
        //console.log(JSON.stringify(messages, null, 2));

        const result = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
        });

        const reply = result.choices[0].message;
        console.log(`GPT-4: ${reply.content}`);

        messages.push(reply);
    }
}

chat();
