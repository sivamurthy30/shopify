import { shopifyApi, ApiVersion, Session } from '@shopify/shopify-api'
import '@shopify/shopify-api/adapters/node'

export interface ShopifyConfig {
  shop: string
  accessToken: string
  apiKey?: string
  apiSecret?: string
}

export class ShopifyClient {
  private session: Session
  private shopify: ReturnType<typeof shopifyApi>

  constructor(config: ShopifyConfig) {
    this.shopify = shopifyApi({
      apiKey: config.apiKey || 'dummy-key',
      apiSecretKey: config.apiSecret || 'dummy-secret',
      scopes: ['read_customers', 'read_orders', 'read_products'],
      hostName: config.shop.replace('https://', '').replace('http://', ''),
      apiVersion: ApiVersion.January24,
      isEmbeddedApp: false,
    })

    this.session = this.shopify.session.customAppSession(config.shop)
    this.session.accessToken = config.accessToken
  }

  async fetchCustomers(limit = 250, sinceId?: string) {
    const client = new this.shopify.clients.Rest({ session: this.session })
    const params: any = { limit }
    if (sinceId) params.since_id = sinceId
    
    const response = await client.get({ path: 'customers', query: params })
    return response.body as any
  }

  async fetchOrders(limit = 250, sinceId?: string, status = 'any') {
    const client = new this.shopify.clients.Rest({ session: this.session })
    const params: any = { limit, status }
    if (sinceId) params.since_id = sinceId
    
    const response = await client.get({ path: 'orders', query: params })
    return response.body as any
  }

  async fetchProducts(limit = 250, sinceId?: string) {
    const client = new this.shopify.clients.Rest({ session: this.session })
    const params: any = { limit }
    if (sinceId) params.since_id = sinceId
    
    const response = await client.get({ path: 'products', query: params })
    return response.body as any
  }

  async registerWebhook(topic: string, address: string) {
    const client = new this.shopify.clients.Rest({ session: this.session })
    
    const response = await client.post({
      path: 'webhooks',
      data: {
        webhook: {
          topic,
          address,
          format: 'json',
        },
      },
    })
    
    return response.body as any
  }
}
