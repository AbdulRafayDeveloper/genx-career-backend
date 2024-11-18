import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const runGroqQuery = async (message, tone) => {
  try {
    if (!message) {
      return {status: 400, message: "Message is required"};
    }

    const wordCount = message.split(" ").length;
    if (wordCount > 1500) {
      return { status: 400, message: "Message exceeds the word limit of 1500 words" };
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Rewrite the following text in a ${tone} tone: "${message}"`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const responseContent =
      chatCompletion.choices[0]?.message?.content || "No response from Groq";
      return { status: 200, message: "Success", content: responseContent };
  } catch (error) {
    console.error("Error in runGroqQuery:", error);
    return {status: 500, message: "Internal server error. Please try again later"}
  }
};

export { runGroqQuery };
