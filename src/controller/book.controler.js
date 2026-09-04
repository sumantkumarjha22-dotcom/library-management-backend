import mongoose from "mongoose";
import { asynchandeler } from "../utiles/asynchandeler.utiles.js";
import { User } from "../models/users.model.js";
import { Book } from "../models/book.model.js";
import { ApiResponse } from "../utiles/api_response.utiles.js";
import { ApiError } from "../utiles/api_error.utiles.js";
import { Allbook } from "../models/allbook.models.js";


const bookcontroler =  asynchandeler (async (req,res)=>{

 console.log("in bookcontrolero")
   const{id,title,author}=req.body

   

const alreadyCollected = await Book.findOne({ user: req.user._id, bookid: id });

if(alreadyCollected){

   throw new ApiError(404,"you have already collected")
}  

   const bookdata= await Book.create({
       user:req?.user._id,
         

        bookid:id,
        bookname:title,
        authorname:author,
        
   }

      )
    //  console.log(bookdata)
  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        {bookdata},
        
        " added in succesfull"
        

    )
  )


})



const collectedbook= asynchandeler (async(req,res)=>{
//console.log("in collectedvook")
const one_user_data= await Book.find({user:req.user._id})
//console.log("one_user",one_user_data)
//console.log("1");
return res.status(200)
.json(
  new ApiResponse(
    200,
    {one_user_data},
    "done"
  )
)

})


const searchbook = asynchandeler (async (req,res)=>{

 try {
   const {query}=req.body;
  console.log(query);
  if (!query || query.trim() === "") {
  throw new ApiError(400, "Enter a valid name");
}
   const search = await Allbook.find({
    
     
   $or:[ { bookname:{
       $regex:query,
       
     }},
     {authorname:{
       $regex:query,
       
 
     }}
   ]
   })

    
   console.log(search)
   if(search.length===0){
    throw new ApiError(404,"no result found");
   }
   
   
 res.status(200)
 .json(
  new ApiResponse(200,{search},"data send succesful")
 )
 } catch (error) {
  console.log("error in search controller", error.message);

  return res.status(500).json({
    message: error.message
  });
}
 



})
export {bookcontroler,collectedbook ,searchbook};