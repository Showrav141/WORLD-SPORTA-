
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAnalysis = async (teamA: string, teamB: string, sport: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a professional, brief pre-match analysis for a ${sport} game between ${teamA} and ${teamB}. Mention key players to watch and a likely outcome prediction. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Analysis currently unavailable. Please check back later.";
  }
};

export const getNewsSummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following sports news content into 3 bullet points: \n\n${content}`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Summary failed:", error);
    return "Summary unavailable.";
  }
};
