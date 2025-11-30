import { GoogleGenAI } from "@google/genai";
import { GenerationContext } from '../types';

// Lazy initialization
const getAiClient = (apiKey?: string) => {
  // Use provided key, fallback to env var
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    console.warn("API Key is missing. Please configure it in Settings or via environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generatePRDSection = async (
  sectionTitle: string,
  context: GenerationContext,
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    
    // Construct a context-aware prompt
    const prompt = `
      You are an expert Product Manager at a top-tier tech company. 
      Your task is to write the specific section: "${sectionTitle}" for a Product Requirements Document (PRD).
      
      Product Context:
      - Product Name: ${context.productName}
      - Brief Description: ${context.shortDescription}
      
      Existing Content Context (if any):
      ${JSON.stringify(context.existingSections)}
      
      Instructions:
      - Write only the content for the "${sectionTitle}" section.
      - Be professional, concise, and structured.
      - Use bullet points where appropriate.
      - Do not include the section title in the output, just the content.
      - Format using Markdown.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error generating PRD content:", error);
    throw new Error("Failed to generate content. Check your API Key or Network.");
  }
};

export const generateProductDescription = async (
  productName: string,
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    const prompt = `
      Write a concise, compelling 2-3 sentence product description for a product named "${productName}". 
      Focus on what it might do and who it is for.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate description");
  }
};

export const enhanceText = async (
  text: string,
  instruction: string,
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    const prompt = `
      You are an expert editor. 
      Instruction: ${instruction}
      Original Text:
      "${text}"
      
      Output the improved text only. Keep the same format (Markdown).
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Error enhancing text:", error);
    return text;
  }
};