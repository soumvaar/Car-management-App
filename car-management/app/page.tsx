import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import CarList from './components/CarList'
import SearchBar from './components/SearchBar'

export default async function Home() {
  const { userId } = auth()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Car Management Application</h1>
      {userId ? (
        <>
          <Link href="/cars/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
            Add New Car
          </Link>
          <SearchBar />
          <CarList />
        </>
      ) : (
        <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign In
        </Link>
      )}
    </div>
  )
}