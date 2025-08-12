import { BsArrowRight } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export const TotalRating = () => {
    return (
        <main className="mx-5 space-y-3">
            <section className="w-full flex items-center justify-between">
                <p className="text-[20px] font-medium tracking-tight">
                    Total Rating
                </p>
                <button className="text-[22px] w-[34px] h-[34px] flex items-center justify-center rounded-full bg-mainColor/20 text-mainDark">
                    <BsArrowRight />
                </button>
            </section>
            <section className="">
                <div className="flex items-center gap-3 border border-b-0 p-2 rounded-t-lg">
                    <div className="flex items-center justify-center w-[64px] h-[64px] rounded-lg bg-[#F2C66733]">
                        <div className="w-[53px] h-[53px] flex items-center justify-center rounded-md bg-[#F2C66733]">
                            <AiFillStar className="text-yellow-400 text-4xl" />
                        </div>
                    </div>
                    <div className="space-y-1 flex-1">
                        <p className="text-[16px]">
                            Rating
                        </p>
                        <div className="flex items-center justify-between">
                            <h1 className="text-[18px] font-bold">
                                4/5
                            </h1>
                            <div className="flex items-center gap-2">
                                <AiFillStar className="text-yellow-400 text-[25px]" />
                                <AiFillStar className="text-yellow-400 text-[25px]" />
                                <AiFillStar className="text-yellow-400 text-[25px]" />
                                <AiFillStar className="text-yellow-400 text-[25px]" />
                                <AiOutlineStar className="text-[25px] text-muted-foreground" />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-1 bg-[#74CA94] text-white rounded-b-lg border border-t-0">
                    <p>
                        Ayo semangattt, dikit lagi nilai kamu sempurna! 
                    </p>
                </div>
            </section>
        </main>
    )
}