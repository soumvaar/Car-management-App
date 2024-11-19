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

export async function GET(req: Request, { params }: { params: { carId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const car = await prisma.car.findUnique({
      where: {
        id: params.carId,
        userId,
      },
    })

    if (!car) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error('GET /api/cars/[carId] error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { carId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, images, carType, company, dealer } = CarSchema.parse(body)

    const car = await prisma.car.update({
      where: {
        id: params.carId,
        userId,
      },
      data: {
        title,
        description,
        images,
        carType,
        company,
        dealer,
      },
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error('PATCH /api/cars/[carId] error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { carId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.car.delete({
      where: {
        id: params.carId,
        userId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/cars/[carId] error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}