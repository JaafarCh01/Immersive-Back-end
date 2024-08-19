import express from 'express';
import authRouter from "./auth.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 


dotenv.config();
const MONGO_URI = "mongodb+srv://jaafarbuis55:QtD63ykDPJvIh24Z@cluster0.hi9is74.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


app.get('/api/avatar', (req, res) => {
  const { name = 'User', color = 'FFFFFF', background = '000000' } = req.query;

  const encodedName = encodeURIComponent(name);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&color=${color}&background=${background}`;

  res.json({ avatarUrl });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
