"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// List halaman yang tidak butuh proteksi
const PUBLIC_ROUTES = ["/login", "/register", "/about", "/invoice", "/rating"];

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const validateToken = async (): Promise<boolean> => {
        const token = localStorage.getItem("access_token");
        
        if (!token) {
            return false;
        }

        try {
            const response = await fetch('https://murafly.my.id/auth/whoAmI', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                return !!userData; // Return true jika ada user data
            } else {
                // Token tidak valid atau expired
                localStorage.removeItem("access_token");
                return false;
            }
        } catch (error) {
            console.error('Error validating token:', error);
            // Jika ada error network, anggap token tidak valid untuk keamanan
            localStorage.removeItem("access_token");
            return false;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            // Jika halaman ini adalah public route, langsung load
            if (PUBLIC_ROUTES.includes(pathname)) {
                setIsLoaded(true);
                setIsAuthenticated(false);
                return;
            }

            // Untuk protected routes, validasi token
            const isValid = await validateToken();
            
            if (isValid) {
                setIsAuthenticated(true);
                setIsLoaded(true);
            } else {
                setIsAuthenticated(false);
                setIsLoaded(true);
                router.push("/login");
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Listen untuk perubahan localStorage
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "access_token") {
                if (!event.newValue) {
                    // Token dihapus
                    setIsAuthenticated(false);
                    if (!PUBLIC_ROUTES.includes(pathname)) {
                        router.push("/login");
                    }
                } else {
                    // Token baru ditambahkan, validasi ulang
                    validateToken().then((isValid) => {
                        setIsAuthenticated(isValid);
                        if (!isValid && !PUBLIC_ROUTES.includes(pathname)) {
                            router.push("/login");
                        }
                    });
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [pathname, router]);

    // Listen untuk perubahan token di tab yang sama
    useEffect(() => {
        const handleLocalStorageChange = () => {
            const token = localStorage.getItem("access_token");
            if (!token && !PUBLIC_ROUTES.includes(pathname)) {
                setIsAuthenticated(false);
                router.push("/login");
            }
        };

        // Polling sederhana untuk detect perubahan localStorage di tab yang sama
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem("access_token");
            if (!currentToken && isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
                setIsAuthenticated(false);
                router.push("/login");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated, pathname, router]);

    // Tampilkan loading atau konten
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Untuk public routes, selalu tampilkan children
    if (PUBLIC_ROUTES.includes(pathname)) {
        return children;
    }

    // Untuk protected routes, hanya tampilkan jika authenticated
    if (isAuthenticated) {
        return children;
    }

    // Jika tidak authenticated dan bukan public route, return null
    // (karena sudah redirect ke login)
    return null;
};

export default ProtectedRoutes;