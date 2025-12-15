import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email:  string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim:  true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:  true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select:  false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next:  any) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this. password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);