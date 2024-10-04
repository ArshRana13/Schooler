// importing 
import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

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

router.get('/getDetails',async (req,res)=>{
  console.log("To start assignment with id ",req.query.id);
  let id = req.query.id;

  //now to send assignment details in the form a obj
  let obj = {};
  
  try{
      let assData = await db.query('Select * from assignmentss where id = $1',[id]);
      //console.log(assData.rows);
      obj.title = assData.rows[0].title;
      obj.description = assData.rows[0].description;
      obj.timeLimit = {hours: assData.rows[0].time_limit_hours,
                       mins: assData.rows[0].time_limit_minutes,
                       secs: assData.rows[0].time_limit_seconds}
      obj.deadline = assData.rows[0].deadline;

      let questionData  = await db.query('Select * from questions where assignment_id = $1',[id]);

      console.log("question data " ,questionData.rows);
      obj.totalQuestions = questionData.rows.length;

      let score = 0;

      questionData.rows.forEach((e)=>{
        score += e.score;
      })
      
      obj.totalScore = score;

      res.send({data : obj});
   }
   
   
   catch(e)
  {
    console.log("something bad happened with database fetching",e);
    res.sendStatus(401);
    
  }
  //res.send({msg:"hello my name is Aryan Yadav"});
})



router.get('/getQuestions',async (req,res) =>{
 //now to send assignment details in the form a obj
 let id = req.query.id;

 let obj = {};
  
 try{
     let assData = await db.query('Select * from assignmentss where id = $1',[id]);
     //console.log(assData.rows);
     obj.title = assData.rows[0].title;
     obj.description = assData.rows[0].description;
     obj.timeLimit = {hours: assData.rows[0].time_limit_hours,
                      mins: assData.rows[0].time_limit_minutes,
                      secs: assData.rows[0].time_limit_seconds}
     obj.deadline = assData.rows[0].deadline;

     let questionData  = await db.query('Select * from questions where assignment_id = $1',[id]);

     console.log("question data " ,questionData.rows);
     let questions = questionData.rows;
      obj.questions = questions;
     res.send({data : obj});
  }
  
  
  catch(e)
 {
   console.log("something bad happened with database fetching",e);
   res.sendStatus(401);
   
 }
})

export default router;