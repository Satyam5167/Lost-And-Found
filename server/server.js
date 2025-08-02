import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import itemRoutes from './Routes/itemRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import userMail from './Routes/userMail.js';


const app = express();
dotenv.config();

//MiddleWare
app.use(express.json());

//setup cors
const corsOptions ={
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "PUT", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions));

app.use('/', authRoutes);
app.use('/', itemRoutes);
app.use('/', userMail);
app.use('/getUser',authRoutes, userRoutes);

app.listen(process.env.PORT,'0.0.0.0', ()=>{
    console.log(`Server is running at ${process.env.PORT}`);
});