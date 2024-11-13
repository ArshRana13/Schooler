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

    //checking deadline
    if(assData.rows[0].status == 'pending')
    {
      console.log('IM HERE');
      
      const dateNow = new Date();
      console.log("date today ",dateNow);
      
      if(dateNow > new Date(assData.rows[0].deadline))
      {
        console.log('here too');
        
        await db.query('UPDATE assignmentss SET status = $1 WHERE id = $2',["missed",id]);
        assData = await db.query('Select * from assignmentss where id = $1',[id]);

      }
    }


      obj.title = assData.rows[0].title;
      obj.description = assData.rows[0].description;
      obj.timeLimit = {hours: assData.rows[0].time_limit_hours,
                       mins: assData.rows[0].time_limit_minutes,
                       secs: assData.rows[0].time_limit_seconds}
      obj.deadline = assData.rows[0].deadline;
      obj.status = assData.rows[0].status;
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
})

router.post('/submitTest',async (req,res)=>{
    console.log("req body is ,",req.body);
    let testData = req.body;
    let assignmentId = testData.assignmentId;
    let answers = testData.answers;
    let questions = testData.questions;
    let tab_switches = testData.tabSwitches;
    let student_id = testData.studentId;
   
  //before anything make sure the assignment status is set to submitted
    await db.query('UPDATE assignmentss SET status = $1 where id = $2',['submitted',assignmentId]);

    //first of all we need to create need to make a new extry in the test relation returning the id
    try{
      let t = await db.query(
        'INSERT INTO tests (assignment_id, tab_switches, student_id) VALUES ($1, $2, $3) RETURNING id',
        [assignmentId, tab_switches, student_id]
      );
      let test_id = t.rows[0].id;
        

        //now we have to create a entry in the answers relation passing this test_id as the FK
        try{
           answers.map(async (element,index)=>{
            await db.query(
              'INSERT INTO answers (contents, test_id, question_id) VALUES ($1, $2, $3)',
              [element, test_id, questions[index].id]
            );
            
            })
        }
        catch(e)
        {
          console.log('smth happened with the answers relation ',e);
          
        }
      }
    catch(e)
    {
      console.log('smth happened with the test relation  ',e);
      
    }
    res.sendStatus(200);
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