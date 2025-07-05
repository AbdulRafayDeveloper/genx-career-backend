// import axios from "axios";

// export async function convertHtmlToPdfBuffer(htmlContent) {
//     const response = await axios.post(
//         "https://api.pdfshift.io/v3/convert/pdf",
//         {
//             source: htmlContent,
//         },
//         {
//             auth: {
//                 username: "sk_a00e969bad3b624de18ec0f78e69cee41de7dbff",
//                 password: "",
//             },
//             responseType: "arraybuffer",
//         }
//     );

//     return Buffer.from(response.data);
// }

import axios from "axios";

export async function convertHtmlToPdfBuffer(htmlContent) {
    const api_key = "sk_83f820c8e4ec838d86ab13e32edb746a3ee8f657";

    const response = await axios.post(
        "https://api.pdfshift.io/v3/convert/pdf",
        {
            source: htmlContent,
        },
        {
            headers: {
                'X-API-Key': "sk_83f820c8e4ec838d86ab13e32edb746a3ee8f657"
            },
            responseType: "arraybuffer",
        }
    );

    return Buffer.from(response.data);
}
