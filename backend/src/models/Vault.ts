import mongoose, { Schema, Document } from 'mongoose';

export interface IVault extends Document {
  userId: mongoose.Types.ObjectId;
  strategy: 'conservative' | 'balanced' | 'aggressive';
  totalDeposited: number;
  currentBalance: number;
  yieldAccrued: number;
  allocationTargets: {
    tech: number;
    realEstate: number;
    agriculture: number;
  };
  deals: Array<{
    dealId: mongoose.Types.ObjectId;
    amount: number;
    percentage: number;
    yieldEarned: number;
  }>;
  transactionHistory: Array<{
    type: 'deposit' | 'withdrawal' | 'dividend' | 'rebalance';
    amount: number;
    date: Date;
    txHash?: string;
  }>;
  rebalanceSchedule?: 'monthly' | 'quarterly' | 'manual';
  lastRebalance?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VaultSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    strategy: {
      type: String,
      enum: ['conservative', 'balanced', 'aggressive'],
      default: 'balanced',
    },
    totalDeposited: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    yieldAccrued: {
      type: Number,
      default: 0,
    },
    allocationTargets: {
      tech: { type: Number, default: 40 },
      realEstate: { type: Number, default: 35 },
      agriculture: { type: Number, default: 25 },
    },
    deals: [
      {
        dealId: {
          type: mongoose.Types.ObjectId,
          ref: 'Deal',
        },
        amount: Number,
        percentage: Number,
        yieldEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
    transactionHistory: [
      {
        type: {
          type: String,
          enum: ['deposit', 'withdrawal', 'dividend', 'rebalance'],
        },
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        txHash: String,
      },
    ],
    rebalanceSchedule: {
      type: String,
      enum: ['monthly', 'quarterly', 'manual'],
      default: 'quarterly',
    },
    lastRebalance: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVault>('Vault', VaultSchema);
