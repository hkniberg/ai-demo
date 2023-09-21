import { OpenAI } from "openai";
import { config } from "dotenv";

/*
  Prompt used to generate this code:

  Using the above code as a starting point,
  write code that generates embeddings for
  "Cats are cute", "Hot dogs cost $3", and "What kind of animal should I buy?",
  and calculates the distance between each pair.
  Place these in variables so I can change the text.
*/

config({ path: '../../.env' });
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

// Sample texts
const text1 = "Cats are cute";
const text2 = "Hot dogs cost $3";
const text3 = "What kind of animal should I buy?";

// Generate embeddings
const embedding1 = await getEmbedding(text1);
const embedding2 = await getEmbedding(text2);
const embedding3 = await getEmbedding(text3);

// Calculate distances
const distance12 = euclideanDistance(embedding1, embedding2);
const distance23 = euclideanDistance(embedding2, embedding3);
const distance13 = euclideanDistance(embedding1, embedding3);

console.log(`Distance between "${text1}" and "${text2}":`, distance12);
console.log(`Distance between "${text2}" and "${text3}":`, distance23);
console.log(`Distance between "${text1}" and "${text3}":`, distance13);
