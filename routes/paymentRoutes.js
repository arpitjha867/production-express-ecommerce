import express from "express";
import { checkoutFunc, getKey, paymentVerification } from "../controllers/paymentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//checkout
router.post("/checkout",requireSignIn,checkoutFunc)

// payment varifaicatoin
router.post("/payment-varification",paymentVerification)

//send key
router.get("/getKey",requireSignIn,getKey)

export default router;