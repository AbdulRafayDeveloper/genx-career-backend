import { readFileContent } from "../../helpers/fileUpload.js";
import {
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from "../../helpers/apiResponses.js";

const readFile = async (req, res) => {
  try {
    if (!req.file) {
      return badRequestResponse(res, "No file Uploaded. Kindly upload a file!");
    }

    const content = await readFileContent(req.file);
    const wordsArray = content.split(/\s+/);
    const isMoreThan1500 = wordsArray.length > 1500;
    const limitedWords = wordsArray.slice(0, 1500).join(" ");
    const formattedWords = limitedWords
      .replace(/\n/g, "")
      .replace(/[#*\\]/g, "");

    const responseMessage = isMoreThan1500
      ? "File content is more than 1500 words. Here are the first 1500 words"
      : "Your text has been read and extracted successfully.";

    if (responseMessage) {
      return successResponse(res, responseMessage, formattedWords);
    } else {
      return successResponse(
        res,
        "Failed to extract and read text. Please try again later!"
      );
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Failed to extract and read the text. Please try again later"
    );
  }
};

export { readFile };
