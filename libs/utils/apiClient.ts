const API_BASE_URL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:3000";

// List endpoint yang tidak memerlukan token authentication
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register", 
  "/auth/forgot-password",
  "/auth/reset-password",
  "/invoice", // untuk public invoice endpoints
  "/rating",
  "/public", // general public endpoints
];

// Function to check if endpoint is public
const isPublicEndpoint = (endpoint: string): boolean => {
  return PUBLIC_ENDPOINTS.some(publicEndpoint => 
    endpoint.startsWith(publicEndpoint)
  );
};

// Function to check if we're on a public route (client-side)
const isPublicRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const pathname = window.location.pathname;
  const publicRoutes = ["/login", "/register", "/about", "/rating"];
  
  // Check static public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Check if it's any invoice route
  if (pathname.startsWith("/invoice")) {
    return true;
  }
  
  return false;
};

// Fungsi utama API client
export const apiClient = async (
  endpoint: string,
  { method = "GET", body, headers, requireAuth = true, ...customConfig }: RequestInit & { requireAuth?: boolean } = {}
) => {
  try {
    // Determine if this endpoint needs authentication
    const needsAuth = requireAuth && !isPublicEndpoint(endpoint);
    const isOnPublicRoute = isPublicRoute();
    
    // Ambil token dari localStorage hanya jika diperlukan
    let accessToken = null;
    if (needsAuth || !isOnPublicRoute) {
      accessToken = localStorage.getItem("access_token");
    }

    // Headers default
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Tambahkan Authorization header hanya jika ada token dan diperlukan
    if (accessToken && needsAuth) {
      (defaultHeaders as any).Authorization = `Bearer ${accessToken}`;
    }

    // Opsi fetch
    const config: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
      ...(body && { body: JSON.stringify(body) }),
      ...customConfig,
    };

    // Request ke API
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    let result: any;

    if (response.status !== 204) {
      result = await response.json();

      if (!response?.ok) {
        // Handle unauthorized error differently for public routes
        if (response.status === 401 && isOnPublicRoute) {
          console.warn("Unauthorized request on public route - this might be expected");
          // Don't throw error for public routes, just return the error result
          return { error: true, message: result.message || "Unauthorized", status: 401 };
        }
        
        throw new Error(result.message || "Something went wrong");
      }
    }

    return result;
  } catch (error) {
    // Suppress console error for expected auth failures on public routes
    if (isPublicRoute() && error instanceof Error && error.message.includes("Unauthorized")) {
      console.warn("Auth error on public route (expected):", error.message);
      return { error: true, message: error.message, status: 401 };
    }
    
    console.error("API Error:", error);
    throw error;
  }
};

// Fungsi khusus untuk metode HTTP tertentu
export const api = {
  get: (endpoint: string, config: RequestInit & { requireAuth?: boolean } = {}) => 
    apiClient(endpoint, { method: "GET", ...config }),
    
  post: (endpoint: string, body: any, config: RequestInit & { requireAuth?: boolean } = {}) => 
    apiClient(endpoint, { method: "POST", body, ...config }),
    
  put: (endpoint: string, body: any, config: RequestInit & { requireAuth?: boolean } = {}) => 
    apiClient(endpoint, { method: "PUT", body, ...config }),
    
  patch: (endpoint: string, body: any, config: RequestInit & { requireAuth?: boolean } = {}) => 
    apiClient(endpoint, { method: "PATCH", body, ...config }),
    
  delete: (endpoint: string, config: RequestInit & { requireAuth?: boolean } = {}) => 
    apiClient(endpoint, { method: "DELETE", ...config }),

  // Fungsi khusus untuk public endpoints
  public: {
    get: (endpoint: string, config: RequestInit = {}) => 
      apiClient(endpoint, { method: "GET", requireAuth: false, ...config }),
      
    post: (endpoint: string, body: any, config: RequestInit = {}) => 
      apiClient(endpoint, { method: "POST", body, requireAuth: false, ...config }),
      
    put: (endpoint: string, body: any, config: RequestInit = {}) => 
      apiClient(endpoint, { method: "PUT", body, requireAuth: false, ...config }),
      
    patch: (endpoint: string, body: any, config: RequestInit = {}) => 
      apiClient(endpoint, { method: "PATCH", body, requireAuth: false, ...config }),
      
    delete: (endpoint: string, config: RequestInit = {}) => 
      apiClient(endpoint, { method: "DELETE", requireAuth: false, ...config }),
  }
};
