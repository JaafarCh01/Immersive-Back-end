import express from 'express';
import authRouter from "./auth.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // Import the CORS middleware

dotenv.config();
const MONGO_URI = "mongodb+srv://jaafarbuis55:QtD63ykDPJvIh24Z@cluster0.hi9is74.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
const PORT = 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Use CORS middleware to allow requests from other origins
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

export default app;
