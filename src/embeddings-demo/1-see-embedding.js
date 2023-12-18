import {OpenAI} from "openai";
import {config} from "dotenv";
config({path: '../../.env'});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// https://platform.openai.com/docs/api-reference/embeddings/create
const result = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: "Cats are cute"
})
console.log(result.data[0].embedding);

// Uncomment this to see all the gory details of the response
//console.log(JSON.stringify(result, null, 2));