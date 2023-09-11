import {OpenAI} from "openai";
import {config} from "dotenv";
config({path: '../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {"role": "user", "content": "Is it raining in Stockholm?"},
    ]
})
console.log(gptResponse.choices[0].message.content);

