// importing 
import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
import { broadcast } from '../server.js';
dotenv.config();

const router = express.Router();

// Database connection
const db = new pg.Client({
  password: process.env.DATABASE_PASSWORD,
  host: 'localhost',
  user: 'postgres',
  database: 'schooler',
  port: 5432
});
db.connect();

router.post('/addAssignment',async (req,res)=>{
  console.log(req.body);
  let {group,title,description,score,message}= req.body;
  try{
  await db.query('INSERT INTO assignments (group_student,title,description,score) VALUES ($1, $2, $3, $4)', [group,title,description,score])
  const result = await db.query('SELECT title, description, score FROM assignments');
  const assignments = result.rows;
  broadcast({ type: 'UPDATE_ASSIGNMENTS', assignments });
  res.sendStatus(200);
  }
  catch(error){
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Assignment creation failed' });
  }
})
export default router;