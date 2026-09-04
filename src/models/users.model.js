import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userschema = mongoose.Schema({

    username: {
        type: String,
        required: true, 
        unique: true

    },
    password: {
        type: String,
        required: true

    },
    fullname: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
         unique: true

    },
    email: {
        type: String,
        required: true,
         unique: true

    },
    isAdmin:{
        type:Boolean,
        default:false,

    },

    refreshtoken: {
        type: String
    }

}, { timestamps: true })


userschema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)

})


userschema.methods.is_password_correct = async function (password) {
    const tellme = await bcrypt.compare(password, this.password);
    console.log(tellme);
    return tellme

}

userschema.methods.creat_access_token = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            isAdmin:this.isAdmin


        },
        process.env.ACCESS_TOKEN_SECRETE,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIERY
        }
    )

}


userschema.methods.creat_refresh_token = function () {
    return jwt.sign({
        username: this.username,
        _id: this._id
    },

        process.env.REFRESH_TOKEN_SECRETE,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIERY
        }
    )
}

const User = mongoose.model("User", userschema)
export { User }

