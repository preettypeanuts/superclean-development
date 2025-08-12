import { BsArrowLeft } from "react-icons/bs";

export const PageBanner = () => {
    return (
        <main >
            <section className="w-full h-[147px] bg-gradient-to-r from-mainColor from-10% to-mainDark to-110% rounded-b-2xl flex items-center relative">
                <div className="mx-5 w-full grid grid-cols-3">
                    <div>
                        <button className="w-[30px] h-[30px] bg-white/80 rounded-lg flex items-center justify-center">
                            <BsArrowLeft size={20} color="#30635D" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="text-[20px] font-medium text-white text-center">
                            Daftar SPK
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}