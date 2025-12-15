import express, { Router, Request, Response } from 'express';
import { CareRecord } from '../models/CareRecord.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = express.Router();

// Middleware to check authentication
router.use(authenticate);

// GET all care records for authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { animalId } = req.query;
    
    const query:  any = { userId: (req as any).user.id };
    if (animalId) {
      query.animalId = animalId;
    }

    const careRecords = await CareRecord.find(query).populate('animalId');
    res.json(careRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching care records', error });
  }
});

// GET single care record
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const record = await CareRecord.findOne({
      _id: req. params.id,
      userId: (req as any).user.id,
    }).populate('animalId');

    if (!record) {
      return res.status(404).json({ message: 'Care record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching care record', error });
  }
});

// POST create new care record
router.post('/', async (req: Request, res: Response) => {
  try {
    const { animalId, careType, date, notes, nextDue, completedBy } = req.body;

    if (!animalId || !careType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRecord = new CareRecord({
      animalId,
      userId: (req as any).user.id,
      careType,
      date:  date || new Date(),
      notes,
      nextDue,
      completedBy,
    });

    const savedRecord = await newRecord.save();
    const populatedRecord = await savedRecord.populate('animalId');
    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error creating care record', error });
  }
});

// PUT update care record
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const record = await CareRecord.findOne({
      _id: req.params.id,
      userId: (req as any).user.id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Care record not found' });
    }

    Object.assign(record, req.body);
    const updatedRecord = await record. save();
    const populatedRecord = await updatedRecord.populate('animalId');
    res.json(populatedRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error updating care record', error });
  }
});

// DELETE care record
router. delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await CareRecord.deleteOne({
      _id: req.params.id,
      userId: (req as any).user.id,
    });

    if (result.deletedCount === 0) {
      return res. status(404).json({ message: 'Care record not found' });
    }

    res.json({ message: 'Care record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting care record', error });
  }
});

export default router;