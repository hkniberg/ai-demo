import { OpenAI } from "openai";
import { config } from "dotenv";
import readlineSync from "readline-sync";
config({ path: '../../.env' });

/*
Prompt used to generate this:

Here is simple chat application using OpenAI:
...(chat-demo/2-chat-system-prompt-mjs)...

Here is sample code for generating an image URL from a prompt:
...(image-demo/image-demo.js)...

Create a new chat application that is image-enabled
It is like chatgpt, but you can also ask it generate images.

 */

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages = [
    { role: "system", content: "you are a helpful assistant" },
];

async function chat() {
    console.log("Write 'generate image: xxx' to generate an image.")
    while (true) {
        const input = readlineSync.question("You: ");
        messages.push({ role: "user", content: input });

        if (input.toLowerCase().startsWith('generate image:')) {
            const prompt = input.substring('generate image:'.length).trim();
            try {
                const result = await openai.images.generate({
                    prompt: prompt,
                    size: "256x256"
                });
                console.log(`GPT: Here is the image URL: ${result.data[0].url}`);
            } catch (error) {
                console.error(`GPT: Sorry, I couldn't generate the image. ${error.message}`);
            }
        } else {
            try {
                const result = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: messages,
                });

                const reply = result.choices[0].message;
                console.log(`GPT: ${reply.content}`);
                messages.push(reply);
            } catch (error) {
                console.error(`GPT: Sorry, I couldn't generate a response. ${error.message}`);
            }
        }
    }
}

chat();
