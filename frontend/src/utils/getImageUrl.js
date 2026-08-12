const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // Cloudinary / any absolute URL
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://')
  ) {
    return imagePath;
  }

  // Backend URL without /api
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const backendUrl = apiUrl.replace(/\/api\/?$/, '');

  // Legacy local uploads
  if (imagePath.startsWith('/uploads/')) {
    return `${backendUrl}${imagePath}`;
  }

  // If path doesn't start with /
  return `${backendUrl}/${imagePath}`;
};

export default getImageUrl;