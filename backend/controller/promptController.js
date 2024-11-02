import { run } from "../geminiAiApi.js";
export const promptInput = (req, res) => {
  const { prompt } = req.body;
  run(prompt);
};
