import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  weight: number;
  color: string;
  medicalHistory: string;
  vaccinations:  string[];
  lastCheckup?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const animalSchema = new Schema<IAnimal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type:  String,
      required: true,
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Other'],
    },
    breed:  {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required:  true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    color: {
      type: String,
      trim: true,
    },
    medicalHistory: {
      type: String,
      default: '',
    },
    vaccinations: [
      {
        type: String,
        trim: true,
      },
    ],
    lastCheckup: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Animal = mongoose.model<IAnimal>('Animal', animalSchema);