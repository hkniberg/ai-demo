import {OpenAI} from "openai";
import {config} from "dotenv";
config({path: '../.env'});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {"role": "user", "content": "I bet you can't say Hello World"},
    ]
})
console.log(result.choices[0].message.content);

// Uncomment this to see all the gory details of the response
// console.log(JSON.stringify(result, null, 2));