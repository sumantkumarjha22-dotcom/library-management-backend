import{ Router} from "express";
import { userregister ,login_user } from "../controller/user.controller.js";
import {logout_user} from "../controller/user.controller.js";
import { veryfiyuser } from "../middelware/authentation.user.js";
import { user_profile,ChangePassword, EditUsername, CreatRefreshAccesstoke, EditName, EditEmail } from "../controller/user.controller.js";
import {send_user_deatils} from "../controller/user.controller.js"
import  {giveusercollectrequest} from "../controller/user.controller.js"

const router=Router()



router.route("/register").post(userregister);
router.route("/login").post(login_user);
router.route("/logout").post(veryfiyuser,logout_user)
router.route("/pofile").get(veryfiyuser,user_profile)
router.route("/detail").get(veryfiyuser,send_user_deatils)
router.route("/changename").post(veryfiyuser,EditName)
router.route("/changeusername").post(veryfiyuser,EditUsername)
router.route("/changeemail").post(veryfiyuser,EditEmail)
router.route("/changepassword").post(veryfiyuser,ChangePassword)
router.route("/creatrefreshaccesstoken").post(veryfiyuser,CreatRefreshAccesstoke)
router.route("/giveusercollectrequest").get(veryfiyuser,giveusercollectrequest)




export {router}