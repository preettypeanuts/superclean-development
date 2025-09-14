const API_BASE_URL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:3000";

// Fungsi utama API client
export const apiFormdataClient = async (
  endpoint: string,
  { method = "GET", body, headers, ...customConfig }: RequestInit = {}
) => {
  try {
    // Ambil token dari localStorage
    const accessToken = localStorage.getItem("access_token");

    // Headers default
    const defaultHeaders: HeadersInit = {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };


    // Request ke API
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body,
      ...customConfig,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Fungsi khusus untuk metode HTTP tertentu
export const apiFormdata = {
  post: (endpoint: string, body: any, config: RequestInit = {}) => apiFormdataClient(endpoint, { method: "POST", body, ...config }),
  put: (endpoint: string, body: any, config: RequestInit = {}) => apiFormdataClient(endpoint, { method: "PUT", body, ...config }),
  patch: (endpoint: string, body: any, config: RequestInit = {}) => apiFormdataClient(endpoint, { method: "PATCH", body, ...config }),
};
