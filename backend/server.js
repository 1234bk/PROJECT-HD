import { app } from "./app.js";
import dotenv from 'dotenv';


const PORT = process.env.PORT ;
dotenv.config();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});