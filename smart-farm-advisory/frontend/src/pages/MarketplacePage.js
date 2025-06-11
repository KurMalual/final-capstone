"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

const MarketplacePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: "Sorghum",
          price: 15,
          unit: "bag",
          quantity: 50,
          category: "grains",
          seller: "John Farmer",
          location: "Juba",
          image: "🌾",
          description: "High quality sorghum, freshly harvested",
          rating: 4.8,
          reviews: 24,
        },
        {
          id: 2,
          name: "Groundnuts",
          price: 24,
          unit: "bag",
          quantity: 30,
          category: "nuts",
          seller: "Mary Producer",
          location: "Yei",
          image: "🥜",
          description: "Premium groundnuts, perfect for processing",
          rating: 4.9,
          reviews: 18,
        },
        {
          id: 3,
          name: "Maize",
          price: 18,
          unit: "bag",
          quantity: 75,
          category: "grains",
          seller: "Peter Farmer",
          location: "Wau",
          image: "🌽",
          description: "Yellow maize, excellent for animal feed",
          rating: 4.7,
          reviews: 32,
        },
        {
          id: 4,
          name: "Beans",
          price: 22,
          unit: "bag",
          quantity: 40,
          category: "legumes",
          seller: "Sarah Grower",
          location: "Juba",
          image: "🫘",
          description: "Organic beans, rich in protein",
          rating: 4.6,
          reviews: 15,
        },
        {
          id: 5,
          name: "Sesame Seeds",
          price: 35,
          unit: "bag",
          quantity: 20,
          category: "seeds",
          seller: "David Farmer",
          location: "Bentiu",
          image: "🌰",
          description: "Premium sesame seeds for export",
          rating: 4.9,
          reviews: 12,
        },
        {
          id: 6,
          name: "Cassava",
          price: 12,
          unit: "bag",
          quantity: 60,
          category: "tubers",
          seller: "Grace Producer",
          location: "Yei",
          image: "🍠",
          description: "Fresh cassava roots, ready for processing",
          rating: 4.5,
          reviews: 28,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const categories = [
    { value: "all", label: "All Products", icon: "🛒" },
    { value: "grains", label: "Grains", icon: "🌾" },
    { value: "nuts", label: "Nuts", icon: "🥜" },
    { value: "legumes", label: "Legumes", icon: "🫘" },
    { value: "seeds", label: "Seeds", icon: "🌰" },
    { value: "tubers", label: "Tubers", icon: "🍠" },
  ]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
        default:
          return b.id - a.id
      }
    })

  const handleOrder = (product) => {
    alert(`Order placed for ${product.name}! The seller will contact you soon.`)
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Marketplace 🛒
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Discover fresh agricultural products from local farmers
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            {/* Search */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  backgroundColor: "white",
                }}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  outline: "none",
                  backgroundColor: "white",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "6px solid #e5e7eb",
                borderTop: "6px solid #16a34a",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem",
              }}
            ></div>
            <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.5rem", color: "#1f2937", marginBottom: "0.5rem" }}>No products found</h3>
            <p style={{ color: "#6b7280" }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOrder={handleOrder} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const ProductCard = ({ product, onOrder }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
      transition: "all 0.3s",
      border: "1px solid #f1f5f9",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)"
      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)"
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
    }}
  >
    {/* Product Image */}
    <div
      style={{
        height: "200px",
        background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "4rem",
        position: "relative",
      }}
    >
      {product.image}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: "white",
          padding: "0.5rem 0.75rem",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          color: "#16a34a",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        ⭐ {product.rating}
      </div>
    </div>

    {/* Product Info */}
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "0.5rem",
          }}
        >
          {product.name}
        </h3>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: "1.5" }}>{product.description}</p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#16a34a",
            }}
          >
            ${product.price}
          </span>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>per {product.unit}</span>
        </div>
        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          📦 {product.quantity} {product.unit}s available
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "0.9rem" }}>👤</span>
          <span style={{ fontSize: "0.9rem", color: "#374151" }}>{product.seller}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem" }}>📍</span>
          <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>{product.location}</span>
        </div>
      </div>

      <button
        onClick={() => onOrder(product)}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #16a34a, #22c55e)",
          color: "white",
          border: "none",
          padding: "0.875rem",
          borderRadius: "10px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-1px)"
          e.target.style.boxShadow = "0 6px 20px rgba(22, 163, 74, 0.3)"
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)"
          e.target.style.boxShadow = "none"
        }}
      >
        Order Now 🛒
      </button>
    </div>
  </div>
)

export default MarketplacePage
