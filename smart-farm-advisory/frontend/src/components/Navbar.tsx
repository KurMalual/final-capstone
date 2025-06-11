"use client"

import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { Leaf } from "lucide-react"

interface NavbarProps {
  transparent?: boolean
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  const { user, isAuthenticated, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav
      className={`px-4 py-3 flex items-center justify-between ${transparent ? "bg-transparent" : "bg-white shadow-sm"}`}
    >
      <Link to="/" className="flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-600" />
        <span className="font-semibold text-lg">Smart Farm Connect</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-green-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-green-600">
          About
        </Link>

        {isAuthenticated ? (
          <>
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-green-600">
                {user?.first_name || user?.username}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Log in
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
