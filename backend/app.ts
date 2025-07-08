import express from 'express';
import connectToMongoDB from './db.js';



const app = express();
connectToMongoDB()





app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})