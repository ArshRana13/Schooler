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




export default router;