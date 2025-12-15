import express, { Router, Request, Response } from 'express';
import { Animal, IAnimal } from '../models/Animal.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = express.Router();

// Middleware to check authentication
router.use(authenticate);

// GET all animals for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const animals = await Animal.find({ userId: (req as any).user.id });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animals', error });
  }
});

// GET single animal by ID
router.get('/:id', async (req:  Request, res: Response) => {
  try {
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: (req as any).user.id,
    });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animal', error });
  }
});

// POST create new animal
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, species, breed, dateOfBirth, weight, color, medicalHistory, vaccinations } = req.body;

    if (!name || !species || !breed || !dateOfBirth || !weight) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newAnimal = new Animal({
      userId: (req as any).user.id,
      name,
      species,
      breed,
      dateOfBirth,
      weight,
      color,
      medicalHistory,
      vaccinations:  vaccinations || [],
    });

    const savedAnimal = await newAnimal.save();
    res.status(201).json(savedAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating animal', error });
  }
});

// PUT update animal
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findOne({
      _id: req.params. id,
      userId: (req as any).user.id,
    });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    Object.assign(animal, req.body);
    const updatedAnimal = await animal.save();
    res.json(updatedAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating animal', error });
  }
});

// DELETE animal
router.delete('/:id', async (req: Request, res:  Response) => {
  try {
    const result = await Animal.deleteOne({
      _id: req.params. id,
      userId: (req as any).user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting animal', error });
  }
});

export default router;