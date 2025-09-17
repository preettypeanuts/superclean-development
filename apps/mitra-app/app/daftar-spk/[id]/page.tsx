"use client";

import { PageBanner } from "@shared/components/mitra/page-banner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@ui-components/components/ui/select";
import { CheckIcon, ChevronDown, ChevronUp, LucideListFilter, PenLine, Trash2Icon, XIcon } from "lucide-react";
import { Dispatch, useContext, useEffect, useMemo, useState } from "react";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { Header } from "@shared/components/Header";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Service, useCategoryStore, usePromoLookup, useServiceLookup } from "libs/utils/useCategoryStore";
import { DialogDescription, DialogTitle } from "@ui-components/components/ui/dialog";
import { Input } from "@ui-components/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { formatRupiah } from "@shared/utils/formatRupiah";
import { Button } from "@ui-components/components/ui/button";
import Image from "next/image";
import { FaX } from "react-icons/fa6";
import { cn } from "@ui-components/utils";

type statusName = "pending" | "in_progress" | "completed";

type Task = {
  date: string;
  time: string;
  status: statusName;
  isCurrent?: boolean;
};

type Item = {
  id: number;
  category: string;
  service: string;
  quantity: number;
  price: number;
  type: "vakum" | "cuci";
  totalPrice: number;
}

type EditItemModalProps = {
  isOpen?: boolean;
  item: Item | null;
  handleEditItem: (item: Item) => void;
  onClose?: () => void;
};

const EditItemModal = ({ isOpen = false, item, onClose = () => { }, handleEditItem }: EditItemModalProps) => {
  const itemId = item?.id || 0;
  const isEdit = itemId > 0;

  const [formData, setFormData] = useState<Item>({
    id: item?.id || 0,
    category: item?.category || "",
    service: item?.service || "",
    quantity: item?.quantity || 1,
    type: item?.type || "vakum",
    price: item?.price || 0,
    totalPrice: item?.totalPrice || 0,
  });

  const handleChangeTable = (field: keyof Item, value: string | number) => {
    let type = formData.type;
    if (field === "category") {
      type = "vakum"; // Default type
      if (value === "GENERAL" || value === "BLOWER") {
        type = "cuci"; // Change type for these categories
      }

      setFormData((prev) => ({
        ...prev,
        category: value as string,
        type: type, // Set the type based on category
        service: "", // Reset service when category changes
        price: 0, // Reset price when category changes
      }));

      return;
    }


    if (field === "service") {
      const service = services.find((s) => s.serviceCode === value);
      if (service) {
        const price = type === "vakum" ? service.vacuumPrice : service.cleanPrice;
        console.log("Selected service:", service, "Price:", price);

        setFormData((prev) => ({
          ...prev,
          service: service.serviceCode,
          price: price,
        }));
      }

      return;
    }

    const serviceCode = formData.service
    const service = services.find((s) => s.serviceCode === serviceCode);

    if (field === 'type' && service) {
      const newType = value as "vakum" | "cuci"
      const price = newType === "vakum" ? service.vacuumPrice : service.cleanPrice;

      setFormData((prev) => ({
        ...prev,
        service: service.serviceCode,
        price: price,
        type: newType,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const { catLayananMapping, loading: loadingCat } = useCategoryStore();
  const { services, loading: loadingServices } = useServiceLookup(formData.category);
  const { promo, loading: loadingPromo, error: promoError } = usePromoLookup(formData.service, formData.quantity);

  const totals = useMemo(() => {
    // total price calculation
    const price = formData.price || 0
    const quantity = formData.quantity || 1;

    const totalPrice = quantity * price

    // total promo calculation
    const promoAmount = promo?.amount || 0
    const promoType = promo?.type || "Nominal"

    let totalPromo = 0;
    if (promoType === "Persentase") {
      totalPromo = (totalPrice * promoAmount) / 100;
    } else if (promoType === "Nominal") {
      totalPromo = promoAmount;
    }

    const endPrice = totalPrice - totalPromo;
    setFormData((prev) => ({
      ...prev,
      totalPrice: endPrice,
    }));

    return {
      totalPrice,
      totalPromo,
      endPrice
    }
  }, [formData.quantity, formData.price, promo]);

  const loading = useMemo(() => {
    return loadingCat || loadingServices || loadingPromo;
  }, [loadingCat, loadingServices, loadingPromo]);

  const isValid = useMemo(() => {
    return formData.category !== "" &&
      formData.service !== "" &&
      formData.quantity > 0 &&
      totals.endPrice >= 0;
  }, [formData, totals]);

  // reset form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: item?.id || 0,
        category: item?.category || "",
        service: item?.service || "",
        quantity: item?.quantity || 1,
        type: item?.type || "vakum",
        price: item?.price || 0,
        totalPrice: item?.totalPrice || 0,
      });
    }
  }, [isOpen, item]);

  return (
    <>
      <DialogWrapper
        className="w-10/12"
        open={isOpen}
        onOpenChange={onClose}
        headItem={
          <>
            <Header label={isEdit ? "Edit SPK" : "Tambah SPK Baru"} />
          </>
        }
      >
        <DialogTitle className="hidden" />
        <div className="mx-2">
          <div className="space-y-4">
            <div className=" space-y-2">
              <Label htmlFor="category" className="w-1/4">
                Kategori
              </Label>
              <Select
                onValueChange={(value) => handleChangeTable("category", value)}
                value={formData.category}
                disabled={loadingCat}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="z-[999]">
                  <SelectGroup>
                    <SelectLabel>Kategori</SelectLabel>
                    {loadingCat ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      Object.keys(catLayananMapping).map((key) => (
                        <SelectItem key={key} value={key}>
                          {catLayananMapping[key]}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="w-1/4 font-semibold">
                Layanan
              </Label>
              <Select
                onValueChange={(value) => handleChangeTable("service", value)}
                value={formData.service}
                disabled={loadingServices || !formData.category || formData.category === ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !formData.category
                        ? "Pilih kategori terlebih dahulu"
                        : loadingServices
                          ? "Loading..."
                          : "Pilih Layanan"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="z-[999]">
                  <SelectGroup>
                    <SelectLabel>Layanan</SelectLabel>
                    {loadingServices ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : services.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        Tidak ada layanan untuk kategori ini
                      </SelectItem>
                    ) : (
                      services.map((service) => (
                        <SelectItem key={service.serviceCode} value={service.serviceCode}>
                          {service.serviceName}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>

              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah" className="w-1/4 font-semibold">Jumlah</Label>
              <Input
                min={1}
                placeholder="Masukkan Jumlah"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChangeTable("quantity", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipe" className="w-[20%] font-semibold">Tipe</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => handleChangeTable("type", value)}
                className="flex items-center gap-5"
                disabled={(formData.category === "GENERAL" || formData.category === "BLOWER")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vakum" id="vakum" />
                  <Label htmlFor="vakum">Vakum</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cuci" id="cuci" />
                  <Label htmlFor="cuci">Cuci</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga" className="w-1/4 font-semibold">Harga</Label>
              <RupiahInput
                disabled
                placeholder="Rp. 0"
                value={formatRupiah(totals.totalPrice)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga" className="w-1/4 font-semibold">Promo</Label>
              <RupiahInput
                loading={loadingPromo}
                disabled
                placeholder="Rp. 0"
                value={formatRupiah(totals.totalPromo)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga" className="w-1/4 font-bold">Total</Label>
              <RupiahInput
                className="!bg-transparent !border-transparent font-bold text-lg text-black !opacity-100"
                disabled
                placeholder="Rp. 0"
                value={formatRupiah(totals.endPrice)}
              />
            </div>

          </div>
        </div>
        <div className="flex mt-6 gap-2 py-2">
          <Button
            className="flex-1" onClick={() => { onClose() }} variant="outline2">
            Kembali
          </Button>
          <Button
            className="flex-1"
            type="submit"
            variant="main"
            onClick={() => { onClose(); handleEditItem(formData); }}
            disabled={!isValid}
          >
            Simpan
          </Button>
        </div>
      </DialogWrapper>
    </>
  )
}


type DeleteItemModalProps = {
  isOpen: boolean;
  item: Item | null;
  handleDeleteItem: (item: Item) => void;
  onClose: () => void;
};

const DeleteItemModal = ({ isOpen, onClose, handleDeleteItem, item }: DeleteItemModalProps) => {
  return (
    <>
      <DialogWrapper
        className="w-10/12"
        open={isOpen}
        onOpenChange={onClose}
      >
        <div className="flex items-center justify-between">
          <div className="mx-auto items-center rounded-md justify-center p-4 bg-red-400/50">
            <div className="mx-auto items-center rounded-md justify-center p-2 bg-red-400/70">
              <Trash2Icon className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <DialogTitle className="text-center line-clamp-2 mx-10">Kamu yakin menghapus item?</DialogTitle>
        <div className="flex mt-4">
          <Button className="flex-1 mx-2" variant="outline2" onClick={onClose}>Batal</Button>
          <Button className="flex-1 mx-2" variant="destructive" onClick={() => { onClose(); handleDeleteItem(item as Item); }}>Hapus</Button>
        </div>
      </DialogWrapper>
    </>
  )
}

type JobCompletedModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const JobCompletedModal = ({ isOpen, onClose }: JobCompletedModalProps) => {
  return (
    <>
      <DialogWrapper
        className="w-10/12"
        open={isOpen}
        onOpenChange={onClose}
      >
        <div className="flex items-center justify-between">
          <img src="/assets/job-complete.png" className="w-full max-w-[50%] mx-auto" />
        </div>
        <DialogTitle className="text-center">Pekerjaan Selesai</DialogTitle>
        <DialogDescription className="text-center font-medium text-sm">
          Semua tugasmu telah berhasil diselesaikan.
          <br />
          Terima Kasih
        </DialogDescription>
        <div className="flex">
          <Button className="flex-1 mx-2" variant="main" onClick={onClose}>Kembali ke Dashboard</Button>
        </div>
      </DialogWrapper>
    </>
  )
}


export type TaskTimelineProps = {
  tasks: Task[];
  onEditItem?: (item?: Item) => void;
  onDeleteItem?: (item?: Item) => void;
};

const TimelineIcon = ({ taskIndex, currentTaskIndex }: { taskIndex: number; currentTaskIndex: number }) => {
  return <>
    {taskIndex > currentTaskIndex ? (
      <>
        <div className="absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 bg-gray-500 dark:border-gray-500 dark:bg-gray-500 flex items-center justify-center"></div>
        <div className="absolute w-3 h-3 rounded-full mt-[3.25px] -start-[9.5px] border border-gray-500 dark:border-gray-500 bg-transparent p-2"></div>
      </>
    ) : taskIndex === currentTaskIndex ? (
      <>
        <div className="absolute w-3 h-3 bg-orange-400 rounded-full mt-1.5 -start-1.5  dark:border-orange-400 dark:bg-orange-400 flex items-center justify-center"></div>
        <div className="absolute w-3 h-3 rounded-full mt-[3.25px] -start-[9.5px] border border-orange-400 dark:border-orange-400 bg-transparent p-2"></div>
      </>
    ) : (
      <>
        <div className="absolute w-3 h-3 bg-mainColor rounded-full mt-1.5 -start-1.5  dark:border-mainDark dark:bg-mainDark flex items-center justify-center">
          <CheckIcon className="text-white" />
        </div>
        <div className="absolute w-3 h-3 rounded-full mt-[3.25px] -start-[9.5px] border border-mainColor dark:border-mainDark bg-transparent p-2"></div>
      </>
    )}
  </>
}

const TimelineItemCompleted = ({
  task,
  currentTaskIndex = 0,
  completeTask = () => { }
}: {
  task: Task;
  currentTaskIndex: number;
  completeTask: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const TASK_INDEX = 2;
  const isOpenable = TASK_INDEX == currentTaskIndex;

  const [jobCompleted, setJobCompleted] = useState(false);

  return (
    <>
      <li className="mb-10 ms-4 flex">
        <div className="">
          <TimelineIcon taskIndex={TASK_INDEX} currentTaskIndex={currentTaskIndex} />
        </div>
        <div className="flex-1">
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">({task.date} - {task.time})</time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Selesai & Diterima Pelanggan</h3>
          {
            isOpen && (
              <>
                {/* top divider */}
                <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>

                {/* additional details */}
                <div>
                  <p className="text-sm mb-4">Jika pelanggan sudah puas dan pekerjaan sudah selesai, mohon untuk klik tombol <span>"Selesai"</span></p>

                  <div className="flex">
                    <Button className="flex-1 mx-2" variant="outline2" onClick={() => { }}>Kembali</Button>
                    <Button className="flex-1 mx-2" variant="main" onClick={() => {
                      setJobCompleted(true);
                      completeTask();
                      setIsOpen(false);
                    }}>Selesai</Button>
                  </div>
                </div>

              </>
            )
          }
        </div>

        <div className="">
          {/* dropdown chevron */}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" onClick={() => isOpenable && setIsOpen(!isOpen)} />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" onClick={() => isOpenable && setIsOpen(!isOpen)} />
          )}
        </div>
      </li>

      <JobCompletedModal
        isOpen={jobCompleted}
        onClose={() => setJobCompleted(false)}
      />

    </>
  );
}

const TimelineItemInProgress = ({
  task,
  itemList = [],
  onEditItem,
  onDeleteItem,
  currentTaskIndex = 0,
  completeTask = () => { }
}: {
  task: Task;
  itemList?: Item[];
  onEditItem: (item?: Item) => void;
  onDeleteItem: (item?: Item) => void;
  currentTaskIndex: number;
  completeTask: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const TASK_INDEX = 1;
  const isOpenable = TASK_INDEX == currentTaskIndex;

  return (
    <li className="mb-10 ms-4 flex">
      <div className="">
        <TimelineIcon taskIndex={TASK_INDEX} currentTaskIndex={currentTaskIndex} />
      </div>
      <div className="flex-1">
        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">({task.date} - {task.time})</time>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dalam Proses Pengerjaan</h3>
        {
          isOpen && (
            <>
              {/* top divider */}
              <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>

              {/* additional details */}
              <div className="mt-2 text-sm text-gray-600">
                {/* preview information */}
                <p className="my-4 font-medium">List item yang harus segera dikerjakan dan diselesaikan</p>
                <p className="font-bold text-base text-black">Alamat</p>
                <p className="mt-3 text-sm font-medium mb-4">Jl. Cimanuk No.1A, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115</p>

                {/* item list */}
                <div>
                  {/* item list header */}
                  <div className="flex">
                    <p className="flex-1 font-semibold text-black text-base">List Item Pengerjaan:</p>
                    <p onClick={() => {
                      onEditItem();
                    }}
                      className="flex text-blue-500 font-semibold text-base">+ <span className="underline ml-1">Tambah Item</span></p>
                  </div>

                  {/* item list content */}
                  <div className="mt-3">
                    {itemList.map((item, index) => {
                      const isOriginal = item.id !== 0; // Assuming id 0 is the original item

                      return (
                        <div key={index} className="py-2 flex justify-center items-center">
                          <p className="flex flex-1 gap-1">
                            <span>{item.quantity}x </span> -
                            <span className="max-w-[120px] block overflow-hidden whitespace-nowrap text-ellipsis"> {item.service}</span> -
                            <span> Rp. {item.totalPrice.toLocaleString()} </span>
                          </p>

                          {!isOriginal && (
                            <div className="flex">
                              <button onClick={() => onDeleteItem(item)} className="text-red-500 p-2 mx-2 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors">
                                <Trash2Icon className="w-4 h-4" />
                              </button>

                              <button onClick={() => onEditItem(item)} className="text-blue-600 p-2 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition-colors">
                                <PenLine className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* action button */}
                <div className="mt-4 flex justify-end">
                  <button onClick={() => { setIsOpen(false); completeTask(); }} className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors">
                    Pekerjaan Selesai
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
          <ChevronUp className="w-4 h-4 text-gray-400" onClick={() => isOpenable && setIsOpen(!isOpen)} />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" onClick={() => isOpenable && setIsOpen(!isOpen)} />
        )}
      </div>
    </li>
  );
}

const TimelineItemPending = ({
  task,
  itemList = [],
  onEditItem,
  onDeleteItem,
  currentTaskIndex = 0,
  completeTask = () => { }
}: {
  task: Task;
  itemList: Item[];
  onEditItem: (item?: Item) => void;
  onDeleteItem: (item?: Item) => void;
  currentTaskIndex: number;
  completeTask: () => void;
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const TASK_INDEX = 0;
  const isOpenable = TASK_INDEX == currentTaskIndex;

  return (
    <li className="mb-10 ms-4 flex">
      <div className="">
        <TimelineIcon taskIndex={TASK_INDEX} currentTaskIndex={currentTaskIndex} />
      </div>
      <div className="flex-1">
        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">({task.date} - {task.time})</time>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Terjadwal</h3>
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
                      onEditItem();
                    }}
                      className="flex text-blue-500 font-semibold text-base">+ <span className="underline ml-1">Tambah Item</span></p>
                  </div>

                  {/* item list content */}
                  <div className="mt-3">
                    {itemList.map((item, index) => {
                      return (
                        <div key={index} className="py-2 flex justify-center items-center">
                          <p className="flex flex-1 gap-1">
                            <span>{item.quantity}x </span> -
                            <span className="max-w-[120px] block overflow-hidden whitespace-nowrap text-ellipsis"> {item.service}</span> -
                            <span> Rp. {item.totalPrice.toLocaleString()} </span>
                          </p>

                          <div className="flex">
                            <button onClick={() => onDeleteItem(item)} className="text-red-500 p-2 mx-2 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors">
                              <Trash2Icon className="w-4 h-4" />
                            </button>

                            <button onClick={() => onEditItem(item)} className="text-blue-600 p-2 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition-colors">
                              <PenLine className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* action button */}
                <div className="mt-4 flex justify-end">
                  <button onClick={() => { setIsOpen(false); completeTask(); }} className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 transition-colors">
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
          <ChevronUp className="w-4 h-4 text-gray-400" onClick={() => isOpenable && setIsOpen(!isOpen)} />
        ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" onClick={() => isOpenable && setIsOpen(!isOpen)} />
        )}
      </div>
    </li>
  );
}


const TaskTimeline = ({
  tasks,
  itemList,
  setEditItem,
  setDeleteItem
}: {
  tasks: Task[];
  itemList: Item[];
  setEditItem: (item: Item | null) => void;
  setDeleteItem: (item: Item | null) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(tasks.findIndex(task => task.isCurrent));

  const completeTask = () => {
    tasks[currentIndex].isCurrent = false;
    if (currentIndex < tasks.length - 1)
      tasks[currentIndex + 1].isCurrent = true;

    setCurrentIndex(currentIndex + 1);
  }

  return (
    <>
      <ol className="relative border-s border-black/40 dark:border-gray-700">
        <TimelineItemPending
          task={tasks[0]}
          itemList={itemList}
          onEditItem={(editItem) => {
            const item = editItem || {} as Item;
            setEditItem(item);
          }}
          onDeleteItem={(item) => {
            setDeleteItem(item || null);
          }}
          currentTaskIndex={currentIndex}
          completeTask={completeTask}
        />

        <TimelineItemInProgress
          task={tasks[1]}
          itemList={itemList}
          onEditItem={(editItem) => {
            const item = editItem || { id: 0 } as Item;
            setEditItem(item);
          }}
          onDeleteItem={(item) => {
            setDeleteItem(item || null);
          }}
          currentTaskIndex={currentIndex}
          completeTask={completeTask}
        />

        <TimelineItemCompleted
          task={tasks[2]}
          currentTaskIndex={currentIndex}
          completeTask={completeTask}
        />
      </ol>
    </>
  );
}

const DetailTab = ({
  tasks,
  itemList,
  setItemList,
}: {
  tasks: Task[];
  itemList: Item[];
  setItemList: Dispatch<React.SetStateAction<Item[]>>;
}) => {

  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  const handleEditItem = (item?: Item) => {
    const isNew = !item || item.id === 0;
    const newItem: Item = {
      id: isNew ? 0 : item.id,
      category: item?.category || "",
      service: item?.service || "",
      quantity: item?.quantity || 1,
      type: item?.type || "vakum",
      price: item?.price || 0,
      totalPrice: item?.totalPrice || 0,
    };

    setItemList((prev) => {
      if (isNew) {
        return [...prev, newItem];
      } else {
        return prev.map((i) => (i.id === item?.id ? newItem : i));
      }
    });
  };

  const handleDeleteItem = (item?: Item) => {
    if (!item) return;

    setItemList((prev) => prev.filter((i) => i.id !== item.id));
  };


  return (
    <>
      <p className="mb-6 font-bold text-lg">Status Pengerjaan</p>
      <TaskTimeline tasks={tasks} itemList={itemList} setDeleteItem={setDeleteItem} setEditItem={setEditItem} />

      <EditItemModal handleEditItem={handleEditItem} isOpen={!!editItem} onClose={() => setEditItem(null)} item={editItem} />
      <DeleteItemModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} handleDeleteItem={handleDeleteItem} item={deleteItem} />
    </>
  );
}

interface AttachmentImageProps {
  onUpload?: (file: File) => void;
  label?: string;
  className?: string;
  allowUpload?: boolean;
  src?: string;
  width?: number;
  height?: number;
}


const UploadPhoto = ({
  onUpload = () => { },
  label = "Upload Image",
  className = "",
  allowUpload = true,
  src = "",
  width = 200,
  height = 200
}: AttachmentImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImageSrc(fileUrl);
    }
  }


  return <>
    <div className={cn(className, "flex items-center justify-center relative w-full h-full aspect-square rounded-md overflow-hidden")}>
      {
        imageSrc ? (
          <div className="flex flex-1 items-center justify-center h-full relative">
            <img
              src={imageSrc}
              alt={label}
              width={width}
              height={height}
            // className=" w-full h-full cursor-pointer aspect-square object-cover"
            />
          </div>)
          : (
            <div className="flex-1 aspect-square border-2 border-dashed  border-gray-300 hover:border-gray-400 bg-gray-400/10 rounded-md flex items-center justify-center ">
              {/* invisible file input */}
              <input type="file" accept="image/*" className="w-full h-full opacity-0 cursor-pointer aspect-square" onChange={handleFileChange} />
            </div>
          )
      }

      {imageSrc && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute !p-1 top-2 right-3 rounded-lg bg-mainColor/80 border border-gray-300 hover:bg-gray-100/10 text-white hover:text-red-500"
          onClick={() => {
            setImageSrc("");
            // onUpload(null);
          }}
        >
          {/* cross icon */}
          <FaX size={10} />
        </Button>
      )}
    </div>
  </>

}

const FotoTab = () => {
  return <>
    <div className="bg-mainColor/20 p-2 rounded-md">
      <p>Bukti Pengerjaan</p>

    </div>

    <div className="mt-4">
      {/* foto sebelum */}
      <p className="mb-3">1. Foto Sebelum</p>

      {/* 3x3 photo grid */}
      <div className="flex flex-col gap-y-3">
        {[1, 2, 3].map((_, index1) => {
          return (
            <div key={index1} className="flex-1 flex">
              {[1, 2, 3].map((_, index2) => {
                const key = index1 * 3 + index2;
                return (
                  <UploadPhoto key={key}
                    className="max-w-[33%] px-1"
                  // src="assets/mitra-icon.png"
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>

    <div className="mt-4">
      {/* foto sebelum */}
      <p className="mb-3">2. Foto Setelah</p>

      {/* 3x3 photo grid */}
      <div className="flex flex-col gap-y-3">
        {[1, 2, 3].map((_, index1) => {
          return (
            <div key={index1} className="flex-1 flex">
              {[1, 2, 3].map((_, index2) => {
                const key = index1 * 3 + index2;
                return (
                  <UploadPhoto key={key}
                    className="max-w-[33%] px-1"
                  // src="assets/mitra-icon.png"
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  </>
}

export default function PekerjaanBerlangsung() {
  const tasks: Task[] = [
    { date: "20/03/2025", time: "10:00 WIB", status: "pending", isCurrent: true },
    { date: "20/03/2025", time: "11:00 WIB", status: "in_progress", isCurrent: false },
    { date: "20/03/2025", time: "12:00 WIB", status: "completed", isCurrent: false },
  ];

  const [itemList, setItemList] = useState<Item[]>([
    { id: 1, type: "cuci", category: "", service: "Cuci Sofa", quantity: 1, price: 20000, totalPrice: 20000 },
    { id: 2, type: "cuci", category: "", service: "Cuci Bantal", quantity: 1, price: 20000, totalPrice: 20000 },
    { id: 3, type: "cuci", category: "", service: "Cuci Kasur", quantity: 1, price: 30000, totalPrice: 30000 },
  ]);

  type TabType = "detail" | "riwayat" | "foto";
  const [currentTab, setCurrentTab] = useState<TabType>("detail");
  const tabs: { id: TabType; label: string }[] = [
    { id: "detail", label: "Detail" },
    { id: "riwayat", label: "Riwayat" },
    { id: "foto", label: "Foto" },
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
            {tabs.map((tab, index) => {
              if (tab.id == currentTab) {
                return <button key={index} className="py-[5px] px-3 font-medium bg-white text-black dark:bg-mainColor dark:text-white rounded-md">{tab.label}</button>
              }
              else {
                return <button key={index} onClick={() => setCurrentTab(tab.id)} className="py-[5px] px-3 font-medium bg-slate-400/10 dark:bg-gray-700 rounded-md">{tab.label}</button>
              }
            })}
          </div>
        </div>

        {/* content */}
        <div className="mt-2 p-4">
          {/* content based on current tab */}
          {currentTab === "detail" && (
            <DetailTab tasks={tasks} itemList={itemList} setItemList={setItemList} />
          )}
          {currentTab === "riwayat" && (
            <p>Riwayat Pekerjaan akan ditampilkan di sini.</p>
          )}
          {currentTab === "foto" && (
            <FotoTab />
          )}
        </div>
      </div>


    </main>
  );
}