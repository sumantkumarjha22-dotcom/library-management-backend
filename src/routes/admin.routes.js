import { Router } from "express";
import {importBooks} from "../controller/allbook.controller.js"
import { getallbook } from "../controller/admine.controller.js";
import {FindAvaliableOrNot} from "../controller/bookrequest.controller.js"
import { AllBook } from "../controller/allbook.controller.js";
import {veryfiyadmine, veryfiyuser} from "../middelware/authentation.user.js"
import { upload } from "../middelware/multer.middelware.js";
import { AddBook } from "../controller/admine.controller.js";
import {Upload} from "../middelware/multerForImportBook.middelware.js"
import { UploadBook} from "../controller/admine.controller.js"

const allbookroute = Router();

allbookroute.route("/allbook").post(importBooks);
allbookroute.route("/getbook").get(getallbook);
allbookroute.route("/getadminbook").get(veryfiyadmine,getallbook)
allbookroute.route("/availableornot").post(veryfiyadmine,FindAvaliableOrNot)
allbookroute.route("/allbookforadmine").get(veryfiyadmine,AllBook)
allbookroute.route("/addbook").post(upload.single("CoverImage"),AddBook)
allbookroute.route("/upload").post(Upload.single("file"),UploadBook)



export {allbookroute}