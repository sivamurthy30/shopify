import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class AnalyticsService {
  private tenantId: string

  constructor(tenantId: string) {
    this.tenantId = tenantId
  }

  async getOverviewMetrics() {
    const [totalCustomers, totalOrders, totalProducts, revenueData] = await Promise.all([
      prisma.customer.count({ where: { tenantId: this.tenantId } }),
      prisma.order.count({ where: { tenantId: this.tenantId } }),
      prisma.product.count({ where: { tenantId: this.tenantId } }),
      prisma.order.aggregate({
        where: { tenantId: this.tenantId },
        _sum: { totalPrice: true },
      }),
    ])

    return {
      totalCustomers,
      totalOrders,
      totalProducts,
      totalRevenue: revenueData._sum.totalPrice || 0,
    }
  }

  async getOrdersByDate(startDate: Date, endDate: Date) {
    const orders = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        tenantId: this.tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalPrice: true,
      },
      _count: true,
    })

    // Group by day
    const dailyData = new Map<string, { date: string; revenue: number; orders: number }>()
    
    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0]
      const existing = dailyData.get(dateKey) || { date: dateKey, revenue: 0, orders: 0 }
      existing.revenue += Number(order._sum.totalPrice || 0)
      existing.orders += order._count
      dailyData.set(dateKey, existing)
    })

    return Array.from(dailyData.values()).sort((a, b) => a.date.localeCompare(b.date))
  }

  async getTopCustomers(limit = 5) {
    const customers = await prisma.customer.findMany({
      where: { tenantId: this.tenantId },
      orderBy: { totalSpent: 'desc' },
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        totalSpent: true,
        ordersCount: true,
      },
    })

    return customers.map(c => ({
      ...c,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email || 'Unknown',
    }))
  }

  async getRevenueByProduct(limit = 10) {
    const productRevenue = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { tenantId: this.tenantId },
        productId: { not: null },
      },
      _sum: {
        price: true,
        quantity: true,
      },
    })

    const productIds = productRevenue
      .map(p => p.productId)
      .filter((id): id is string => id !== null)

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true },
    })

    const productMap = new Map(products.map(p => [p.id, p.title]))

    return productRevenue
      .map(p => ({
        productId: p.productId!,
        productName: productMap.get(p.productId!) || 'Unknown',
        revenue: Number(p._sum.price || 0) * (p._sum.quantity || 0),
        unitsSold: p._sum.quantity || 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
  }

  async getCustomerSegmentation() {
    const customers = await prisma.customer.findMany({
      where: { tenantId: this.tenantId },
      select: { totalSpent: true, ordersCount: true },
    })

    const segments = {
      vip: 0,        // >$1000 spent
      loyal: 0,      // 5+ orders
      regular: 0,    // 2-4 orders
      oneTime: 0,    // 1 order
      inactive: 0,   // 0 orders
    }

    customers.forEach(customer => {
      const spent = Number(customer.totalSpent)
      const orders = customer.ordersCount

      if (spent > 1000) segments.vip++
      else if (orders >= 5) segments.loyal++
      else if (orders >= 2) segments.regular++
      else if (orders === 1) segments.oneTime++
      else segments.inactive++
    })

    return segments
  }

  async getCohortAnalysis() {
    // Get customers grouped by their first order month
    const customers = await prisma.customer.findMany({
      where: { tenantId: this.tenantId },
      include: {
        orders: {
          orderBy: { createdAt: 'asc' },
          select: { createdAt: true, totalPrice: true },
        },
      },
    })

    const cohorts = new Map<string, {
      month: string
      customers: number
      totalRevenue: number
      avgOrderValue: number
    }>()

    customers.forEach(customer => {
      if (customer.orders.length === 0) return

      const firstOrderDate = customer.orders[0].createdAt
      const cohortKey = `${firstOrderDate.getFullYear()}-${String(firstOrderDate.getMonth() + 1).padStart(2, '0')}`
      
      const existing = cohorts.get(cohortKey) || {
        month: cohortKey,
        customers: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      }

      existing.customers++
      const customerRevenue = customer.orders.reduce((sum, order) => sum + Number(order.totalPrice), 0)
      existing.totalRevenue += customerRevenue

      cohorts.set(cohortKey, existing)
    })

    return Array.from(cohorts.values())
      .map(cohort => ({
        ...cohort,
        avgOrderValue: cohort.totalRevenue / cohort.customers,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  async getGrowthMetrics() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const [currentPeriod, previousPeriod] = await Promise.all([
      prisma.order.aggregate({
        where: {
          tenantId: this.tenantId,
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { totalPrice: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: {
          tenantId: this.tenantId,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
        _sum: { totalPrice: true },
        _count: true,
      }),
    ])

    const currentRevenue = Number(currentPeriod._sum.totalPrice || 0)
    const previousRevenue = Number(previousPeriod._sum.totalPrice || 0)
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    const currentOrders = currentPeriod._count
    const previousOrders = previousPeriod._count
    const orderGrowth = previousOrders > 0 
      ? ((currentOrders - previousOrders) / previousOrders) * 100 
      : 0

    return {
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      orderGrowth: Math.round(orderGrowth * 10) / 10,
      currentRevenue,
      previousRevenue,
      currentOrders,
      previousOrders,
    }
  }
}
