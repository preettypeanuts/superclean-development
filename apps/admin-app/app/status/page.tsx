import { HeaderMobile } from "@shared/components/Header";
import { WrapperMobile } from "@shared/components/Wrapper";
import { FaRegCheckCircle } from "react-icons/fa";
export default function StatusPage() {
  return (
    <>
      <HeaderMobile label="Pembayaran" />
      <WrapperMobile className="space-y-5 flex items-center justify-center">
        <div className="w-full h-[80vh] bg-green-50 rounded-lg px-2 py-20 flex flex-col gap-2 items-center justify-center">
          <div className="p-3 bg-green-200 rounded-full">
            <div className="p-3 bg-green-300/70 rounded-full">
              <FaRegCheckCircle className="text-green-700" size={30} />
            </div>
          </div>
          <h1 className="text-green-700 font-bold text-xl">
            Selesai
          </h1>
          <p className="text-neutral-500 text-xs text-center">
            Terima kasih sudah menggunakan layanan kami dan telah memberikan rating
          </p>
        </div>
      </WrapperMobile>
    </>
  );
}
