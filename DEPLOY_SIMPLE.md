# 🚀 Simple Deployment Guide

## Deploy to Vercel (3 minutes)

### Step 1: Import Project
1. Go to https://vercel.com/new
2. Import: `sivamurthy30/shopify`
3. Click "Import"

### Step 2: Configure
- Framework: Next.js ✅ (auto-detected)
- Build Command: `next build` ✅ (default)
- Output Directory: `.next` ✅ (default)

### Step 3: Add Environment Variables

Click "Add" and enter these **two variables**:

**Variable 1:**
```
Key: NEXTAUTH_URL
Value: https://your-project.vercel.app
```

**Variable 2:**
```
Key: NEXTAUTH_SECRET  
Value: q3CMKS03ZPTCsvrcvb12Zjj9rpEQ514UOS/WsRKT5kY=
```

### Step 4: Deploy
Click "Deploy" and wait 2-3 minutes.

### Step 5: Update URL
After deployment:
1. Copy your Vercel URL
2. Go to Settings → Environment Variables
3. Edit `NEXTAUTH_URL` with your actual URL
4. Redeploy

### Step 6: Test
Visit: `https://your-app.vercel.app/auth/demo`

---

## ✅ That's It!

Your demo is live with:
- Professional UI
- Interactive analytics
- Mock data (no database needed)
- Full feature showcase

---

## 📝 For Submission

**GitHub**: https://github.com/sivamurthy30/shopify
**Live Demo**: https://your-app.vercel.app/auth/demo
**Video**: (Upload to YouTube/Loom)

---

## 🎥 Demo URLs

- Landing: `https://your-app.vercel.app`
- Demo Mode: `https://your-app.vercel.app/auth/demo`
- Dashboard: `https://your-app.vercel.app/demo/dashboard`
- Analytics: Click any store in demo dashboard

All features work without database setup!
