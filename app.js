import {router} from "./src/routes/api.route.js";
import express from 'express';
import cors from "cors";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',router)

export {app};