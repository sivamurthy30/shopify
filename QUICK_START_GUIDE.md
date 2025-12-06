# ⚡ Quick Start Guide - Get Running in 15 Minutes

## Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Shopify Partners account (free)

---

## Step 1: Clone & Install (2 mins)

```bash
git clone <your-repo-url>
cd xeno-shopify-insights
npm install
```

---

## Step 2: Database Setup (3 mins)

### Option A: Neon (Recommended)
1. Go to https://neon.tech → Sign up
2. Create new project → Copy connection string
3. Add `?sslmode=require` to the end

### Option B: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # Mac
# or download from postgresql.org

# Create database
createdb xeno_shopify
```

---

## Step 3: Environment Variables (2 mins)

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## Step 4: Database Schema (1 min)

```bash
npm run db:push
```

---

## Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Step 6: Shopify Setup (5 mins)

### Create Development Store
1. Go to https://partners.shopify.com
2. Stores → Add store → Development store
3. Fill in details → Save

### Add Dummy Data
1. Products → Add 10 products
2. Customers → Add 20 customers
3. Orders → Create 50 orders (test mode)

### Create Custom App
1. Settings → Apps and sales channels → Develop apps
2. Create an app → Name: "Xeno Analytics"
3. Configuration → Admin API integration
4. Add scopes:
   - `read_customers`
   - `read_orders`
   - `read_products`
5. Install app → Copy Admin API access token

---

## Step 7: Test the App (1 min)

1. Sign up at http://localhost:3000
2. Add tenant:
   - Name: "My Store"
   - Domain: `your-store.myshopify.com`
   - Access Token: (paste from Shopify)
3. Click "Sync Data"
4. View analytics dashboard

---

## 🎉 You're Running!

### What to Test:
- ✅ Sign up / Sign in
- ✅ Add Shopify store
- ✅ Sync data
- ✅ View analytics
- ✅ Date range filtering
- ✅ All charts render

### Common Issues:

**"Prisma Client not generated"**
```bash
npm run db:generate
```

**"Database connection failed"**
- Check DATABASE_URL format
- Ensure database exists
- Check credentials

**"Shopify API error"**
- Verify access token
- Check store domain format
- Ensure API scopes are correct

---

## 🚀 Next Steps

1. **Deploy to Vercel** (see DEPLOYMENT.md)
2. **Create demo video** (see DEMO_SCRIPT.md)
3. **Submit** (see FINAL_STEPS.md)

---

## 📚 Full Documentation

- **README.md** - Complete overview
- **SETUP.md** - Detailed setup guide
- **ARCHITECTURE.md** - Technical details
- **DEPLOYMENT.md** - Deployment guide
- **FINAL_STEPS.md** - Submission checklist

---

## 💡 Pro Tips

- Use Prisma Studio to view data: `npm run db:studio`
- Check Vercel logs for deployment issues
- Test on mobile for responsive design
- Clear browser cache if issues persist

---

**Need help?** Check the troubleshooting sections in SETUP.md and DEPLOYMENT.md

**Ready to deploy?** Follow FINAL_STEPS.md for the complete submission process
