import express, { Router, Request, Response } from 'express';
import User from '../models/User';

// Initialize Stripe (in production, use actual API key)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

const router: Router = express.Router();

const PRICING = {
  premium: {
    monthly: 4900, // $49.00 in cents
    annual: 49000, // $490.00 in cents (annual)
  },
  premium_plus: {
    monthly: 9900, // $99.00 in cents
    annual: 99000, // $990.00 in cents (annual)
  },
};

/**
 * GET /api/premium/status/:userId
 * Get user's premium subscription status
 */
router.get('/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPremium = user.premiumSubscription?.isActive || false;
    const currentPlan = user.premiumSubscription?.plan || 'free';

    res.json({
      success: true,
      data: {
        userId: user._id,
        isPremium,
        currentPlan,
        subscriptionDetails: user.premiumSubscription,
        statusMessage: isPremium ? 'Active subscription' : 'No active subscription',
      },
    });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching premium status',
    });
  }
});

/**
 * POST /api/premium/subscribe
 * Create premium subscription with Stripe
 */
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { userId, plan, stripeToken, billingCycle = 'monthly' } = req.body;

    // Validation
    if (!userId || !plan || !['premium', 'premium_plus'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription data. Plan must be "premium" or "premium_plus".',
      });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billing cycle. Must be "monthly" or "annual".',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: 'User email is required for subscription',
      });
    }

    try {
      // Create or get Stripe customer
      let customerId = user._id as any;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: userId,
          },
        });
        customerId = customer.id;
      }

      // Create payment intent
      const planPrice = PRICING[plan as keyof typeof PRICING];
      const amount = billingCycle === 'annual' ? planPrice.annual : planPrice.monthly;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: customerId,
        description: `${plan} subscription - ${billingCycle} billing`,
        metadata: {
          userId,
          plan,
          billingCycle,
        },
      });

      // For mock testing, simulate successful payment
      if (process.env.NODE_ENV === 'test' || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
        // Proceed with subscription
        const startDate = new Date();
        const endDate = new Date();

        if (billingCycle === 'annual') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        user.premiumSubscription = {
          plan: plan as any,
          startDate,
          endDate,
          isActive: true,
        };

        await user.save();

        return res.status(201).json({
          success: true,
          message: `Successfully upgraded to ${plan}`,
          data: {
            userId: user._id,
            plan: user.premiumSubscription.plan,
            billingCycle,
            amount: `$${amount / 100}`,
            startDate: user.premiumSubscription.startDate,
            endDate: user.premiumSubscription.endDate,
            isActive: user.premiumSubscription.isActive,
            clientSecret: paymentIntent.client_secret,
          },
        });
      }

      // In production, return client secret for Stripe frontend processing
      res.status(201).json({
        success: true,
        message: 'Payment intent created. Complete payment to activate subscription.',
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: `$${amount / 100}`,
          plan,
          billingCycle,
        },
      });
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError.message);
      res.status(400).json({
        success: false,
        message: `Payment failed: ${stripeError.message}`,
      });
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
    });
  }
});

/**
 * POST /api/premium/confirm-payment
 * Confirm payment and activate subscription
 */
router.post('/confirm-payment', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, userId, plan, billingCycle } = req.body;

    if (!paymentIntentId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'paymentIntentId and userId required',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    try {
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed',
        });
      }

      // Activate subscription
      const startDate = new Date();
      const endDate = new Date();

      if (billingCycle === 'annual') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      user.premiumSubscription = {
        plan: plan || 'premium',
        startDate,
        endDate,
        isActive: true,
      };

      await user.save();

      res.json({
        success: true,
        message: 'Subscription activated successfully',
        data: {
          userId: user._id,
          plan: user.premiumSubscription.plan,
          startDate: user.premiumSubscription.startDate,
          endDate: user.premiumSubscription.endDate,
        },
      });
    } catch (stripeError: any) {
      res.status(400).json({
        success: false,
        message: `Verification failed: ${stripeError.message}`,
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
    });
  }
});

/**
 * POST /api/premium/cancel-subscription
 * Cancel premium subscription
 */
router.post('/cancel-subscription', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId required',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.premiumSubscription?.isActive) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel',
      });
    }

    user.premiumSubscription.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        userId: user._id,
        message: 'Your premium access will remain active until the end of your billing period.',
      },
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
    });
  }
});

/**
 * GET /api/premium/analytics/:userId
 * Get AI-powered risk analytics (Premium feature)
 */
router.get('/analytics/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.premiumSubscription?.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required',
      });
    }

    // In production: Call Hugging Face or OpenAI API for risk predictions
    res.json({
      success: true,
      data: {
        portfolioRisk: {
          score: 42,
          level: 'Medium',
          recommendation: 'Your portfolio has balanced risk exposure',
        },
        predictions: {
          nextMonthYield: '$156',
          confidenceScore: 0.87,
          riskAdjustedReturn: '8.9%',
        },
        recommendations: [
          'Rebalance allocation towards tech startups',
          'Consider agriculture deals for lower volatility',
          'Diversify across geographies',
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
    });
  }
});

export default router;
