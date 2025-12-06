import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AnalyticsService } from '@/services/analytics-service'

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        id: params.tenantId,
        users: {
          some: { userId: session.user.id },
        },
      },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const analyticsService = new AnalyticsService(tenant.id)

    let data
    switch (type) {
      case 'overview':
        data = await analyticsService.getOverviewMetrics()
        break
      case 'orders':
        data = await analyticsService.getOrdersByDate(
          startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate ? new Date(endDate) : new Date()
        )
        break
      case 'top-customers':
        data = await analyticsService.getTopCustomers()
        break
      case 'product-revenue':
        data = await analyticsService.getRevenueByProduct()
        break
      case 'segmentation':
        data = await analyticsService.getCustomerSegmentation()
        break
      case 'cohorts':
        data = await analyticsService.getCohortAnalysis()
        break
      case 'growth':
        data = await analyticsService.getGrowthMetrics()
        break
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
