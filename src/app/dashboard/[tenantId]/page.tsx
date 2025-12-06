'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function TenantDashboard() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const tenantId = params.tenantId as string

  const [overview, setOverview] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])
  const [productRevenue, setProductRevenue] = useState<any[]>([])
  const [segmentation, setSegmentation] = useState<any>(null)
  const [growth, setGrowth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchAllData()
    }
  }, [status, router, tenantId, fetchAllData])

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [overviewRes, ordersRes, customersRes, productsRes, segmentRes, growthRes] = await Promise.all([
        fetch(`/api/tenants/${tenantId}/analytics?type=overview`),
        fetch(`/api/tenants/${tenantId}/analytics?type=orders&startDate=${dateRange.start}&endDate=${dateRange.end}`),
        fetch(`/api/tenants/${tenantId}/analytics?type=top-customers`),
        fetch(`/api/tenants/${tenantId}/analytics?type=product-revenue`),
        fetch(`/api/tenants/${tenantId}/analytics?type=segmentation`),
        fetch(`/api/tenants/${tenantId}/analytics?type=growth`),
      ])

      const [overviewData, ordersData, customersData, productsData, segmentData, growthData] = await Promise.all([
        overviewRes.json(),
        ordersRes.json(),
        customersRes.json(),
        productsRes.json(),
        segmentRes.json(),
        growthRes.json(),
      ])

      setOverview(overviewData.data)
      setOrders(ordersData.data)
      setTopCustomers(customersData.data)
      setProductRevenue(productsData.data)
      setSegmentation(segmentData.data)
      setGrowth(growthData.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  })

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch(`/api/tenants/${tenantId}/sync`, {
        method: 'POST',
      })
      
      if (response.ok) {
        alert('Sync completed successfully!')
        fetchAllData()
      } else {
        alert('Sync failed')
      }
    } catch (error) {
      alert('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-emerald-400 mb-4"></div>
          <p className="text-neutral-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

  const segmentationData = segmentation ? [
    { name: 'VIP (>$1000)', value: segmentation.vip },
    { name: 'Loyal (5+ orders)', value: segmentation.loyal },
    { name: 'Regular (2-4)', value: segmentation.regular },
    { name: 'One-time', value: segmentation.oneTime },
    { name: 'Inactive', value: segmentation.inactive },
  ] : []

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-neutral-400 hover:text-white hover:bg-neutral-900 px-3 py-2 rounded-lg transition-all flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-neutral-800"></div>
            <h1 className="text-xl font-semibold tracking-tight">
              Analytics
            </h1>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="group bg-white text-neutral-950 px-6 py-2.5 rounded-xl hover:bg-neutral-100 transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{syncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all bg-neutral-900/30">
            <div className="flex items-start justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Total Revenue</p>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-2">
              ${overview?.totalRevenue?.toFixed(2) || 0}
            </p>
            {growth && (
              <div className={`flex items-center gap-1 text-sm ${growth.revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={growth.revenueGrowth >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                </svg>
                <span className="font-medium">{Math.abs(growth.revenueGrowth).toFixed(1)}%</span>
                <span className="text-neutral-500">vs last 30d</span>
              </div>
            )}
          </div>

          <div className="group border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all bg-neutral-900/30">
            <div className="flex items-start justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Total Orders</p>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-2">{overview?.totalOrders || 0}</p>
            {growth && (
              <div className={`flex items-center gap-1 text-sm ${growth.orderGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={growth.orderGrowth >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                </svg>
                <span className="font-medium">{Math.abs(growth.orderGrowth).toFixed(1)}%</span>
                <span className="text-neutral-500">vs last 30d</span>
              </div>
            )}
          </div>

          <div className="group border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all bg-neutral-900/30">
            <div className="flex items-start justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Total Customers</p>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">{overview?.totalCustomers || 0}</p>
          </div>

          <div className="group border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all bg-neutral-900/30">
            <div className="flex items-start justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Total Products</p>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">{overview?.totalProducts || 0}</p>
          </div>
        </div>

        {/* Orders Over Time */}
        <div className="border border-neutral-800 rounded-2xl p-6 mb-12 bg-neutral-900/30">
          <h2 className="text-2xl font-semibold mb-6">Revenue & Orders Trend</h2>
          <div className="mb-6 flex flex-wrap gap-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button
              onClick={fetchAllData}
              className="bg-white text-neutral-950 px-6 py-2 rounded-xl hover:bg-neutral-100 transition-all font-medium"
            >
              Apply
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366f1" name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#8b5cf6" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Customers */}
          <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30">
            <h2 className="text-2xl font-semibold mb-6">Top Customers</h2>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="group flex justify-between items-center p-4 rounded-xl hover:bg-neutral-900 transition-all border border-transparent hover:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      index === 1 ? 'bg-neutral-700 text-neutral-300 border border-neutral-600' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-emerald-400 transition-colors">
                        {customer.name}
                      </p>
                      <p className="text-sm text-neutral-500">{customer.ordersCount} orders</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">
                    ${Number(customer.totalSpent).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segmentation */}
          <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30">
            <h2 className="text-2xl font-semibold mb-6">Customer Segmentation</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={segmentationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Revenue */}
        <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30">
          <h2 className="text-2xl font-semibold mb-6">Top Products by Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#6366f1" name="Revenue ($)" />
              <Bar dataKey="unitsSold" fill="#8b5cf6" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}
