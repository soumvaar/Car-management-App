'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CarForm from '../../components/CarForm'

interface Car {
  id: string
  title: string
  description: string
  images: string[]
  carType: string
  company: string
  dealer: string
}

export default function CarDetails({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/cars/${params.id}`)
      .then((res) => res.json())
      .then((data) => setCar(data))
  }, [params.id])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (data: any) => {
    const response = await fetch(`/api/cars/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/')
    } else {
      console.error('Failed to update car')
    }
  }

  const handleDelete = async () => {
    const response = await fetch(`/api/cars/${params.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      router.push('/')
    } else {
      console.error('Failed to delete car')
    }
  }

  if (!car) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Car</h1>
      <CarForm initialData={car} onSubmit={handleUpdate} />
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
        Delete Car
      </button>
    </div>
  )
}