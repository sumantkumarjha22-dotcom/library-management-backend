import "dotenv/config";
import { GoogleGenAI, ValidateRewardResponse } from "@google/genai";

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
  console.log("hi");
  if(question ===""){
    throw ApiError(200,"enter somting");
  }
  try {
    const data = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: question,
      //stream:true,
    });
    console.log("400");
  
  
  const answerdata =data.output_text
    console.log(answerdata);
  


     return res
     .status(200)
     .json( new   ApiResponse(200,{answer:answerdata},"answer send succsfull"))
  }
catch (error) {
    console.log("error in internaction with gemani api",error.message)
    
  
return res
.status(200)
.json(new ApiResponse(200,{},"succesful"));

}

}
export { interaction };