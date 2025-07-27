// Utility function to handle image URLs from backend
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If the path already starts with http, return as-is (already full URL)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If the path starts with /media/, prepend the backend base URL
  if (imagePath.startsWith('/media/')) {
    return `https://final-capstone-jm3o.onrender.com${imagePath}`;
  }
  
  // If it's just a filename or relative path, assume it's in media folder
  return `https://final-capstone-jm3o.onrender.com/media/${imagePath}`;
};

export default getImageUrl;
