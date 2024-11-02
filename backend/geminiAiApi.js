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
export async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const response = await result.response.text();

  // Log raw response for debugging
  console.log("Raw response:", response);

  // Clean the response to extract JSON data
  const jsonStartIndex = response.indexOf("{");
  const jsonEndIndex = response.lastIndexOf("}") + 1;

  if (jsonStartIndex === -1 || jsonEndIndex === -1) {
    console.error("Error: No valid JSON found in the response");
    return null;
  }

  const jsonResponseString = response.slice(jsonStartIndex, jsonEndIndex);

  // Parsing the response as JSON
  try {
    console.log("JSON Response String:", jsonResponseString); // Log the cleaned response
    const jsonResponse = JSON.parse(jsonResponseString);
    console.log("Gemini Response:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    console.error("Problematic JSON:", jsonResponseString); // Log the problematic part
    return null;
  }
}
