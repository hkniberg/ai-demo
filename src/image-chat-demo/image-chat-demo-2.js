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

Create a new chat application that is image-enabled.
It is like chatgpt, but you can also ask it generate images.

For example:
Me: "Hi there"
GPT: "How can I help you?"
Me: "I need a picture of a pig"
GPT: OK, here you go: (image URL)
Me: "Actually, I want it to wear a hat"
GPT: OK, here is a pig with a hat: (image URL)

Use gpt-4 instead of gpt-3.5-turbo.
Use openai.chat to determine if the user is asking for an image, and to generate the image prompt in that case.
Use openai.images to generate the image URL from the image prompt.

Use the following system prompt:
"You are a chatbot that can also generate images. When an image needs to be generated,
include a string like IMAGE[<image prompt>].

Example:
User: I want an image of a pig, it should have a hat
Assistant: Sure, I can do that for you. IMAGE[pig with hat]

Then send 'pig with hat' to openai.images, and replace the prompt with the URL, so the output is:
 'Sure, I can do that for you. http://....'

 Also log the image prompt.
 */
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const messages = [
    { role: "system", content: "You are a chatbot that can also generate images. " +
            "When an image needs to be generated, " +
            "include a string like IMAGE[<image prompt>]." },
];

async function generateImage(prompt) {
    try {
        const result = await openai.images.generate({
            prompt: prompt,
            size: "256x256"
        });
        return result.data[0].url;
    } catch (error) {
        console.error("Error generating image:", error);
        return "Error generating image.";
    }
}

async function chat() {
    while (true) {
        const input = readlineSync.question("You: ");
        messages.push({ role: "user", content: input });

        // log the messages
        console.log("-------------")
        console.log(JSON.stringify(messages, null, 2));
        console.log("-------------")

        const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        // log the result
        console.log("========")
        console.log(JSON.stringify(result, null, 2));
        console.log("========")



        let reply = result.choices[0].message.content;
        const imagePromptMatch = reply.match(/IMAGE\[(.*?)\]/);

        if (imagePromptMatch) {
            const imagePrompt = imagePromptMatch[1];
            console.log(`Image Prompt: ${imagePrompt}`);
            const imageUrl = await generateImage(imagePrompt);
            reply = reply.replace(`IMAGE[${imagePrompt}]`, imageUrl);
        }

        console.log(`GPT: ${reply}`);
        messages.push({ role: "assistant", content: reply });
    }
}

chat();
