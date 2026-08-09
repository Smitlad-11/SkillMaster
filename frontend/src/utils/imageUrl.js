export const getImageUrl = (image) => {
  if (!image) return '';

  // Cloudinary URL
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // Fallback for old local paths
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');

  return `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;
};