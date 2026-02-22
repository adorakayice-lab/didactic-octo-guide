import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Models
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String },
  walletAddress: { type: String, sparse: true },
  firstName: String,
  lastName: String,
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  isVerified: Boolean,
  premiumSubscription: {
    plan: String,
    startDate: Date,
    endDate: Date,
    isActive: Boolean,
  },
  totalInvested: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const dealSchema = new mongoose.Schema({
  title: String,
  description: String,
  apy: Number,
  term: Number,
  minInvestment: Number,
  targetAmount: Number,
  currentRaised: Number,
  status: { type: String, enum: ['draft', 'open', 'coming', 'closed', 'completed'], default: 'open' },
  assetClass: String,
  geography: String,
  riskRating: String,
  issuer: String,
  investors: [{ userId: mongoose.Schema.Types.ObjectId, amount: Number, investmentDate: Date, earningsAccrued: Number }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const vaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  strategy: { type: String, enum: ['conservative', 'balanced', 'aggressive'] },
  totalDeposited: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  yieldAccrued: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Deal = mongoose.model('Deal', dealSchema);
const Vault = mongoose.model('Vault', vaultSchema);

// Sample data
const sampleUsers = [
  {
    email: 'eniola.adeyemi@example.com',
    firstName: 'Eniola',
    lastName: 'Adeyemi',
    passwordHash: bcrypt.hashSync('SecurePassword123!', 10),
    kycStatus: 'verified',
    isVerified: true,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42D2D',
    totalInvested: 19000,
    totalEarned: 1297,
    premiumSubscription: {
      plan: 'premium',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      isActive: true,
    },
  },
  {
    email: 'kwesi.owusu@example.com',
    firstName: 'Kwesi',
    lastName: 'Owusu',
    passwordHash: bcrypt.hashSync('SecurePassword456!', 10),
    kycStatus: 'verified',
    isVerified: true,
    walletAddress: '0x8626f6940E2eb28930DF29c04B7c66d893b9f25b',
    totalInvested: 45000,
    totalEarned: 3200,
    premiumSubscription: {
      plan: 'premium_plus',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      isActive: true,
    },
  },
  {
    email: 'zainab.hassan@example.com',
    firstName: 'Zainab',
    lastName: 'Hassan',
    passwordHash: bcrypt.hashSync('SecurePassword789!', 10),
    kycStatus: 'verified',
    isVerified: true,
    totalInvested: 12500,
    totalEarned: 950,
  },
  {
    email: 'amara.nwankwo@example.com',
    firstName: 'Amara',
    lastName: 'Nwankwo',
    passwordHash: bcrypt.hashSync('SecurePassword000!', 10),
    kycStatus: 'pending',
    isVerified: false,
    totalInvested: 0,
    totalEarned: 0,
  },
];

const sampleDeals = [
  {
    title: 'Tech Startup Series A',
    description: 'Innovative fintech solutions for emerging markets with strong growth potential and experienced team.',
    apy: 12,
    term: 24,
    minInvestment: 500,
    targetAmount: 1000000,
    currentRaised: 750000,
    status: 'open',
    assetClass: 'tech',
    geography: 'Africa',
    riskRating: 'medium',
    issuer: 'TechVentures Africa',
  },
  {
    title: 'Real Estate Development - Lagos',
    description: 'Premium property development project in Victoria Island, Lagos with high rental yield expectations.',
    apy: 10,
    term: 36,
    minInvestment: 1000,
    targetAmount: 2000000,
    currentRaised: 500000,
    status: 'open',
    assetClass: 'real_estate',
    geography: 'Nigeria',
    riskRating: 'low',
    issuer: 'LagosProperties Ltd',
  },
  {
    title: 'Agriculture Infrastructure',
    description: 'Sustainable farming solutions supporting small-holder farmers in Africa with fair-trade practices.',
    apy: 8,
    term: 12,
    minInvestment: 250,
    targetAmount: 1500000,
    currentRaised: 1500000,
    status: 'closed',
    assetClass: 'agriculture',
    geography: 'Ghana',
    riskRating: 'low',
    issuer: 'GreenFarm Collective',
  },
  {
    title: 'Renewable Energy Project',
    description: 'Solar farm development providing clean energy to rural communities across West Africa.',
    apy: 11,
    term: 20,
    minInvestment: 2000,
    targetAmount: 5000000,
    currentRaised: 2500000,
    status: 'open',
    assetClass: 'renewable_energy',
    geography: 'Senegal',
    riskRating: 'medium',
    issuer: 'AfricanSolar Energy',
  },
  {
    title: 'Trade Finance Fund',
    description: 'Short-term financing for African exporters with focus on agricultural and manufacturing products.',
    apy: 9,
    term: 6,
    minInvestment: 5000,
    targetAmount: 3000000,
    currentRaised: 1800000,
    status: 'open',
    assetClass: 'credit',
    geography: 'Multi-country',
    riskRating: 'low',
    issuer: 'TradeFinance Africa',
  },
  {
    title: 'Healthcare Facilities Fund',
    description: 'Financing for private healthcare clinics and diagnostic centers across emerging markets.',
    apy: 13,
    term: 30,
    minInvestment: 3000,
    targetAmount: 2500000,
    currentRaised: 800000,
    status: 'coming',
    assetClass: 'other',
    geography: 'Kenya',
    riskRating: 'medium-high',
    issuer: 'HealthCareVentures',
  },
];

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/assetbridge-nexus';
    await mongoose.connect(dbUri);

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Deal.deleteMany({});
    await Vault.deleteMany({});

    // Seed users
    console.log('👥 Creating users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Link deals with users
    console.log('💼 Creating deals...');
    const dealsWithInvestors = sampleDeals.map((deal, index) => {
      if (index < 2 && users.length > 0) {
        return {
          ...deal,
          investors: [
            {
              userId: users[0]._id,
              amount: Math.min(10000, deal.currentRaised / 2),
              investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
              earningsAccrued: Math.min(10000, deal.currentRaised / 2) * (deal.apy / 100) / 12 * 2,
            },
            {
              userId: users[1]._id,
              amount: deal.currentRaised / 2,
              investmentDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
              earningsAccrued: (deal.currentRaised / 2) * (deal.apy / 100) / 12,
            },
          ],
        };
      }
      return deal;
    });

    const deals = await Deal.insertMany(dealsWithInvestors);
    console.log(`✅ Created ${deals.length} deals`);

    // Create vaults
    console.log('🏦 Creating vaults...');
    const vaults = await Vault.insertMany(
      users.slice(0, 3).map((user) => ({
        userId: user._id,
        strategy: ['conservative', 'balanced', 'aggressive'][Math.floor(Math.random() * 3)],
        totalDeposited: [5000, 10000, 15000][Math.floor(Math.random() * 3)],
        currentBalance: [4900, 9800, 14700][Math.floor(Math.random() * 3)],
        yieldAccrued: [100, 200, 300][Math.floor(Math.random() * 3)],
      }))
    );
    console.log(`✅ Created ${vaults.length} vaults`);

    // Print summary
    console.log('\n📊 Database seeded successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`  • Users: ${users.length}`);
    console.log(`  • Deals: ${deals.length}`);
    console.log(`  • Vaults: ${vaults.length}`);
    console.log(`\n👤 Test Credentials:`);
    console.log(`  Email: ${sampleUsers[0].email}`);
    console.log(`  Password: SecurePassword123!`);
    console.log(`  Wallet: ${sampleUsers[0].walletAddress}`);
    console.log(`\n🔗 MongoDB URI: ${dbUri.replace(/:[^:@]*@/, ':****@')}`);

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
