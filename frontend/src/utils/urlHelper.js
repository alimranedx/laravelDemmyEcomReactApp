/**
 * Generates the correct URL for product images from the Laravel backend.
 * Handles absolute URLs, relative paths with/without storage prefix, and placeholders.
 */
export const getImageUrl = (prod, size = '400x300') => {
  if (!prod || !prod.image_path) return `https://via.placeholder.com/${size}?text=No+Data`;
  const imgPath = prod.image_path ?? '';
  
  if (!imgPath) {
    return `https://via.placeholder.com/${size}?text=No+Image`;
  }

  if (imgPath.startsWith('http')) {
    return imgPath;
  }

  // Handle standard Laravel storage paths
  // If the path starts with 'products/', we need to prepend '/storage/'
  // If it already starts with '/storage' or 'storage', we just ensure it has the base URL
  let cleanPath = imgPath;
  
  if (!cleanPath.startsWith('storage') && !cleanPath.startsWith('/storage')) {
    cleanPath = `storage/${cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath}`;
  }

  // Ensure leading slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }

  return `http://localhost:8000${cleanPath}`;
};

export const getPlaceholder = (size = '400x300', text = 'No+Image') => {
  return `https://via.placeholder.com/${size}?text=${text}`;
};
