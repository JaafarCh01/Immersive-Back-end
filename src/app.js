import express from 'express';
import authRouter from "./auth.js";
import dotenv from 'dotenv';
import cors from 'cors'; 
import { createClient } from '@supabase/supabase-js';
import studentRouter from '../routes/studentRouter.js';
import adminRouter from '../routes/adminRouter.js';

dotenv.config();
const supabaseUrl = "https://fkgrhxulpnjmtwswiudx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZ3JoeHVscG5qbXR3c3dpdWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzI2MzAsImV4cCI6MjAzOTY0ODYzMH0.xuHWZWNU05HVxCRu5S6rMBdYK9ocBRygGhypwWE-I7E";
const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('Supabase connected successfully');
  }
}).catch(err => {
  console.error('Unexpected error during Supabase connection:', err);
});

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


app.get('/api/avatar', (req, res) => {
  const { name = 'User', color = 'FFFFFF', background = '000000' } = req.query;

  const encodedName = encodeURIComponent(name);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&color=${color}&background=${background}`;

  res.json({ avatarUrl });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

import teacherRouter from '../routes/teacherRouter.js';

app.use('/api/teacher', teacherRouter);

app.use("/api/v1/auth", authRouter);

app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({ 
      message: 'Connected to Supabase successfully', 
      data: data.length > 0 ? 'Data retrieved' : 'No data found'
    });
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    res.status(500).json({ message: 'Failed to connect to Supabase', error: error.message });
  }
});

app.use('/student', studentRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { app as default, supabase };