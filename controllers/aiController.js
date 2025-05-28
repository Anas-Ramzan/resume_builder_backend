const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const generateMockContent = (prompt, fieldType) => {
  if (fieldType === "profile summary") {
    return `Mock Profile Summary: ${prompt}. This is a generated summary.`;
  } else if (fieldType === "job description") {
    return `Mock Job Description: ${prompt}. This is a generated job description.`;
  } else if (fieldType === "project description") {
    return `Mock Project Description: ${prompt}. This is a generated project description.`;
  }
  return `Mock Content: ${prompt}`;
};

const generateAIContent = async (req, res) => {
  try {
    const { prompt, fieldType } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let enhancedPrompt = prompt;
        if (fieldType === "profile summary") {
          enhancedPrompt = `Write a professional profile summary for a resume. ${prompt}. Keep it concise, professional, and highlight key strengths and experience.`;
        } else if (fieldType === "job description") {
          enhancedPrompt = `Write professional job description bullet points for a resume. ${prompt}. Format as bullet points highlighting achievements and responsibilities.`;
        } else if (fieldType === "project description") {
          enhancedPrompt = `Write a professional project description for a resume. ${prompt}. Focus on technologies used, challenges solved, and impact achieved.`;
        }

        const result = await model.generateContent([enhancedPrompt]);
        const response = await result.response;
        const text = await response.text();

        if (text && text.trim()) {
          return res.status(200).json({ content: text.trim() });
        } else {
          throw new Error("Empty response from Gemini API");
        }
      } catch (geminiError) {
        console.error("Gemini API Error:", geminiError.message);
      }
    }

    const content = generateMockContent(prompt, fieldType);
    return res.status(200).json({ content });
  } catch (error) {
    console.error("AI Content Generation Error:", error.message);
    return res.status(500).json({
      message: "Failed to generate content",
      error: "Please try again or check your internet connection.",
    });
  }
};

module.exports = { generateAIContent };