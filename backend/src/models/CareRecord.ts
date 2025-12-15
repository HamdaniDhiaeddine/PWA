import mongoose, { Schema, Document } from 'mongoose';

export type CareType = 'feeding' | 'grooming' | 'exercise' | 'medication' | 'veterinary';

export interface ICareRecord extends Document {
  animalId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  careType: CareType;
  date: Date;
  notes: string;
  nextDue?: Date;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const careRecordSchema = new Schema<ICareRecord>(
  {
    animalId: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
    },
    userId: {
      type:  Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    careType: {
      type: String,
      required:  true,
      enum: ['feeding', 'grooming', 'exercise', 'medication', 'veterinary'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      default:  '',
    },
    nextDue: {
      type: Date,
    },
    completedBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const CareRecord = mongoose.model<ICareRecord>('CareRecord', careRecordSchema);