# 🔧 Troubleshooting Guide

Common issues and their solutions.

---

## Database Issues

### "Can't reach database server"

**Symptoms**: Connection timeout, can't connect to database

**Solutions**:
```bash
# 1. Check DATABASE_URL format
# Correct format:
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# 2. Test connection
npm run db:studio

# 3. Verify database exists
# For Neon: Check dashboard
# For local: psql -l

# 4. Check firewall/network
ping your-db-host.com
```

### "Prisma Client not generated"

**Symptoms**: Import errors, type errors

**Solutions**:
```bash
# Generate Prisma Client
npm run db:generate

# Or during build
prisma generate && npm run build

# Clear node_modules if persists
rm -rf node_modules
npm install
npm run db:generate
```

### "Migration failed"

**Symptoms**: Schema push fails, migration errors

**Solutions**:
```bash
# 1. Reset database (WARNING: deletes data)
npx prisma migrate reset

# 2. Push schema without migration
npm run db:push

# 3. Check for syntax errors in schema.prisma
npx prisma validate

# 4. Force push (development only)
npx prisma db push --force-reset
```

---

## Authentication Issues

### "NEXTAUTH_URL not set"

**Symptoms**: NextAuth errors, redirect issues

**Solutions**:
```bash
# 1. Add to .env
NEXTAUTH_URL="http://localhost:3000"

# 2. For production
NEXTAUTH_URL="https://your-app.vercel.app"

# 3. Restart server
# Kill process and run: npm run dev
```

### "Invalid session"

**Symptoms**: Can't stay logged in, session expires immediately

**Solutions**:
```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update .env
NEXTAUTH_SECRET="your-new-secret"

# 3. Clear browser cookies
# Chrome: Settings → Privacy → Clear browsing data

# 4. Restart server
npm run dev
```

### "Password hash error"

**Symptoms**: Can't sign up, bcrypt errors

**Solutions**:
```bash
# 1. Reinstall bcryptjs
npm uninstall bcryptjs
npm install bcryptjs

# 2. Check Node version (need 18+)
node --version

# 3. Clear cache
npm cache clean --force
npm install
```

---

## Shopify Integration Issues

### "Invalid access token"

**Symptoms**: 401 errors, authentication failed

**Solutions**:
1. Verify token format: Should start with `shpat_`
2. Check token hasn't expired
3. Regenerate token in Shopify admin:
   - Settings → Apps → Your app → API credentials
   - Uninstall and reinstall app
4. Verify store domain format: `your-store.myshopify.com`

### "Insufficient API scopes"

**Symptoms**: 403 errors, permission denied

**Solutions**:
1. Go to Shopify admin
2. Settings → Apps → Your app → Configuration
3. Add required scopes:
   - `read_customers`
   - `read_orders`
   - `read_products`
   - `read_inventory`
4. Save and reinstall app

### "Rate limit exceeded"

**Symptoms**: 429 errors, too many requests

**Solutions**:
```typescript
// Already implemented in shopify.ts
// Wait and retry automatically

// If persists:
// 1. Reduce batch size
// 2. Add delays between requests
// 3. Use webhooks instead of polling
```

### "Webhook not receiving events"

**Symptoms**: No real-time updates

**Solutions**:
1. Verify webhook URL is accessible:
   ```bash
   curl https://your-app.vercel.app/api/webhooks/shopify
   ```

2. Check webhook configuration in Shopify:
   - Settings → Notifications → Webhooks
   - Verify URL is correct
   - Check webhook status (should be "Active")

3. Test webhook locally with ngrok:
   ```bash
   npm install -g ngrok
   ngrok http 3000
   # Use ngrok URL in Shopify webhook config
   ```

4. Check Vercel logs for errors

---

## Deployment Issues

### "Build failed on Vercel"

**Symptoms**: Deployment fails, build errors

**Solutions**:
```bash
# 1. Test build locally
npm run build

# 2. Check build command in Vercel
# Should be: prisma generate && next build

# 3. Verify all dependencies installed
npm install

# 4. Check for TypeScript errors
npm run lint

# 5. Clear Vercel cache
# Vercel dashboard → Deployments → Redeploy → Clear cache
```

### "Environment variables not working"

**Symptoms**: Undefined variables, connection errors

**Solutions**:
1. Verify variables in Vercel dashboard:
   - Settings → Environment Variables
   - Check spelling and values
   - Ensure no extra spaces

2. Redeploy after adding variables:
   - Deployments → Redeploy

3. Check variable names match .env.example

4. For secrets, don't use quotes:
   ```
   ✅ NEXTAUTH_SECRET=abc123
   ❌ NEXTAUTH_SECRET="abc123"
   ```

### "Database connection fails in production"

**Symptoms**: Works locally, fails on Vercel

**Solutions**:
1. Check DATABASE_URL in Vercel:
   - Must include `?sslmode=require`
   - Verify connection string is correct

2. For Neon:
   - Use "Connection pooling" string
   - Not the direct connection string

3. Test connection:
   ```bash
   # In Vercel dashboard → Deployments → View Function Logs
   # Look for database connection errors
   ```

4. Verify database allows external connections

---

## Frontend Issues

### "Charts not rendering"

**Symptoms**: Blank charts, console errors

**Solutions**:
```bash
# 1. Check data format
console.log(chartData)

# 2. Verify Recharts installed
npm list recharts

# 3. Check for null/undefined data
# Add fallback: data={chartData || []}

# 4. Inspect browser console for errors
# F12 → Console
```

### "Styles not loading"

**Symptoms**: Unstyled page, no Tailwind

**Solutions**:
```bash
# 1. Verify Tailwind installed
npm list tailwindcss

# 2. Check tailwind.config.ts paths
# Should include: './src/**/*.{js,ts,jsx,tsx}'

# 3. Restart dev server
# Kill and run: npm run dev

# 4. Clear .next cache
rm -rf .next
npm run dev
```

### "Hydration errors"

**Symptoms**: React hydration mismatch warnings

**Solutions**:
```typescript
// 1. Use 'use client' for client components
'use client'

// 2. Check for server/client mismatches
// Don't use Date.now() in SSR

// 3. Use useEffect for client-only code
useEffect(() => {
  // Client-only code here
}, [])

// 4. Suppress specific warnings (last resort)
<div suppressHydrationWarning>
```

---

## Performance Issues

### "Slow page loads"

**Symptoms**: Pages take >5 seconds to load

**Solutions**:
1. Check database query performance:
   ```bash
   npm run db:studio
   # Look at query execution times
   ```

2. Add database indexes (already done in schema)

3. Implement caching:
   ```typescript
   // Add Redis caching for analytics
   // See ARCHITECTURE.md for details
   ```

4. Optimize images:
   ```typescript
   import Image from 'next/image'
   // Use Next.js Image component
   ```

### "Slow sync operations"

**Symptoms**: Sync takes >5 minutes

**Solutions**:
1. Use incremental sync (already implemented)

2. Reduce batch size:
   ```typescript
   // In shopify.ts
   const limit = 100 // Reduce from 250
   ```

3. Run sync in background:
   ```bash
   npm run sync:shopify
   ```

4. Use webhooks for real-time updates

---

## Development Issues

### "Port already in use"

**Symptoms**: Can't start dev server, EADDRINUSE

**Solutions**:
```bash
# 1. Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# 2. Or use different port
npm run dev -- -p 3001

# 3. Find and kill process manually
lsof -i :3000
kill -9 <PID>
```

### "Module not found"

**Symptoms**: Import errors, can't find module

**Solutions**:
```bash
# 1. Install missing dependency
npm install <package-name>

# 2. Clear node_modules
rm -rf node_modules package-lock.json
npm install

# 3. Check import path
# Use @ alias: import { ... } from '@/lib/...'

# 4. Restart TypeScript server
# VS Code: Cmd+Shift+P → Restart TS Server
```

### "TypeScript errors"

**Symptoms**: Red squiggly lines, type errors

**Solutions**:
```bash
# 1. Check for errors
npm run lint

# 2. Generate Prisma types
npm run db:generate

# 3. Restart TypeScript server
# VS Code: Cmd+Shift+P → Restart TS Server

# 4. Check tsconfig.json paths
```

---

## Testing Issues

### "Can't sign up"

**Symptoms**: Sign up fails, no error message

**Solutions**:
1. Check browser console (F12)
2. Verify database connection
3. Check API route logs
4. Test with different email
5. Clear browser cache/cookies

### "Can't add tenant"

**Symptoms**: Tenant creation fails

**Solutions**:
1. Verify Shopify credentials:
   - Store domain: `store.myshopify.com`
   - Access token: Starts with `shpat_`

2. Check API scopes in Shopify

3. Test Shopify connection:
   ```bash
   curl -X GET \
     "https://your-store.myshopify.com/admin/api/2024-01/shop.json" \
     -H "X-Shopify-Access-Token: your-token"
   ```

### "Sync fails"

**Symptoms**: Sync button doesn't work

**Solutions**:
1. Check browser console for errors
2. Verify Shopify credentials
3. Check API rate limits
4. Look at sync logs in database:
   ```bash
   npm run db:studio
   # Check SyncLog table
   ```

---

## Browser Issues

### "Blank page"

**Symptoms**: White screen, nothing renders

**Solutions**:
1. Check browser console (F12)
2. Clear cache and hard reload:
   - Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Try incognito mode
4. Check if JavaScript is enabled
5. Try different browser

### "Console errors"

**Symptoms**: Red errors in console

**Solutions**:
1. Read the error message carefully
2. Check the file and line number
3. Google the error message
4. Check if it's a warning (yellow) vs error (red)
5. Look for stack trace

---

## Quick Diagnostic Commands

```bash
# Check Node version (need 18+)
node --version

# Check npm version
npm --version

# Check if port is in use
lsof -i :3000

# Test database connection
npm run db:studio

# Check for TypeScript errors
npm run lint

# Test build
npm run build

# Generate Prisma Client
npm run db:generate

# View database schema
npx prisma db pull

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Check environment variables
printenv | grep DATABASE_URL
printenv | grep NEXTAUTH
```

---

## Getting Help

### Before Asking for Help

1. ✅ Read the error message carefully
2. ✅ Check this troubleshooting guide
3. ✅ Google the exact error message
4. ✅ Check official documentation
5. ✅ Try the solutions above

### Where to Get Help

**Documentation**:
- Next.js: https://nextjs.org/docs
- Prisma: https://prisma.io/docs
- Shopify: https://shopify.dev/docs
- NextAuth: https://next-auth.js.org/

**Community**:
- Stack Overflow
- GitHub Discussions
- Discord servers
- Reddit (r/nextjs, r/webdev)

**Logs to Check**:
1. Browser console (F12)
2. Terminal output
3. Vercel deployment logs
4. Database logs
5. Shopify webhook logs

---

## Emergency Fixes

### "Everything is broken"

**Nuclear option** (last resort):
```bash
# 1. Backup your .env file
cp .env .env.backup

# 2. Clean everything
rm -rf node_modules
rm -rf .next
rm package-lock.json

# 3. Reinstall
npm install

# 4. Regenerate Prisma
npm run db:generate

# 5. Restart
npm run dev
```

### "Need to start over"

**Fresh start**:
```bash
# 1. Backup important files
cp .env .env.backup

# 2. Clone fresh copy
cd ..
git clone <your-repo-url> xeno-fresh
cd xeno-fresh

# 3. Copy .env
cp ../xeno-shopify-insights/.env.backup .env

# 4. Install and run
npm install
npm run db:push
npm run dev
```

---

## Prevention Tips

### Best Practices

1. **Always commit working code**
   ```bash
   git add .
   git commit -m "Working state before changes"
   ```

2. **Test locally before deploying**
   ```bash
   npm run build
   npm start
   ```

3. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

4. **Use environment variables**
   - Never commit .env
   - Always use .env.example as template

5. **Check logs regularly**
   - Browser console
   - Terminal output
   - Vercel logs

---

## Still Stuck?

If you've tried everything above and still have issues:

1. **Document the problem**:
   - What were you trying to do?
   - What happened instead?
   - What error messages did you see?
   - What have you tried?

2. **Check the logs**:
   - Browser console
   - Terminal output
   - Vercel deployment logs

3. **Create a minimal reproduction**:
   - Isolate the issue
   - Remove unrelated code
   - Test in isolation

4. **Search for similar issues**:
   - GitHub Issues
   - Stack Overflow
   - Google

---

**Remember**: Most issues have simple solutions. Take a deep breath, read the error message carefully, and work through the solutions systematically.

**Good luck! 🍀**
