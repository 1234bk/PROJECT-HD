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
import skinroutes from './routes/skinroutes.js';
dotenv.config();
export const app = express();
config({path:'./.env'});
connectDB();



if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ API Key. Please set GROQ_API_KEY in your .env file.");
    process.exit(1);
}




// app.use(cors({
//     origin:process.env.FRONTEND_URL,
//     credentials:true
// }));
// app.use(cors({
//   origin: ["http://localhost:5173"], // frontend origin
//   credentials: true,                 // only needed if you use cookies, optional here
// }));
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


app.use('/auth', authRoutes);
app.use('/note'  ,notesRoutes);
app.use('/skinanalysis', skinroutes);
// app.use(errorHandler)

app.get("/", protect, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.name} to your dashboard` });
});

