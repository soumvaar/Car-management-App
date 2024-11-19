'use client'

import { useRouter } from 'next/navigation'
import CarForm from '../../components/CarForm'

export default function NewCar() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/')
    } else {
      console.error('Failed to create car')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Add New Car</h1>
      <CarForm onSubmit={handleSubmit} />
    </div>
  )
}