import {OpenAI} from "openai";
import {config} from "dotenv";
import {getWeather, weatherFunctionSchema} from "./weather.mjs";
config({path: '../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

let messages = [
    {"role": "user", "content": "Is it raining in Stockholm?"},
];
const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    functions: [weatherFunctionSchema]
})
const gptResponseMessage = gptResponse.choices[0].message;
console.log(gptResponseMessage);

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

    console.log("Giving the weather data back to GPT: ", messages);
    const gptResponse2 = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    console.log("GPT response:")
    console.log(gptResponse2.choices[0].message);
}



