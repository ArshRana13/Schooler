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

// Middleware to create users
router.post('/createUser', async (req, res) => {
  const { email, role, group } = req.body;
  console.log(req.body);

  if (role == 'admin') {
    let teacher = await db.query('SELECT id FROM teacher WHERE name = $1', [email]);
    let student = await db.query('SELECT id FROM student WHERE name = $1', [email]);
    if (teacher.rows[0] || student.rows[0]) {
      // An account with this email exists in teacher or student database
      res.status(401).json({ message: 'An account with this email exists in teacher or student database' });
    } else {
      let admin = await db.query('SELECT id FROM admin WHERE name = $1', [email]);
      if (admin.rows[0]) {
        // An account with the same email exists in admin database
        res.status(401).json({ message: 'An account with this email exists in admin database' });
      } else {
        try {
          await db.query('INSERT INTO admin (name, password) VALUES ($1, $2)', [email, 'google']);
          res.status(200).json({ message: 'Admin created' });
        } catch (e) {
          console.log(e);
        }
      }
    }
  } else if (role == 'teacher') {
    let admin = await db.query('SELECT id FROM admin WHERE name = $1', [email]);
    let student = await db.query('SELECT id FROM student WHERE name = $1', [email]);
    if (admin.rows[0] || student.rows[0]) {
      // An account with this email exists in teacher or student database
      res.status(401).json({ message: 'An account with this email exists in admin or student database' });
    } else {
      let teacher = await db.query('SELECT id FROM teacher WHERE name = $1', [email]);
      if (teacher.rows[0]) {
        // An account with the same email exists in admin database
        res.status(401).json({ message: 'An account with this email exists in teacher database' });
      } else {
        try {
          await db.query('INSERT INTO teacher (name, password) VALUES ($1, $2)', [email, 'google']);
          res.status(200).json({ message: 'Teacher created' });
        } catch (e) {
          console.log(e);
        }
      }
    }
  } else if (role == 'student') {
    let teacher = await db.query('SELECT id FROM teacher WHERE name = $1', [email]);
    let admin = await db.query('SELECT id FROM admin WHERE name = $1', [email]);
    if (teacher.rows[0] || admin.rows[0]) {
      // An account with this email exists in teacher or student database
      res.status(401).json({ message: 'An account with this email exists in teacher or admin database' });
    } else {
      let student = await db.query('SELECT id FROM student WHERE name = $1', [email]);
      if (student.rows[0]) {
        // An account with the same email exists in admin database
        res.status(401).json({ message: 'An account with this email exists in student database' });
      } else {
        try {
          if(group!=null)
            {
          await db.query('INSERT INTO student (name, password, group_student) VALUES ($1, $2, $3)', [email, 'google',group]);
          res.status(200).json({ message: 'Student created' });
            }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
});


router.post('/deleteUser',async (req,res)=>{
  console.log(req.body);
  let email = req.body.email;

  let teacher = await db.query('SELECT id FROM teacher WHERE name = $1',[email]);
  let student = await db.query('SELECT id FROM student WHERE name = $1',[email]);

  if(teacher.rows[0])
    {
      //the acccount to delete belongs to the teacher relation
      await db.query('DELETE FROM teacher WHERE name = $1',[email])
     return res.status(200).json({ message: 'Teacher deleted' });
    }
    if(student.rows[0])
      {
        //the acccount to delete belongs to the teacher relation
      await db.query('DELETE FROM student WHERE name = $1',[email])
      return res.status(200).json({ message: 'Student deleted' });
      }
      
      res.status(401).json({message:"Either this account belongs to an admin or it does not exists"})
})


// router.post('/viewDetails', async (req,res)=>{
//     let email = req.body.email;
    
// })

export default router;
