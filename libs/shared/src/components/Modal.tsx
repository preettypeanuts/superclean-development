import { IoMdClose } from "react-icons/io";
import { Button } from "../../../ui-components/src/components/ui/button"
import { ReactNode } from "react";
interface ModalProps {
    id: string;
    children: ReactNode;
    className?: string;
}
export const Modal = ({ id, children, className }: ModalProps) => {
    return (
        <dialog id={id} className="modal modal-bottom sm:modal-middle -top-5">
            <div className={`${className} modal-box bg-lightColor dark:bg-darkColor`}>
                {children}
            </div>
            <div className="modal-action absolute -top-4 right-2">
                <form method="dialog">
                    <Button variant={"destructive"} size={"icon"} className="text-2xl rounded-full"><IoMdClose size={16} /></Button>
                </form>
            </div>
        </dialog>
    )
}