import { OpenAI } from "openai";
import { config } from "dotenv";
import readlineSync from "readline-sync";
/*
    Prompt used to generate this code:

    Look at the above example of how to talk to OpenAI (helloworld-demo).
    Create a new program that is chat loop, so I can keep chatting with the AI.
 */
config({path: '../../.env'});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages = [];

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

