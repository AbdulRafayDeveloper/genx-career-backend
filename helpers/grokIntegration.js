import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeCVAndJobDescription = async (cvContent, jobDescription) => {
  try {
    if (!cvContent || !jobDescription) {
      return { status: 400, message: "Both CV content and job description are required" };
    }

    const cvWordCount = cvContent.split(" ").length;
    const jdWordCount = jobDescription.split(" ").length;

    if (cvWordCount > 1000 || jdWordCount > 1500) {
      return { status: 400, message: "Cv Content should not be more than 1000 words" };
    }

    if (jdWordCount > 700) {
      return { status: 400, message: "Job Description Content should not be more than 700 words" };
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Analyze the following CV content and job description. 
          1. Provide a one-word rating (Not Good, Good, Best) based on how well the CV matches the job description.
          2. Suggestions for improvements to make the CV better match the job description.
          3. List what matches and what does not match in separate paragraphs.

          CV Content: "${cvContent}"
          Job Description: "${jobDescription}"`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const responseContent =
      chatCompletion.choices[0]?.message?.content || "No response from Groq";
    return { status: 200, message: "Success", content: responseContent };
  } catch (error) {
    console.error("Error in analyzeCVAndJobDescription:", error);
    return { status: 500, message: "Internal server error. Please try again later" };
  }
};

export { analyzeCVAndJobDescription };
