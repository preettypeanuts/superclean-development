import { AiFillHome } from "react-icons/ai";

export const NavigationBar = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full h-[90px] bg-mainColor flex items-center justify-evenly">
            <button className="flex flex-col items-center justify-center">
                <AiFillHome size={26} />
                <p className="text-[14px]">
                    Home
                </p>
            </button>
              <button className="flex flex-col items-center justify-center">
                <AiFillHome size={26} />
                <p className="text-[14px]">
                    Home
                </p>
            </button>
              <button className="flex flex-col items-center justify-center">
                <AiFillHome size={26} />
                <p className="text-[14px]">
                    Home
                </p>
            </button>
        </nav>
    )
}