import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import path from 'path'
//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();

//razor pay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname,'./client/build')))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/payments",paymentRoutes);

//rest api
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
