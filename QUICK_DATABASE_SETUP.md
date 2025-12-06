# Quick Database Setup (2 minutes)

## The Error You're Seeing

```
Environment variable not found: DATABASE_URL
```

This means you need to set up a database. Here are your options:

---

## Option 1: Neon (Easiest - No Installation)

**Step 1:** Go to https://neon.tech and sign up (free)

**Step 2:** Create a new project
- Click "Create Project"
- Name it "xeno-shopify"
- Select a region close to you
- Click "Create Project"

**Step 3:** Copy the connection string
- You'll see a connection string like:
  ```
  postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```
- Copy this entire string

**Step 4:** Update your `.env` file
```bash
# Open .env file and replace DATABASE_URL with your Neon string
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Step 5:** Set up the database
```bash
npm run db:push
```

**Step 6:** Restart the server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

**Done!** Now you can sign up and use the app.

---

## Option 2: Local PostgreSQL (If You Have It Installed)

**Step 1:** Create a database
```bash
createdb xeno_shopify
```

**Step 2:** Update `.env`
```bash
DATABASE_URL="postgresql://localhost:5432/xeno_shopify"
```

**Step 3:** Set up the database
```bash
npm run db:push
```

**Step 4:** Restart the server
```bash
npm run dev
```

---

## Option 3: Supabase (Alternative Free Option)

**Step 1:** Go to https://supabase.com and sign up

**Step 2:** Create a new project
- Click "New Project"
- Name it "xeno-shopify"
- Set a database password
- Select a region
- Click "Create Project" (takes ~2 minutes)

**Step 3:** Get connection string
- Go to Settings → Database
- Copy the "Connection pooling" string (not the direct connection)
- It looks like: `postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres`

**Step 4:** Update `.env`
```bash
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres"
```

**Step 5:** Set up the database
```bash
npm run db:push
```

**Step 6:** Restart the server
```bash
npm run dev
```

---

## Verification

After setup, you should be able to:
1. Visit http://localhost:3000
2. Click "Get Started"
3. Fill in the sign-up form
4. Create an account successfully
5. Sign in and see the dashboard

---

## Still Having Issues?

Check the server logs for specific errors:
```bash
# The terminal where you ran `npm run dev`
# Look for error messages
```

Common issues:
- **Wrong connection string format** - Make sure it starts with `postgresql://`
- **Missing `?sslmode=require`** - Add this to the end for Neon/Supabase
- **Firewall blocking** - Check if your firewall allows database connections
- **Wrong password** - Double-check your database password

---

## For Demo/Testing Without Database

If you just want to show the UI without functionality:
1. Take screenshots of each page
2. Use the screenshots in your demo video
3. Explain "In production, this would connect to PostgreSQL"
4. Show the code instead of the running app

This is acceptable for the demo if you're having database issues!
