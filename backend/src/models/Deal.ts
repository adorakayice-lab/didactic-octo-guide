import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  apy: number;
  termMonths: number;
  minInvestment: number;
  targetAmount: number;
  currentRaised: number;
  status: 'draft' | 'open' | 'coming' | 'closed' | 'completed';
  underlyingAsset: string;
  assetClass: string;
  geography: string;
  riskRating: 'low' | 'medium' | 'high';
  issuer: string;
  issuerRating?: string;
  fundingSchedule?: Array<{
    date: Date;
    amount: number;
  }>;
  investors: Array<{
    userId: mongoose.Types.ObjectId;
    amount: number;
    investmentDate: Date;
    earningsAccrued: number;
  }>;
  totalEarningsDistributed: number;
  startDate?: Date;
  maturityDate?: Date;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    apy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    termMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    minInvestment: {
      type: Number,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentRaised: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'coming', 'closed', 'completed'],
      default: 'draft',
    },
    underlyingAsset: {
      type: String,
      required: true,
    },
    assetClass: {
      type: String,
      enum: ['credit', 'real_estate', 'agriculture', 'renewable_energy', 'other'],
      required: true,
    },
    geography: {
      type: String,
      required: true,
    },
    riskRating: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    issuer: {
      type: String,
      required: true,
    },
    issuerRating: String,
    fundingSchedule: [
      {
        date: Date,
        amount: Number,
      },
    ],
    investors: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
        amount: Number,
        investmentDate: Date,
        earningsAccrued: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalEarningsDistributed: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    maturityDate: Date,
    documents: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDeal>('Deal', DealSchema);
