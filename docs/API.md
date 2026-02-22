# AssetBridge Nexus - API Documentation

## Base URL

```
Production: https://api.assetbridge-nexus.com
Development: http://localhost:3001
```

## Authentication

All protected endpoints require a JWT token in the authorization header:

```
Authorization: Bearer <token>
X-API-Version: v1
```

## Response Format

All API responses follow a consistent JSON format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

## Rate Limiting

- **Free Users**: 100 requests per 15 minutes
- **Premium Users**: Unlimited requests
- **Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "country": "Nigeria",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0".toLowerCase()
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Validation error or email already exists
- `500`: Server error

---

### POST /api/auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "email": "user@example.com",
      "firstName": "John"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### POST /api/auth/wallet-connect

Connect using Web3 wallet.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0",
      "firstName": "Web3 User"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Deal Endpoints

### GET /api/credit

List all available credit deals with optional filtering.

**Query Parameters:**
```
status: open|closed|coming|all (default: all)
assetClass: credit|real_estate|agriculture|renewable_energy (default: all)
minApy: number (default: 0)
sortBy: apy|term|progress (default: apy)
page: number (default: 1)
limit: number (default: 20, max: 100)
```

**Example Request:**
```
GET /api/credit?status=open&minApy=10&sortBy=apy
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "dealId",
      "title": "Tech Startup Series A",
      "apy": 12,
      "termMonths": 24,
      "minInvestment": 500,
      "targetAmount": 1000000,
      "currentRaised": 750000,
      "status": "open",
      "riskRating": "medium"
    }
  ]
}
```

---

### GET /api/credit/:dealId

Get specific deal details.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "dealId",
    "title": "Tech Startup Series A",
    "description": "Innovative fintech solutions for emerging markets...",
    "apy": 12,
    "termMonths": 24,
    "minInvestment": 500,
    "targetAmount": 1000000,
    "currentRaised": 750000,
    "status": "open",
    "assetClass": "credit",
    "geography": "West Africa",
    "riskRating": "medium",
    "issuer": "Company Name",
    "investors": [
      {
        "userId": "userId",
        "amount": 5000,
        "investmentDate": "2024-01-15T10:00:00Z",
        "earningsAccrued": 125
      }
    ],
    "documents": [
      {
        "name": "Term Sheet",
        "url": "https://...",
        "type": "legal"
      }
    ]
  }
}
```

---

### POST /api/credit/:dealId/invest

Invest in a specific deal.

**Request Body:**
```json
{
  "userId": "userId",
  "amount": 5000,
  "transactionHash": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment successful",
  "data": {
    "dealId": "dealId",
    "dealTitle": "Tech Startup Series A",
    "investedAmount": 5000,
    "apy": 12,
    "transactionHash": "0x..."
  }
}
```

**Status Codes:**
- `201`: Investment created
- `400`: Validation error or deal closed
- `404`: Deal not found

---

### GET /api/credit/user/:userId/investments

Get user's investments.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "totalInvested": 13500,
  "totalEarnings": 337.50,
  "data": [
    {
      "dealId": "dealId",
      "dealTitle": "Tech Startup Series A",
      "amount": 5000,
      "apy": 12,
      "earningsAccrued": 125,
      "status": "active"
    }
  ]
}
```

---

## Vault Endpoints

### GET /api/vault/:userId

Get user's vault information.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "vaultId",
    "userId": "userId",
    "strategy": "balanced",
    "totalDeposited": 25000,
    "currentBalance": 25337.50,
    "yieldAccrued": 337.50,
    "allocationTargets": {
      "tech": 40,
      "realEstate": 35,
      "agriculture": 25
    },
    "transactionHistory": [
      {
        "type": "deposit",
        "amount": 5000,
        "date": "2024-01-15T10:00:00Z",
        "txHash": "0x..."
      }
    ]
  }
}
```

---

### POST /api/vault/:userId/deposit

Deposit funds to vault.

**Request Body:**
```json
{
  "amount": 5000,
  "strategy": "balanced",
  "transactionHash": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deposit successful",
  "data": {
    "depositAmount": 5000,
    "newBalance": 30000,
    "strategy": "balanced"
  }
}
```

---

### POST /api/vault/:userId/withdraw

Request withdrawal from vault.

**Request Body:**
```json
{
  "amount": 2000,
  "transactionHash": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal request processed",
  "data": {
    "withdrawnAmount": 2000,
    "remainingBalance": 28000,
    "note": "Withdrawal will be processed within 7 business days"
  }
}
```

---

### GET /api/vault/:userId/yields

Get yield information.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDeposited": 25000,
    "currentBalance": 25337.50,
    "yieldAccrued": 337.50,
    "strategy": "balanced",
    "estimatedMonthlyYield": "200.00",
    "estimatedAnnualYield": "2400.00",
    "estimatedAPY": "10.2%",
    "lastRebalance": "2024-01-01T00:00:00Z"
  }
}
```

---

## Premium Endpoints

### GET /api/premium/status/:userId

Get premium subscription status.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "userId",
    "isPremium": true,
    "currentPlan": "premium",
    "subscriptionDetails": {
      "plan": "premium",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-02-15T00:00:00Z",
      "isActive": true
    }
  }
}
```

---

### POST /api/premium/subscribe

Create or upgrade premium subscription.

**Request Body:**
```json
{
  "userId": "userId",
  "plan": "premium",
  "paymentToken": "pm_..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Upgraded to premium successfully",
  "data": {
    "userId": "userId",
    "plan": "premium",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-02-15T00:00:00Z",
    "isActive": true
  }
}
```

---

### GET /api/premium/analytics/:userId

Get AI-powered premium analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolioRisk": {
      "score": 42,
      "level": "Medium",
      "recommendation": "Your portfolio has balanced risk exposure"
    },
    "predictions": {
      "nextMonthYield": "$156",
      "confidenceScore": 0.87,
      "riskAdjustedReturn": "8.9%"
    },
    "recommendations": [
      "Rebalance allocation towards tech startups",
      "Consider agriculture deals for lower volatility",
      "Diversify across geographies"
    ]
  }
}
```

---

## KYC Endpoints

### GET /api/kyc/status/:userId

Get KYC verification status.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "userId",
    "kycStatus": "verified",
    "isVerified": true,
    "lastUpdated": "2024-01-15T10:00:00Z"
  }
}
```

---

### POST /api/kyc/verify

Initiate KYC verification.

**Request Body:**
```json
{
  "userId": "userId",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "countryCode": "NG"
}
```

**Response:**
```json
{
  "success": true,
  "message": "KYC verification initiated",
  "data": {
    "userId": "userId",
    "status": "pending",
    "nextSteps": "Check your email for identity verification instructions",
    "inquiryId": "inq_abc123"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_INPUT` | 400 | Missing or invalid required fields |
| `UNAUTHORIZED` | 401 | Invalid credentials or missing token |
| `FORBIDDEN` | 403 | Permission denied (e.g., premium feature) |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists (e.g., email) |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Webhooks

### Deal Update Webhook

Sent when deal status changes.

```json
{
  "event": "deal.status_changed",
  "dealId": "dealId",
  "oldStatus": "open",
  "newStatus": "closed",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### Yield Distribution Webhook

Sent when yields are distributed.

```json
{
  "event": "yield.distributed",
  "userId": "userId",
  "amount": 125,
  "dealId": "dealId",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## Rate Limits

Requests that exceed rate limits receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "retryAfter": 300
}
```

---

## Version History

- **v1.0.0** (Current) - Initial API release
  - Authentication
  - Deal listing and investing
  - Vault management
  - Premium features
  - KYC verification

---

## Support

For API support:
- Email: api-support@assetbridge-nexus.com
- Discord: https://discord.gg/assetbridge-nexus
- GitHub Issues: https://github.com/adorakayice-lab/assetbridge-nexus/issues
