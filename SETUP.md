# 🚀 Quick Setup Guide

## Step 1: Prerequisites

Install these before starting:
- Node.js 18+ (https://nodejs.org/)
- PostgreSQL (https://www.postgresql.org/) or use a cloud provider
- Git

## Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd xeno-shopify-insights

# Install dependencies
npm install
```

## Step 3: Database Setup

### Option A: Local PostgreSQL

```bash
# Create database
createdb xeno_shopify

# Update .env
DATABASE_URL="postgresql://localhost:5432/xeno_shopify"
```

### Option B: Cloud Database (Recommended)

**Neon (Free tier):**
1. Go to https://neon.tech
2. Create account and new project
3. Copy connection string
4. Update .env with the connection string

**Supabase (Free tier):**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for production)
5. Update .env

## Step 4: Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your favorite editor
```

Required variables:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

## Step 5: Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 6: Shopify Setup

1. **Create Development Store**
   - Go to https://partners.shopify.com
   - Click "Stores" → "Add store" → "Development store"
   - Fill in details and create

2. **Create Custom App**
   - In your dev store: Settings → Apps and sales channels
   - Click "Develop apps" → "Create an app"
   - Name it "Xeno Insights"
   - Configure Admin API scopes:
     - `read_customers`
     - `read_orders`
     - `read_products`
   - Install app and copy "Admin API access token"

3. **Add Dummy Data**
   - Products: Add 10-20 products
   - Customers: Add 20-30 customers
   - Orders: Create 50+ orders with various dates

## Step 7: Run the Application

```bash
# Start development server
npm run dev
```

Visit http://localhost:3000

## Step 8: First Use

1. **Sign Up**
   - Click "Sign Up" on homepage
   - Create your account

2. **Add Store**
   - Click "Add Store"
   - Enter:
     - Store Name: "My Test Store"
     - Shopify Domain: "your-store.myshopify.com"
     - Access Token: (from Step 6)

3. **Sync Data**
   - Click "Sync Data" button
   - Wait for sync to complete
   - Explore analytics!

## Step 9: Deploy to Production

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Add environment variables in Vercel dashboard:
- DATABASE_URL
- NEXTAUTH_URL (your production URL)
- NEXTAUTH_SECRET

### Set Up Scheduled Sync

**Option 1: Vercel Cron**
Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/sync",
    "schedule": "0 */6 * * *"
  }]
}
```

**Option 2: External Cron**
Use https://cron-job.org to hit your sync endpoint every 6 hours

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npm run db:studio
```

### Prisma Issues
```bash
# Reset and regenerate
npm run db:generate
npm run db:push
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Shopify API Errors
- Verify access token is correct
- Check API scopes are configured
- Ensure store domain is correct (include .myshopify.com)

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments
- Check Shopify API docs: https://shopify.dev/docs

## Next Steps

1. Set up webhooks for real-time sync
2. Configure scheduled sync job
3. Customize analytics for your needs
4. Add more stores!

---

Happy coding! 🚀
