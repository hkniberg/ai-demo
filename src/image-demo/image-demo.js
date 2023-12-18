import {OpenAI} from "openai";
import {config} from "dotenv";
config({path: '../../.env'});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// https://platform.openai.com/docs/api-reference/images/create
const result = await openai.images.generate({
    prompt: "An ugly cat",
    size: "256x256" // optional, defaults to 1024x1024
});

console.log(result.data[0].url);

// Uncomment this to see all the gory details of the response
//console.log(JSON.stringify(result, null, 2));