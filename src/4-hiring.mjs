import {OpenAI} from "openai";
import {config} from "dotenv";
import * as path from "path";
import * as fs from "fs";

config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const systemMessage = "You are a recruitment expert";
const prompt = `
Below is the CV of a job candidate for the following job: {job}.
Evaluate the candidate on a scale of 1-10, and write the main pros and cons.
{cv}
`;

async function main() {
    const job = readFile('baker.txt');
    const cv = readFile('MarieCurie.md');

    const fullPrompt = prompt
        .replace('{job}', job)
        .replace('{cv}', cv);

    const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": fullPrompt},
        ]
    })
    console.log(result.choices[0].message);
}

function readFile(fileName) {
    const fullPath = path.join('..', 'hiring-demo', fileName);
    return fs.readFileSync(fullPath, 'utf8');
}

main();