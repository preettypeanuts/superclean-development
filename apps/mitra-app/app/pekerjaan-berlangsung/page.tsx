"use client";

import { PageBanner } from "@shared/components/mitra/page-banner";
import { CheckIcon, ChevronDown, ChevronUp, PenLine, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";

type Task = {
  date: string;
  time: string;
  status: string;
  isCurrent?: boolean;
};

type Item = {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export const TaskTimelineItem = ({ task }: { task: Task }) => {
  const [isOpen, setIsOpen] = useState(false);

  const itemList: Item[] = [
    { id: 1, name: "Cuci Sofa", quantity: 1, price: 20000 },
    { id: 2, name: "Cuci Bantal", quantity: 1, price: 20000 },
    { id: 3, name: "Cuci Kasur", quantity: 1, price: 30000 },
  ]

  return (
    <li className="mb-10 ms-4 flex">
      <div className="">
        <div className="absolute w-3 h-3 bg-mainColor rounded-full mt-1.5 -start-1.5  dark:border-mainDark dark:bg-mainDark flex items-center justify-center">
          {/* check icon */}
          <CheckIcon className="text-white" />
        </div>
        {/* outer cirle dotted */}
        <div className="absolute w-3 h-3 rounded-full mt-[3.25px] -start-[9.5px] border border-mainColor dark:border-mainDark bg-transparent p-2"></div>
      </div>
      <div className="flex-1">
        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">({task.date} - {task.time})</time>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.status}</h3>
        {
          isOpen && (
            <>

              {/* top divider */}
              <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>

              {/* additional details */}

              <div className="mt-2 text-sm text-gray-600">
                {/* preview information */}
                <p className="my-4 font-medium">Jadwal pengerjaan yang harus diselesaikan</p>
                <p className="font-bold text-base text-black">Alamat</p>
                <p className="mt-3 text-sm font-medium mb-4">Jl. Cimanuk No.1A, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115</p>

                {/* item list */}
                <div>
                  {/* item list header */}
                  <div className="flex">
                    <p className="flex-1 font-semibold text-black text-base">List Item Pengerjaan:</p>
                    <p onClick={() => {
                      // todo: open modal to add new item
                    }}
                      className="flex text-blue-500 font-semibold text-base">+ <span className="underline ml-1">Tambah Item</span></p>
                  </div>

                  {/* item list content */}
                  <div className="mt-3">
                    {itemList.map((item) => (
                      <div className="py-2 flex justify-center items-center">
                        <p className="flex flex-1 gap-1">
                          <span>1x </span> -
                          <span className="max-w-[120px] block overflow-hidden whitespace-nowrap text-ellipsis"> Cuci Sofa</span> -
                          <span> Rp. 20.000 </span>
                        </p>

                        <div className="flex">
                          <button className="text-red-500 p-2 mx-2 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors">
                            <Trash2Icon className="w-4 h-4" />
                          </button>

                          <button className="text-blue-600 p-2 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition-colors">
                            <PenLine className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* action button */}
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors">
                    Mulai Pengerjaan
                  </button>
                </div>
              </div>

              {/* bottom divider */}
              <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>
            </>
          )
        }
      </div>

      <div className="">
        {/* dropdown chevron */}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" onClick={() => setIsOpen(!isOpen)} />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" onClick={() => setIsOpen(!isOpen)} />
        )}
      </div>
    </li>
  )
}


export const TaskTimeline = ({ tasks }: { tasks: Task[] }) => {
  const currentTask = tasks.find(task => task.isCurrent);
  const currentIndex = tasks.indexOf(currentTask!);

  return (
    <ol className="relative border-s border-black/40 dark:border-gray-700">
      {tasks.map((task, index) => (
        <TaskTimelineItem key={index} task={task} />
      ))}
    </ol>
  );
}

export default function PekerjaanBerlangsung() {
  const tasks: Task[] = [
    { date: "20/03/2025", time: "10:00 WIB", status: "Terjadwal", isCurrent: true },
    { date: "20/03/2025", time: "11:00 WIB", status: "Dalam Proses Pengerjaan", isCurrent: false },
    { date: "20/03/2025", time: "12:00 WIB", status: "Selesai", isCurrent: false },
  ];

  return (
    <main className="pb-[20vh] relative">
      <PageBanner
        title="Pekerjaan Berlangsung"
      />
      <div className="bg-white dark:bg-slate-800 mx-4 rounded-md -m-8 z-30 relative">
        {/* preview */}
        <div>
          {/* summary */}
          <div className="flex items-center justify-between p-4">
            {/* left content */}
            <div className="mr-4">
              <p className="text-lg">Dewi Gita Putri</p>
              <p className="text-sm">Nomor Transaksi: TRX-005</p>
              <p className="text-sm line-clamp-1">Alamat: Jl. Raya No. 123 TEETETETET TEETETETET TEETETETET TEETETETET TEETETETET TEETETETET</p>
            </div>

            {/* right content */}
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-mainColor flex items-center justify-center rounded-md">
                <div className="w-10 h-10">
                  <img src="/assets/mitra-icon.png" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>

          {/* map */}
          <div className="flex w-full px-4 max-h-48 justify-between">
            <img src="/assets/sample-map.png" className="rounded-lg w-full object-cover" alt="" />
          </div>

          {/* divider */}
          <div className="grid grid-cols-5 pb-3 border-b border-bottom-dash border-gray-500"></div>

          {/* Dates and status */}
          <div className="flex mt-4 text-sm justify-around">
            <div className="flex items-center gap-1">
              <AiFillCalendar />
              <p>20/03/2025</p>
            </div>
            <div className="flex items-center gap-1">
              <AiFillClockCircle />
              <p>10:00 WIB</p>
            </div>
            <div className="flex items-center gap-1 text-[#0369A1]">
              <BsClipboard2CheckFill />
              <p>Menunggu Proses</p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 mx-4 bg-mainColor/20 p-2 rounded-md">
          <div className="flex space-x-3">
            <button className="py-[5px] px-3 font-medium bg-white text-black dark:bg-mainColor dark:text-white rounded-md">Detail</button>
            <button className="py-[5px] px-3 font-medium bg-slate-400/10 dark:bg-gray-700 rounded-md">Riwayat</button>
            <button className="py-[5px] px-3 font-medium bg-slate-400/10 dark:bg-gray-700 rounded-md">Foto</button>
          </div>
        </div>

        {/* content */}
        <div className="mt-6 p-4">
          <p>Status Pengerjaan</p>

          <TaskTimeline tasks={tasks} />
        </div>
      </div>


    </main>
  );
}
