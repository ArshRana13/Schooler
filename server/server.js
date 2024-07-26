import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import session from 'express-session';
import dotenv from 'dotenv';
import pg from 'pg';
import Admin from './Routes/admin.js';
import Teacher from './Routes/teacher.js';
import Student from './Routes/student.js';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws'; 


const app = express();
dotenv.config();

// Middlewares
app.use(session({
  secret: 'my name is arsh whats yours?',
  resave: false,
  saveUninitialized: false
}));

const db = new pg.Client({
  password: process.env.DATABASE_PASSWORD,
  host: 'localhost',
  user: 'postgres',
  database: 'schooler',
  port: 5432
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests from this origin
  methods: ['GET', 'POST'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true,  // Allow cookies and credentials
};

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

// Login & Authentication
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (email == 'folkyylore@gmail.com' && password == '123') {
    console.log('success');
    res.status(200).json({ message: 'Login successful' });
  } else {
    console.log('error');
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.get("/schooler/home", (req, res) => {
  if (req.isAuthenticated())
    return res.status(200).json({ role: req.user.role,group_student: req.user.group_student,assignments: req.user.assignments });
  else
    return res.sendStatus(401);
});

app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get("/auth/google/schooler/home",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    if (req.user.role == 'admin') {
      res.redirect("http://localhost:5173/schooler/admin/home");
    } else if (req.user.role == 'teacher') {
      res.redirect("http://localhost:5173/schooler/teacher/home");
    } else if (req.user.role == 'student') {
      res.redirect("http://localhost:5173/schooler/student/home");
    }
    else {
      res.redirect("http://localhost:5173/login");
    }
  }
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:3000/auth/google/schooler/home",
      userProfileURL: process.env.userProfileURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);

      // Database checking
      let admin = await db.query('SELECT id FROM admin WHERE name = $1', [profile.email]);
      let teacher = await db.query('SELECT id FROM teacher WHERE name = $1', [profile.email]);
      let student = await db.query('SELECT group_student FROM student WHERE name = $1', [profile.email]);

      console.log(admin.rows);
      console.log(student.rows);
      if (admin.rows[0]) {
        profile.role = 'admin';
        return cb(null, profile);
      } else if (teacher.rows[0]) {
        profile.role = 'teacher';
        return cb(null, profile);
      } else if (student.rows[0]) {
        profile.role = 'student';
        profile.group_student = student.rows[0].group_student;
        let assignments = await db.query('SELECT * from assignmentss join student on student.group_student  = assignmentss.group_name where student.group_student = $1',[profile.group_student]);
        profile.assignments = assignments.rows;
        console.log(assignments.rows);
        return cb(null,profile)
      } else {
        return cb(null, false);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Admin routes
app.use('/schooler/admin', Admin);
app.use('/schooler/teacher', Teacher);
app.use('/schooler/student',Student);

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (ws) => {
  console.log('WebSocket connection established');

  // Fetch initial assignments from the database
  const result = await db.query('SELECT * FROM assignmentss');
  console.log(result.rows);
  const assignments = result.rows;

  // Send initial data
  ws.send(JSON.stringify({ type: 'INITIAL_DATA', assignments }));
});


export const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const server = app.listen(3000, (err) => {
  if (!err) {
    console.log('Server started on port 3000');
  } else {
    console.error('Server failed to start:', err);
  }
});

// Upgrade HTTP server to WebSocket server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

export default app;
