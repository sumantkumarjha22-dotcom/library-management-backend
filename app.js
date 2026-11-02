    // import dns from 'node:dns/promises';
    // dns.setServers(['1.1.1.1', '8.8.8.8']); 
    import express, { json } from "express"

    import cors from "cors"
    import cookieParser from "cookie-parser"
    // STEP 3: Middleware Configurations (Your code snippet)
    const app = express()
    // 3. GLOBAL MIDDLEWARE PIPELINE
    // Pass 1: Handle Cross-Origin restrictions & allow credentials
 
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://library-management-frontend-cyan-two.vercel.app",
      "https://library-management-frontend-sumant9.vercel.app",
      /\.vercel\.app$/
    ],
    credentials: true, // only needed if you send cookies / auth headers with credentials
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


    // Pass 2: Parse incoming JSON body -> attaches object to req.body
    app.use(express.json())

    // Pass 3: Parse URL-encoded form data -> attaches object to req.body
    app.use(express.urlencoded({ extended: true, limit: "16kb" }))

    // Pass 4: Serve static assets directly from 'public' directory
    app.use(express.static("public"))

    // Pass 5: Parse Cookie headers -> attaches object to req.cookies
    app.use(cookieParser())


    // STEP 4: Define API Routes (MUST come AFTER middleware)
    // router import (i have imported router in defalt so i can use any name this why it is named as userrouter)
    import { router } from "./src/routes/user.routes.js"
    import {bookroute} from "./src/routes/book.route.js"
    import { airouter } from "./src/routes/ai.routes.js";
    import { allbookroute} from "./src/routes/admin.routes.js"



    //router use
    app.use("/api/v1/users", router);
    app.use("/api/v1/users",bookroute);
    app.use("/api/v1/users" ,airouter);
    app.use("/api/v1/users",allbookroute);

    // STEP 5: Test Route
    app.get("/user", (req,res) => {
        res.send("hahaha")
    })

    // STEP 6: Global Error Handler Middleware
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({
            statusCode,
            success: false,
            message: err.message || "Internal Server Error",
            errors: err.errors || []
        });
    });

    export { app }
