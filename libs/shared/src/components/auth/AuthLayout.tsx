"use client";
import Image from "next/image";
import { SiCcleaner } from "react-icons/si";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk router di client

interface AuthLayoutProps {
    headline: string,
    tagline: string,
    bgImage: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ headline, tagline, bgImage }) => {
    const [visibleInputs, setVisibleInputs] = useState<Record<string, boolean>>({});
    const [username, serUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const toggleVisibility = (id: string) => {
        setVisibleInputs((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle hanya input yang diklik
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            console.log("API URL:", process.env.NEXT_PUBLIC_APIURL);

            const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || "Login gagal!");
            }
    
            // Ambil access_token dari result.data.access_token
            const accessToken = result?.data?.access_token;
    
            if (!accessToken) {
                throw new Error("Access token tidak ditemukan!");
            }
    
            // Simpan token ke localStorage
            localStorage.setItem("access_token", accessToken);

            // Redirect ke dashboard
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <section className="w-full h-screen max-h-screen">
            <div className="flex md:flex-row flex-col h-full relative">
                {/* Background Image */}
                <div className="absolute w-full h-full">
                    <Image
                        className="block object-cover w-full md:h-full h-[30lvh] absolute"
                        src={bgImage}
                        alt="Background"
                        fill
                        priority
                    />
                    <div className="absolute top-5 left-5 z-20">
                        <p className="flex gap-2 items-center text-white font-medium text-2xl">
                            <SiCcleaner className="text-3xl" />
                            Superclean
                        </p>
                    </div>
                </div>

                {/* Register Form */}
                <div className="absolute flex justify-center items-center md:top-2 md:bottom-2 bottom-0 md:right-2 w-full md:w-[35lvw] h-auto md:flex-grow md:rounded-3xl rounded-t-3xl bg-white/65 dark:bg-black/65 shadow-custom backdrop-blur-xl md:px-12 px-5 py-10 border border-white/20 dark:border-neutral-500/50">
                    <div className="flex flex-col justify-center w-full h-full">
                        {/* Header */}
                        <div className="md:pb-5 flex flex-col items-start justify-center">
                            <h1 className="text-2xl md:text-3xl font-medium text-mainColor dark:brightness-100 brightness-75">
                                {headline}
                            </h1>
                            <p className="text-sm">{tagline}</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="w-full">
                            {error && (
                                <p className="text-red-500 text-sm mb-2">{error}</p>
                            )}

                            <label className="form-control w-full my-2">
                                <div className="label">
                                    <span className="text-neutral-500/80 text-xs">Username</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => serUsername(e.target.value)}
                                    placeholder="Masukkan username anda"
                                    className="input bg-baseDark/30 dark:bg-baseLight/15 placeholder:text-neutral-200 dark:placeholder:text-neutral-500 w-full rounded-xl placeholder:text-sm"
                                />
                            </label>

                            <div className="label">
                                <span className="text-neutral-500/80 text-xs">Password</span>
                            </div>
                            <label className="input flex items-center gap-2 bg-baseDark/30 dark:bg-baseLight/15 w-full rounded-xl">
                                <input
                                    type={visibleInputs["password"] ? "text" : "password"}
                                    className="grow placeholder:text-neutral-200 dark:placeholder:text-neutral-500 placeholder:text-sm"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password anda"
                                    name="password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("password")}
                                    className="text-xl text-neutral-200 dark:text-neutral-500"
                                >
                                    {visibleInputs["password"] ? <IoMdEyeOff /> : <IoMdEye />}
                                </button>
                            </label>

                            <div className="mt-8">
                                <button className="btn w-full rounded-xl border-none bg-mainColor text-white">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
