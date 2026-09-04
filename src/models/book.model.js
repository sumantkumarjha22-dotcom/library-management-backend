import mongoose, { Schema } from "mongoose";
import { User } from "./users.model.js";

const bookschema = Schema({


    user: {
        type: Schema.Types.ObjectId,
        ref: "User"

    },
    bookid: {
        type: String,
        require: true

    },
    bookname: {
        type: String,
        require: true


    },
    authorname: {
        type: String,
        require: true


    },
    Collect_date: {
        type: Date,
         default:Date.now

    }



})


const Book =mongoose.model("Book",bookschema)
export {Book}