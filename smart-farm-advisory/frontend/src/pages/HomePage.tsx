import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Leaf, ShoppingBag, Truck, Tractor } from "lucide-react"

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent />

      {/* Hero Section */}
      <div
        className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/protype1-v5wygAB5AN8M3NauxhQlSD2yA8tZaP.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto w-full py-20 bg-black bg-opacity-40 text-white px-6 rounded-lg">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6">
            Bridging the gap between
            <br />
            Farmers, Buyers, and Transporters
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">
            A comprehensive platform designed for South Sudan's agricultural ecosystem
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md">
              Get Started
            </Link>
            <Link to="/about" className="bg-white hover:bg-gray-100 text-green-600 font-semibold px-6 py-3 rounded-md">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <Link
              to="/dashboard"
              className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Farmer Dashboard</h3>
              <p className="text-gray-600">Manage your farm products and access services</p>
            </Link>

            <Link
              to="/marketplace"
              className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Marketplace</h3>
              <p className="text-gray-600">Buy and sell agricultural products</p>
            </Link>

            <Link
              to="/equipment"
              className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Tractor className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Equipment</h3>
              <p className="text-gray-600">Rent or list farming equipment</p>
            </Link>

            <Link
              to="/transportation"
              className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Transportation</h3>
              <p className="text-gray-600">Find transport for your products</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="font-semibold">Smart Farm Connect</span>
            </div>
            <div className="text-sm text-gray-500">&copy; 2025 Smart Farm Connect. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
