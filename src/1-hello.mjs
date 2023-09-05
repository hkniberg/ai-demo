import {OpenAI} from "openai";
import {config} from "dotenv";
config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function main() {
    const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "user", "content": "hi there"},
        ]
    })
    console.log(result.choices[0].message.content);
}

main();