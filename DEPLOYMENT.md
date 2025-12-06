# 🚀 Deployment Guide

## Overview

This guide covers deploying to Vercel (recommended) and alternative platforms.

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- Built for Next.js
- Zero-config deployment
- Automatic HTTPS
- Edge network (fast globally)
- Free tier generous

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Database hosted (Neon/Supabase)

### Step 1: Prepare Repository

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Via Web UI:**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`
5. Add Environment Variables:
   ```
   DATABASE_URL=your-database-url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   ```
6. Click "Deploy"

**Via CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts
# Set environment variables when asked
```

### Step 3: Configure Database

**If using Neon:**
1. Go to Neon dashboard
2. Copy connection string
3. Add to Vercel environment variables
4. Redeploy

**If using Supabase:**
1. Go to Supabase dashboard
2. Settings → Database
3. Copy "Connection pooling" string
4. Add to Vercel environment variables
5. Redeploy

### Step 4: Set Up Scheduled Sync

**Option A: Vercel Cron (Recommended)**

Create `src/app/api/cron/sync/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ShopifyClient } from '@/lib/shopify'
import { SyncService } from '@/services/sync-service'

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenants = await prisma.tenant.findMany({
    where: { isActive: true },
  })

  for (const tenant of tenants) {
    try {
      const shopifyClient = new ShopifyClient({
        shop: tenant.shopifyDomain,
        accessToken: tenant.shopifyAccessToken,
      })
      const syncService = new SyncService(tenant.id, shopifyClient)
      await syncService.syncAll()
    } catch (error) {
      console.error(`Sync failed for ${tenant.name}:`, error)
    }
  }

  return NextResponse.json({ success: true })
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/sync",
    "schedule": "0 */6 * * *"
  }]
}
```

Add to `.env`:
```
CRON_SECRET=your-random-secret
```

**Option B: External Cron Service**

1. Go to https://cron-job.org
2. Create account
3. Add new cron job:
   - URL: `https://your-app.vercel.app/api/cron/sync`
   - Schedule: Every 6 hours
   - Add header: `Authorization: Bearer your-cron-secret`

### Step 5: Configure Webhooks

In Shopify admin:
1. Settings → Notifications → Webhooks
2. Create webhooks:
   - `orders/create` → `https://your-app.vercel.app/api/webhooks/shopify`
   - `orders/updated` → `https://your-app.vercel.app/api/webhooks/shopify`
   - `customers/create` → `https://your-app.vercel.app/api/webhooks/shopify`
   - `customers/update` → `https://your-app.vercel.app/api/webhooks/shopify`
   - `products/create` → `https://your-app.vercel.app/api/webhooks/shopify`
   - `products/update` → `https://your-app.vercel.app/api/webhooks/shopify`

### Step 6: Test Deployment

1. Visit your deployed URL
2. Sign up for account
3. Add Shopify store
4. Trigger sync
5. View analytics
6. Check for errors in Vercel logs

---

## Option 2: Railway

### Why Railway?
- Simple deployment
- Built-in PostgreSQL
- Generous free tier
- Good for full-stack apps

### Steps

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Add PostgreSQL service
7. Configure environment variables
8. Deploy

---

## Option 3: Render

### Why Render?
- Free tier includes database
- Easy setup
- Good documentation

### Steps

1. Go to https://render.com
2. Sign up
3. New → Web Service
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm install && npm run db:push && npm run build`
   - Start Command: `npm start`
6. Add PostgreSQL database
7. Set environment variables
8. Deploy

---

## Database Hosting Options

### Neon (Recommended)
- **Free Tier**: 10 GB storage, 100 hours compute
- **Pros**: Serverless, auto-scaling, great DX
- **Setup**: https://neon.tech

### Supabase
- **Free Tier**: 500 MB database, 2 GB bandwidth
- **Pros**: Additional features (auth, storage, realtime)
- **Setup**: https://supabase.com

### Railway PostgreSQL
- **Free Tier**: $5 credit/month
- **Pros**: Integrated with app deployment
- **Setup**: Automatic with Railway

### Heroku Postgres
- **Free Tier**: Deprecated (use paid tier)
- **Pros**: Reliable, mature
- **Setup**: https://heroku.com

---

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional: Cron
CRON_SECRET="your-random-secret"

# Optional: Webhook
WEBHOOK_SECRET="your-webhook-secret"
```

### Generating Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -hex 32

# WEBHOOK_SECRET
openssl rand -hex 32
```

---

## Post-Deployment Checklist

### Functionality
- [ ] Can access homepage
- [ ] Can sign up
- [ ] Can sign in
- [ ] Can add tenant
- [ ] Can sync data
- [ ] Can view analytics
- [ ] Charts render correctly
- [ ] No console errors

### Performance
- [ ] Page loads in <3 seconds
- [ ] API responses in <500ms
- [ ] No memory leaks
- [ ] Database queries optimized

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] No secrets in code
- [ ] API routes protected
- [ ] Sessions secure

### Monitoring
- [ ] Error tracking set up (optional)
- [ ] Logs accessible
- [ ] Uptime monitoring (optional)
- [ ] Performance monitoring (optional)

---

## Troubleshooting

### Build Fails

**Error**: `Prisma Client not generated`
```bash
# Solution: Update build command
prisma generate && next build
```

**Error**: `Module not found`
```bash
# Solution: Clear cache and rebuild
vercel --force
```

### Database Connection Fails

**Error**: `Can't reach database server`
```bash
# Solution: Check DATABASE_URL format
# Should be: postgresql://user:pass@host:5432/db?sslmode=require
```

**Error**: `SSL required`
```bash
# Solution: Add to DATABASE_URL
?sslmode=require
```

### Runtime Errors

**Error**: `NEXTAUTH_URL not set`
```bash
# Solution: Add to environment variables
NEXTAUTH_URL=https://your-app.vercel.app
```

**Error**: `Session not found`
```bash
# Solution: Clear cookies and try again
# Or regenerate NEXTAUTH_SECRET
```

### Sync Fails

**Error**: `Shopify API error`
```bash
# Solution: Verify access token
# Check API scopes
# Ensure store domain is correct
```

---

## Monitoring & Maintenance

### Vercel Dashboard
- View deployment logs
- Monitor function execution
- Check error rates
- View analytics

### Database Monitoring
- Check connection count
- Monitor query performance
- Review slow queries
- Set up alerts

### Recommended Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Uptime Robot**: Uptime monitoring
- **Vercel Analytics**: Performance metrics

---

## Scaling Considerations

### Current Setup (0-100 users)
- Single Vercel instance
- Serverless functions
- Direct database queries
- No caching

### Phase 2 (100-1000 users)
- Add Redis caching
- Implement job queue
- Database read replicas
- CDN for assets

### Phase 3 (1000+ users)
- Horizontal scaling
- Multi-region deployment
- Separate analytics DB
- Load balancing

---

## Cost Estimates

### Free Tier (Development)
- Vercel: Free
- Neon: Free (10 GB)
- Total: $0/month

### Starter (0-100 users)
- Vercel Pro: $20/month
- Neon Scale: $19/month
- Total: ~$40/month

### Growth (100-1000 users)
- Vercel Pro: $20/month
- Neon Scale: $69/month
- Redis: $10/month
- Total: ~$100/month

### Scale (1000+ users)
- Vercel Enterprise: Custom
- Database: $200+/month
- Redis: $50+/month
- Total: $300+/month

---

## Support Resources

### Vercel
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Community: https://github.com/vercel/next.js/discussions

### Neon
- Docs: https://neon.tech/docs
- Support: support@neon.tech
- Discord: https://discord.gg/neon

### Next.js
- Docs: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js

---

## Success!

Your app is now live! 🎉

Share your deployment:
- Add URL to README
- Update demo video
- Share on LinkedIn
- Add to portfolio

---

**Need help?** Open an issue on GitHub or reach out directly!
