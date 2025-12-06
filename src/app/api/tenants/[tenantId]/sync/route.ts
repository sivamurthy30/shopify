import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ShopifyClient } from '@/lib/shopify'
import { SyncService } from '@/services/sync-service'

export async function POST(
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

    const shopifyClient = new ShopifyClient({
      shop: tenant.shopifyDomain,
      accessToken: tenant.shopifyAccessToken,
      apiKey: tenant.shopifyApiKey || undefined,
      apiSecret: tenant.shopifyApiSecret || undefined,
    })

    const syncService = new SyncService(tenant.id, shopifyClient)
    const result = await syncService.syncAll()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
