import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// Register a new user endpoint /auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (checkUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Step 1: Encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Step 2: Save the new user and the hashed password to the DB
  try {
    const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = insertUser.run(username, hashedPassword);

    // Now the user is registered they would be assigned a default todo
    const defaultTodo = 'Hello, add your first todo!';
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // Create a token
    const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Login endpoint /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = getUser.get(username);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;