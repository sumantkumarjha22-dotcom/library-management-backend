import { asynchandeler } from "../utiles/asynchandeler.utiles.js";
import jwt from "jsonwebtoken"
import { User } from "../models/users.model.js"
import { ApiError } from "../utiles/api_error.utiles.js";


const veryfiyuser = asynchandeler(async (req, res, next) => {
   //console.log("----- VERIFY USER -----");
   // console.log("METHOD:", req.method);
   // console.log("URL:", req.originalUrl);
    //console.log("ORIGIN:", req.headers.origin);

    //console.log("cookies:", req.cookies);
    const token =
   
        req?.cookies?.accesstoken ||
        req.header("Authorization")?.replace("Bearer ", "");
     //console.log( "user token is ",token)

if (!token) {
    throw new ApiError(401, "Unauthorized request IN auth..");
}
    const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE)


   //console.log("decoded_token",decoded_token)
   if(decoded_token.isAdmin){
    throw new ApiError(404,"you are not user")
   }

    const user = await User.findById(decoded_token._id)
   //console.log(user)
if (!user) {
    throw new ApiError(401, "User not found");
}

    req.user = user
 //   console.log( "useru",user);
  //  console.log(req.user)
    next()

})

const veryfiyadmine= asynchandeler (async( req, res, next)=>{
  
    // console.log( "in veryfiyadmine")
   //  console.log("cookies is ",req?.cookies)

 const token = req?.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
 //console.log(token)
  if(!token){
throw new ApiError(200,"erroen in toke of admine ")
  }
   const decodedtoken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE)
   console.log("decode token is ",decodedtoken)

 console.log("is admine",decodedtoken.isAdmin)
 if(!decodedtoken.isAdmin){
    throw new ApiError (404,"you are no admine ")
 }

  const admine = await User.findById(decodedtoken._id) ;

   if (!admine) {
    throw new ApiError(401, "User not found");
}

req.user=admine
next()


})
export { veryfiyuser  ,veryfiyadmine}