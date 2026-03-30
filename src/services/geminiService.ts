import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getSchoolEnquiryResponse(userMessage: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `
          You are a helpful and professional virtual assistant for St. Andrews International School.
          Your goal is to answer enquiries from students, parents, and prospective families.
          
          School Info:
          - Name: St. Andrews International School
          - Location: 123 Education Lane, Academic City
          - Founded: 1985
          - Curriculum: International Baccalaureate (IB) and IGCSE
          - Facilities: Modern labs, Olympic-sized pool, 500-seat theater, Digital Library.
          - Activities: Sports Meet (April 15), Science Fair (May 10), Art Exhibition (April 22), Debate (May 5), Music Gala (June 12).
          - Contact: info@standrews.edu | +1 (555) 012-3456
          
          Tone: Professional, welcoming, and informative.
          If you don't know an answer, politely suggest they contact the administration office directly.
        `,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to the school database right now. Please try again later or contact the office directly.";
  }
}
