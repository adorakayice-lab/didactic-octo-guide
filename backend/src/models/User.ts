import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  walletAddress: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  premiumSubscription?: {
    plan: 'free' | 'premium' | 'premium_plus';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
  totalInvested: number;
  totalEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    country: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    premiumSubscription: {
      plan: {
        type: String,
        enum: ['free', 'premium', 'premium_plus'],
        default: 'free',
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
    totalEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
