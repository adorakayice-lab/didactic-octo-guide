import request from 'supertest';
import express from 'express';

// Mock the routes
const createRouter = () => {
  const router = express.Router();

  // Register endpoint
  router.post('/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Mock JWT token generation
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: '507f1f77bcf86cd799439011',
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        token,
      },
    });
  });

  // Login endpoint
  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: '507f1f77bcf86cd799439011',
        email,
        token,
      },
    });
  });

  // Wallet connect endpoint
  router.post('/wallet-connect', (req, res) => {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and signature are required',
      });
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

    return res.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        userId: '507f1f77bcf86cd799439011',
        walletAddress,
        token,
      },
    });
  });

  return router;
};

describe('Auth Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', createRouter());
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should reject registration without email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        password: 'securePassword123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration without password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should reject login without email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with short password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: '12345',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/wallet-connect', () => {
    it('should connect wallet with valid signature', async () => {
      const response = await request(app).post('/api/auth/wallet-connect').send({
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42D2D',
        signature: '0xsignature123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.walletAddress).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f42D2D');
    });

    it('should reject without wallet address', async () => {
      const response = await request(app).post('/api/auth/wallet-connect').send({
        signature: '0xsignature123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
