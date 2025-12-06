#!/usr/bin/env tsx

import { prisma } from '../lib/prisma'
import { ShopifyClient } from '../lib/shopify'
import { SyncService } from '../services/sync-service'

async function syncAllTenants() {
  console.log('Starting scheduled sync for all tenants...')

  const tenants = await prisma.tenant.findMany({
    where: { isActive: true },
  })

  console.log(`Found ${tenants.length} active tenants`)

  for (const tenant of tenants) {
    try {
      console.log(`Syncing tenant: ${tenant.name} (${tenant.shopifyDomain})`)

      const shopifyClient = new ShopifyClient({
        shop: tenant.shopifyDomain,
        accessToken: tenant.shopifyAccessToken,
        apiKey: tenant.shopifyApiKey || undefined,
        apiSecret: tenant.shopifyApiSecret || undefined,
      })

      const syncService = new SyncService(tenant.id, shopifyClient)
      const result = await syncService.syncAll()

      console.log(`✓ Synced ${result.recordsSynced} records for ${tenant.name}`)
    } catch (error) {
      console.error(`✗ Failed to sync ${tenant.name}:`, error)
    }
  }

  console.log('Sync completed for all tenants')
  process.exit(0)
}

syncAllTenants()
