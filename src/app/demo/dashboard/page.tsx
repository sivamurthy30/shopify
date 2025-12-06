'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const MOCK_STORES = [
  {
    id: '1',
    name: 'Fashion Boutique',
    shopifyDomain: 'fashion-boutique.myshopify.com',
    lastSyncAt: new Date().toISOString(),
    _count: {
      customers: 1247,
      orders: 3891,
      products: 156
    }
  },
  {
    id: '2',
    name: 'Tech Gadgets Store',
    shopifyDomain: 'tech-gadgets.myshopify.com',
    lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    _count: {
      customers: 892,
      orders: 2134,
      products: 89
    }
  },
  {
    id: '3',
    name: 'Home Decor Plus',
    shopifyDomain: 'home-decor-plus.myshopify.com',
    lastSyncAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    _count: {
      customers: 2103,
      orders: 5672,
      products: 234
    }
  }
]

export default function DemoDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const demoMode = localStorage.getItem('demo_mode')
    const demoUser = localStorage.getItem('demo_user')
    
    if (!demoMode || !demoUser) {
      router.push('/')
      return
    }
    
    setUser(JSON.parse(demoUser))
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('demo_user')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-emerald-400 mb-4"></div>
          <p className="text-neutral-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Demo Banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-400 font-medium">Demo Mode - Mock Data</span>
          </div>
          <span className="text-xs text-neutral-500">No database required</span>
        </div>
      </div>

      <nav className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg"></div>
            <h1 className="text-xl font-semibold tracking-tight">Xeno</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-neutral-950 text-xs font-bold">
                {user.email[0].toUpperCase()}
              </div>
              <span className="text-neutral-300 text-sm">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-neutral-400 hover:text-white px-4 py-2 rounded-lg hover:bg-neutral-900 transition-all text-sm"
            >
              Exit Demo
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-5xl font-bold tracking-tight mb-3">Stores</h2>
            <p className="text-neutral-400">Manage and analyze your Shopify stores</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_STORES.map((store, index) => (
            <Link
              key={store.id}
              href={`/demo/analytics/${store.id}`}
              className="group border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all bg-neutral-900/30 hover:bg-neutral-900/50"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-neutral-500 text-sm">{store.shopifyDomain}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {store._count.customers.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Customers</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {store._count.orders.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Orders</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {store._count.products}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Products</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Synced {new Date(store.lastSyncAt).toLocaleDateString()}</span>
                </div>
                <svg className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
