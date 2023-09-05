import { OpenAI } from "openai";
import { config } from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { readPdfText } from 'pdf-text-reader';

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const jobDescriptionFile = 'baker.txt';

const systemMessage = "You are a recruitment expert";

const candidateEvaluationPrompt = `
Below is the CV of a job candidate for the following job: {job}.
Evaluate the candidate. Write the main pros and cons, and your personal reflection.
Here is the CV:
{cv}
`;

const finalRecommendationPrompt = `
Below is an evaluation of job candidates for the following job: {job}.
Based on this information, who looks most promising for this job, and why?
{candidateEvaluations}
`;

const candidatesDir = path.join('..', 'hiring-demo', 'candidates');
const evaluationsDir = path.join('..', 'hiring-demo', 'evaluations');
const candidateFileNames = fs.readdirSync(candidatesDir);

async function evaluateCandidate(job, candidateFileName) {
    console.log(`Evaluating ${candidateFileName}...`);

    const cv = await readFile(path.join(candidatesDir, candidateFileName));
    const fullPrompt = candidateEvaluationPrompt
        .replace('{job}', job)
        .replace('{cv}', cv);

    const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { "role": "system", "content": systemMessage },
            { "role": "user", "content": fullPrompt },
        ]
    });

    const evaluationText = result.choices[0].message.content;
    console.log(`...got result for ${candidateFileName}`);

    await saveEvaluation(candidateFileName, evaluationText);
    return evaluationText;
}

async function generateFinalRecommendation(job, evaluations) {
    const fullPrompt = finalRecommendationPrompt
        .replace('{job}', job)
        .replace('{candidateEvaluations}', evaluations.join('\n\n'));

    console.log("Generating final recommendation..")
    const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {"role": "system", "content": systemMessage},
            {"role": "user", "content": fullPrompt},
        ]
    });

    let finalRecommendation = result.choices[0].message.content;
    return finalRecommendation;
}

async function main() {
    const job = await readFile(path.join('..', 'hiring-demo', jobDescriptionFile));
    const evaluations = await Promise.all(candidateFileNames.map(candidateFileName => evaluateCandidate(job, candidateFileName)));
    let finalRecommendation = await generateFinalRecommendation(job, evaluations);
    console.log(finalRecommendation);
}

async function readFile(fileName) {
    if (fileName.endsWith('.pdf')) {
        return await readPdfText({ url: fileName });
    } else {
        return fs.readFileSync(fileName, 'utf8');
    }
}

async function saveEvaluation(candidateFileName, evaluationText) {
    const evaluationFileName = path.join(evaluationsDir, candidateFileName.replace(/\..+$/, '') + '-evaluation.txt');
    fs.writeFileSync(evaluationFileName, evaluationText);
}

main();
