// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import  session  from 'express-session';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
app.use(session({
  secret: 'my name is arsh whats yours?', 
  resave: false,
  saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());

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
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/schooler/home",
  passport.authenticate("google", {
    successRedirect: "/schooler/home",
    failureRedirect: "/login",
  })
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
      // try {
      //   console.log(profile);
      //   const result = await db.query("SELECT * FROM users WHERE email = $1", [
      //     profile.email,
      //   ]);
      //   if (result.rows.length === 0) {
      //     const newUser = await db.query(
      //       "INSERT INTO users (email, password) VALUES ($1, $2)",
      //       [profile.email, "google"]
      //     );
      //     return cb(null, newUser.rows[0]);
      //   } else {
      //     return cb(null, result.rows[0]);
      //   }
      // } catch (err) {
      //   return cb(err);
      // }
      console.log(profile);
      if(profile.email == 'folkyylore@gmail.com')
        {
          return cb(null,profile);
        }
        else
        return cb(null,false);
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});








app.listen(3000, (err) => {
  if (!err) {
    console.log('Server started on port 3000');
  } else {
    console.error('Server failed to start:', err);
  }
});
