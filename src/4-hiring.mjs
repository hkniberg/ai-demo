import {OpenAI} from "openai";
import {config} from "dotenv";
import * as path from "path";
import * as fs from "fs";
import {readPdfText} from "pdf-text-reader";

config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const systemMessage = "You are a recruitment expert";
const prompt = `
Below is the CV of a job candidate for the following job: {job}.
Evaluate the candidate. Write the main pros and cons, and your personal reflection.
Here is the CV:
{cv}
`;

async function main() {
    const job = await readFile('astronaut.txt');
    const cv = await readFile('candidates/MarieCurie.md');

    const fullPrompt = prompt
        .replace('{job}', job)
        .replace('{cv}', cv);

    console.log("Evaluating candidate...");
    const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": fullPrompt},
        ]
    })
    console.log(result.choices[0].message.content);
}

async function readFile(fileName) {
    const fullPath = path.join('..', 'hiring-demo', fileName)
    if (fileName.endsWith('.pdf')) {
        return await readPdfText({ url: fullPath });
    } else {
        return fs.readFileSync(fullPath, 'utf8');
    }
}

main();