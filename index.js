import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import { app } from "./app.js";
import connectDB from "./src/db/index.js";



connectDB()
    .then(() => {
         console.log("MongoDB connected");
         app.listen(process.env.PORT, () => {
             console.log(`Server running on port ${process.env.PORT}`);
         });
     })
      
   .catch((error) => {
         console.error("Error connecting to MongoDB", error);
     });
     
 