import { Allbook } from "../models/allbook.models.js";
import axios from "axios"
import {ApiResponse} from "../utiles/api_response.utiles.js"
import { asynchandeler } from "../utiles/asynchandeler.utiles.js";
const importBooks = async (req, res) => {
    console.log("0")
    try {
        console.log("hi")
        let url = "https://gutendex.com/books";
        let page = 0;
        const allbooks=[]
        while (url != null && page < 10) {

            console.log("page;", page + 1)
            const response = await axios.get(url);

            const books = response.data.results;




            for (let i = 0; i < books.length; i++) {


                const exists = await Allbook.findOne({
                    bookid: String(books[i].id)
                });

                if (exists) {
                    continue;
                }
                
          const allbook=      await Allbook.create({
                    bookid: String(books[i].id),
                    bookname: books[i].title,
                    authorname: books[i].authors[0]?.name || "Unknown",
                    subject: books[i].subjects[0] || "General",
                    totalcount: 5,
                    availablebook: 5,
                    coverimage: books[i].formats?.["image/jpeg"] || "",
                });
 
                 allbooks.push(allbook)
                
            }

            url = response.data.next;
            // console.log("hello");
            page++;
        }

       res.json(
            new ApiResponse(200,allbooks,"succesful")
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
        return res.json(

        )

    }


    
};
const AllBook= asynchandeler(async (req,res)=>{

      try {
         const response = await Allbook.find({})
     
          return res.status(200)
          .json(new ApiResponse(200,{response},"succesful"))
         
  
      } catch (error) {
        console.log(error)
          return res.status(200)
          .json(new ApiResponse(200,{},"error in AllBooks"))
         
      }

     





    })
export { importBooks,AllBook };