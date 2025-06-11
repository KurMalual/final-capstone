"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const EducationalVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/education/videos/")
      setVideos(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching videos:", error)
      setLoading(false)
    }
  }

  const categories = ["all", "planting", "harvesting", "pest_control", "irrigation", "livestock", "marketing"]

  const filteredVideos =
    selectedCategory === "all" ? videos : videos.filter((video) => video.category === selectedCategory)

  const openVideoModal = (video) => {
    setSelectedVideo(video)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  if (loading) {
    return (
      <div className="education-loading">
        <div className="loading-spinner"></div>
        <p>Loading educational content...</p>
      </div>
    )
  }

  return (
    <div className="educational-videos">
      <div className="education-header">
        <h2>Educational Videos</h2>
        <p>Learn modern farming techniques and best practices</p>
      </div>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div className="videos-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-card" onClick={() => openVideoModal(video)}>
              <div className="video-thumbnail">
                {video.thumbnail ? (
                  <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} />
                ) : (
                  <div className="default-thumbnail">
                    <span className="play-icon">▶️</span>
                  </div>
                )}
                <div className="video-duration">{video.duration || "5:00"}</div>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <div className="video-meta">
                  <span className="category">{video.category?.replace("_", " ")}</span>
                  <span className="views">{video.views || 0} views</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-videos">
            <span className="no-videos-icon">📹</span>
            <p>No educational videos available in this category.</p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedVideo.title}</h3>
              <button className="close-btn" onClick={closeVideoModal}>
                ×
              </button>
            </div>
            <div className="video-player">
              {selectedVideo.video_url ? (
                <video controls width="100%" height="400">
                  <source src={selectedVideo.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <p>Video not available</p>
                </div>
              )}
            </div>
            <div className="video-details">
              <p>{selectedVideo.description}</p>
              <div className="video-tags">
                <span className="tag">{selectedVideo.category?.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EducationalVideos
