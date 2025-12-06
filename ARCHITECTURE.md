# 🏗️ Architecture Deep Dive

## System Overview

Xeno Shopify Insights is a multi-tenant SaaS platform that ingests data from multiple Shopify stores and provides advanced analytics. The architecture is designed for scalability, maintainability, and production readiness.

## Design Principles

1. **Multi-tenancy First**: Complete data isolation using tenant identifiers
2. **Type Safety**: TypeScript throughout for compile-time error detection
3. **Separation of Concerns**: Clear boundaries between layers
4. **API-First**: RESTful APIs that can support multiple clients
5. **Real-time + Batch**: Hybrid sync strategy for reliability

## Layer Architecture

### 1. Presentation Layer (Next.js App Router)

**Location**: `src/app/`

**Responsibilities**:
- Server-side rendering for performance
- Client-side interactivity
- Route handling
- Session management

**Key Components**:
- `page.tsx`: Landing page
- `auth/`: Authentication pages
- `dashboard/`: Main application UI
- `dashboard/[tenantId]/`: Tenant-specific analytics

**Technology Choices**:
- Next.js 14 App Router for modern React patterns
- Tailwind CSS for rapid, responsive styling
- Recharts for data visualization
- NextAuth for authentication

### 2. API Layer (Next.js API Routes)

**Location**: `src/app/api/`

**Responsibilities**:
- Request validation
- Authentication/authorization
- Business logic orchestration
- Response formatting

**Endpoints**:

```
/api/auth/
  ├── signup          POST   Create new user
  └── [...nextauth]   *      NextAuth handlers

/api/tenants/
  ├── GET             List user's tenants
  ├── POST            Create new tenant
  └── [tenantId]/
      ├── sync        POST   Trigger data sync
      └── analytics   GET    Fetch analytics data

/api/webhooks/
  └── shopify         POST   Receive Shopify webhooks
```

**Security**:
- Session validation on all protected routes
- Tenant ownership verification
- Input validation with Zod schemas

### 3. Service Layer

**Location**: `src/services/`

**Responsibilities**:
- Business logic implementation
- Data transformation
- External API integration
- Complex queries

**Services**:

#### SyncService
```typescript
class SyncService {
  syncAll()         // Full sync of all data
  syncCustomers()   // Sync customer data
  syncOrders()      // Sync order data
  syncProducts()    // Sync product data
}
```

#### AnalyticsService
```typescript
class AnalyticsService {
  getOverviewMetrics()        // Basic metrics
  getOrdersByDate()           // Time-series data
  getTopCustomers()           // Top spenders
  getRevenueByProduct()       // Product performance
  getCustomerSegmentation()   // Customer segments
  getCohortAnalysis()         // Cohort metrics
  getGrowthMetrics()          // Growth indicators
}
```

### 4. Integration Layer

**Location**: `src/lib/`

**Responsibilities**:
- External API clients
- Third-party service wrappers
- Configuration management

**Components**:

#### ShopifyClient
```typescript
class ShopifyClient {
  fetchCustomers()      // Get customers from Shopify
  fetchOrders()         // Get orders from Shopify
  fetchProducts()       // Get products from Shopify
  registerWebhook()     // Set up webhooks
}
```

**Features**:
- Automatic pagination handling
- Rate limit awareness
- Error handling and retries
- Session management

### 5. Data Layer (Prisma + PostgreSQL)

**Location**: `prisma/schema.prisma`

**Responsibilities**:
- Data persistence
- Query optimization
- Data integrity
- Migrations

**Schema Design**:

```
Users ←→ TenantUser ←→ Tenants
                         ↓
                    ┌────┴────┬────────┬─────────┐
                    ↓         ↓        ↓         ↓
                Customers  Orders  Products  Events
                    ↑         ↓
                    └────OrderItems
```

**Key Design Decisions**:

1. **Composite Unique Indexes**
   ```prisma
   @@unique([tenantId, shopifyId])
   ```
   Ensures no duplicate Shopify records per tenant

2. **Decimal for Money**
   ```prisma
   totalPrice Decimal @db.Decimal(10, 2)
   ```
   Prevents floating-point errors in financial calculations

3. **JSON for Flexibility**
   ```prisma
   metadata Json?
   ```
   Allows storing arbitrary event data

4. **Cascading Deletes**
   ```prisma
   onDelete: Cascade
   ```
   Maintains referential integrity

## Data Flow

### Sync Flow

```
User clicks "Sync" 
  → API validates session & tenant ownership
  → SyncService.syncAll() called
  → ShopifyClient fetches data (paginated)
  → Data transformed and upserted to DB
  → SyncLog created for audit
  → Response sent to client
```

### Analytics Flow

```
User views dashboard
  → API validates session & tenant ownership
  → AnalyticsService queries DB
  → Data aggregated and transformed
  → Response cached (future enhancement)
  → Charts rendered on client
```

### Webhook Flow

```
Shopify sends webhook
  → Webhook endpoint validates signature
  → Tenant identified by shop domain
  → Relevant sync method called
  → CustomEvent created if applicable
  → 200 OK response sent immediately
```

## Multi-Tenancy Strategy

### Data Isolation

Every tenant-specific table includes `tenantId`:
```prisma
model Customer {
  id       String @id
  tenantId String
  // ...
  @@index([tenantId])
}
```

### Query Patterns

All queries include tenant filter:
```typescript
await prisma.customer.findMany({
  where: { tenantId: tenant.id }
})
```

### Access Control

```typescript
// Verify user has access to tenant
const tenant = await prisma.tenant.findFirst({
  where: {
    id: tenantId,
    users: {
      some: { userId: session.user.id }
    }
  }
})
```

## Scalability Considerations

### Current Architecture (0-10k orders/day)

- Single Next.js instance
- Direct database queries
- Synchronous sync operations

### Phase 2 (10k-100k orders/day)

- Add Redis caching layer
- Implement job queue (BullMQ)
- Horizontal scaling with load balancer
- Read replicas for analytics

### Phase 3 (100k+ orders/day)

- Microservices architecture
- Event-driven with message queue
- Separate analytics database (ClickHouse)
- CDN for static assets
- Multi-region deployment

## Performance Optimizations

### Database

1. **Indexes on Foreign Keys**
   ```prisma
   @@index([tenantId])
   @@index([customerId])
   ```

2. **Composite Indexes for Common Queries**
   ```prisma
   @@index([tenantId, createdAt])
   ```

3. **Select Only Needed Fields**
   ```typescript
   select: { id: true, email: true }
   ```

### API

1. **Parallel Queries**
   ```typescript
   const [overview, orders] = await Promise.all([
     getOverview(),
     getOrders()
   ])
   ```

2. **Pagination**
   ```typescript
   take: 250,
   skip: offset
   ```

3. **Aggregation in Database**
   ```typescript
   _sum: { totalPrice: true }
   ```

## Security Architecture

### Authentication

- NextAuth.js with JWT strategy
- Bcrypt password hashing (12 rounds)
- Secure session cookies (httpOnly, secure)

### Authorization

- Session validation on all protected routes
- Tenant ownership verification
- Role-based access control (admin/viewer)

### Data Protection

- SQL injection prevention (Prisma)
- XSS protection (React escaping)
- CSRF protection (NextAuth)
- Environment variable secrets

### API Security

- Rate limiting (future)
- Request validation (Zod)
- Error message sanitization
- Webhook signature verification

## Monitoring & Observability

### Current

- Console logging
- Sync logs in database
- Error boundaries in React

### Recommended Additions

1. **Application Monitoring**
   - Sentry for error tracking
   - LogRocket for session replay

2. **Performance Monitoring**
   - Vercel Analytics
   - Database query monitoring

3. **Business Metrics**
   - Sync success rate
   - API response times
   - User engagement metrics

## Testing Strategy

### Recommended Test Pyramid

```
        /\
       /E2E\          10% - Playwright
      /------\
     /  API   \       30% - API route tests
    /----------\
   / Unit Tests \     60% - Service & utility tests
  /--------------\
```

### Key Test Areas

1. **Unit Tests**
   - AnalyticsService calculations
   - Data transformations
   - Utility functions

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Shopify client

3. **E2E Tests**
   - User signup/signin
   - Tenant creation
   - Dashboard navigation

## Deployment Architecture

### Development
```
Local Machine
  ├── Next.js Dev Server (port 3000)
  ├── PostgreSQL (local or cloud)
  └── Shopify Dev Store
```

### Production (Vercel)
```
Vercel Edge Network
  ├── Next.js (Serverless Functions)
  ├── Static Assets (CDN)
  └── API Routes (Serverless)
       ↓
  PostgreSQL (Neon/Supabase)
       ↓
  Shopify Production Store
```

## Future Enhancements

### Short-term
- Redis caching
- Job queue for sync
- Email notifications
- Export functionality

### Medium-term
- Real-time updates (WebSockets)
- Advanced ML predictions
- Custom report builder
- Mobile app

### Long-term
- Multi-region deployment
- Microservices architecture
- Real-time collaboration
- White-label solution

---

This architecture balances simplicity for rapid development with scalability for future growth. Each layer has clear responsibilities and can be enhanced independently.
