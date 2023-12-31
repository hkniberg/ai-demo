import {OpenAI} from "openai";
import {config} from "dotenv";
config({path: '../../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

let prompt = "What is the population of the 3 largest cities in europe?";

const gptResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
        {"role": "user", "content": prompt},
    ]
})
console.log(gptResponse.choices[0].message.content);

