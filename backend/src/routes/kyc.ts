import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';

const router: Router = express.Router();

// Initialize Persona client (in production, use actual API client)
const PERSONA_API_URL = process.env.PERSONA_API_URL || 'https://api.withpersona.com/api/v1';
const PERSONA_API_KEY = process.env.PERSONA_API_KEY || 'sk_test_mock';
const PERSONA_WEBHOOK_SECRET = process.env.PERSONA_WEBHOOK_SECRET || 'whsec_test_mock';

/**
 * GET /api/kyc/status/:userId
 * Get user's KYC verification status
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

    const status = {
      userId: user._id,
      kycStatus: user.kycStatus || 'pending',
      isVerified: user.isVerified || false,
      lastUpdated: user.updatedAt,
      statusDetails: {
        pending: 'Verification in progress',
        verified: 'Identity verified',
        rejected: 'Verification failed',
      }[user.kycStatus || 'pending'] || 'Status unknown',
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC status',
    });
  }
});

/**
 * POST /api/kyc/verify
 * Initiate KYC verification with Persona
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { userId, firstName, lastName, email, countryCode, phoneNumber, dateOfBirth } = req.body;

    // Validation
    if (!userId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, firstName, lastName, email',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is already verified
    if (user.kycStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'User is already verified',
      });
    }

    try {
      // Call Persona API to create inquiry
      let inquiryId = 'inq_' + Math.random().toString(36).slice(2, 12);

      if (process.env.NODE_ENV === 'production' && PERSONA_API_KEY !== 'sk_test_mock') {
        const response = await fetch(`${PERSONA_API_URL}/inquiries`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PERSONA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              type: 'inquiry',
              attributes: {
                'namefirst': firstName,
                'namelast': lastName,
                'email-address': email,
                'phone-number': phoneNumber,
                'country-code': countryCode || 'US',
                'birthdate': dateOfBirth,
                'inquiryTemplateId': process.env.PERSONA_INQUIRY_TEMPLATE_ID,
              },
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Persona API error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json() as any;
        inquiryId = data?.data?.id;
      }

      // Update user KYC status
      user.kycStatus = 'pending';
      user._id = user._id; // Store inquiry reference if needed
      await user.save();

      res.json({
        success: true,
        message: 'KYC verification initiated successfully',
        data: {
          userId: user._id,
          status: user.kycStatus,
          inquiryId,
          redirectUrl: `https://inquiry.withpersona.com/${inquiryId}`,
          nextSteps: 'Please complete identity verification at the provided URL. Check your email for further instructions.',
          estimatedTime: '5-15 minutes',
        },
      });
    } catch (personaError: any) {
      console.error('Persona API error:', personaError.message);
      res.status(400).json({
        success: false,
        message: `Verification setup failed: ${personaError.message}`,
      });
    }
  } catch (error) {
    console.error('Error initiating KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating KYC verification',
    });
  }
});

/**
 * POST /api/kyc/webhook
 * Webhook for Persona KYC updates
 * Endpoint: POST /api/kyc/webhook
 * Signature verification in headers: Persona-Signature
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['persona-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    // Verify webhook signature (in production)
    if (process.env.NODE_ENV === 'production' && signature) {
      const hash = crypto
        .createHmac('sha256', PERSONA_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        return res.status(401).json({
          success: false,
          message: 'Invalid webhook signature',
        });
      }
    }

    const body = req.body as any;
    const { data } = body;

    if (!data || !data.attributes) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload',
      });
    }

    const { id: inquiryId, attributes } = data;
    const status = attributes.status;
    const attributes_obj = attributes.attributes || {};

    // Find user and update KYC status
    const user = await User.findOne({
      email: attributes_obj['email-address'],
    });

    if (user) {
      switch (status) {
        case 'completed':
          // Check if passed verification
          if (attributes.passed) {
            user.kycStatus = 'verified';
            user.isVerified = true;
          } else {
            user.kycStatus = 'rejected';
            user.isVerified = false;
          }
          break;
        case 'pending':
          user.kycStatus = 'pending';
          break;
        case 'failed':
          user.kycStatus = 'rejected';
          user.isVerified = false;
          break;
        default:
          user.kycStatus = 'pending';
      }

      await user.save();

      console.log(`KYC updated for user ${user._id}: ${user.kycStatus}`);
    }

    // Always return 200 to acknowledge webhook
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      inquiryId,
      newStatus: status,
    });
  } catch (error) {
    console.error('Error processing KYC webhook:', error);
    // Still return 200 to acknowledge, but log error
    res.status(200).json({
      success: false,
      message: 'Webhook received but processing had issues',
      error: process.env.NODE_ENV === 'development' ? (error as any).message : undefined,
    });
  }
});

/**
 * POST /api/kyc/cancel
 * Cancel KYC verification for a user
 */
router.post('/cancel', async (req: Request, res: Response) => {
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

    if (user.kycStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel verified KYC',
      });
    }

    user.kycStatus = 'pending';
    await user.save();

    res.json({
      success: true,
      message: 'KYC verification cancelled',
      data: {
        userId: user._id,
        newStatus: user.kycStatus,
      },
    });
  } catch (error) {
    console.error('Error cancelling KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling KYC verification',
    });
  }
});

export default router;
