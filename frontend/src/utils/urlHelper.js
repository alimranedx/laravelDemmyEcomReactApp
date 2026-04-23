/**
 * Generates the correct URL for product images from the Laravel backend.
 * Handles absolute URLs, relative paths with/without storage prefix, and placeholders.
 */
export const getImageUrl = (source, size = '400x300') => {
  if (!source) return `https://via.placeholder.com/${size}?text=No+Data`;
  
  // If source is a string, it's a path. If it's an object, we look for image_path.
  let imgPath = typeof source === 'string' ? source : (source.image_path ?? '');
  
  if (!imgPath) {
    return `https://via.placeholder.com/${size}?text=No+Image`;
  }

  if (imgPath.startsWith('http')) {
    return imgPath;
  }

  // Handle standard Laravel storage paths
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
