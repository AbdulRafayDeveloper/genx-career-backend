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

        // const chatCompletion = await groq.chat.completions.create({
        //     messages: [
        //         {
        //             role: "user",
        //             content: `Analyze the following CV content and job description. 
        //                         1. Provide a one-word rating (Not Good, Good, Best) based on how well the CV matches the job description. The heading for this must be exactly "Rating". Do not use any other heading.
        //                         2. Provide suggestions for improvements to make the CV better match the job description.
        //                         3. Under the headings "Matches" and "Non-Matches," list what matches and what does not match in separate paragraphs.
        //                         4. Under the heading "Age Factor", check and report the following:
        //                         - If the job description specifies an age requirement, mention what it is.
        //                         - If the CV does not include age or date of birth, suggest adding it.
        //                         - If age is included in the CV, analyze whether it meets the job's age requirement (Too Young, Too Old, or Appropriate).
        //                         - If the job description does **not** specify any age requirement, clearly mention: "No age requirement specified in the job description."

        //                         CV Content: "${cvContent}"
        //                         Job Description: "${jobDescription}"`,
        //         },
        //     ],
        //     model: "llama3-8b-8192",
        // });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Analyze the following CV content and job description.
        1. Provide a one-word rating (Not Good, Good, Best) based on how well the CV matches the job description. The heading for this must be exactly "Rating". Do not use any other heading.
        2. Provide suggestions for improvements to make the CV better match the job description.
        3. Under the headings "Matches" and "Non-Matches," list what matches and what does not match in separate paragraphs.
        4. Under the heading "Age Factor", check and report the following:
           - If the job description specifies an age requirement, mention what it is.
           - If the CV does not include age or date of birth, suggest adding it.
           - If age is included in the CV, analyze whether it meets the job's age requirement (Too Young, Too Old, or Appropriate).
           - If the job description does **not** specify any age requirement, clearly mention: "No age requirement specified in the job description."
        5. Under the heading "Experience Factor", check and report the following:
           - If the job description mentions required years of experience, mention what the requirement is.
           - If the CV includes experience, verify how many years are mentioned.
           - Indicate whether the experience is sufficient, less than required, or exceeds the requirement.
           - If the CV does not mention experience, suggest adding relevant experience details.
           - If the job description does **not** specify any experience requirement, clearly mention: "No experience requirement specified in the job description."

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
        console.log("Error in analyzeCVAndJobDescription:", error);
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

// const summarizeText = async (text, maxLength = 400) => {
//     try {
//         while (text.split(/\s+/).length > maxLength) {
//             const summarizer = new SummarizerManager(text, 5); // Summarize into 5 sentences
//             const summary = await summarizer.getSummaryByFrequency();
//             text = summary.summary;
//         }

//         return text;
//     } catch (err) {
//         throw new Error("Error summarizing text: " + err.message);
//     }
// };

const summarizeText = async (text) => {
    try {
        let wordCount = text.split(/\s+/).length;

        // Dynamically decide maxLength based on original word count
        let maxLength = 1000;

        // Continue summarizing until within maxLength
        while (wordCount > maxLength) {
            // Estimate number of sentences based on desired compression
            const compressionRatio = maxLength / wordCount;
            const estimatedSentences = Math.max(5, Math.ceil(40 * compressionRatio));

            const summarizer = new SummarizerManager(text, estimatedSentences);
            const summary = await summarizer.getSummaryByFrequency();
            text = summary.summary;

            wordCount = text.split(/\s+/).length;
        }

        return text;
    } catch (err) {
        throw new Error("Error summarizing text: " + err.message);
    }
};

const summarizeJobText = async (text) => {
    try {
        let wordCount = text.split(/\s+/).length;

        // Dynamically decide maxLength based on original word count
        let maxLength = 1000;

        console.log("Initial word count:", wordCount);
        console.log("Max length for job text:", maxLength);

        // Continue summarizing until within maxLength
        while (wordCount > maxLength) {
            console.log("Current word count:", wordCount);
            // Estimate number of sentences based on desired compression
            const compressionRatio = maxLength / wordCount;
            const estimatedSentences = Math.max(5, Math.ceil(20 * compressionRatio));

            const summarizer = new SummarizerManager(text, estimatedSentences);
            const summary = await summarizer.getSummaryByFrequency();
            text = summary.summary;

            wordCount = text.split(/\s+/).length;
            console.log("New word count after summarization:", wordCount);
        }

        console.log("Final summarized job text:", text);
        return text;
    } catch (err) {
        throw new Error("Error summarizing text: " + err.message);
    }
};

export { analyzeCVAndJobDescription, extractTextFromPDF, summarizeText, summarizeJobText };
