import { LucidePlus } from "lucide-react";
import { RiCake2Fill } from "react-icons/ri";
export const BirthdayReminder = () => {
    return (
        <section>
            <div className="bg-secondaryColor dark:bg-secondaryColorDark text-[#0569A2] dark:text-[#c0e1ff] px-2 py-2 rounded-lg flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                    <p>
                        <RiCake2Fill />
                    </p>
                    <p className="text-sm">
                        Pengingat Ulang Tahun!
                    </p>
                    <div className="w-7 h-[1px] bg-neutral-500 dark:bg-neutral-400"></div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                        <h1>
                            Andi Saputra
                        </h1>
                        <p>
                            - 10 Mei 2025
                        </p>
                    </div>
                </div>
                <button className="cursor-pointer flex justify-end rotate-45 text-xs text-neutral-600 dark:text-neutral-300">
                    <LucidePlus className="!text-xs" />
                </button>
            </div>

        </section>
    )
}