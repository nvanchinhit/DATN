// Cấu hình API URL động dựa trên giao thức của website
export const getApiUrl = () => {
  // Nếu có biến môi trường, sử dụng nó
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Nếu đang ở client-side, sử dụng protocol hiện tại của website
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol; // http: hoặc https:
    return `${protocol}//nvanchinhit.click`;
  }
  
  // Fallback cho server-side rendering
  return 'https://nvanchinhit.click';
};

export const API_URL = getApiUrl();

