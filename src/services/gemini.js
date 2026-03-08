import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const generateCreativeConcept = async (prompt) => {
  if (!apiKey) throw new Error("API Key not found");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a high-end creative concept for a portfolio piece based on this theme: "${prompt}". Provide a title and a 2-sentence description.`,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text);
};
