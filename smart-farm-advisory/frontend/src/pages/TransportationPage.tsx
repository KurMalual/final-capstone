"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"

interface Product {
  id: number
  name: string
  price: number
  unit: string
  image: string
}

const TransportationPage = () => {
  const [userRole, setUserRole] = useState<string>("farmer") // Default to farmer

  // Sample products for demonstration
  const products: Product[] = [
    {
      id: 1,
      name: "Sorghum",
      price: 15,
      unit: "bag",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png",
    },
    {
      id: 2,
      name: "Groundnuts",
      price: 24,
      unit: "bag",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png",
    },
  ]

  const handleOrder = (productId: number) => {
    console.log(`Ordering product ${productId}`)
    // Implement order functionality
    alert(`Product ordered successfully!`)
  }

  const handleRequestTransport = () => {
    console.log("Requesting transport")
    // Implement transport request functionality
    alert("Transport request submitted successfully!")
  }

  const handleUploadTruck = () => {
    console.log("Uploading truck")
    // Implement truck upload functionality
    alert("Truck uploaded successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Transportation</h1>

            {userRole === "farmer" && (
              <button
                onClick={handleRequestTransport}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Request Transport
              </button>
            )}

            {userRole === "transporter" && (
              <button
                onClick={handleUploadTruck}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Upload Truck
              </button>
            )}
          </div>

          {userRole === "farmer" && (
            <>
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Products for Transport</h2>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-4 py-4">
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                          ${product.price} per {product.unit}
                        </p>
                        <button
                          onClick={() => handleOrder(product.id)}
                          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">Transport Requests</h2>
                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    <li>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-green-600 truncate">Sorghum - 10 bags</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">From: Juba To: Yei</p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Requested on 25 May 2024</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {userRole === "transporter" && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Available Transport Jobs</h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-green-600 truncate">Sorghum - 10 bags</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Available
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">From: Juba To: Yei (120 km)</p>
                        </div>
                        <button className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          Accept Job
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-green-600 truncate">Groundnuts - 15 bags</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Available
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">From: Yei To: Juba (120 km)</p>
                        </div>
                        <button className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          Accept Job
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TransportationPage
