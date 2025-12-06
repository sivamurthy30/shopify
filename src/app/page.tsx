import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-hidden relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Gradient orb */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent blur-3xl"></div>

      <div className="relative">
        {/* Navigation */}
        <nav className="border-b border-neutral-800/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg"></div>
              <span className="text-xl font-semibold tracking-tight">Xeno</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/signin" className="text-neutral-400 hover:text-white transition-colors text-sm">
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-white text-neutral-950 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm text-emerald-400 font-medium">Real-time Analytics Platform</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.95]">
              Shopify insights
              <br />
              <span className="text-neutral-500">that matter</span>
            </h1>
            
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl leading-relaxed">
              Multi-tenant analytics platform with real-time sync, customer segmentation, 
              and actionable insights for modern e-commerce teams.
            </p>

            <div className="flex items-center gap-4">
              <Link 
                href="/auth/signup"
                className="group bg-white text-neutral-950 px-8 py-4 rounded-xl text-base font-medium hover:bg-neutral-100 transition-all inline-flex items-center gap-2"
              >
                Start Free Trial
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/auth/signin"
                className="px-8 py-4 rounded-xl text-base font-medium text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800/50 border border-neutral-800/50 rounded-2xl overflow-hidden">
            <div className="bg-neutral-950 p-10 group hover:bg-neutral-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Sync</h3>
              <p className="text-neutral-400 leading-relaxed">
                Webhook-based updates with scheduled fallback. Your data stays fresh without manual intervention.
              </p>
            </div>

            <div className="bg-neutral-950 p-10 group hover:bg-neutral-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-neutral-400 leading-relaxed">
                Customer segmentation, cohort analysis, and growth metrics. Understand what drives your business.
              </p>
            </div>

            <div className="bg-neutral-950 p-10 group hover:bg-neutral-900/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-tenant</h3>
              <p className="text-neutral-400 leading-relaxed">
                Complete data isolation with role-based access. Scale from one store to hundreds seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">7+</div>
              <div className="text-neutral-500 text-sm">Analytics Views</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">3</div>
              <div className="text-neutral-500 text-sm">Sync Methods</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">100%</div>
              <div className="text-neutral-500 text-sm">TypeScript</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">∞</div>
              <div className="text-neutral-500 text-sm">Scalability</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
