
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFunFact() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Fortell en kort, interessant 'fun fact' om tjenestearbeid, håndverk eller økonomi på norsk. Maks 2 setninger.",
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "Visste du at det første anbudssystemet ble brukt i antikkens Roma?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Visste du at flinke håndverkere sparer samfunnet for milliarder hvert år?";
  }
}

export async function generateChatSummary(messages: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Oppsummer denne samtalen mellom en kunde og en selger kort: ${messages.join("\n")}`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text || "Ingen oppsummering tilgjengelig.";
  } catch (error) {
    return "Kunne ikke generere oppsummering.";
  }
}
