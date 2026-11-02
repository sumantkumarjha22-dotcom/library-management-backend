import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

import { Allbook } from "../models/allbook.models.js";
import { ApiResponse } from "../utiles/api_response.utiles.js";
import { ApiError } from "../utiles/api_error.utiles.js";

console.log(
  "AI KEY:",
  process.env.GOOGLE_API_KEY ? "FOUND" : "NOT FOUND"
);

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

const interaction = async (req, res) => {
  const { question } = req.body;

  console.log("Question:", question);

  if (!question || question.trim() === "") {
    throw ApiError(400, "Enter something");
  }

  try {
    // Get books from MongoDB
    const books = await Allbook.find({}).lean();

    console.log("Books found:", books.length);

    // Create prompt for Gemini
    const prompt = `
You are an AI assistant for a library management system.

User question:
${question}

Library book data from MongoDB:
${JSON.stringify(books)}

Instructions:
- Answer the user's question using the library data.
- Do not invent information.
- If the information is not available, say that it is not available.
- Keep the answer simple and helpful.
- For availability, use availablebook.
- For total copies, use totalcount.
- For author, use authorname.
- For book ID, use bookid.
`;

    // Send question + MongoDB data to Gemini
    const data = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: prompt
    });

    // Get Gemini response
    const answerdata = data.output_text;

    console.log("Gemini answer:", answerdata);

    // Send response to frontend
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { answer: answerdata },
          "Answer sent successfully"
        )
      );

  } catch (error) {
    console.log(
      "Error in interaction with Gemini API:",
      error.message
    );

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong"
        )
      );
  }
};

export { interaction };