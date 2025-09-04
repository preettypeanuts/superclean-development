"use client"
import Image from "next/image";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "libs/ui-components/src/hooks/use-toast";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const { toast } = useToast();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError("Username dan password harus diisi");
            setIsLoading(false);
            return;
        }

        try {
            console.log("API URL:", process.env.NEXT_PUBLIC_APIURL);

            const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/auth/login-mitra`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ 
                    username: username.trim(), 
                    password: password.trim() 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login gagal!");
            }

            const accessToken = result?.data?.access_token;

            if (!accessToken) {
                throw new Error("Access token tidak ditemukan!");
            }

            // Simpan token ke localStorage
            localStorage.setItem("access_token", accessToken);

            // Show success toast
            toast({
                title: "Login Berhasil",
                description: "Selamat datang kembali!",
                variant: "default",
            });

            // Redirect ke dashboard
            router.push("/");

        } catch (err: unknown) {
            console.error("Login error:", err);
            
            let errorMessage = "Terjadi kesalahan saat login";
            
            if (err instanceof Error) {
                // Handle specific error messages
                if (err.message.includes("401") || err.message.includes("Unauthorized")) {
                    errorMessage = "Username atau password salah";
                } else if (err.message.includes("Network") || err.message.includes("fetch")) {
                    errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda";
                } else {
                    errorMessage = err.message;
                }
            }
            
            setError(errorMessage);
            
            toast({
                title: "Login Gagal",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input changes and clear errors
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (error) setError(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (error) setError(null);
    };

    const isFormValid = username.trim().length > 0 && password.trim().length > 0;

    return (
        <main className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <Image
                fill
                src="/assets/bg.jpg"
                alt="Background"
                className="object-cover"
                priority
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Login Form Container */}
            <div className="absolute bottom-0 left-0 right-0">
                <div className="text-white mb-4 px-8 space-y-2 ">
                    <div className="w-[56px] h-[56px] aspect-square bg-mainColor flex items-center justify-center mb-2">
                        <div
                            className="w-full h-full bg-white"
                            style={{
                                mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                                WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                            }}
                        ></div>
                    </div>
                    <h1 className="text-2xl font-semibold">
                        Login
                    </h1>
                    <p className="text-base">
                        Silakan masuk untuk melanjutkan.
                    </p>
                </div>
                
                <div className="bg-white w-full h-auto pb-20 rounded-t-xl p-8 shadow-2xl max-w-md mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="username"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Nama Akun
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Masukkan nama akun Anda"
                                value={username}
                                onChange={handleUsernameChange}
                                disabled={isLoading}
                                className={`h-12 border-gray-300 focus:border-mainColor focus:ring-mainColor placeholder:text-gray-400 ${
                                    error ? "border-red-300" : ""
                                }`}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Kata Sandi
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan kata sandi Anda"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    disabled={isLoading}
                                    className={`h-12 pr-12 border-gray-300 focus:border-mainColor focus:ring-mainColor placeholder:text-gray-400 ${
                                        error ? "border-red-300" : ""
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5" />
                                    ) : (
                                        <EyeOff className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="mt-5 w-full h-10 bg-mainColor hover:bg-mainDark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Masuk...
                                </>
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}