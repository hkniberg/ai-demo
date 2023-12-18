import {OpenAI} from "openai";
import {config} from "dotenv";
import {getWeather, weatherFunctionSchema} from "./weather.js";
config({path: '../../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

/*
Prompt used to generate this:

Use the above code as a basis for making a function called callGpt(model, prompt).
It will loop and keep calling the getWeather function when requested,
and then return the final message when choices[0].finish_reason is 'stop'.

Log every request and response, but when logging requests only include the last message,
not the full message history.

Include a sample call where we ask
which of the 3 largest cities in Europe has sunniest weather.
 */

async function callGpt(model, prompt) {
    let messages = [
        {"role": "user", "content": prompt},
    ];

    while (true) {
        console.log("Sending request with last message: ", messages[messages.length - 1]);

        const gptResponse = await openai.chat.completions.create({
            model,
            messages,
            functions: [weatherFunctionSchema],
        });

        const gptResponseMessage = gptResponse.choices[0].message;
        console.log("Received response: ", gptResponseMessage);

        if (gptResponseMessage?.function_call?.name === 'getWeather') {
            const args = JSON.parse(gptResponseMessage.function_call.arguments);
            const city = args.city;
            console.log("GPT asked me to call getWeather for city: ", city);

            const weatherData = await getWeather(city);
            messages.push({
                role: "function",
                name: 'getWeather',
                content: JSON.stringify(weatherData)
            });
        } else {
            messages.push(gptResponseMessage);
        }

        if (gptResponse.choices[0].finish_reason === 'stop') {
            return gptResponseMessage.content;
        }
    }
}

const result = await callGpt("gpt-4-1106-preview",
    "Which of the biggest 3 european cities has the nicest weather right now?"
)
console.log(result);
