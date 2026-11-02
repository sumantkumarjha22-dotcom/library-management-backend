import { Allbook } from "../models/allbook.models.js";
import { ApiError } from "../utiles/api_error.utiles.js";
import { ApiResponse } from "../utiles/api_response.utiles.js";
import { asynchandeler } from "../utiles/asynchandeler.utiles.js";
import { bookcontroler } from "./book.controler.js";
import { uploadOnCloudinary } from "../utiles/cloudinary.js"

import XLSX from "xlsx";

const getallbook = async (req, res) => {

    try {

        const books = await Allbook.find();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { books },
                    "Successfully fetched books"
                )
            );

    } catch (error) {

        console.log(
            "Error in getallbook in admin controller:",
            error.message
        );

        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    {},
                    "Failed to fetch books"
                )
            );
    }
};
const AddBook = asynchandeler(async (req, res) => {
    const { Standard, BookName, BookId, AuthorName, AvailableBook, TotalCount } = req.body

    if ([BookName, BookId, AuthorName].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "BookName, BookId and AuthorName are required");
    }
    if (
        AvailableBook === undefined || TotalCount === undefined) {
        throw new ApiError(400, "AvailableBook and TotalCount are required");
    }

    console.log("req past", req.file)
    const CoverImage = req.file?.path;
    console.log("CoverImage", CoverImage)

    if (!CoverImage) {
        throw new ApiError(400, "Cover image is required");
    }

    const uploadedurl = await uploadOnCloudinary(CoverImage);
    console.log("uploader", uploadedurl)
    if (!uploadedurl) {
        throw new ApiError(500, "Cover image upload failed");
    }

    const url = uploadedurl.url;
    console.log("url is ", url)


    try {
        const findbook = await Allbook.findOne({
            $or: [
                { bookid: BookId },
                { bookname: BookName }
            ]
        })

        if (findbook) {
            throw new ApiError(505, "book already exist");

        }

        const book = await Allbook.create({
            bookname: BookName,
            bookid: BookId,
            authorname: AuthorName,
            availablebook: AvailableBook,
            totalcount: TotalCount,
            standard: Standard,
            coverimage: url,


        })


        return res
            .status(200)
            .json(new ApiResponse(200, book, "book added uccesfully"));

    } catch (error) {
        console.log("error in bookadd controler", error.message)
        return res.status(505)
            .json(new ApiResponse(505, {}, error?.message || "book added uccesfully"))

    }


})
const UploadBook = asynchandeler(async (req, res) => {

    const formdata = XLSX.readFile(req.file.path)
    const sheetname = formdata.SheetNames[0];
    console.log("sheetname",sheetname)
    const Firstsheet = formdata.Sheets[sheetname]
    console.log("Firstsheet",Firstsheet)

    const data = XLSX.utils.sheet_to_json(Firstsheet)
    console.log("data",data)
  //  console.log(data);
    try {

        for (let i = 0; i < data.length; i++) {

            const existingusert = await Allbook.findOne(
                {
                    $or:
                        [
                            {
                                bookid: data[i].bookid
                            },
                            {
                                bookname: data[i].bookname
                            }
                        ]
                })


            if (existingusert) {
                existingusert.availablebook += data[i].availablebook
                existingusert.totalcount += data[i].totalcount

            }
            else {
                await Allbook.create(data[i])
            }
        }


        return res.status(200)
            .json(new ApiResponse(200, [], "succespull upload"))

    }
    catch (error) {
        console.log("error in import book controler ", error.message)
        return res.json(
            new ApiResponse(404, error, "somthing went wrong in import book controller ")
        )


    }
})
export { getallbook, AddBook, UploadBook };