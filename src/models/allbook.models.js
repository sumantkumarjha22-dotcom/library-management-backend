import mongoose, { Schema } from "mongoose";

const allbookschem = Schema({

    bookname: {
        type: String,
        required: true,
        trim: true,
    },
    bookid: {

        type: String,
        required: true,
        unique: true,
    },
    totalcount: {
        required: true,
        type: Number,
        min: 0,

    },
    availablebook: {
        required: true,
        type: Number,
        min: 0,
    },
    authorname: {
        required: true,
        type: String,
        trim: true,

    },
    coverimage:{
      type:String,
    
    },
    standard:{
        type:String,
        default:"general",
        
     
    }



}, {
    timestamps: true
})

const Allbook = mongoose.model("Allbook", allbookschem)
export { Allbook };