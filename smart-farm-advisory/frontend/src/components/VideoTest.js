"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const VideoTest = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Fetching videos...")
        const response = await axios.get("http://localhost:8000/api/education/videos/")
        console.log("API Response:", response)
        setVideos(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (loading) return <div>Loading videos...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Video Test Component</h2>
      <p>Found {videos.length} videos</p>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <strong>{video.title}</strong> - {video.category_name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VideoTest
