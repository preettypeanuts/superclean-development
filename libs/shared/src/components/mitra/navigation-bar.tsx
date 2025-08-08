import { AiFillHome } from "react-icons/ai";
import { RiNotification4Fill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";

export const NavigationBar = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full h-[90px] shadow flex items-center justify-evenly backdrop-blur-xl bg-white/70 rounded-t-lg">
            <button className="flex flex-col gap-[4px] items-center justify-center text-muted-foreground">
                <AiFillHome size={26} />
                <p className="text-[14px]">
                    Home
                </p>
            </button>
              <button className="flex flex-col gap-[4px] items-center justify-center text-muted-foreground">
                <RiNotification4Fill size={26} />
                <p className="text-[14px]">
                    Notifikasi
                </p>
            </button>
              <button className="flex flex-col gap-[4px] items-center justify-center text-muted-foreground">
                <MdAccountCircle size={26} />
                <p className="text-[14px]">
                    Akun
                </p>
            </button>
        </nav>
    )
}