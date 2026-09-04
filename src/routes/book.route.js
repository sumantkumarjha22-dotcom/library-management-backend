import { Router } from "express";
import { Book } from "../models/book.model.js";
import {bookcontroler} from "../controller/book.controler.js"
import { veryfiyuser } from "../middelware/authentation.user.js";
import {collectedbook} from "../controller/book.controler.js"
import {searchbook} from "../controller/book.controler.js"
import { RequestControlller } from "../controller/bookrequest.controller.js"
import { GetRequestControlller } from "../controller/bookrequest.controller.js";
import { veryfiyadmine } from "../middelware/authentation.user.js";
const bookroute = Router();
bookroute.route("/collect").post(veryfiyuser,bookcontroler)
bookroute.route("/collection").post(veryfiyuser,RequestControlller)
bookroute.route("/search").post(veryfiyuser,searchbook)
bookroute.route("/getrequest").get(veryfiyadmine,GetRequestControlller)





export {bookroute}