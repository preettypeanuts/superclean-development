"use client";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { SiCcleaner } from "react-icons/si";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";

interface FormField {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
}

interface AuthLayoutProps {
    form: FormField[];
    headline: string,
    tagline: string,
    bgImage: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ form, headline, tagline, bgImage }) => {
    const [visibleInputs, setVisibleInputs] = useState<Record<string, boolean>>({});

    const toggleVisibility = (id: string) => {
        setVisibleInputs((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle hanya input yang diklik
        }));
    };

    return (
        <section className="w-full md:h-screen md:max-h-screen">
            <div className="flex md:flex-row flex-col h-full relative">
                {/* Background Image */}
                <div className="hidden md:block relative w-full h-full">
                    <Image
                        className="object-cover w-full md:h-full h-[30lvh] absolute"
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
                    <div className="absolute left-5 bottom-5 z-20">
                        <p className="text-xl text-white font-medium drop-shadow-xl">
                            Sistem yang dirancang untuk memudahkan pekerjaan Anda
                        </p>
                    </div>
                </div>

                {/* Gradient */}
                <div className="hidden md:block absolute inset-0 w-full h-full bg-gradient-to-l dark:from-black dark:via-black/30 from-white via-white/50 to-transparent"></div>

                {/* Register Form */}
                <div className="md:absolute flex justify-center items-center min-h-screen right-0 w-full md:w-[40lvw] h-full md:rounded-l-[30px] bg-lightColor dark:bg-darkColor md:px-12 px-5 py-10">
                    <div className="flex flex-col justify-center w-full h-full ">

                        {/* Header */}
                        <div className="md:pb-5 flex flex-col items-center md:items-start justify-center">
                            <SiCcleaner className="mb-3 md:mb-5 text-7xl md:text-5xl text-mainColor" />
                            <h1 className="text-xl md:text-3xl font-medium text-mainColor">
                                {headline}
                            </h1>
                            <p className="text-sm text-center">
                                {tagline}
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            className="w-full"
                        >
                            {form.map((el, idx) => (
                                <div key={idx}>
                                    {el.type === "password" ? (
                                        <>
                                            <div className="label">
                                                <span className="text-neutral-500/80 text-xs">{el.label}</span>
                                            </div>
                                            <label className="input flex items-center gap-2 bg-baseLight/15 w-full rounded-xl">
                                                <input
                                                    type={visibleInputs[el.name] ? "text" : "password"}
                                                    className="grow placeholder:text-sm"
                                                    required={el.required}
                                                    placeholder={el.placeholder}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleVisibility(el.name)}
                                                    className="text-xl text-gray-500"
                                                >
                                                    {visibleInputs[el.name] ? <IoMdEyeOff /> : <IoMdEye />}
                                                </button>
                                            </label>
                                        </>
                                    ) : (
                                        <label className="form-control w-full my-2">
                                            <div className="label">
                                                <span className="text-neutral-500/80 text-xs">{el.label}</span>
                                            </div>
                                            <input
                                                type={el.type}
                                                required={el.required}
                                                placeholder={el.placeholder}
                                                className="input bg-baseLight/15 w-full rounded-xl placeholder:text-sm"
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}

                            {/* Register Button */}
                            <div className="mt-8">
                                <button className="btn w-full rounded-xl bg-mainColor text-white">Register</button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center justify-center opacity-60 my-5">
                            <div className="w-full h-px bg-neutral-500"></div>
                            <span className="px-3 text-neutral-500 text-sm font-medium">Or</span>
                            <div className="w-full h-px bg-neutral-500"></div>
                        </div>

                        {/* Google Login */}
                        <div className="w-full">
                            <button className="btn border-0 rounded-xl dark:border-neutral-500 w-full bg-white dark:bg-black dark:text-white">
                                <FcGoogle className="text-2xl" />
                                Lanjutkan dengan Google
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
