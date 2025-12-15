import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { User } from '../models/User';

const router: Router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log('Register attempt:', { name, email });

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    // HASH PASSWORD BEFORE SAVING
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });
    
    await newUser.save();
    console.log('User created:', newUser._id);

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-testing';
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    // FETCH USER WITH PASSWORD (override select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // COMPARE PLAIN PASSWORD WITH HASHED PASSWORD
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-testing';
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
});

export default router;
