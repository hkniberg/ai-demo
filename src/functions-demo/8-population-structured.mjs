import {OpenAI} from "openai";
import {config} from "dotenv";
import fs from "fs";
config({path: '../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

let prompt = 'What is the population of the 3 largest cities in europe?'

const populationFunctionSchema = {
    "name": "setPopulation",
    "description": "Reports the population in a number of cities",
    "parameters": {
        "type": "object",
        "properties": {
            "cities": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string",},
                        "population": {"type": "number",}
                    },
                    "required": ["city", "population"],
                },
            }
        },
        "required": ["cities"],
    },
}

const gptResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        {"role": "user", "content": prompt},
    ],
    functions: [populationFunctionSchema],
    function_call: {"name": "setPopulation"} // force GPT to call the function
})

const responseMessage = gptResponse.choices[0].message
if (responseMessage.function_call?.name !== 'setPopulation') {
    throw new Error("Hey, GPT was supposed to call setPopulation!")
}

const args = JSON.parse(responseMessage.function_call.arguments);
console.log(JSON.stringify(args, null, 2))


