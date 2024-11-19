import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CarSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  images: z.array(z.string()).max(10),
  carType: z.string().min(1).max(50),
  company: z.string().min(1).max(50),
  dealer: z.string().min(1).max(50),
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, images, carType, company, dealer } = CarSchema.parse(body)

    const car = await prisma.car.create({
      data: {
        title,
        description,
        images,
        carType,
        company,
        dealer,
        userId,
      },
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error('POST /api/cars error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''

    const cars = await prisma.car.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { carType: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
          { dealer: { contains: query, mode: 'insensitive' } },
        ],
      },
    })

    return NextResponse.json(cars)
  } catch (error) {
    console.error('GET /api/cars error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}