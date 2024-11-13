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
       
       const result = await db.query('SELECT * FROM assignmentss');
       const assignments = result.rows;
       broadcast({ type: 'UPDATE_ASSIGNMENTS', assignments });
       

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


router.get('/getTests',async (req,res) =>{
  let id = req.query.id;
  console.log('id is ',id);
  try{
    let result = await db.query('SELECT * FROM tests WHERE assignment_id = $1 AND evaluated = false', [id]);
    if(result.rows.length > 0)
    {
      res.send({tests: result.rows});
    }
    else{
      res.send({msg:"empty"})
    }
  }
  catch(e){
    console.log('error in tests ',e);
    
  }
  
})


router.get('/getTitle',async (req,res)=>{
  try{
    let assignment = await db.query('Select title from assignmentss where id = $1',[req.query.id])
    res.send({"title":assignment.rows[0].title});
  }
  catch(e)
  {
    console.log('error in assinmentss relation ',e);
    
  }
})
/*
plan for evaluating the assignments 
1. Web sockets so that when the student submits the assignment it is being displaued to the teacher via web sockets.
2. Teacher home page will have two segments => 
      i. create assignments(done)
      ii. Evaluate assignments(to be done)
3. The Evaluate assignment page will have structure like this
    - Each answer will be displayed with the answer submitted by the student.
    = Each question will have the max score next to it and a input box where the teacher will give max obtained by the student.
    - There will also be a AI button that will evaluate the question with the answer provided by the student and will fill the score input box.
    -(summary) => teacher will have control of which question to check manually and which question to be checked by the AI.
    -when the teacher clicks on Submit evaluation the marks are displayed to the student.
    - the ID of the student is not displayed to the teacher. 
*/