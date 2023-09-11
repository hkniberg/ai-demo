import { OpenAI } from "openai";
import { config } from "dotenv";

/*
    Prompt used to generate this code:

    Generalize the above code.
    Make a function called compareTexts(existingTexts, newText),
    and lists the distance between the new text and each existing text.
    Sort by distance, smallest distance first.

    Sample output:
    "What kind of animal should I buy"
    - 0.64 distance from "Cats are cute"
    - 0.7 distance from "Hot dogs cost $3"
 */
config({ path: '../.env' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to compute Euclidean distance between two vectors
function euclideanDistance(vec1, vec2) {
    return Math.sqrt(vec1.reduce((sum, val, index) => sum + Math.pow(val - vec2[index], 2), 0));
}

// Function to generate embeddings for given text
async function getEmbedding(text) {
    const result = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    });
    return result.data[0].embedding;
}

async function compareTexts(existingTexts, newText) {
    const newEmbedding = await getEmbedding(newText);

    // Get embeddings for all existing texts and calculate distances
    const distancePromises = existingTexts.map(async (text) => {
        const embedding = await getEmbedding(text);
        const distance = euclideanDistance(newEmbedding, embedding);
        return { text, distance };
    });

    // Resolve all promises
    const distances = await Promise.all(distancePromises);

    // Sort distances in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Print sorted distances
    console.log(`"${newText}"`);
    distances.forEach(({ text, distance }) => {
        console.log(`- ${distance.toFixed(2)} distance from "${text}"`);
    });
}

const existingTexts = [
    "Hey Dad, I need help urgently",
    "Here is your Amazon.com purchase receipt",
    "Can you come in to the office this weekend?",
    "MAKE $$$$ EASILY! CLiCk HeRE!"
]

const newText = "Your domain xyz.com will expire tomorrow if you don't take action immediately.";
await compareTexts(existingTexts, newText);
