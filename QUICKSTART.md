# ⚡ Quick Start (5 Minutes)

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Shopify development store (free at partners.shopify.com)

## Step 1: Clone & Install (1 min)

```bash
git clone <your-repo>
cd xeno-shopify-insights
npm install
```

## Step 2: Database Setup (1 min)

**Option A: Use Neon (Recommended)**

1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy connection string

**Option B: Local PostgreSQL**

```bash
createdb xeno_shopify
```

## Step 3: Configure (1 min)

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="your-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

## Step 4: Initialize Database (30 sec)

```bash
npm run db:push
```

## Step 5: Run! (30 sec)

```bash
npm run dev
```

Open http://localhost:3000

## Step 6: Use It! (1 min)

1. Click "Sign Up"
2. Create account
3. Click "Add Store"
4. Enter:
   - Name: "Test Store"
   - Domain: "your-store.myshopify.com"
   - Token: (from Shopify admin)
5. Click "Sync Data"
6. Explore analytics!

## Getting Shopify Token

1. Go to your Shopify admin
2. Settings → Apps and sales channels
3. Develop apps → Create an app
4. Configure Admin API scopes:
   - `read_customers`
   - `read_orders`
   - `read_products`
5. Install app
6. Copy "Admin API access token"

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm run dev
```

**Database connection failed?**
- Check DATABASE_URL format
- Ensure database exists
- Check network/firewall

**Shopify API error?**
- Verify token is correct
- Check scopes are configured
- Ensure domain includes .myshopify.com

## Next Steps

- Read README.md for full documentation
- Check ARCHITECTURE.md for design details
- See DEMO_SCRIPT.md for video guide

---

That's it! You're ready to go! 🚀
