import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../prismaClient.js';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// Register a new user endpoint /auth/register
router.post('/register', async (req, res) => {
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
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    // Now the user is registered they would be assigned a default todo
    const defaultTodo = 'Hello, add your first todo!';
   await prisma.todo.create({
    data: {
      task: defaultTodo,
      userId: user.id
    }
   })
    // Create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

// Login endpoint /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

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