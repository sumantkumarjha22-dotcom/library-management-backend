import mongoose ,{Schema} from "mongoose";

const CollectRequestSchema = new Schema({
    
UserName: {
     type:String,
     required:true,
    },
     
UserId:{
    type:String,  
   required:true
},

BookName:{
    type:String,
    required:true,

},

BookId:{
   type:String,
   required:true,
}, 

CollectDate:{
    type:Date,
    default:Date.now

},
Status: {
  type: String,
  enum: ["Pending", "Approved", "Rejected"],
  default: "Pending"
}

},{timestamps:true})  
const CollectRequest= mongoose.model("CollectRequest",CollectRequestSchema)
export {CollectRequest}