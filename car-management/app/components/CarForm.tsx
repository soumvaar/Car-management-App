'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

const CarSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  carType: z.string().min(1, 'Car type is required').max(50, 'Car type must be 50 characters or less'),
  company: z.string().min(1, 'Company is required').max(50, 'Company must be 50 characters or less'),
  dealer: z.string().min(1, 'Dealer is required').max(50, 'Dealer must be 50 characters or less'),
})

type CarFormData = z.infer<typeof CarSchema>

interface CarFormProps {
  initialData?: CarFormData & { id: string; images: string[] }
  onSubmit: (data: CarFormData & { images: string[] }) => void
}

export default function CarForm({ initialData, onSubmit }: CarFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || [])

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    register,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(CarSchema),
    defaultValues: initialData,
  })

  const handleFormSubmit = (data: CarFormData) => {
    onSubmit({ ...data, images })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = (result: any) => {
    const newImage = result.info.secure_url
    setImages((prevImages) => [...prevImages, newImage])
  }

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Other form fields remain unchanged */}
      
      <div>
        <label className="block mb-1">Images</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`Car image ${index + 1}`}
                width={96}
                height={96}
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {images.length < 10 && (
          <CldUploadWidget
            uploadPreset="your_cloudinary_upload_preset"
            onUpload={handleImageUpload}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Upload Image
              </button>
            )}
          </CldUploadWidget>
        )}
        {images.length >= 10 && (
          <p className="text-yellow-600">Maximum number of images (10) reached.</p>
        )}
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Update Car' : 'Add Car'}
      </button>
    </form>
  )
}