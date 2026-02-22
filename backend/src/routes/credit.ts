import express, { Router, Request, Response } from 'express';
import Deal from '../models/Deal';

const router: Router = express.Router();

// ==================== GET ROUTES ====================

/**
 * GET /api/credit
 * Get all available credit deals
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, assetClass, minApy, sortBy } = req.query;

    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (assetClass && assetClass !== 'all') {
      query.assetClass = assetClass;
    }

    if (minApy) {
      query.apy = { $gte: parseFloat(minApy as string) };
    }

    let sortCriteria: any = { createdAt: -1 };
    if (sortBy === 'apy') {
      sortCriteria = { apy: -1 };
    } else if (sortBy === 'term') {
      sortCriteria = { termMonths: 1 };
    }

    const deals = await Deal.find(query).sort(sortCriteria).limit(50);

    res.json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deals',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/credit/:dealId
 * Get a specific deal by ID
 */
router.get('/:dealId', async (req: Request, res: Response) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId).populate('investors.userId', 'firstName lastName email');

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    res.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deal',
    });
  }
});

/**
 * GET /api/credit/user/:userId/investments
 * Get user's investments
 */
router.get('/user/:userId/investments', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const deals = await Deal.find({
      'investors.userId': userId,
    });

    const investments = deals
      .flatMap((deal) =>
        deal.investors
          .filter((inv) => inv.userId.toString() === userId)
          .map((inv) => ({
            dealId: deal._id,
            dealTitle: deal.title,
            amount: inv.amount,
            apy: deal.apy,
            earningsAccrued: inv.earningsAccrued,
            status: deal.status,
          }))
      );

    res.json({
      success: true,
      count: investments.length,
      totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
      totalEarnings: investments.reduce((sum, inv) => sum + inv.earningsAccrued, 0),
      data: investments,
    });
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching investments',
    });
  }
});

// ==================== POST ROUTES ====================

/**
 * POST /api/credit/:dealId/invest
 * Invest in a deal
 */
router.post('/:dealId/invest', async (req: Request, res: Response) => {
  try {
    const { dealId } = req.params;
    const { userId, amount, transactionHash } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid investment data',
      });
    }

    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    if (deal.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: `Cannot invest in ${deal.status} deal`,
      });
    }

    if (amount < deal.minInvestment) {
      return res.status(400).json({
        success: false,
        message: `Minimum investment is $${deal.minInvestment}`,
      });
    }

    if (deal.currentRaised + amount > deal.targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Investment exceeds remaining funding target',
      });
    }

    // Add investor to deal
    deal.investors.push({
      userId: userId,
      amount: amount,
      investmentDate: new Date(),
      earningsAccrued: 0,
    });

    deal.currentRaised += amount;

    // Close deal if fully funded
    if (deal.currentRaised >= deal.targetAmount) {
      deal.status = 'closed';
    }

    await deal.save();

    res.status(201).json({
      success: true,
      message: 'Investment successful',
      data: {
        dealId: deal._id,
        dealTitle: deal.title,
        investedAmount: amount,
        apy: deal.apy,
        transactionHash,
      },
    });
  } catch (error) {
    console.error('Error processing investment:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing investment',
    });
  }
});

export default router;
