"use client";
import Image from "next/image";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk router di client
import { refetchUserProfile } from "../../../../utils/useUserProfile";


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


            const accessToken = result?.data?.access_token;

            if (!accessToken) {
                throw new Error("Access token tidak ditemukan!");
            }

            // Simpan token ke localStorage
            localStorage.setItem("access_token", accessToken);

            // Redirect ke dashboard
            refetchUserProfile()
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
        <section className="w-full h-screen max-h-screen relative">
            <div className="absolute w-full h-full">
                {/* Background Image */}
                <Image
                    className="block object-cover w-full md:h-full h-[30lvh] absolute"
                    src={bgImage}
                    alt="Background"
                    fill
                    priority
                />
            </div>
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                {/* Login Form */}
                <div className="rounded-xl w-full max-w-xl bg-white/50 dark:bg-black/50 shadow-mainShadow backdrop-blur-lg md:px-12 px-5 py-10 border border-white/20 dark:border-neutral-500/50">
                    <div className="flex flex-col justify-center w-full h-full">
                        {/* Header */}
                        <div className="md:pb-5 flex flex-col items-center text-center justify-center">
                            <Image
                                width={100}
                                height={100}
                                src={"/assets/SC_LogoOnlyBig.png"}
                                alt="LogoSC"
                                className="w-[80px] h-[80px] object-cover p-1 bg-white/70 dark:bg-black/70 rounded-lg mb-5"
                            />
                            <h1 className="text-2xl md:text-3xl font-bold text-mainColor brightness-105 dark:brightness-100">
                                {headline}
                            </h1>
                            <p className="text-sm">{tagline}</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="w-full">
                            {error && (
                                <p className="text-red-500 text-sm mb-2">{"Username atau password salah"}</p>
                            )}

                            <label className="form-control w-full my-2">
                                <div className="label">
                                    <span className="text-neutral-700/80 dark:text-neutral-300/90 font-medium text-base">Username</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => serUsername(e.target.value)}
                                    placeholder="Masukkan Username Anda"
                                    className="input bg-white dark:bg-black placeholder:text-neutral-400 dark:placeholder:text-neutral-600 w-full rounded-lg placeholder:text-sm"
                                />
                            </label>

                            <div className="label">
                                <span className="text-neutral-700/80 dark:text-neutral-300/90 font-medium text-base">Password</span>
                            </div>
                            <label className="input flex items-center gap-2 bg-white dark:bg-black w-full rounded-lg">
                                <input
                                    type={visibleInputs["password"] ? "text" : "password"}
                                    className="grow placeholder:text-neutral-400 dark:placeholder:text-neutral-600 placeholder:text-sm"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan Password Anda"
                                    name="password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("password")}
                                    className="text-xl text-[#B4B4B4]"
                                >
                                    {visibleInputs["password"] ? <IoMdEyeOff /> : <IoMdEye />}
                                </button>
                            </label>

                            <div className="mt-8">
                                <button className="btn w-full rounded-lg border-none bg-mainColor text-white">
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
