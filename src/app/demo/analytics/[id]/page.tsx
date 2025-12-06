'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

const MOCK_DATA = {
  overview: {
    totalRevenue: 125450.75,
    totalOrders: 3891,
    totalCustomers: 1247,
    totalProducts: 156
  },
  growth: {
    revenueGrowth: 15.3,
    orderGrowth: 8.7
  },
  orders: [
    { date: '2024-01-01', revenue: 4200, orders: 45 },
    { date: '2024-01-02', revenue: 3800, orders: 38 },
    { date: '2024-01-03', revenue: 5100, orders: 52 },
    { date: '2024-01-04', revenue: 4600, orders: 48 },
    { date: '2024-01-05', revenue: 5400, orders: 55 },
    { date: '2024-01-06', revenue: 6200, orders: 63 },
    { date: '2024-01-07', revenue: 5800, orders: 59 },
  ],
  topCustomers: [
    { id: '1', name: 'Sarah Johnson', totalSpent: 12450.50, ordersCount: 28 },
    { id: '2', name: 'Michael Chen', totalSpent: 9870.25, ordersCount: 22 },
    { id: '3', name: 'Emma Williams', totalSpent: 8340.00, ordersCount: 19 },
    { id: '4', name: 'James Brown', totalSpent: 7650.75, ordersCount: 17 },
    { id: '5', name: 'Lisa Anderson', totalSpent: 6890.50, ordersCount: 15 },
  ],
  segmentation: {
    vip: 45,
    loyal: 128,
    regular: 342,
    oneTime: 589,
    inactive: 143
  },
  productRevenue: [
    { productName: 'Premium Jacket', revenue: 15600, unitsSold: 78 },
    { productName: 'Designer Shoes', revenue: 12400, unitsSold: 62 },
    { productName: 'Leather Bag', revenue: 10800, unitsSold: 54 },
    { productName: 'Sunglasses', revenue: 8900, unitsSold: 89 },
    { productName: 'Watch', revenue: 7600, unitsSold: 38 },
  ]
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

export default function DemoAnalytics() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const demoMode = localStorage.getItem('demo_mode')
    if (!demoMode) {
      router.push('/')
      return
    }
    setLoading(false)
  }, [router])

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

  const segmentationData = [
    { name: 'VIP (>$1000)', value: MOCK_DATA.segmentation.vip },
    { name: 'Loyal (5+ orders)', value: MOCK_DATA.segmentation.loyal },
    { name: 'Regular (2-4)', value: MOCK_DATA.segmentation.regular },
    { name: 'One-time', value: MOCK_DATA.segmentation.oneTime },
    { name: 'Inactive', value: MOCK_DATA.segmentation.inactive },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Demo Banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-400 font-medium">Demo Mode - Mock Data</span>
          </div>
        </div>
      </div>

      <nav className="border-b border-neutral-800/50 backdrop-blur-xl bg-neutral-950/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/demo/dashboard')}
              className="text-neutral-400 hover:text-white hover:bg-neutral-900 px-3 py-2 rounded-lg transition-all flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-neutral-800"></div>
            <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
          </div>
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
            <p className="text-4xl font-bold mb-2">${MOCK_DATA.overview.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-sm text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium">{MOCK_DATA.growth.revenueGrowth}%</span>
              <span className="text-neutral-500">vs last 30d</span>
            </div>
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
            <p className="text-4xl font-bold mb-2">{MOCK_DATA.overview.totalOrders.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-sm text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium">{MOCK_DATA.growth.orderGrowth}%</span>
              <span className="text-neutral-500">vs last 30d</span>
            </div>
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
            <p className="text-4xl font-bold">{MOCK_DATA.overview.totalCustomers.toLocaleString()}</p>
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
            <p className="text-4xl font-bold">{MOCK_DATA.overview.totalProducts}</p>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="border border-neutral-800 rounded-2xl p-6 mb-12 bg-neutral-900/30">
          <h2 className="text-2xl font-semibold mb-6">Revenue & Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_DATA.orders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#737373" />
              <YAxis yAxisId="left" stroke="#737373" />
              <YAxis yAxisId="right" orientation="right" stroke="#737373" />
              <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue ($)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Customers */}
          <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30">
            <h2 className="text-2xl font-semibold mb-6">Top Customers</h2>
            <div className="space-y-3">
              {MOCK_DATA.topCustomers.map((customer, index) => (
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
                  <p className="text-lg font-bold">${customer.totalSpent.toLocaleString()}</p>
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
                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Revenue */}
        <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/30">
          <h2 className="text-2xl font-semibold mb-6">Top Products by Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_DATA.productRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
              <Bar dataKey="unitsSold" fill="#3b82f6" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}
