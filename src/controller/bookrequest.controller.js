import { CollectRequest } from "../models/CollectRequest.js"
import { ApiError } from "../utiles/api_error.utiles.js"
import { ApiResponse } from "../utiles/api_response.utiles.js"
import { asynchandeler } from "../utiles/asynchandeler.utiles.js"
import { User } from "../models/users.model.js"
import { Allbook } from "../models/allbook.models.js"


const RequestControlller = asynchandeler(async (req, res) => {
  try {

    const { BookId, BookName } = req.body;

    if (!BookId || !BookName) {
      throw new ApiError(404, "invalid request");

    }
    console.log(req.user.username)
    console.log(req.user._id)



    const FindBookId = await CollectRequest.findOne({
      BookId: BookId,
      UserId: req.user._id
    })

    if (FindBookId) {
      throw new ApiError(404, "you have already requested for the book")
    }


    const CreatRequest = await CollectRequest.create({
      BookId,
      BookName,
      UserName: req.user.username,
      UserId: req.user._id,

    })
    return res.json(
      new ApiResponse(200, { request: CreatRequest }, "collect request send succcesfull")
    )
  } catch (error) {
    console.log("erron in collect request ", error.message);
    return res
      .status(200)
      .json(new ApiResponse(404, {}, "somthing went wrong")
      )
  }


})




const GetRequestControlller = asynchandeler(async (req, res) => {
  try {
    const GetRequest = await CollectRequest.find({});
    if (GetRequest.length == 0) {
      throw new ApiError(400, "you have no request");
    }


    return res
      .status(200)
      .json(
        new ApiResponse(200, GetRequest, "send")
      )

  } catch (error) {
    console.log("some thing went wrong GetRequestControlller (admine) ", error.message)
    return res.json(
      new ApiResponse(404, [], "somtheing went wrong")
    )
  }
})


const FindAvaliableOrNot = asynchandeler(async (req, res) => {

  try {
    const { BookId, BookName, _id } = req.body
    console.log(_id)
    const FindBook = await Allbook.findOneAndUpdate({

      bookid: BookId,
      bookname: BookName,
      availablebook: { $gt: 0 }
    },
      {
        $inc: { availablebook: -1 }
      },
      {
        new: true
      }

        

    )

    if (FindBook === null) {
      await CollectRequest.findOneAndUpdate({ _id },
    {
      $set: {
      Status: "Rejected"
           },

          },
      {
        new: true
      }
      
    )


      throw new ApiError(404, " book is not avaliable");
    }

    const findpendingbook = await CollectRequest.findOneAndUpdate({ _id },
    {
      $set: {
      Status: "Approved"
           },

          },
      {
        new: true
      }
      
    )





return res
  .status(200)
  .json(
    new ApiResponse(200, FindBook, "send succesful")
  )
  } catch (error) {
  console.log("error in FindAvaliableOrNot in admiin side backend ", error.message)
  return res
    .status(404)
    .json(
      new ApiResponse(200, {}, "error in FindAvaliableOrNot")
    )
}
  


})
export { RequestControlller, GetRequestControlller, FindAvaliableOrNot }


