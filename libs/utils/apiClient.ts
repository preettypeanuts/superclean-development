const API_BASE_URL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:3000";

// Fungsi utama API client
export const apiClient = async (
    endpoint: string,
    { method = "GET", body, headers, ...customConfig }: RequestInit = {}
) => {
    try {
        // Ambil token dari localStorage
        const accessToken = localStorage.getItem("access_token");

        // Headers default
        const defaultHeaders: HeadersInit = {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };

        // Opsi fetch
        const config: RequestInit = {
            method,
            headers: { ...defaultHeaders, ...headers },
            ...(body && { body: JSON.stringify(body) }),
            ...customConfig,
        };

        // Request ke API
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();

        // Jika token kadaluarsa, handle logout
        if (response.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/login"; // Redirect ke login
            throw new Error("Session expired, please login again.");
        }

        // Jika error dari server, lempar error
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
export const api = {
    get: (endpoint: string, config: RequestInit = {}) => apiClient(endpoint, { method: "GET", ...config }),
    post: (endpoint: string, body: any, config: RequestInit = {}) => apiClient(endpoint, { method: "POST", body, ...config }),
    put: (endpoint: string, body: any, config: RequestInit = {}) => apiClient(endpoint, { method: "PUT", body, ...config }),
    patch: (endpoint: string, body: any, config: RequestInit = {}) => apiClient(endpoint, { method: "PATCH", body, ...config }),
    delete: (endpoint: string, config: RequestInit = {}) => apiClient(endpoint, { method: "DELETE", ...config }),
};
