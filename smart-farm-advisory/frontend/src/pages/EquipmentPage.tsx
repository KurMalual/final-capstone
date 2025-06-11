"use client"

import { useState, useEffect } from "react"
import { equipmentService } from "../services/api"
import Navbar from "../components/Navbar"
import { Tractor, Check, X } from "lucide-react"

interface Equipment {
  id: number
  name: string
  type: string
  rate: string
  location: string
  owner: {
    id: number
    username: string
  }
  available: boolean
}

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>("farmer") // Default to farmer

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentService.getEquipment()
        setEquipment(response.data)
      } catch (error) {
        console.error("Error fetching equipment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  // If API is not available, use sample data
  useEffect(() => {
    if (loading) {
      // Sample data for demonstration
      const sampleEquipment = [
        {
          id: 1,
          name: "Tractor",
          type: "Heavy Machinery",
          rate: "Per day",
          location: "Juba",
          owner: { id: 1, username: "John Doe" },
          available: true,
        },
        {
          id: 2,
          name: "Tractor",
          type: "Heavy Machinery",
          rate: "Per day",
          location: "Yei",
          owner: { id: 2, username: "Jane Smith" },
          available: true,
        },
        {
          id: 3,
          name: "Harvester",
          type: "Heavy Machinery",
          rate: "Per day",
          location: "Juba",
          owner: { id: 3, username: "Bob Johnson" },
          available: false,
        },
      ]

      setEquipment(sampleEquipment)
      setLoading(false)
    }
  }, [loading])

  const handleHire = (equipmentId: number) => {
    console.log(`Hiring equipment ${equipmentId}`)
    // Implement hire functionality
    alert(`Equipment hire request submitted!`)
  }

  const handleApprove = (equipmentId: number) => {
    console.log(`Approving equipment request ${equipmentId}`)
    // Implement approve functionality
    alert(`Equipment request approved!`)
  }

  const handleReject = (equipmentId: number) => {
    console.log(`Rejecting equipment request ${equipmentId}`)
    // Implement reject functionality
    alert(`Equipment request rejected!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {userRole === "equipment_seller" ? "Equipment Dashboard" : "Equipment"}
            </h1>

            {userRole === "farmer" && (
              <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Request Equipment
              </button>
            )}

            {userRole === "equipment_seller" && (
              <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Add New Equipment
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {userRole === "farmer" && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900">Available Equipment</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {equipment
                      .filter((e) => e.available)
                      .map((item) => (
                        <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <Tractor className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{item.type}</p>
                                <p className="mt-1 text-sm text-gray-500">Location: {item.location}</p>
                                <p className="mt-1 text-sm text-gray-500">Rate: {item.rate}</p>
                                <p className="mt-1 text-sm text-gray-500">Owner: {item.owner.username}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <button
                                onClick={() => handleHire(item.id)}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Hire Equipment
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {userRole === "equipment_seller" && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900">Equipment Requests</h2>
                  <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      <li>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-600 truncate">Tractor</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">Requested by: John Doe</p>
                            </div>
                            <div className="mt-2 flex space-x-2 sm:mt-0">
                              <button
                                onClick={() => handleApprove(1)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(1)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-600 truncate">Tractor</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">Requested by: Jane Smith</p>
                            </div>
                            <div className="mt-2 flex space-x-2 sm:mt-0">
                              <button
                                onClick={() => handleApprove(2)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(2)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default EquipmentPage
