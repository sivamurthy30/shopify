# 📁 Project File Structure

## Complete File Tree

```
xeno-shopify-insights/
│
├── 📄 Configuration Files
│   ├── .env.example              # Environment variables template
│   ├── .eslintrc.json            # ESLint configuration
│   ├── .gitignore                # Git ignore rules
│   ├── next.config.js            # Next.js configuration
│   ├── package.json              # Dependencies and scripts
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── vercel.json               # Vercel deployment config
│
├── 📚 Documentation (15 files)
│   ├── README.md                 # Main documentation (comprehensive)
│   ├── SETUP.md                  # Detailed setup instructions
│   ├── QUICKSTART.md             # 5-minute quick start
│   ├── QUICK_START_GUIDE.md      # 15-minute quick start
│   ├── ARCHITECTURE.md           # Architecture deep dive
│   ├── FEATURES.md               # Feature showcase
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── DEMO_SCRIPT.md            # Video demo script
│   ├── CHECKLIST.md              # Submission checklist
│   ├── PROJECT_SUMMARY.md        # Executive summary
│   ├── STATUS_REPORT.md          # Current project status
│   ├── FINAL_STEPS.md            # Final steps to submission
│   ├── TROUBLESHOOTING.md        # Common issues & solutions
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── FILE_STRUCTURE.md         # This file
│   └── LICENSE                   # MIT License
│
├── 🗄️ Database
│   └── prisma/
│       └── schema.prisma         # Database schema (10 models)
│
├── 🎨 Frontend (Next.js App Router)
│   └── src/app/
│       ├── layout.tsx            # Root layout with providers
│       ├── page.tsx              # Landing page
│       ├── globals.css           # Global styles
│       ├── providers.tsx         # NextAuth provider
│       │
│       ├── auth/                 # Authentication pages
│       │   ├── signin/
│       │   │   └── page.tsx      # Sign in page
│       │   └── signup/
│       │       └── page.tsx      # Sign up page
│       │
│       └── dashboard/            # Main application
│           ├── page.tsx          # Tenant list dashboard
│           └── [tenantId]/
│               └── page.tsx      # Analytics dashboard
│
├── 🔌 Backend (API Routes)
│   └── src/app/api/
│       ├── auth/
│       │   ├── signup/
│       │   │   └── route.ts      # User registration
│       │   └── [...nextauth]/
│       │       └── route.ts      # NextAuth handlers
│       │
│       ├── tenants/
│       │   ├── route.ts          # List/create tenants
│       │   └── [tenantId]/
│       │       ├── sync/
│       │       │   └── route.ts  # Trigger sync
│       │       └── analytics/
│       │           └── route.ts  # Fetch analytics
│       │
│       └── webhooks/
│           └── shopify/
│               └── route.ts      # Shopify webhook receiver
│
├── 🔧 Services (Business Logic)
│   └── src/services/
│       ├──