"use client"

import { useState } from "react"

const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const onError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return <img src={imgSrc || "/placeholder.svg"} alt={alt} onError={onError} {...props} />
}

export default ImageWithFallback
