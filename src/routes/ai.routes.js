import { Router } from "express";
import { interaction } from "../controller/ai.controller.js";
import { veryfiyuser } from "../middelware/authentation.user.js";

const airouter =Router();

airouter.route("/ask").post(veryfiyuser,interaction);
airouter.route("/answer").get(veryfiyuser,interaction);



export {airouter}