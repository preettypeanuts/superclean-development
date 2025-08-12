import { AiFillInfoCircle, AiFillStar, AiOutlineStar } from "react-icons/ai";

export const TipWidget = () => {
    return (
        <main className="mx-5">
            <section className="w-full h-full bg-gradient-to-b from-mainColor to-mainDark rounded-lg p-2 space-y-2">
                <div className="w-full flex items-center justify-between">
                    <p className="font-[400] text-[12px] text-white">
                        Total Uang Tip - Juni 2024
                    </p>
                    <AiFillInfoCircle className="text-white" />
                </div>
                <h1 className="font-semibold text-2xl text-white">
                    Rp 95.000
                </h1>
                <div className="w-full h-[1px] bg-white/40"></div>
                <div className="space-y-2">
                    <p className="font-[400] text-[12px] text-white">
                        Total Poin
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AiFillStar className="text-yellow-400 text-[25px]" />
                            <AiFillStar className="text-yellow-400 text-[25px]" />
                            <AiFillStar className="text-yellow-400 text-[25px]" />
                            <AiFillStar className="text-yellow-400 text-[25px]" />
                            <AiOutlineStar className="text-[25px] text-muted" />
                        </div>
                        <p className="font-bold text-[16px] text-white">
                            4/5
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}