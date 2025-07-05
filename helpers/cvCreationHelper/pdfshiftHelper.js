import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function convertHtmlToPdfBuffer(htmlContent) {
    const api_key = process.env.PDFSHIFT_API_KEY;

    const response = await axios.post(
        "https://api.pdfshift.io/v3/convert/pdf",
        {
            source: htmlContent,
        },
        {
            headers: {
                'X-API-Key': api_key
            },
            responseType: "arraybuffer",
        }
    );

    return Buffer.from(response.data);
}
