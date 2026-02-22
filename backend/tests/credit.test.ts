import request from 'supertest';
import express from 'express';

const createRouter = () => {
  const router = express.Router();

  // Dummy deals for testing
  const deals = [
    {
      id: '1',
      title: 'Tech Startup Series A',
      apy: 12,
      term: 24,
      minInvestment: 500,
      currentRaised: 750000,
      targetAmount: 1000000,
      status: 'open',
      assetClass: 'tech',
      description: 'Innovative fintech solutions',
    },
    {
      id: '2',
      title: 'Real Estate Development',
      apy: 10,
      term: 36,
      minInvestment: 1000,
      currentRaised: 500000,
      targetAmount: 2000000,
      status: 'open',
      assetClass: 'real_estate',
      description: 'Premium property development',
    },
  ];

  // GET all deals with filters
  router.get('/', (req, res) => {
    const { status, minApy, assetClass } = req.query;

    let filtered = deals;

    if (status) {
      filtered = filtered.filter((deal) => deal.status === status);
    }

    if (minApy) {
      filtered = filtered.filter((deal) => deal.apy >= Number(minApy));
    }

    if (assetClass) {
      filtered = filtered.filter((deal) => deal.assetClass === assetClass);
    }

    return res.json({
      success: true,
      message: 'Deals fetched successfully',
      data: filtered,
    });
  });

  // GET deal by ID
  router.get('/:dealId', (req, res) => {
    const deal = deals.find((d) => d.id === req.params.dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    return res.json({
      success: true,
      message: 'Deal fetched successfully',
      data: deal,
    });
  });

  // POST invest in deal
  router.post('/:dealId/invest', (req, res) => {
    const { userId, amount } = req.body;
    const deal = deals.find((d) => d.id === req.params.dealId);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId and amount are required',
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
        message: 'Investment exceeds deal target',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: {
        investmentId: '507f1f77bcf86cd799439012',
        dealId: deal.id,
        userId,
        amount,
        investmentDate: new Date(),
      },
    });
  });

  return router;
};

describe('Credit Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/credit', createRouter());
  });

  describe('GET /api/credit', () => {
    it('should fetch all deals', async () => {
      const response = await request(app).get('/api/credit');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter deals by status', async () => {
      const response = await request(app).get('/api/credit?status=open');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: 'open',
          }),
        ])
      );
    });

    it('should filter deals by minimum APY', async () => {
      const response = await request(app).get('/api/credit?minApy=11');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            apy: expect.any(Number),
          }),
        ])
      );
      response.body.data.forEach((deal: any) => {
        expect(deal.apy).toBeGreaterThanOrEqual(11);
      });
    });

    it('should filter deals by asset class', async () => {
      const response = await request(app).get('/api/credit?assetClass=tech');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            assetClass: 'tech',
          }),
        ])
      );
    });
  });

  describe('GET /api/credit/:dealId', () => {
    it('should fetch deal by ID', async () => {
      const response = await request(app).get('/api/credit/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('1');
    });

    it('should return 404 for non-existent deal', async () => {
      const response = await request(app).get('/api/credit/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/credit/:dealId/invest', () => {
    it('should create investment with valid data', async () => {
      const response = await request(app)
        .post('/api/credit/1/invest')
        .send({
          userId: 'user123',
          amount: 5000,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investmentId).toBeDefined();
    });

    it('should reject investment below minimum', async () => {
      const response = await request(app)
        .post('/api/credit/1/invest')
        .send({
          userId: 'user123',
          amount: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Minimum investment');
    });

    it('should reject investment without userId', async () => {
      const response = await request(app)
        .post('/api/credit/1/invest')
        .send({
          amount: 5000,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject investment in non-existent deal', async () => {
      const response = await request(app)
        .post('/api/credit/999/invest')
        .send({
          userId: 'user123',
          amount: 5000,
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
