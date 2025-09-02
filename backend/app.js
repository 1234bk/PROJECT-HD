import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';  
import cors from 'cors';
import { connectDB } from './database/dbConnection.js';
// import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import { protect } from './middleware/authMiddleware.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();
export const app = express();
config({path:'./.env'});
connectDB();



app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


app.use('/auth', authRoutes);
app.use('/note' , protect ,notesRoutes);
// app.use(errorHandler)

app.get("/", protect, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.name} to your dashboard` });
});

