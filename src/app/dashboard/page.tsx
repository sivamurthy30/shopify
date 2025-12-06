'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Tenant {
  id: string
  name: string
  shopifyDomain: string
  lastSyncAt: string | null
  _count: {
    customers: number
    orders: number
    products: number
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTenant, setShowAddTenant] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchTenants()
    }
  }, [status, router])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants')
      const data = await response.json()
      setTenants(data.tenants || [])
    } catch (error) {
      console.error('Failed to fetch tenants:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-emerald-400 mb-4"></div>
          <p className="text-neutral-500 text-sm">Loading stores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg"></div>
            <h1 className="text-xl font-semibold tracking-tight">Xeno</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-neutral-950 text-xs font-bold">
                {session?.user?.email?.[0].toUpperCase()}
              </div>
              <span className="text-neutral-300 text-sm">{session?.user?.email}</span>
            </div>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="text-neutral-400 hover:text-white px-4 py-2 rounded-lg hover:bg-neutral-900 transition-all text-sm"
            >
              Sign Out
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
          <button
            onClick={() => setShowAddTenant(true)}
            className="group bg-white text-neutral-950 px-6 py-3 rounded-xl hover:bg-neutral-100 transition-all flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Store</span>
          </button>
        </div>

        {tenants.length === 0 ? (
          <div className="border border-neutral-800 rounded-2xl p-20 text-center bg-neutral-900/30">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3">No stores connected</h3>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Connect your first Shopify store to start tracking analytics and insights
            </p>
            <button
              onClick={() => setShowAddTenant(true)}
              className="bg-white text-neutral-950 px-6 py-3 rounded-xl hover:bg-neutral-100 transition-all font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Connect Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant, index) => (
              <Link
                key={tenant.id}
                href={`/dashboard/${tenant.id}`}
                className="group border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all bg-neutral-900/30 hover:bg-neutral-900/50"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                      {tenant.name}
                    </h3>
                    <p className="text-neutral-500 text-sm">{tenant.shopifyDomain}</p>
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
                      {tenant._count.customers}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Customers</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">
                      {tenant._count.orders}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Orders</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">
                      {tenant._count.products}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Products</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  {tenant.lastSyncAt ? (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span>Synced {new Date(tenant.lastSyncAt).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full"></div>
                      <span>Not synced</span>
                    </div>
                  )}
                  <svg className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {showAddTenant && (
          <AddTenantModal
            onClose={() => setShowAddTenant(false)}
            onSuccess={() => {
              setShowAddTenant(false)
              fetchTenants()
            }}
          />
        )}
      </main>
    </div>
  )
}

function AddTenantModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    shopifyDomain: '',
    shopifyAccessToken: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to add store')
      } else {
        onSuccess()
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Add Store</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-neutral-300 text-sm font-medium mb-2">Store Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
              placeholder="My Store"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 text-sm font-medium mb-2">Shopify Domain</label>
            <input
              type="text"
              placeholder="your-store.myshopify.com"
              value={formData.shopifyDomain}
              onChange={(e) => setFormData({ ...formData, shopifyDomain: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 text-sm font-medium mb-2">Access Token</label>
            <input
              type="password"
              placeholder="shpat_xxxxx"
              value={formData.shopifyAccessToken}
              onChange={(e) => setFormData({ ...formData, shopifyAccessToken: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
              required
            />
            <p className="text-xs text-neutral-500 mt-2">
              Get this from Shopify admin → Apps → Develop apps
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 text-white py-3 rounded-xl hover:bg-neutral-700 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-neutral-950 py-3 rounded-xl hover:bg-neutral-100 transition-all disabled:opacity-50 font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </span>
              ) : (
                'Add Store'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
