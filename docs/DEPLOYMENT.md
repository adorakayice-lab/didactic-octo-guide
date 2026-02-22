# AssetBridge Nexus - Deployment & Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- MongoDB Atlas account (or local MongoDB)
- Ethereum wallet for testnet deployment
- GitHub account

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/adorakayice-lab/assetbridge-nexus.git
cd assetbridge-nexus
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update with your configuration:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_INFURA_KEY=your_infura_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id

# Backend
BACKEND_PORT=3001
MONGODB_URI=mongodb://localhost:27017/assetbridge-nexus
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development

# Blockchain
ETHEREUM_INFURA_URL=https://sepolia.infura.io/v3/your_infura_key
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_alchemy_key
PRIVATE_KEY=your_wallet_private_key

# Third-Party Services
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
PERSONA_API_KEY=your_persona_key
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install contract dependencies
cd contracts
npm install
cd ..
```

### 4. Start Development Servers

#### Terminal 1 - Frontend

```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

#### Terminal 2 - Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

#### Terminal 3 - MongoDB (if running locally)

```bash
mongod
# Starts MongoDB on port 27017
```

## Deploy to Production

### Frontend Deployment (Vercel)

1. **Connect GitHub Repository**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel deploy --prod
   ```

3. **Environment Variables**
   - Add variables in Vercel dashboard
   - Set `NEXT_PUBLIC_API_URL` to production backend URL

### Backend Deployment (Render)

1. **Create Render Account**
   - Sign up at https://render.com

2. **Create New Web Service**
   - Connect GitHub repository
   - Select server: `backend` directory
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

3. **Add Environment Variables**
   - Add all variables from `.env.local`

4. **Deploy**
   - Render will auto-deploy on git push

### Database Deployment (MongoDB Atlas)

1. **Create Cluster**
   - Sign up at https://mongodb.com/atlas
   - Create a cluster in your preferred region

2. **Get Connection String**
   - Copy connection string
   - Update `MONGODB_URI` in backend environment

3. **Network Access**
   - Add backend IP to IP whitelist
   - Add 0.0.0.0/0 for development

### Smart Contract Deployment

#### Sepolia Testnet

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

#### Ethereum Mainnet (Production)

```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.ts --network mainnet

# Verify contracts
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

## Docker Deployment

### Build Docker Images

```bash
# Frontend
cd frontend
docker build -t assetbridge-frontend .
docker run -p 3000:3000 assetbridge-frontend

# Backend
cd backend
docker build -t assetbridge-backend .
docker run -p 3001:3001 \
  -e MONGODB_URI=mongodb://mongo:27017/assetbridge \
  -e JWT_SECRET=your_secret \
  assetbridge-backend
```

### Docker Compose

```bash
docker-compose up -d
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build:frontend
      - run: vercel deploy --token ${{ secrets.VERCEL_TOKEN }} --prod

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build:backend
      - run: # Deploy to Render
```

## Testing

### Unit Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

### E2E Tests

```bash
npm run test:e2e
```

## Monitoring & Logging

### Frontend Monitoring

```typescript
// Install Sentry
npm install @sentry/nextjs

// Initialize in _app.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### Backend Logging

```typescript
// Install Winston
npm install winston

// Configure logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
```

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check connection string
echo $MONGODB_URI

# Test connection
npm install -g mongodb-cli
mongosh "your_connection_string"
```

### Smart Contract Deployment Issues

```bash
# Check network connection
npm install -g ethers

# Verify wallet has ETH
ethers-cli account balance --address 0x...
```

### Frontend Build Issues

```bash
# Clear Next.js cache
rm -rf frontend/.next
npm run build:frontend
```

## Performance Optimization

### Frontend

```bash
# Analyze bundle size
npm install -g next-bundle-analyzer

# Generate report
ANALYZE=true npm run build:frontend
```

### Backend

```bash
# Monitor API response times
npm install good-http-client

# Check database queries
db.setProfilingLevel(1)
db.system.profile.find().limit(5).sort({ ts : -1 }).pretty()
```

## Security Checklist

- [ ] Environment variables not committed
- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all routes
- [ ] JWT secrets rotated
- [ ] Smart contracts audited
- [ ] Node.js dependencies updated
- [ ] Secrets management implemented
- [ ] Monitoring and alerts set up

## Rollback Procedures

### Frontend Rollback

```bash
# Revert to previous Vercel deployment
vercel rollback
```

### Backend Rollback

```bash
# Render dashboard: Deployments → select previous → Redeploy
```

### Smart Contract Rollback

```bash
# Deploy new version with fixes
npx hardhat run scripts/deploy.ts --network mainnet
```

## Maintenance

### Daily
- Monitor error logs
- Check API response times
- Verify database backups

### Weekly
- Review transaction logs
- Check smart contract events
- Update dependencies

### Monthly
- Database optimization
- Performance analysis
- Security audit

## Support & Documentation

- **Issues**: https://github.com/adorakayice-lab/assetbridge-nexus/issues
- **Discussions**: https://github.com/adorakayice-lab/assetbridge-nexus/discussions
- **Email**: devops@assetbridge-nexus.com
- **Discord**: https://discord.gg/assetbridge-nexus
