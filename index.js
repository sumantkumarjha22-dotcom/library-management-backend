import "dotenv/config";          // must be the FIRST import
import dns from "node:dns";      // regular dns, not dns/promises
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { connectdb } from "./src/confi/db.js";
import { app } from "./app.js";

console.log("URI:", process.env.MONGO_URI ? "FOUND" : "MISSING");

connectdb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});