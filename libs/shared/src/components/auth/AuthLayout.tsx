"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Gunakan next/navigation untuk router di client
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from "../../../../ui-components/src/components/ui/button";
import { refetchUserProfile } from "../../../../utils/useUserProfile";


interface AuthLayoutProps {
  headline: string,
  tagline: string,
  bgImage: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ headline, tagline, bgImage }) => {
  const [visibleInputs, setVisibleInputs] = useState<Record<string, boolean>>({});
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showError, setShowError] = useState(false);

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

    if (loading) return; // Prevent multiple submissions

    try {
      setLoading(true);
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
      router.replace("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    finally {
      setLoading(false);
    }
  };

  // check for existing token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/"); // Redirect to dashboard if token exists
    }
  }, [router]);


  useEffect(() => {
    if (error) {
      setShowError(true);
    };
  }, [error]);

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
              {error && showError && (
                <div className="flex bg-red-400/10 border border-red-400/40 rounded-lg p-3 mt-2 items-center animate-fadeInDown dark:border-red-400/70 dark:bg-red-400/20">
                  <p className="text-red-500 text-sm">{"Username atau password salah"}</p>
                  <span className="ml-auto cursor-pointer" onClick={() => setShowError(false)}>✕</span>
                </div>
              )}

              <label className="form-control w-full my-2">
                <div className="label">
                  <span className="text-neutral-700/80 dark:text-neutral-300/90 font-medium text-base">Username</span>
                </div>
                <input
                  type="text"
                  required
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={(e) => {
                    setUsername(e.target.value.trim() ? e.target.value.trim() : "");
                  }}
                  placeholder="Masukkan Username Anda"
                  className="input bg-white dark:bg-black placeholder:text-neutral-400 dark:placeholder:text-neutral-600 w-full rounded-lg placeholder:text-sm"
                />
                {
                  username === "" ? (
                    <span className="text-red-500 text-sm mt-1">Username tidak boleh kosong</span>
                  ) : null
                }
              </label>

              <div className="label">
                <span className="text-neutral-700/80 dark:text-neutral-300/90 font-medium text-base">Password</span>
              </div>
              <label className="input flex items-center gap-2 bg-white dark:bg-black w-full rounded-lg">
                <input
                  type={visibleInputs["password"] ? "text" : "password"}
                  className="grow placeholder:text-neutral-400 dark:placeholder:text-neutral-600 placeholder:text-sm"
                  required
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => {
                    setPassword(e.target.value.trim() ? e.target.value.trim() : "");
                  }}
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

              {
                password === "" ? (
                  <span className="text-red-500 text-sm mt-1">Password tidak boleh kosong</span>
                ) : null
              }

              <div className="mt-8">
                {/* <button className="btn w-full rounded-lg border-none bg-mainColor text-white">
                                    Login
                                </button> */}
                <Button className="w-full rounded-lg border-none bg-mainColor text-white" variant="main" size="lg" type="submit" loading={loading} disabled={loading}>
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
