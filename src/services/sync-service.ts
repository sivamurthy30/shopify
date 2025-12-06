import { prisma } from '@/lib/prisma'
import { ShopifyClient } from '@/lib/shopify'
import { Prisma } from '@prisma/client'

export class SyncService {
  private tenantId: string
  private shopifyClient: ShopifyClient

  constructor(tenantId: string, shopifyClient: ShopifyClient) {
    this.tenantId = tenantId
    this.shopifyClient = shopifyClient
  }

  async syncAll() {
    const syncLog = await prisma.syncLog.create({
      data: {
        tenantId: this.tenantId,
        syncType: 'full',
        status: 'running',
      },
    })

    try {
      let totalSynced = 0
      
      totalSynced += await this.syncCustomers()
      totalSynced += await this.syncProducts()
      totalSynced += await this.syncOrders()

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'success',
          recordsSynced: totalSynced,
          completedAt: new Date(),
        },
      })

      await prisma.tenant.update({
        where: { id: this.tenantId },
        data: { lastSyncAt: new Date() },
      })

      return { success: true, recordsSynced: totalSynced }
    } catch (error) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      })
      throw error
    }
  }

  async syncCustomers() {
    let synced = 0
    let sinceId: string | undefined

    while (true) {
      const response = await this.shopifyClient.fetchCustomers(250, sinceId)
      const customers = response.customers || []

      if (customers.length === 0) break

      for (const customer of customers) {
        await prisma.customer.upsert({
          where: {
            tenantId_shopifyId: {
              tenantId: this.tenantId,
              shopifyId: customer.id.toString(),
            },
          },
          create: {
            tenantId: this.tenantId,
            shopifyId: customer.id.toString(),
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone,
            ordersCount: customer.orders_count || 0,
            totalSpent: new Prisma.Decimal(customer.total_spent || 0),
            tags: customer.tags ? customer.tags.split(',').map((t: string) => t.trim()) : [],
            createdAt: new Date(customer.created_at),
            updatedAt: new Date(customer.updated_at),
          },
          update: {
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone,
            ordersCount: customer.orders_count || 0,
            totalSpent: new Prisma.Decimal(customer.total_spent || 0),
            tags: customer.tags ? customer.tags.split(',').map((t: string) => t.trim()) : [],
            updatedAt: new Date(customer.updated_at),
          },
        })
        synced++
      }

      if (customers.length < 250) break
      sinceId = customers[customers.length - 1].id.toString()
    }

    return synced
  }

  async syncProducts() {
    let synced = 0
    let sinceId: string | undefined

    while (true) {
      const response = await this.shopifyClient.fetchProducts(250, sinceId)
      const products = response.products || []

      if (products.length === 0) break

      for (const product of products) {
        await prisma.product.upsert({
          where: {
            tenantId_shopifyId: {
              tenantId: this.tenantId,
              shopifyId: product.id.toString(),
            },
          },
          create: {
            tenantId: this.tenantId,
            shopifyId: product.id.toString(),
            title: product.title,
            vendor: product.vendor,
            productType: product.product_type,
            tags: product.tags ? product.tags.split(',').map((t: string) => t.trim()) : [],
            status: product.status,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
          },
          update: {
            title: product.title,
            vendor: product.vendor,
            productType: product.product_type,
            tags: product.tags ? product.tags.split(',').map((t: string) => t.trim()) : [],
            status: product.status,
            updatedAt: new Date(product.updated_at),
          },
        })
        synced++
      }

      if (products.length < 250) break
      sinceId = products[products.length - 1].id.toString()
    }

    return synced
  }

  async syncOrders() {
    let synced = 0
    let sinceId: string | undefined

    while (true) {
      const response = await this.shopifyClient.fetchOrders(250, sinceId)
      const orders = response.orders || []

      if (orders.length === 0) break

      for (const order of orders) {
        const customer = order.customer ? await prisma.customer.findUnique({
          where: {
            tenantId_shopifyId: {
              tenantId: this.tenantId,
              shopifyId: order.customer.id.toString(),
            },
          },
        }) : null

        const createdOrder = await prisma.order.upsert({
          where: {
            tenantId_shopifyId: {
              tenantId: this.tenantId,
              shopifyId: order.id.toString(),
            },
          },
          create: {
            tenantId: this.tenantId,
            shopifyId: order.id.toString(),
            customerId: customer?.id,
            orderNumber: order.order_number?.toString() || order.name,
            email: order.email,
            totalPrice: new Prisma.Decimal(order.total_price || 0),
            subtotalPrice: new Prisma.Decimal(order.subtotal_price || 0),
            totalTax: new Prisma.Decimal(order.total_tax || 0),
            currency: order.currency,
            financialStatus: order.financial_status,
            fulfillmentStatus: order.fulfillment_status,
            tags: order.tags ? order.tags.split(',').map((t: string) => t.trim()) : [],
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at),
          },
          update: {
            customerId: customer?.id,
            orderNumber: order.order_number?.toString() || order.name,
            email: order.email,
            totalPrice: new Prisma.Decimal(order.total_price || 0),
            subtotalPrice: new Prisma.Decimal(order.subtotal_price || 0),
            totalTax: new Prisma.Decimal(order.total_tax || 0),
            currency: order.currency,
            financialStatus: order.financial_status,
            fulfillmentStatus: order.fulfillment_status,
            tags: order.tags ? order.tags.split(',').map((t: string) => t.trim()) : [],
            updatedAt: new Date(order.updated_at),
          },
        })

        // Sync order items
        if (order.line_items) {
          await prisma.orderItem.deleteMany({
            where: { orderId: createdOrder.id },
          })

          for (const item of order.line_items) {
            const product = await prisma.product.findUnique({
              where: {
                tenantId_shopifyId: {
                  tenantId: this.tenantId,
                  shopifyId: item.product_id?.toString() || '',
                },
              },
            })

            await prisma.orderItem.create({
              data: {
                orderId: createdOrder.id,
                productId: product?.id,
                shopifyProductId: item.product_id?.toString() || '',
                shopifyVariantId: item.variant_id?.toString() || '',
                title: item.title,
                quantity: item.quantity,
                price: new Prisma.Decimal(item.price || 0),
              },
            })
          }
        }

        synced++
      }

      if (orders.length < 250) break
      sinceId = orders[orders.length - 1].id.toString()
    }

    return synced
  }
}
