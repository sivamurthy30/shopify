# 🎥 Demo Video Script (7 minutes)

## Introduction (45 seconds)

**[Show your face on camera]**

"Hi! I'm [Your Name], and I'm excited to show you what I built for the Xeno FDE Internship assignment.

I created a production-ready, multi-tenant Shopify analytics platform that goes beyond the basic requirements. This isn't just a CRUD app – it's a scalable SaaS platform with advanced analytics, real-time sync, and a clean architecture that's ready for production.

Let me walk you through what makes this unique."

## Architecture Overview (1 minute)

**[Screen share - show ARCHITECTURE.md diagram]**

"The architecture follows a clean layered approach:

- **Presentation layer** with Next.js 14 and server-side rendering
- **API layer** with protected routes and proper validation
- **Service layer** with business logic separated from controllers
- **Data layer** with Prisma ORM and PostgreSQL

The key innovation here is the multi-tenancy design. Every tenant's data is completely isolated using tenant identifiers, with role-based access control. This means one platform can serve hundreds of Shopify stores securely.

I chose Next.js because it gives us both great developer experience and production performance. TypeScript throughout ensures type safety and catches errors at compile time."

## Live Demo - Setup (1 minute 30 seconds)

**[Screen share - show landing page]**

"Let me show you the platform in action. Here's the landing page with a modern, gradient design.

**[Click Sign Up]**

I'll create a new account... and we're in!

**[Show dashboard]**

This is the main dashboard where users manage their Shopify stores. I already have one store connected, but let me show you how easy it is to add another.

**[Click Add Store]**

You just need:
- Store name
- Shopify domain
- Admin API access token

The platform handles all the OAuth complexity behind the scenes."

## Live Demo - Data Sync (1 minute 30 seconds)

**[Click on existing store]**

"Here's where it gets interesting. Let me trigger a data sync.

**[Click Sync Data button]**

The sync service is pulling data from Shopify's API:
- Customers with their lifetime spend
- Orders with all line items
- Products with metadata
- Custom events like cart abandonment

**[Show sync completing]**

The sync handles pagination automatically, can process thousands of records, and logs everything for debugging. In production, this runs on a schedule every 6 hours, plus we have webhooks for real-time updates."

## Live Demo - Analytics (2 minutes)

**[Show analytics dashboard]**

"Now for the best part – the analytics. This goes way beyond basic metrics.

**[Point to overview cards]**

At the top, we have overview metrics with growth indicators. See this green arrow? That's a 23% revenue growth compared to the last 30 days.

**[Scroll to revenue chart]**

This time-series chart shows revenue and order trends. You can filter by date range – let me show you the last 90 days.

**[Change date range]**

The chart updates instantly with dual-axis visualization.

**[Scroll to customer segmentation]**

Here's something unique – customer segmentation. I'm automatically categorizing customers into:
- VIP: Over $1000 lifetime spend
- Loyal: 5+ orders
- Regular: 2-4 orders
- One-time buyers
- Inactive customers

This helps businesses target their marketing. For example, you might want to re-engage those one-time buyers with a discount campaign.

**[Scroll to top customers]**

Top 5 customers by spend – actionable data for account management.

**[Scroll to product revenue]**

And product performance analysis showing which products drive the most revenue. This bar chart makes it easy to spot your winners and losers."

## Technical Deep Dive (1 minute 15 seconds)

**[Show code in VS Code]**

"Let me show you some code that makes this special.

**[Open src/services/analytics-service.ts]**

Here's the AnalyticsService. Notice how I'm using Prisma's aggregation functions to do calculations in the database, not in JavaScript. This is crucial for performance at scale.

**[Open src/services/sync-service.ts]**

The sync service handles pagination automatically and uses upsert operations to handle both new and updated records. Every sync is logged for debugging.

**[Open prisma/schema.prisma]**

The database schema uses composite unique indexes for performance and Decimal types for financial data to avoid floating-point errors.

**[Open src/app/api/tenants/[tenantId]/analytics/route.ts]**

Every API route validates the session and verifies tenant ownership. Security is built in, not bolted on."

## Trade-offs & Future Enhancements (45 seconds)

**[Back to camera]**

"Let me talk about some trade-offs I made:

**Current approach:**
- Synchronous sync operations – simple but blocks the request
- Direct database queries – fast for current scale
- Single region deployment – keeps costs low

**For production scale, I'd add:**
- Job queue (BullMQ) for async sync operations
- Redis caching for frequently accessed analytics
- Read replicas for analytics queries
- Multi-region deployment for global customers

The architecture is designed to evolve. Each layer can be enhanced independently without rewriting everything."

## Closing (30 seconds)

**[Show enthusiasm!]**

"What excites me about this project is that it solves real problems. Shopify merchants need these insights to grow their business, and this platform delivers them in a beautiful, intuitive way.

I'd love to bring this same approach to Xeno – building customer-facing solutions that are both technically excellent and genuinely useful.

Thanks for watching, and I'm excited to discuss this further!"

---

## Tips for Recording

### Before Recording
- [ ] Test your microphone and camera
- [ ] Close unnecessary applications
- [ ] Clear browser history/cache
- [ ] Prepare test data in Shopify store
- [ ] Practice the demo flow 2-3 times
- [ ] Have water nearby

### During Recording
- [ ] Smile and show enthusiasm
- [ ] Speak clearly and at moderate pace
- [ ] Use your hands to emphasize points
- [ ] Look at the camera when talking
- [ ] Show confidence in your work

### Technical Setup
- [ ] Record in 1080p minimum
- [ ] Use good lighting (face the window)
- [ ] Quiet environment
- [ ] Screen recording at 30fps
- [ ] Use a good microphone (not laptop mic if possible)

### Editing
- [ ] Cut out long pauses
- [ ] Add smooth transitions
- [ ] Ensure audio is clear
- [ ] Add captions if possible
- [ ] Keep under 7 minutes
- [ ] Export in MP4 format

### What to Avoid
- ❌ Don't apologize for anything
- ❌ Don't say "um" or "uh" too much
- ❌ Don't rush through explanations
- ❌ Don't show errors or bugs
- ❌ Don't go over 7 minutes

### What to Emphasize
- ✅ Your problem-solving approach
- ✅ Technical decisions and why
- ✅ Features beyond requirements
- ✅ Production-ready code quality
- ✅ Your enthusiasm for the role

---

## Alternative 5-Minute Version

If you want a shorter, punchier demo:

1. **Intro** (30s) - Who you are, what you built
2. **Quick Demo** (2m) - Sign in, sync, show analytics
3. **Technical Highlight** (1m 30s) - Show one impressive code section
4. **Architecture** (30s) - Quick overview of design
5. **Closing** (30s) - Why you're excited

The key is showing confidence and competence while being personable!
