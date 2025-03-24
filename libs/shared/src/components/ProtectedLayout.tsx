"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// List halaman yang tidak butuh proteksi
const PUBLIC_ROUTES = ["/login", "/register", "/about"];

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token");

            // Jika halaman yang dikunjungi bukan public route & user belum login, redirect ke login
            if (!PUBLIC_ROUTES.includes(pathname) && !token) {
                router.push("/login");
            } else {
                setIsLoaded(true);
            }
        };

        checkAuth(); // Cek auth saat pertama kali mount

        // Listen perubahan localStorage
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "access_token" && !event.newValue) {
                router.push("/login"); // Redirect jika token dihapus
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [pathname, router]);

    if (!isLoaded) return null;

    return children;
};

export default ProtectedRoutes;
