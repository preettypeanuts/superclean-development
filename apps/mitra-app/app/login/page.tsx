"use client"
import Image from "next/image";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = () => {
        // Handle login logic here
        console.log("Login attempt:", { username, password });
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <Image
                fill
                src="https://images.unsplash.com/photo-1522918279596-eb92d4d75259?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Background"
                className="object-cover"
                priority
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Login Form Container */}
            <div className="absolute bottom-0 left-0 right-0 bg-white w-full h-auto pb-20 rounded-t-xl p-8 shadow-2xl">
                <div className="max-w-md mx-auto">
                    <div className="flex flex-col gap-4">
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
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-12 border-gray-300 focus:border-mainColor focus:ring-maincborder-mainColor placeholder:text-gray-400"
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 pr-12 border-gray-300 focus:border-mainColor focus:ring-maincborder-mainColor placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                            onClick={handleSubmit}
                            disabled={!username || !password}
                            className="mt-5 w-full h-10 bg-mainColor hover:bg-mainDark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            Masuk
                        </button>

                    </div>
                </div>
            </div>
        </main>
    );
}