import {OpenAI} from "openai";
import {config} from "dotenv";
config({path: '../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const weatherFunctionSchema = {
    "name": "getWeather",
    "description": "Get the current weather for a city",
    "parameters": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "The city",
            },
        },
        "required": ["city"],
    },
}

const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {"role": "user", "content": "Is it raining in Stockholm?"},
    ],
    functions: [weatherFunctionSchema]
})
console.log(gptResponse.choices[0].message);
