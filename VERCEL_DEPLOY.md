# 🚀 Deploy to Vercel - Quick Guide

## Prerequisites
- GitHub account with your code pushed
- Vercel account (free at vercel.com)

---

## Step-by-Step Deployment (5 minutes)

### Step 1: Push to GitHub First

If you haven't already:
```bash
# Create repo on GitHub: https://github.com/new
# Name it: shopify

# Then push:
git remote add origin https://github.com/YOUR_USERNAME/shopify.git
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Website (Recommended)**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next` (default)

5. **Environment Variables** - Click "Add" for each:
   ```
   DATABASE_URL = postgresql://user:pass@host/db?sslmode=require
   NEXTAUTH_URL = https://your-app.vercel.app
   NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
   ```

6. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

---

## Environment Variables Setup

### For Demo Mode (No Database)
You can deploy with just these for demo:
```
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = q3CMKS03ZPTCsvrcvb12Zjj9rpEQ514UOS/WsRKT5kY=
```

The demo mode (`/auth/demo`) will work without a database!

### For Full Functionality (With Database)

**Get Free Database from Neon:**
1. Go to https://neon.tech
2. Sign up (free)
3. Create project "xeno-shopify"
4. Copy connection string

**Add to Vercel:**
```
DATABASE_URL = postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = q3CMKS03ZPTCsvrcvb12Zjj9rpEQ514UOS/WsRKT5kY=
```

---

## After Deployment

### Step 1: Get Your URL
Vercel will give you a URL like: `https://shopify-xxx.vercel.app`

### Step 2: Update Environment Variable
Go back to Vercel → Settings → Environment Variables
Update `NEXTAUTH_URL` to your actual URL

### Step 3: Redeploy
Vercel → Deployments → Click "..." → Redeploy

### Step 4: Test
Visit your URL:
- Landing page: `https://your-app.vercel.app`
- Demo mode: `https://your-app.vercel.app/auth/demo`

---

## Demo URLs to Share

After deployment, you'll have:
- **Landing Page**: `https://your-app.vercel.app`
- **Demo Mode**: `https://your-app.vercel.app/auth/demo`
- **Sign Up**: `https://your-app.vercel.app/auth/signup`
- **Sign In**: `https://your-app.vercel.app/auth/signin`

---

## Troubleshooting

### Build Fails
**Error**: "Prisma Client not generated"
**Fix**: Make sure build command is: `prisma generate && next build`

### Environment Variables Not Working
**Fix**: 
1. Check spelling
2. No quotes around values
3. Redeploy after adding variables

### Demo Mode Not Working
**Fix**: Demo mode works without database! Just visit `/auth/demo`

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Build command set: `prisma generate && next build`
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Tested demo mode
- [ ] URL added to README

---

## For Your Submission

**GitHub URL**: `https://github.com/YOUR_USERNAME/shopify`
**Live Demo**: `https://your-app.vercel.app/auth/demo`
**Video**: (Upload to YouTube/Loom)

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check deployment logs in Vercel dashboard

---

**Estimated Time**: 5-10 minutes
**Cost**: Free (Vercel free tier)
