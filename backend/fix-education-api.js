const fs = require("fs")
const path = require("path")

console.log("=== Fixing Frontend Education API ===\n")

// Fix API config
try {
  const apiConfigPath = path.join(__dirname, "src", "config", "api.js")
  console.log(`Checking API config at: ${apiConfigPath}`)

  if (fs.existsSync(apiConfigPath)) {
    let content = fs.readFileSync(apiConfigPath, "utf8")

    // Replace education endpoints - remove extra "api/" in the path
    content = content.replace(
      /EDUCATION:\s*{[^}]*}/,
      `EDUCATION: {
    VIDEOS: \`\${API_BASE_URL}/api/education/videos/\`,
    CATEGORIES: \`\${API_BASE_URL}/api/education/categories/\`,
  }`,
    )

    fs.writeFileSync(apiConfigPath, content)
    console.log("✅ Updated API config")
  } else {
    console.log("❌ API config file not found")
  }
} catch (error) {
  console.error("Error updating API config:", error)
}

// Fix FarmerDashboard
try {
  const dashboardPath = path.join(__dirname, "src", "pages", "FarmerDashboard.js")
  console.log(`Checking FarmerDashboard at: ${dashboardPath}`)

  if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, "utf8")

    // Replace hardcoded URLs with API_ENDPOINTS
    content = content.replace(
      /const categoriesResponse = await axios\.get$$"http:\/\/localhost:8000\/api\/education\/categories\/"$$/g,
      "const categoriesResponse = await axios.get(API_ENDPOINTS.EDUCATION.CATEGORIES)",
    )

    content = content.replace(
      /const videosUrl = selectedCategory\s*\?\s*`http:\/\/localhost:8000\/api\/education\/videos\/\?category=\${selectedCategory}`\s*:\s*"http:\/\/localhost:8000\/api\/education\/videos\/"/g,
      "const videosUrl = selectedCategory ? `${API_ENDPOINTS.EDUCATION.VIDEOS}?category=${selectedCategory}` : API_ENDPOINTS.EDUCATION.VIDEOS",
    )

    content = content.replace(
      /axios\.post$$`http:\/\/localhost:8000\/api\/education\/videos\/\${video\.id}\/view\/`$$/g,
      "axios.post(`${API_ENDPOINTS.EDUCATION.VIDEOS}${video.id}/view/`)",
    )

    fs.writeFileSync(dashboardPath, content)
    console.log("✅ Updated FarmerDashboard")
  } else {
    console.log("❌ FarmerDashboard file not found")
  }
} catch (error) {
  console.error("Error updating FarmerDashboard:", error)
}

console.log("\nDone! Please restart your frontend development server.")
