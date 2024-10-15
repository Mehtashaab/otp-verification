import { Router } from "express";
import { login, register ,verifyOtp} from "../controllers/auth.controller.js";



const router = Router();


// Send OTP to user
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify').post(verifyOtp)


export {router};