import mongoose from "mongoose";
import { User } from "../models/users.model.js"
import { asynchandeler } from "../utiles/asynchandeler.utiles.js";
// import { use } from "react";
import { ApiError } from "../utiles/api_error.utiles.js";
import { ApiResponse } from "../utiles/api_response.utiles.js";
import { CollectRequest } from "../models/CollectRequest.js";
import { collectedbook } from "./book.controler.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}
const userregister = asynchandeler(async (req, res) => {
  try {
    const { email, fullname, password, number, username } = req.body;

    if ([fullname, email, password, username, String(number || '')].some((field) => !field || String(field).trim() === '')) {
      throw new ApiError(400, 'All fields are required');
    }

    const existeduser = await User.findOne({
      $or: [{ email }, { username: (username || '').toLowerCase() }, { number }]
    });

    if (existeduser) {
      if (existeduser.email === email) {
        throw new ApiError(409, 'User with this email already exists');
      }
      if (existeduser.username === (username || '').toLowerCase()) {
        throw new ApiError(409, 'User with this username already exists');
      }
      if (existeduser.number === number) {
        throw new ApiError(409, 'User with this phone number already exists');
      }
      throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({
      email,
      password,
      fullname,
      number,
      username: username.toLowerCase()
    });

    const create_user = await User.findById(user._id).select('-password -refreshtoken');

    if (!create_user) {
      throw new ApiError(500, 'Error creating user');
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        { create_user },
        'User registered successfully'
      )
    );
  } catch (error) {
    console.log('REGISTER ERROR:', error);
    throw error;
  }
})
const login_user = asynchandeler(async (req, res) => {

  try {

    const { username, email, password } = req.body;

    // Check username or email
    if (!username && !email) {
      throw new ApiError(
        400,
        "Username or email is required"
      );
    }

    // Find user
    const user = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    // Username or email incorrect
    if (!user) {
      throw new ApiError(
        401,
        "Incorrect username or email"
      );
    }

    // Check password
    const check_password =
      await user.is_password_correct(password);

    // Password incorrect
    if (!check_password) {
      throw new ApiError(
        401,
        "Incorrect password"
      );
    }

    // Create access token
    const creat_accesstoken =
      await user.creat_access_token();

    // Create refresh token
    const creat_refreshtoken =
      await user.creat_refresh_token();

    // Save refresh token
    user.refreshtoken = creat_refreshtoken;

    await user.save({
      validateBeforeSave: false
    });

    // Remove password and refresh token
    const loggeduser = await User.findById(user._id)
      .select("-password -refreshtoken");

    // Send response
    return res
      .status(200)
      .cookie("accesstoken",creat_accesstoken,options)
      .cookie("refreshtoken",creat_refreshtoken,options)
      .json(
        new ApiResponse(
          200,
          { loggeduser },
          "Logged in successfully"
        )
      );

  } catch (error) {

    console.error("Login error:", error);

    throw error;

  }

});

const send_user_deatils = asynchandeler(async (req, res) => {
  const userdetails = req.user;

  console.log(userdetails)


  return res
    .status(200)

    .json(
      new ApiResponse(200, { userdetails }, "good")
    )

})
const logout_user = asynchandeler(async (req, res) => {

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshtoken: 1 // this removes the field from document
      }
    },
    {
      new: true
    }
  )
  return res
    .status(202)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))



})


const user_profile = asynchandeler(async (req, res) => {


  const userprofile = await User.findById(req.user._id).select("-password -refreshtoken")
  if (!userprofile) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userprofile },
        "profile fetched succcesful"
      )
    )
})


const giveusercollectrequest = asynchandeler(async (req, res) => {
  console.log("id is ", req.user._id.toString())
  try {
    const findcollectedbook = await CollectRequest.find({
      UserId: req.user._id.toString()
    })
    console.log("findcollectedbook", findcollectedbook

    )
    
    if (findcollectedbook.length <= 0) {
      throw new ApiError(200, "you have no collected book")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { findcollectedbook }, "send")
      )
  } catch (error) {
    console.log("error in giveusercollectrequest ", error.message)
    return res
      .status(200)
      .json(
        new ApiResponse(404, {}, "something went wrong in giveusercollectrequest ")
      )

  }

})






const CreatRefreshAccesstoke = asynchandeler(async (req, res) => {
  const IncomingRefreshToken = req.cookies.refreshtoken || req.body.refreshToken
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }
  try {

    const decodedtoken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRETE)

    const user = await User.findById(decodedtoken?._id)
    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (IncomingRefreshToken !== user?.refreshtoken) {
      throw new ApiError(401, "Refresh token is expired or used")

    }

    const NewrefreshToken = user.creat_refresh_token()
    const NewAccesToken = user.creat_access_token()

    user.refreshtoken = NewrefreshToken
    await user.save({ validateBeforeSave: false })

    return res
      .status(200)
      .cookie("accesstoken", NewAccesToken, options)
      .cookie("refreshtoken", NewrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accesstoken: NewAccesToken, refreshtoken: NewrefreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }


})




const EditName = asynchandeler(async (req, res) => {
  const { FullName } = req.body
  if (!FullName || FullName.trim() === "") {
    throw new ApiError(400, "Enter your name");
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.fullname = FullName.trim()
    await user.save({ validateBeforeSave: false })

    const editeduser = await User.findById(req.user._id).select(
      "-password -refreshtoken"
    );
    return res.status(200)
      .json(
        new ApiResponse(200, editeduser, "name changed succesfull")
      )
  } catch (error) {
    console.log("error in fullname change ", error.message)
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, error?.message || "Error in fullname change")
      );
  }







})




// changeing the mail of  user 
const EditEmail = asynchandeler(async (req, res) => {
  const { Email } = req.body

  if (!Email || Email.trim() === "") {
    throw new ApiError(400, "Enter your email")
  }
  const newemail = await User.findOne({
    email: Email.trim()
  });
  if (newemail) {
    throw new ApiError(409, "Email already exists")
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.email = Email.trim()
    await user.save({ validateBeforeSave: false })

    const editeduser = await User.findById(req.user._id).select(
      "-password -refreshtoken"
    );
    return res.status(200)
      .json(
        new ApiResponse(200, editeduser, "Email changed succesful")
      )
  } catch (error) {
    console.log("error in Email change ", error.message)
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Error in Email change")
      );
  }

})







// changing the username of user
const EditUsername = asynchandeler(async (req, res) => {

  const { Username } = req.body
  if (!Username || Username.trim() === "") {
    throw new ApiError(400, "Enter your username")
  }
  try {

    const newusername = await User.findOne({
      username: Username.trim()
    });
    if (newusername) {
      throw new ApiError(409, "Username already exists")

    }

    const user = await User.findById(req.user._id)
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.username = Username.trim()
    await user.save({ validateBeforeSave: false })

    const EditeduserName = await User.findById(req.user._id).select("-password -refreshtoken")

    return res.status(200)
      .json(
        new ApiResponse(200, EditeduserName, "UserName changed succesful")
      )
  } catch (error) {
    console.log("error in username change ", error.message)
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Error in username change")
      );
  }

})






//chanbging the password of user
const ChangePassword = asynchandeler(async (req, res) => {
  const { oldpassword, newpassword, conformpassword } = req.body

  if (newpassword !== conformpassword) {
    throw new ApiError(400, "Passwords do not match")
  }


  try {

    const user = await User.findById(req.user._id)
    if (!user) {
      throw new ApiError(404, "User not found");
    }


    const veryfypassword = await user.is_password_correct(oldpassword);
    if (!veryfypassword) {
      throw new ApiError(400, "Invalid current password")

    }

    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    const editeduser = await User.findById(req.user._id).select("-password -refreshtoken")

    return res
      .status(200)
      .json(new ApiResponse(200, editeduser, "password changed succesful"))

  } catch (error) {
    console.log("", console.error.message);
    return res
      .status(505)
      .json(new ApiResponse(505, {}, "error in passwordchange controoler"))

  }
})
 






const EditNumber = asynchandeler(async (req, res) => {
  
})
export { EditNumber,ChangePassword, EditUsername, CreatRefreshAccesstoke, EditName, EditEmail, userregister, login_user, logout_user, user_profile, send_user_deatils, giveusercollectrequest }