import Groq from "groq-sdk";
import dotenv from "dotenv";
import pdfParse from "pdf-parse";
import { SummarizerManager } from "node-summarizer";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeCVAndJobDescription = async (cvContent, jobDescription) => {
    try {
        if (!cvContent || !jobDescription) {
            return { status: 400, message: "Both CV content and job description are required" };
        }

        const cvWordCount = cvContent.split(" ").length;
        const jdWordCount = jobDescription.split(" ").length;

        if (cvWordCount > 850) {
            return { status: 400, message: "Cv Content should not be more than 850 words" };
        }

        if (jdWordCount > 500) {
            return { status: 400, message: "Job Description Content should not be more than 500 words" };
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Analyze the following CV content and job description. 
                        1. Provide a one-word rating (Not Good, Good, Best) based on how well the CV matches the job description. The heading for this must be exactly "Rating". Do not use any other heading.
                        2. Provide suggestions for improvements to make the CV better match the job description.
                        3. Under the headings "Matches" and "Non-Matches," list what matches and what does not match in separate paragraphs.
        
                        CV Content: "${cvContent}"
                        Job Description: "${jobDescription}"`,
                },
            ],
            model: "llama3-8b-8192",
        });

        const analysis =
            chatCompletion.choices[0]?.message?.content || "No response from Groq";

        return analysis;
    } catch (error) {
        console.error("Error in analyzeCVAndJobDescription:", error);
        return { status: 500, message: "Internal server error. Please try again later" };
    }
};

const extractTextFromPDF = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text; // Extracted text
    } catch (err) {
        throw new Error("Error extracting PDF text: " + err.message);
    }
};

const summarizeText = async (text, maxLength = 1000) => {
    try {
        while (text.split(/\s+/).length > maxLength) {
            const summarizer = new SummarizerManager(text, 5); // Summarize into 5 sentences
            const summary = await summarizer.getSummaryByFrequency();
            text = summary.summary;
        }

        return text;
    } catch (err) {
        throw new Error("Error summarizing text: " + err.message);
    }
};

export { analyzeCVAndJobDescription, extractTextFromPDF, summarizeText };
