# Xeno Shopify Insights Platform

Multi-tenant analytics platform for Shopify stores. Built for the Xeno FDE Internship 2025.

## What It Does

This platform connects to Shopify stores and provides analytics on customers, orders, and products. It handles multiple stores (multi-tenant), syncs data in real-time via webhooks, and shows insights through interactive charts.

### Key Features

**Data Sync**
- Real-time updates via Shopify webhooks
- Scheduled batch sync every 6 hours
- Manual sync trigger from dashboard
- Tracks customers, orders, products, and custom events

**Analytics**
- Customer segmentation (VIP, Loyal, Regular, One-time, Inactive)
- Revenue and order trends with date filtering
- Top customers by spend
- Product performance tracking
- Cohort analysis by acquisition month
- Growth metrics vs previous period

**Technical**
- Built with Next.js 14, TypeScript, and Prisma
- PostgreSQL database with optimized queries
- NextAuth for authentication
- Complete data isolation per tenant
- Responsive UI with Tailwind and Recharts

## Architecture

The app follows a standard layered architecture:

**Frontend (Next.js)**
- Auth pages (sign in/up)
- Dashboard (tenant list)
- Analytics views (charts and metrics)

**API Routes**
- `/api/auth/*` - Authentication
- `/api/tenants` - Tenant management
- `/api/tenants/[id]/sync` - Trigger data sync
- `/api/tenants/[id]/analytics` - Fetch analytics data
- `/api/webhooks/shopify` - Receive Shopify events

**Services**
- `SyncService` - Handles data ingestion from Shopify
- `AnalyticsService` - Calculates metrics and aggregations
- `ShopifyClient` - Wrapper for Shopify API calls

**Database (PostgreSQL + Prisma)**
- Users, Tenants, TenantUser (multi-tenancy)
- Customers, Orders, OrderItems, Products
- CustomEvents, SyncLog (tracking)

## Database Schema

**Users & Tenants**
- Users table for authentication
- Tenants table for Shopify store configs
- TenantUser join table with role support (admin/viewer)

**Shopify Data**
- Customers with lifetime spend tracking
- Orders with financial details
- OrderItems for line-level data
- Products catalog

**Tracking**
- CustomEvents for cart abandonment, checkout events
- SyncLog for audit trail

All tables use `tenantId` for data isolation. Composite indexes on `[tenantId, shopifyId]` for fast lookups.

## Getting Started

**Quick Demo (No Setup Required)**

```bash
# Clone and install
git clone https://github.com/sivamurthy30/shopify.git
cd shopify
npm install

# Start server
npm run dev
```

Visit http://localhost:3000/auth/demo for instant demo with mock data!

**Live Demo**

Visit the deployed version: [Demo Link](https://your-app.vercel.app/auth/demo)

**Features in Demo Mode**
- ✅ Dashboard with 3 mock stores
- ✅ Full analytics with interactive charts
- ✅ Revenue trends and growth metrics
- ✅ Customer segmentation
- ✅ Top customers and product performance
- ✅ Professional UI showcase

No database or Shopify account needed for demo!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in (NextAuth)
- `GET /api/auth/signout` - Sign out

### Tenants
- `GET /api/tenants` - List user's tenants
- `POST /api/tenants` - Create new tenant (connect Shopify store)

### Sync
- `POST /api/tenants/[id]/sync` - Trigger manual sync

### Analytics
- `GET /api/tenants/[id]/analytics?type=overview` - Overview metrics
- `GET /api/tenants/[id]/analytics?type=orders&startDate=...&endDate=...` - Orders by date
- `GET /api/tenants/[id]/analytics?type=top-customers` - Top 5 customers
- `GET /api/tenants/[id]/analytics?type=product-revenue` - Product revenue
- `GET /api/tenants/[id]/analytics?type=segmentation` - Customer segments
- `GET /api/tenants/[id]/analytics?type=cohorts` - Cohort analysis
- `GET /api/tenants/[id]/analytics?type=growth` - Growth metrics

### Webhooks
- `POST /api/webhooks/shopify` - Shopify webhook receiver

## Features

**Core**
- Multi-tenant Shopify integration
- Email/password authentication
- Real-time data sync via webhooks
- Scheduled batch sync (cron job)
- Manual sync trigger
- Interactive analytics dashboard

**Analytics Views**
- Overview metrics (revenue, orders, customers, products)
- Revenue and order trends with date filtering
- Top 5 customers by spend
- Customer segmentation (VIP, Loyal, Regular, One-time, Inactive)
- Product performance by revenue
- Cohort analysis by acquisition month
- Growth metrics vs previous 30 days

**Technical**
- TypeScript throughout
- Prisma ORM with optimized queries
- NextAuth for secure sessions
- Role-based access (admin/viewer)
- Responsive design
- Error logging and sync audit trail

## 📈 Analytics Features

### Overview Metrics
- Total revenue, orders, customers, products
- Growth indicators (30-day comparison)

### Revenue & Orders Trend
- Time-series chart with date range filtering
- Dual-axis visualization (revenue + order count)

### Customer Segmentation
- VIP: Customers with >$1000 lifetime spend
- Loyal: 5+ orders
- Regular: 2-4 orders
- One-time: 1 order
- Inactive: 0 orders

### Top Customers
- Top 5 by lifetime spend
- Order count tracking

### Product Performance
- Revenue by product
- Units sold tracking
- Top 10 products visualization

### Cohort Analysis
- Customers grouped by first purchase month
- Average order value per cohort
- Revenue tracking by cohort

## 🔄 Sync Strategy

### 1. Manual Sync
- Triggered by user via dashboard
- Full sync of all data
- Progress tracking and logging

### 2. Webhook Sync (Real-time)
- Shopify webhooks for instant updates
- Event-driven architecture
- Handles: orders, customers, products, carts

### 3. Scheduled Sync (Cron)
```bash
npm run sync:shopify
```
- Runs via cron job (recommended: every 6 hours)
- Catches any missed webhook events
- Ensures data consistency

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Hosting

- **Neon**: Free PostgreSQL with generous limits
- **Supabase**: PostgreSQL + additional features
- **Railway**: PostgreSQL + app hosting

### Cron Jobs

Set up scheduled sync using:
- Vercel Cron Jobs
- GitHub Actions
- External cron service (cron-job.org)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based session management
- API route protection with NextAuth
- Tenant data isolation
- SQL injection prevention (Prisma)
- XSS protection (React)

## What's Different

**Beyond Basic Requirements**
- Added customer segmentation and cohort analysis
- Three sync methods (webhooks, scheduled, manual) instead of one
- Growth metrics with period-over-period comparison
- Role-based access for team collaboration
- Comprehensive sync logging for debugging

**Technical Decisions**
- Used TypeScript for better maintainability
- Prisma for type-safe database queries
- Composite indexes for fast multi-tenant queries
- Incremental sync to reduce API calls
- Server-side analytics calculations for performance

## Assumptions

- Stores have <100k orders (can scale higher with caching)
- Single currency per store
- Timestamps in UTC
- Admin API access token available (not OAuth flow)
- 6-hour sync frequency is acceptable
- Email/password auth is sufficient for MVP

## Future Improvements

**Performance**
- Redis caching for analytics queries
- Job queue for async sync operations
- Database read replicas

**Features**
- Customer lifetime value prediction
- Churn analysis
- Export to CSV/Excel
- Email notifications for sync failures
- Custom report builder

**Scale**
- Multi-region deployment
- Horizontal scaling
- Rate limiting
- API documentation

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- PostgreSQL + Prisma
- NextAuth.js
- Tailwind CSS
- Recharts
- Shopify Admin API

## 📚 Project Structure

```
xeno-shopify-insights/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   └── shopify.ts         # Shopify client
│   ├── services/
│   │   ├── sync-service.ts    # Data sync logic
│   │   └── analytics-service.ts # Analytics logic
│   ├── jobs/
│   │   └── shopify-sync.ts    # Scheduled sync job
│   └── types/
│       └── next-auth.d.ts     # Type definitions
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🎥 Demo Video Script

**Introduction (30s)**
- "Hi! I'm [Your Name], and I built this multi-tenant Shopify analytics platform for Xeno"
- Show landing page and explain the problem it solves

**Architecture (1m)**
- Walk through the architecture diagram
- Explain multi-tenancy approach
- Show database schema

**Features Demo (3m)**
- Sign up and create account
- Connect Shopify store
- Trigger sync and show progress
- Navigate through analytics dashboard
- Highlight unique features (segmentation, cohorts, growth metrics)

**Technical Highlights (1.5m)**
- Show code structure
- Explain sync strategy (webhooks + scheduled)
- Demonstrate type safety with TypeScript
- Show API endpoints

**Trade-offs & Future (1m)**
- Discuss architectural decisions
- Explain what would be added for production
- Show enthusiasm for the role

## 🤝 Contributing

This is a submission for Xeno FDE Internship 2025. For questions or feedback, please reach out!

## 📄 License

MIT License - feel free to use this as a learning resource!

---

Built with ❤️ for Xeno FDE Internship 2025
