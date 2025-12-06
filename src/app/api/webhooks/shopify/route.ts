import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ShopifyClient } from '@/lib/shopify'
import { SyncService } from '@/services/sync-service'

export async function POST(req: Request) {
  try {
    const shopDomain = req.headers.get('x-shopify-shop-domain')
    const topic = req.headers.get('x-shopify-topic')
    
    if (!shopDomain || !topic) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { shopifyDomain: shopDomain },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const body = await req.json()

    // Handle different webhook topics
    if (topic.includes('orders')) {
      // Trigger order sync
      const shopifyClient = new ShopifyClient({
        shop: tenant.shopifyDomain,
        accessToken: tenant.shopifyAccessToken,
      })
      const syncService = new SyncService(tenant.id, shopifyClient)
      await syncService.syncOrders()
    } else if (topic.includes('customers')) {
      const shopifyClient = new ShopifyClient({
        shop: tenant.shopifyDomain,
        accessToken: tenant.shopifyAccessToken,
      })
      const syncService = new SyncService(tenant.id, shopifyClient)
      await syncService.syncCustomers()
    } else if (topic.includes('products')) {
      const shopifyClient = new ShopifyClient({
        shop: tenant.shopifyDomain,
        accessToken: tenant.shopifyAccessToken,
      })
      const syncService = new SyncService(tenant.id, shopifyClient)
      await syncService.syncProducts()
    }

    // Log custom events
    if (topic === 'carts/update') {
      await prisma.customEvent.create({
        data: {
          tenantId: tenant.id,
          eventType: 'cart_abandoned',
          email: body.email,
          metadata: body,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
