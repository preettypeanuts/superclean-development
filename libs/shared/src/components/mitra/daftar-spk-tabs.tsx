import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../ui-components/src/components/ui/tabs";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";


// Dummy data
const pekerjaanBerlangsung = [
  {
    id: 1,
    nama: "Dewi Gita Putri",
    nomorTransaksi: "TRX-001",
    alamat: "Jl. Cimandiri No.1A, Citarum, Kec...",
    tanggal: "20/03/2025",
    waktu: "10:00 WIB",
    status: "Menunggu Diproses",
    statusColor: "text-secondaryColorDark"
  },
  {
    id: 2,
    nama: "Dewi Gita Putri",
    nomorTransaksi: "TRX-002",
    alamat: "Jl. Cimandiri No.1A, Citarum, Kec...",
    tanggal: "20/03/2025",
    waktu: "10:00 WIB",
    status: "Menunggu Diproses",
    statusColor: "text-secondaryColorDark"
  },
  {
    id: 3,
    nama: "Dewi Gita Putri",
    nomorTransaksi: "TRX-003",
    alamat: "Jl. Cimandiri No.1A, Citarum, Kec...",
    tanggal: "20/03/2025",
    waktu: "10:00 WIB",
    status: "Menunggu Diproses",
    statusColor: "text-secondaryColorDark"
  },
  {
    id: 4,
    nama: "Dewi Gita Putri",
    nomorTransaksi: "TRX-004",
    alamat: "Jl. Cimandiri No.1A, Citarum, Kec...",
    tanggal: "20/03/2025",
    waktu: "10:00 WIB",
    status: "Menunggu Diproses",
    statusColor: "text-secondaryColorDark"
  },
  {
    id: 5,
    nama: "Dewi Gita Putri",
    nomorTransaksi: "TRX-005",
    alamat: "Jl. Cimandiri No.1A, Citarum, Kec...",
    tanggal: "20/03/2025",
    waktu: "10:00 WIB",
    status: "Menunggu Diproses",
    statusColor: "text-secondaryColorDark"
  },
  {
    id: 6,
    nama: "Dewi Gita Putri",
    nomorTransaksi: "TRX-006",
    alamat: "Jl. Cimandiri No.1A, Citarum, Kec...",
    tanggal: "20/03/2025",
    waktu: "10:00 WIB",
    status: "Menunggu Diproses",
    statusColor: "text-secondaryColorDark"
  }
];

const riwayatPekerjaan = [
  {
    id: 7,
    nama: "Ahmad Subagyo",
    nomorTransaksi: "TRX-007",
    alamat: "Jl. Sudirman No.15, Jakarta Pusat, DKI...",
    tanggal: "15/03/2025",
    waktu: "14:30 WIB",
    status: "Selesai",
    statusColor: "text-green-600"
  },
  {
    id: 8,
    nama: "Siti Nurhaliza",
    nomorTransaksi: "TRX-008",
    alamat: "Jl. Merdeka No.25, Bandung, Jawa Barat...",
    tanggal: "12/03/2025",
    waktu: "09:15 WIB",
    status: "Selesai",
    statusColor: "text-green-600"
  },
  {
    id: 9,
    nama: "Budi Santoso",
    nomorTransaksi: "TRX-009",
    alamat: "Jl. Pahlawan No.8, Surabaya, Jawa Timur...",
    tanggal: "10/03/2025",
    waktu: "11:45 WIB",
    status: "Dibatalkan",
    statusColor: "text-red-600"
  }
];

// Task Card Component
const TaskCard = ({ task }) => {
  return (
    <div className="w-full bg-white p-3 rounded-lg border">
      <div className="grid grid-cols-5 pb-3 border-b border-bottom-dash">
        <div className="col-span-4">
          <h1 className="text-[20px] font-semibold mb-1">
            {task.nama}
          </h1>
          <div className="text-[14px] text-gray-600 space-y-1">
            <p className="text-orange-600 font-medium">
              Nomor Transaksi : {task.nomorTransaksi}
            </p>
            <p className="truncate">
              Alamat: {task.alamat}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <div className="w-[45px] h-[45px] aspect-square bg-mainColor flex items-center justify-center rounded-md">
            <div
              className="w-10 h-10 bg-white"
              style={{
                mask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
                WebkitMask: "url(/assets/SC_LogoOnlyBig.png) no-repeat center / contain",
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-[14px] pt-3">
        <div className="flex truncate items-center gap-1 text-gray-600">
          <AiFillCalendar />
          <p>{task.tanggal}</p>
        </div>
        <div className="flex truncate items-center gap-1 text-gray-600">
          <AiFillClockCircle />
          <p>{task.waktu}</p>
        </div>
        <div className={`flex truncate items-center gap-1 ${task.statusColor}`}>
          <BsClipboard2CheckFill />
          <p>{task.status}</p>
        </div>
      </div>
    </div>
  );
};

export const DaftarSPKTabs = () => {
  return (
    <main className="flex items-center justify-center mx-5 relative !-mt-7">
      <Tabs defaultValue="account" className="flex flex-col items-center justify-center w-full">
        <TabsList className="bg-[#F0FAF9] w-full">
          <TabsTrigger className="w-full text-[16px]" value="account">Pekerjaan Berlangsung</TabsTrigger>
          <TabsTrigger className="w-full text-[16px]" value="password">Riwayat Pekerjaan</TabsTrigger>
        </TabsList>
        <TabsContent className="!mt-0 w-full" value="account">
          <div className="w-full space-y-3">
            {pekerjaanBerlangsung.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
        <TabsContent className="!mt-0 w-full" value="password">
          <div className="w-full space-y-3">
            {riwayatPekerjaan.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}