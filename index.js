import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()
import {connectdb} from "./src/confi/db.js"
import {app} from "./app.js"
 connectdb()

const PORT = 5000;
//console.log("hello")
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});