'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Car {
  id: string
  title: string
  description: string
  images: string[]
  carType: string
  company: string
  dealer: string
}

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    fetch('/api/cars')
      .then((res) => res.json())
      .then((data) => setCars(data))
  }, [])

  console.log(cars);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map((car) => (
        <div key={car.id} className="border p-4 rounded">
          <h2 className="text-xl font-bold">{car.title}</h2>
          <p>{car.description}</p>
          <p>Type: {car.carType}</p>
          <p>Company: {car.company}</p>
          <p>Dealer: {car.dealer}</p>
          <Link href={`/cars/${car.id}`} className="text-blue-500">
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}