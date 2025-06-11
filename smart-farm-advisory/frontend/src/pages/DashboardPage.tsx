"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import Navbar from "../components/Navbar"
import { weatherService } from "../services/api"
import { Sun, Cloud, CloudRain, Leaf, ShoppingBag, Tractor, Truck } from "lucide-react"

interface WeatherData {
  temperature: number
  condition: string
  location: string
}

const DashboardPage = () => {
  const { user } = useUser()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Default to Juba if no specific location
        const response = await weatherService.getWeather("Juba")
        setWeather(response.data)
      } catch (error) {
        console.error("Error fetching weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
      return <Sun className="h-12 w-12 text-yellow-400" />
    } else if (conditionLower.includes("rain")) {
      return <CloudRain className="h-12 w-12 text-blue-400" />
    } else {
      return <Cloud className="h-12 w-12 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.first_name || user?.username}!</h1>

          {/* Weather Card */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Current Weather</h3>
              {loading ? (
                <div className="mt-2 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading weather data...</span>
                </div>
              ) : weather ? (
                <div className="mt-2 flex items-center">
                  {getWeatherIcon(weather.condition)}
                  <div className="ml-4">
                    <div className="text-3xl font-bold">{weather.temperature}°C</div>
                    <div className="text-gray-500">{weather.condition}</div>
                    <div className="text-sm text-gray-500">{weather.location}</div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500">Weather data unavailable</div>
              )}
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/dashboard"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Farmer Dashboard</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Manage Products</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/marketplace"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Marketplace</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Buy & Sell</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/equipment"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Tractor className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Equipment</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Rent & Hire</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/transportation"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Transportation</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Request Transport</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* My Listings Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">My Listings</h2>
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
                        <p className="flex items-center text-sm text-gray-500">Equipment</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Added on 27 May 2024</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-green-600 truncate">Sorghum</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          $15 per bag
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">Product</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Added on 25 May 2024</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
