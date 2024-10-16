/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// export async function run(prompt) {
//   const chatSession = model.startChat({
//     generationConfig,
//     // safetySettings: Adjust safety settings
//     // See https://ai.google.dev/gemini-api/docs/safety-settings
//     history: [],
//   });

//   const result = await chatSession.sendMessage(prompt);
//   console.log(result.response.text());
// }
export async function run(promptText) {
  const prompt = `
  Please classify the following post. 
  Return a JSON object with fields: "isAgriculture", "crop", and "cropType". 
  If it does not belong to agriculture, set "isAgriculture" to false.
  
  Post description: "${promptText}"
  
  Your response should be strictly in JSON format without any additional text.
  Example:
  {
    "isAgriculture": true,
    "crop": "paddy",
    "cropType": "Hybrid Paddy"
  }
  `;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const response = result.response.text();

  // Parsing the response as JSON
  try {
    const jsonResponse = JSON.parse(response);
    console.log("Gemini Response:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return null;
  }
}
