# AssetBridge Nexus - Quick Start Guide

## 🚀 Get Started in 5 Minutes

Follow this guide to run AssetBridge Nexus locally on your machine.

## Option A: Docker Compose (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/adorakayice-lab/assetbridge-nexus.git
   cd assetbridge-nexus
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_INFURA_KEY=your_infura_key_here
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id
   ETHEREUM_INFURA_URL=https://sepolia.infura.io/v3/your_key
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Verify Services**
   ```bash
   docker-compose ps
   ```

5. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

6. **View Logs**
   ```bash
   docker-compose logs -f frontend   # Frontend logs
   docker-compose logs -f backend    # Backend logs
   docker-compose logs -f mongodb    # Database logs
   ```

7. **Stop Services**
   ```bash
   docker-compose down
   ```

---

## Option B: Manual Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/adorakayice-lab/assetbridge-nexus.git
   cd assetbridge-nexus
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend && npm install && cd ..
   
   # Backend
   cd backend && npm install && cd ..
   
   # Contracts
   cd contracts && npm install && cd ..
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # If using MongoDB Atlas, update MONGODB_URI in .env.local
   ```

5. **Start Frontend** (Terminal 1)
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:3000
   ```

6. **Start Backend** (Terminal 2)
   ```bash
   cd backend
   npm run dev
   # Runs on http://localhost:3001
   ```

7. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

---

## 📋 What You Can Do

### On the Frontend
- ✅ Browse private credit deals
- ✅ View your dashboard (mock data)
- ✅ Explore vault strategies
- ✅ Check premium features
- ✅ View about page with team info
- ✅ Responsive design on mobile

### Backend API
- ✅ Register/Login users
- ✅ Connect wallet (Web3)
- ✅ Get deals list
- ✅ Manage vault deposits/withdrawals
- ✅ Check premium status
- ✅ KYC verification initiation

### Smart Contracts
- ✅ Compile Solidity contracts
- ✅ Run contract tests
- ✅ Deploy to Sepolia testnet

---

## 🧪 Test the Application

### Sample User Credentials
```
Email: user@example.com
Password: Test@123456
```

### Sample Wallet Address
```
0x742d35Cc6634C0532925a3b844Bc9e7595f06ab5
```

### Test Endpoints

**Register User**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "country": "Nigeria"
  }'
```

**Get Deals**
```bash
curl http://localhost:3001/api/credit
```

**Check API Health**
```bash
curl http://localhost:3001/health
```

---

## 📁 Project Structure

```
assetbridge-nexus/
├── frontend/                    # Next.js React app
│   ├── pages/                  # Pages (home, dashboard, etc.)
│   ├── components/             # React components
│   ├── styles/                 # CSS and Tailwind
│   └── public/images/          # Images folder
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # MongoDB schemas
│   │   ├── controllers/       # Business logic
│   │   └── middleware/        # Auth, validation
│   └── package.json
│
├── contracts/                  # Solidity smart contracts
│   ├── contracts/             # .sol files
│   ├── scripts/               # Deployment scripts
│   └── test/                  # Contract tests
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md        # System design
│   ├── API.md                 # API documentation
│   └── DEPLOYMENT.md          # Deployment guide
│
└── docker-compose.yml         # Docker services
```

---

## 🔧 Common Tasks

### Add a New Page

1. Create file in `frontend/pages/your-page.tsx`
2. Add to navigation in `frontend/components/Navbar.tsx`
3. Import components you need
4. Restart frontend server

### Add API Endpoint

1. Create handler in `backend/src/routes/your-route.ts`
2. Import in `backend/src/server.ts`
3. Add route: `app.use('/api/your-route', yourRoute);`
4. Restart backend server

### Deploy Smart Contract

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check connection string in .env.local
# Make sure MongoDB is running:
mongosh  # or mongo --version
```

### Frontend Not Compiling
```bash
rm -rf frontend/.next
npm cache clean --force
cd frontend && npm install && npm run dev
```

### Backend Not Starting
```bash
# Check Node version
node --version  # Should be 18+

# Check if port is free
lsof -i :3001

# Check logs
cd backend && npm run dev
```

---

## 📚 Learn More

- [Full Architecture Documentation](./docs/ARCHITECTURE.md)
- [Complete API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Smart Contracts Documentation](./contracts/README.md)

---

## 🚀 Next Steps

1. **Customize** - Update hero images and colors in `frontend/styles/globals.css`
2. **Connect Wallet** - Integrate MetaMask (ethers.js already imported)
3. **Add Real Data** - Replace mock data with API calls
4. **Deploy** - Follow deployment guide for production
5. **Monitor** - Set up error tracking and analytics

---

## 💻 Development Tips

### Hot Reload
Both frontend and backend support hot reload during development.

### Environment Variables
- Never commit `.env.local`
- Always use `NEXT_PUBLIC_` prefix for frontend env vars
- Backend vars don't need prefix

### Database
- Use MongoDB Atlas for production
- Local MongoDB fine for development
- Keep backups of important data

### Smart Contracts
- Always test locally first
- Use testnet (Sepolia) before mainnet
- Get audits before mainnet deployment

---

## 📞 Support

- **GitHub Issues**: https://github.com/adorakayice-lab/assetbridge-nexus/issues
- **Discord**: https://discord.gg/assetbridge-nexus
- **Email**: support@assetbridge-nexus.com

---

## License

MIT - See LICENSE file

---

**Happy Building! 🎉**

If you found this helpful, please star the repository ⭐
