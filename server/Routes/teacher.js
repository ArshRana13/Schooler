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

  let {group,title,description,inputFields,hours,minutes,seconds,deadline} = req.body;


  console.log("deadline  :  ",deadline);
  try{
    let a =  await db.query(
      'INSERT INTO assignmentss(group_name,title,description,time_limit_hours,time_limit_minutes,time_limit_seconds,deadline) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
       [group,title,description,hours,minutes,seconds,deadline]);
       
      let id = a.rows[0].id;
       //now i will insert questions in the database
       inputFields.forEach( async (element) => {
        let question = element.value;
        let score = element.score;

       await db.query(
        'Insert into questions(question,score,assignment_id) Values($1, $2, $3)',
        [question,score,id]
      );
       });
    }
  catch(e){
    console.log('Error occured while creating the assignment');
    console.log(e);
  }
  res.send('hello');
  // let {group,title,description,score,message}= req.body;
  // try{
  // await db.query('INSERT INTO assignments (group_student,title,description,score) VALUES ($1, $2, $3, $4)', [group,title,description,score])
  // const result = await db.query('SELECT title, description, score FROM assignments');
  // const assignments = result.rows;
  // broadcast({ type: 'UPDATE_ASSIGNMENTS', assignments });
  // res.sendStatus(200);
  // }
  // catch(error){
  //   console.error('Error creating assignment:', error);
  //   res.status(500).json({ message: 'Assignment creation failed' });
  // }
})
export default router;