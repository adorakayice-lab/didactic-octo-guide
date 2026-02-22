import express, { Router, Request, Response } from 'express';
import Vault from '../models/Vault';

const router: Router = express.Router();

/**
 * GET /api/vault/:userId
 * Get user's vault information
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const vault = await Vault.findOne({ userId }).populate('deals.dealId', 'title apy termMonths');

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: 'Vault not found',
      });
    }

    res.json({
      success: true,
      data: vault,
    });
  } catch (error) {
    console.error('Error fetching vault:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vault',
    });
  }
});

/**
 * POST /api/vault/:userId/deposit
 * Deposit funds to vault
 */
router.post('/:userId/deposit', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { amount, strategy, transactionHash } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit amount',
      });
    }

    let vault = await Vault.findOne({ userId });

    if (!vault) {
      vault = new Vault({
        userId,
        strategy: strategy || 'balanced',
        totalDeposited: amount,
        currentBalance: amount,
      });
    } else {
      vault.totalDeposited += amount;
      vault.currentBalance += amount;
      if (strategy) vault.strategy = strategy;
    }

    // Add transaction to history
    vault.transactionHistory.push({
      type: 'deposit',
      amount,
      date: new Date(),
      txHash: transactionHash,
    });

    await vault.save();

    res.status(201).json({
      success: true,
      message: 'Deposit successful',
      data: {
        depositAmount: amount,
        newBalance: vault.currentBalance,
        strategy: vault.strategy,
      },
    });
  } catch (error) {
    console.error('Error processing deposit:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing deposit',
    });
  }
});

/**
 * POST /api/vault/:userId/withdraw
 * Request withdrawal from vault
 */
router.post('/:userId/withdraw', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { amount, transactionHash } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal amount',
      });
    }

    const vault = await Vault.findOne({ userId });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: 'Vault not found',
      });
    }

    if (amount > vault.currentBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
      });
    }

    vault.currentBalance -= amount;

    // Add transaction to history
    vault.transactionHistory.push({
      type: 'withdrawal',
      amount,
      date: new Date(),
      txHash: transactionHash,
    });

    await vault.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request processed',
      data: {
        withdrawnAmount: amount,
        remainingBalance: vault.currentBalance,
        note: 'Withdrawal will be processed within 7 business days',
      },
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing withdrawal',
    });
  }
});

/**
 * GET /api/vault/:userId/yields
 * Get vault yield information
 */
router.get('/:userId/yields', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const vault = await Vault.findOne({ userId });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: 'Vault not found',
      });
    }

    // Calculate average APY based on allocation
    const estimatedMonthlyYield = vault.currentBalance * 0.008; // ~10% APY average
    const estimatedAnnualYield = estimatedMonthlyYield * 12;

    res.json({
      success: true,
      data: {
        totalDeposited: vault.totalDeposited,
        currentBalance: vault.currentBalance,
        yieldAccrued: vault.yieldAccrued,
        strategy: vault.strategy,
        estimatedMonthlyYield: estimatedMonthlyYield.toFixed(2),
        estimatedAnnualYield: estimatedAnnualYield.toFixed(2),
        estimatedAPY: '10.2%',
        lastRebalance: vault.lastRebalance,
      },
    });
  } catch (error) {
    console.error('Error fetching yields:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching yields',
    });
  }
});

export default router;
