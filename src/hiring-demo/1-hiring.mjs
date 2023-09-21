import {OpenAI} from "openai";
import {config} from "dotenv";
import * as fs from "fs";
import {readPdfText} from "pdf-text-reader";

config({path: '../../.env'});
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const systemMessage = "You are a recruitment expert";
const prompt = `
Below is the CV of a job candidate for the following job: {job}.
Evaluate the candidate. Write the main pros and cons, and your personal reflection.
Here is the CV:
{cv}
`;

const jobFile = 'astronaut.txt'
const cvFile = 'MarieCurie.md'

async function main() {
    const job = await readFile('../../files/hiring-demo/jobs/' + jobFile);
    const cv = await readFile('../../files/hiring-demo/candidates/' + cvFile);

    const fullPrompt = prompt
        .replace('{job}', job)
        .replace('{cv}', cv);

    console.log(`Evaluating ${cvFile} for the job ${jobFile}...`);
    const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": fullPrompt},
        ]
    })
    const evaluation = result.choices[0].message.content;
    console.log(evaluation);
}

async function readFile(filePath) {
    if (filePath.endsWith('.pdf')) {
        return await readPdfText({ url: filePath });
    } else {
        return fs.readFileSync(filePath, 'utf8');
    }
}

main();