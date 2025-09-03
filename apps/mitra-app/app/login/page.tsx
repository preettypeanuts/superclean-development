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