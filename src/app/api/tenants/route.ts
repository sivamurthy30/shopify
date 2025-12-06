import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const tenantSchema = z.object({
  name: z.string().min(1),
  shopifyDomain: z.string().min(1),
  shopifyAccessToken: z.string().min(1),
  shopifyApiKey: z.string().optional(),
  shopifyApiSecret: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenants = await prisma.tenant.findMany({
      where: {
        users: {
          some: { userId: session.user.id },
        },
      },
      include: {
        _count: {
          select: {
            customers: true,
            orders: true,
            products: true,
          },
        },
      },
    })

    return NextResponse.json({ tenants })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = tenantSchema.parse(body)

    const tenant = await prisma.tenant.create({
      data: {
        ...data,
        users: {
          create: {
            userId: session.user.id,
            role: 'admin',
          },
        },
      },
    })

    return NextResponse.json({ tenant })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    )
  }
}
