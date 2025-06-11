"use client"

import { useState, useEffect } from "react"
import { productsService } from "../services/api"
import Navbar from "../components/Navbar"
import { Search } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  unit: string
  image: string
  seller: {
    id: number
    username: string
  }
}

const MarketplacePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsService.getProducts()
        setProducts(response.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // If API is not available, use sample data
  useEffect(() => {
    if (loading) {
      // Sample data for demonstration
      const sampleProducts = [
        {
          id: 1,
          name: "Sorghum",
          price: 15,
          unit: "bag",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png",
          seller: { id: 1, username: "farmer1" },
        },
        {
          id: 2,
          name: "Groundnuts",
          price: 24,
          unit: "bag",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png",
          seller: { id: 2, username: "farmer2" },
        },
        {
          id: 3,
          name: "Maize",
          price: 18,
          unit: "bag",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png",
          seller: { id: 3, username: "farmer3" },
        },
        {
          id: 4,
          name: "Beans",
          price: 22,
          unit: "bag",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png",
          seller: { id: 4, username: "farmer4" },
        },
      ]

      setProducts(sampleProducts)
      setLoading(false)
    }
  }, [loading])

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleOrder = (productId: number) => {
    console.log(`Ordering product ${productId}`)
    // Implement order functionality
    alert(`Product ordered successfully!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Marketplace</h1>

            <div className="mt-4 md:mt-0 relative rounded-md shadow-sm max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* Product Categories */}
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Product Listings</h2>

                {filteredProducts.length === 0 ? (
                  <p className="mt-4 text-gray-500">No products found matching your search.</p>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
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
                          <p className="mt-1 text-sm text-gray-500">Seller: {product.seller.username}</p>
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
                )}
              </div>

              {/* Equipment for Hire Section */}
              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">Equipment for Hire</h2>
                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    <li>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-green-600 truncate">Tractor</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Per day
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">Available in Juba</p>
                          </div>
                          <button className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Hire
                          </button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-green-600 truncate">Harvester</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Per day
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">Available in Yei</p>
                          </div>
                          <button className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Hire
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default MarketplacePage
