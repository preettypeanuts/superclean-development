"use client";

import { PageBanner } from "@shared/components/mitra/page-banner";

import { Header } from "@shared/components/Header";
import { api } from "@shared/utils/apiClient";
import { apiFormdata } from "@shared/utils/apiFormdataClient";
import { formatRupiah } from "@shared/utils/formatRupiah";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { Button } from "@ui-components/components/ui/button";
import { DialogDescription, DialogTitle } from "@ui-components/components/ui/dialog";
import { Input } from "@ui-components/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@ui-components/components/ui/select";
import { cn } from "@ui-components/utils";
import { LocationData, MitraCustomerDetail, MitraSPKDetail, MitraSPKItemDetail } from "apps/mitra-app/app/daftar-spk-blower/[id]/page";
import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
import { Label } from "libs/ui-components/src/components/ui/label";
import { useCategoryStore, usePromoLookup, useServiceLookup } from "libs/utils/useCategoryStore";
import { CheckIcon, ChevronDown, ChevronUp, PenLine, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { FaX } from "react-icons/fa6";

const SPK_STATUS = {
  BARU: 0,
  PROSES: 1,
  BATAL: 2,
  MENUNGGU_BAYAR: 3,
  SUDAH_BAYAR: 4,
  SELESAI: 5,
}

const SPK_STATUS_PROSES = {
  TERJADWAL: 0,
  PENGERJAAN: 1,
  SELESAI_PENGERJAAN: 2,
  SELESAI: 3,
}

type statusName = "pending" | "in_progress" | "completed";

const findStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return "Baru";
    case 1:
      return "Proses";
    case 1.5: // dummy status for "in progress"
      return "Proses";
    case 2:
      return "Batal";
    case 3:
      return "Menunggu Bayar";
    case 4:
      return "Sudah Bayar";
    case 5:
      return "Selesai";
    case 6:
      return "Dikerjakan Ulang";

    default:
      return "Unknown";
  }
}

type Task = {
  date: string;
  time: string;
  status: statusName;
  isCurrent?: boolean;
};

type Item = {
  id: string;
  category: string;
  service: string;
  quantity: number;
  price: number;
  type: "vakum" | "cuci";
  totalPrice: number;
  promoCode?: string;
  promoType?: "Nominal" | "Persentase";
  promoAmount?: number;
}

type EditItemModalProps = {
  isOpen?: boolean;
  item: MitraSPKItemDetail | null;
  onClose?: () => void;
};

const EditItemModal = ({ isOpen = false, item, onClose = () => { } }: EditItemModalProps) => {
  const context = useContext(TransactionContext);
  const handleAddItem = context.handleAddItem!;
  const handleEditItem = context.handleEditItem!;

  const itemId = item?.id || "";
  const isEdit = itemId !== "";

  const [formData, setFormData] = useState<Item>({} as Item);


  useEffect(() => {
    if (item) {
      setFormData({
        id: item?.id || "",
        category: item?.serviceCategory || "",
        service: item?.serviceCode || "",
        quantity: item?.quantity || 1,
        price: item.servicePrice,
        type: item?.serviceType === 1 ? "cuci" : "vakum",
        totalPrice: item?.totalPrice || 0,
      } as Item);
    } else {
      setFormData({} as Item);
    }
  }, [item]);

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


  useEffect(() => {
    // set prices when edit
    if (item && services.length > 0) {
      setFormData((prev) => {
        const service = services.find((s) => s.serviceCode === item.serviceCode);
        const price = item.serviceType === 1 ? service?.cleanPrice : service?.vacuumPrice;

        if (service) {
          return {
            ...prev,
            price: price || 0,
            totalPrice: (price || 0) * prev.quantity,
          }
        }
        else {
          return prev;
        }
      });
    }
  }, [item, services]);

  useEffect(() => {
    // set promo data to form
    if (promo) {
      setFormData((prev) => ({
        ...prev,
        promoCode: promo.code,
        promoType: promo.type,
        promoAmount: promo.amount,
      }));
    }
  }, [promo])

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
      totalPromo = promoAmount * quantity;
    }

    const endPrice = totalPrice - totalPromo;

    return {
      totalPrice,
      totalPromo,
      endPrice
    }
  }, [formData.quantity, formData.price, promo, formData.service]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const loading = useMemo(() => {
    return loadingCat || loadingServices || loadingPromo || submitLoading;
  }, [loadingCat, loadingServices, loadingPromo]);

  const isValid = useMemo(() => {
    return formData.category !== "" &&
      formData.service !== "" &&
      formData.quantity > 0 &&
      totals.endPrice >= 0;
  }, [formData, totals]);

  const handleSave = async () => {
    if (isValid) {
      try {
        setSubmitLoading(true);

        if (isEdit) {
          await handleEditItem(itemId, formData);
        } else {
          await handleAddItem(formData);
        }

        onClose();
      }
      catch (error) {

      }
      finally {
        setSubmitLoading(false);
      }
    }
  };

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
                min={0}
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
            loading={loading}
            className="flex-1" onClick={() => { onClose() }} variant="outline2">
            Kembali
          </Button>
          <Button
            className="flex-1"
            type="submit"
            variant="main"
            onClick={() => { handleSave() }}
            disabled={!isValid}
            loading={loading}
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
  itemId: string;
  onClose: () => void;
};

const DeleteItemModal = ({
  isOpen,
  onClose,
  itemId
}: DeleteItemModalProps) => {
  const context = useContext(TransactionContext);
  const handleDelete = context.handleDeleteItem!;

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await handleDelete(itemId)
      onClose();
    }
    catch (error) {

    }
    finally {
      setLoading(false);
    }
  };

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
          <Button className="flex-1 mx-2" disabled={loading} variant="outline2" onClick={onClose}>Batal</Button>
          <Button className="flex-1 mx-2" disabled={loading} loading={loading} variant="destructive" onClick={() => { onDelete() }}>Hapus</Button>
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
          <Button className="flex-1 mx-2" variant="main" onClick={() => {
            history.back();
          }}>Kembali ke Dashboard</Button>
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
}: {
  }) => {
  const transaction = React.useContext(TransactionContext);
  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state
  const setTransaction = transaction.setTransactionDetail!;

  const beforeImages = transaction.beforeImages || [];
  const afterImages = transaction.afterImages || [];

  const TASK_INDEX = 2;
  const isOpenable = TASK_INDEX <= transaction.transactionDetail?.stateProcess!;
  const isCurrent = TASK_INDEX === transaction.transactionDetail?.stateProcess!;

  const [jobCompleted, setJobCompleted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(isCurrent);

  const completeDisabled = !isCurrent || loading || beforeImages.length === 0 || afterImages.length === 0;

  useEffect(() => {
    setIsOpen(isCurrent);
  }, [isCurrent]);

  const handleBackTask = async () => {
    try {
      setLoading(true);

    } catch (error) {
      console.error('Error going back task:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCompleteTask = async () => {
    try {
      setLoading(true);

      const userStorage = localStorage.getItem('user') ?? '';

      await api.put(`/transaction/${trxId}/state-process`, {
        stateProcess: SPK_STATUS_PROSES.SELESAI,
      });

      const user = JSON.parse(userStorage);

      await api.put(`/transaction/${trxId}/status`, {
        status: SPK_STATUS.MENUNGGU_BAYAR,
        username: user ? user?.username : 'Mitra',
        fullname: user ? user?.fullname : 'Mitra'
      });

      setTransaction((prev) => ({
        ...prev,
        stateProcess: SPK_STATUS_PROSES.SELESAI,
        status: SPK_STATUS.MENUNGGU_BAYAR,
      }));

      // simulate waiting for 2 seconds
      setJobCompleted(true);
      // Simulate API call
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <li className="mb-10 ms-4 flex">
        <div className="">
          <TimelineIcon taskIndex={TASK_INDEX} currentTaskIndex={transaction.transactionDetail?.stateProcess!} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white" onClick={() => isOpenable && setIsOpen(!isOpen)}>Selesai & Diterima Pelanggan</h3>
          {
            isOpen && (
              <>
                {/* top divider */}
                <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>

                {/* additional details */}
                <div>
                  <p className="text-sm mb-4">Jika pelanggan sudah puas dan pekerjaan sudah selesai, mohon untuk klik tombol <span>"Selesai"</span></p>

                  <div className="flex flex-col my-2">
                    <div className="flex my-0.5">
                      <p className="flex flex-1 font-medium">Total Harga</p>
                      <p className="flex-1 text-right font-medium text-gray-800 text-lg">
                        Rp {transaction.transactionDetail?.totalPrice.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="flex my-0.5">
                      <p className="flex flex-1 font-medium">Promo</p>
                      <p className="flex-1 text-right font-medium text-gray-800 text-lg">
                        Rp {transaction.transactionDetail?.totalPromoPrice.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="flex my-0.5">
                      <p className="flex flex-1 font-medium">Diskon</p>
                      <p className="flex-1 text-right font-medium text-gray-800 text-lg">
                        Rp {transaction.transactionDetail?.discountPrice?.toLocaleString('id-ID') || '0'}
                      </p>
                    </div>

                    <div className="flex my-0.5">
                      <p className="flex flex-1 font-medium">Biaya tambahan</p>
                      <p className="flex-1 text-right font-medium text-gray-800 text-lg">
                        Rp {transaction.transactionDetail?.additionalFee?.toLocaleString('id-ID') || '0'}
                      </p>
                    </div>

                    <div className="grid grid-cols-5 mb-2 pb-3 border-b border-bottom-dash border-gray-500"></div>

                    <div className="flex my-0.5">
                      <p className="flex flex-1 font-bold">Total</p>
                      <p className="flex-1 text-right font-bold text-gray-800 text-lg">
                        Rp {transaction.transactionDetail?.finalPrice?.toLocaleString('id-ID') || '0'}
                      </p>
                    </div>

                  </div>

                  {
                    true && (
                      <div className="flex">
                        <Button
                          disabled={completeDisabled}
                          className={`flex-1 mx-2 ${completeDisabled ? "opacity-50 cursor-not-allowed" : ""}`} variant={completeDisabled ? "disabled" : "main"} onClick={() => {
                            handleCompleteTask();
                          }}>Selesai</Button>
                      </div>
                    )
                  }
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
        onClose={() => {
          setJobCompleted(false);
        }}
      />

    </>
  );
}

const TimelineItemInProgress = ({
  onEditItem,
  onDeleteItem,
}: {
  onEditItem: (item?: MitraSPKItemDetail) => void;
  onDeleteItem: (item?: MitraSPKItemDetail) => void;
}) => {
  const transaction = React.useContext(TransactionContext);
  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state

  const setTransaction = transaction.setTransactionDetail!;
  const transactionItems = transaction.transactionDetail?.details || [];

  const beforeImages = transaction.beforeImages || [];
  const afterImages = transaction.afterImages || [];
  const showUploadAfter = transaction.showUploadAfter;

  const TASK_INDEX = 1;
  const isCurrent = TASK_INDEX === transaction.transactionDetail?.stateProcess!;
  const isOpenable = TASK_INDEX <= transaction.transactionDetail?.stateProcess!;

  const [isOpen, setIsOpen] = useState(isCurrent);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsOpen(isCurrent);
  }, [isCurrent]);

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);

      // update stateProcess to "in progress" first
      await api.put(`/transaction/${trxId}/state-process`, {
        stateProcess: SPK_STATUS_PROSES.SELESAI_PENGERJAAN,
      });

      setTransaction((prev) => ({
        ...prev,
        stateProcess: SPK_STATUS_PROSES.SELESAI_PENGERJAAN,
      }));

      if (afterImages.length === 0 || beforeImages.length === 0) {
        showUploadAfter();
      }

    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <li className="mb-10 ms-4 flex">
      <div className="">
        <TimelineIcon taskIndex={TASK_INDEX}
          currentTaskIndex={transaction.transactionDetail?.stateProcess!}
        />
      </div>
      <div className="flex-1">
        {/* <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">({task.date} - {task.time})</time> */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white" onClick={() => isOpenable && setIsOpen(!isOpen)}>Dalam Proses Pengerjaan</h3>
        {
          isOpen && (
            <>
              {/* top divider */}
              <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>

              {/* additional details */}
              <div className="mt-2 text-sm text-gray-600">
                <p className="my-4 font-medium">List item yang harus segera dikerjakan dan diselesaikan</p>
                {/* item list */}
                <div>
                  {/* item list header */}
                  <div className="flex">
                    <p className="flex-1 font-semibold text-black text-base">List Item Pengerjaan:</p>
                    {
                      isCurrent && (
                        <p onClick={() => {
                          onEditItem();
                        }}
                          className="flex text-blue-500 font-semibold text-base">+ <span className="underline ml-1">Tambah Item</span></p>
                      )
                    }
                  </div>

                  {/* item list content */}
                  <div className="mt-3">
                    {transactionItems.map((item, index) => {
                      return (
                        <div key={index} className="py-2 flex justify-center items-center">
                          <p className="flex flex-col flex-1 gap-1">
                            <div className="flex">
                              <span className="mr-2">{item.quantity}x </span>
                              <span className="mr-2"> - </span>
                              <span className="block overflow-hidden whitespace-nowrap text-ellipsis"> {item.service.name}</span>
                            </div>
                            {item.serviceCategory === "BLOWER" ? null : (
                                <div className="flex">
                                   <span className="mr-2"><b>Tipe : </b>{item.serviceType === 1 ? 'Cuci' : 'Vakum'} </span>
                              </div>
                              )} 

                            <span className="font-bold text-[#72757C]"> Rp. {(item.totalPrice - item.promoPrice).toLocaleString('id-ID')} </span>
                          </p>

                          {
                            isCurrent && (
                              <div className="flex">
                                <button
                                  onClick={() => onDeleteItem(item)}
                                  className="text-red-500 p-2 mx-2 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors">
                                  <Trash2Icon className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => onEditItem(item)}
                                  className="text-blue-600 p-2 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition-colors">
                                  <PenLine className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* action button */}
                {
                  isCurrent && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => { handleCompleteTask(); }}
                        disabled={isLoading}
                        className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 disabled:bg-mainColor/40 transition-colors">
                        Pekerjaan Selesai
                      </button>
                    </div>
                  )
                }
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
  );
}

const TimelineItemPending = ({
  onEditItem,
  onDeleteItem,
}: {
  onEditItem: (item?: MitraSPKItemDetail) => void;
  onDeleteItem: (item?: MitraSPKItemDetail) => void;
}) => {
  const transaction = React.useContext(TransactionContext);
  const setTransaction = transaction.setTransactionDetail!;
  const transactionItems = transaction.transactionDetail?.details || [];

  const beforeImages = transaction.beforeImages || [];
  const showUploadBefore = transaction.showUploadBefore;

  const TASK_INDEX = 0;
  const isOpenable = TASK_INDEX <= transaction.transactionDetail?.stateProcess!;
  const isCurrent = TASK_INDEX === transaction.transactionDetail?.stateProcess!;

  const [isOpen, setIsOpen] = useState(isCurrent);
  const [isLoading, setIsLoading] = useState(false);

  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);

      const response = await api.put(`/transaction/${trxId}/state-process`, {
        stateProcess: SPK_STATUS_PROSES.PENGERJAAN,
      });

      if (beforeImages.length === 0) {
        showUploadBefore();
      }

      setIsOpen(false);

      setTransaction((prev) => ({
        ...prev,
        stateProcess: SPK_STATUS_PROSES.PENGERJAAN,
      }));

    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <li className="mb-10 ms-4 flex">
        <div className="">
          <TimelineIcon taskIndex={TASK_INDEX}
            currentTaskIndex={transaction.transactionDetail?.stateProcess!}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900" onClick={() => isOpenable && setIsOpen(!isOpen)}>Terjadwal</h3>
          {
            isOpen && (
              <>
                {/* top divider */}
                <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>

                {/* additional details */}
                <div className="mt-2 text-sm text-gray-600">
                  {/* preview information */}
                  <p className="my-4 font-medium">Jadwal pengerjaan yang harus diselesaikan</p>
                  <p className="font-bold text-base text-black">Alamat: </p>
                  <p className="mt-3 text-sm font-medium mb-4">
                    {transaction.customerDetail?.address}, {transaction.customerDetail?.subDistrict}, {transaction.customerDetail?.district}, {transaction.customerDetail?.city}, {transaction.customerDetail?.province}
                  </p>

                  <p className="font-bold text-base text-black">Catatan:</p>
                  <p className="mt-3 text-sm font-medium mb-4">
                    {transaction.transactionDetail?.notes}
                  </p>

                  {/* item list */}
                  <div>
                    {/* item list header */}
                    <div className="flex">
                      <p className="flex-1 font-semibold text-black text-base">List Item Pengerjaan:</p>
                      {
                        isCurrent && (
                          <p onClick={() => {
                            onEditItem();
                          }}
                            className="flex text-blue-500 font-semibold text-base">+ <span className="underline ml-1">Tambah Item</span></p>
                        )
                      }
                    </div>

                    {/* item list content */}
                    <div className="mt-3">
                      {transactionItems.map((item, index) => {
                        return (
                          <div key={index} className="py-2 flex justify-center items-center">
                            <p className="flex flex-col flex-1 gap-1">
                              <div className="flex">
                                <span className="mr-2">{item.quantity}x </span>
                                <span className="mr-2"> - </span>
                                <span className="block overflow-hidden whitespace-nowrap text-ellipsis"> {item.service.name}</span>
                              </div>
                              {item.serviceCategory === "BLOWER" ?  null : (
                                <div className="flex">
                                   <span className="mr-2"><b>Tipe : </b>{item.serviceType === 1 ? 'Cuci' : 'Vakum'} </span>
                              </div>
                              )}                              

                              <span className="font-bold text-[#72757C]"> Rp. {(item.totalPrice - item.promoPrice).toLocaleString('id-ID')} </span>
                            </p>

                            {
                              isCurrent && (
                                <div className="flex">
                                  <button
                                    onClick={() => onDeleteItem(item)}
                                    className="text-red-500 p-2 mx-2 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors">
                                    <Trash2Icon className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => onEditItem(item)}
                                    className="text-blue-600 p-2 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition-colors">
                                    <PenLine className="w-4 h-4" />
                                  </button>
                                </div>
                              )
                            }
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* action button */}
                  {
                    isCurrent && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => { handleCompleteTask(); }} className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/80 disabled:opacity-50 transition-colors"
                          disabled={isLoading || transactionItems.length === 0}
                        >
                          Mulai Pengerjaan
                        </button>
                      </div>
                    )
                  }
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
    </>
  );
}

const TaskTimeline = ({
  setEditItem,
  setDeleteItem
}: {
  setEditItem: (item: MitraSPKItemDetail | null) => void;
  setDeleteItem: (item: MitraSPKItemDetail | null) => void;
}) => {

  return (
    <>
      <ol className="relative border-s border-black/40 dark:border-gray-700">
        <TimelineItemPending
          onEditItem={(editItem) => {
            const item = editItem || {} as MitraSPKItemDetail;
            setEditItem(item);
          }}
          onDeleteItem={(item) => {
            setDeleteItem(item || null);
          }}
        />

        <TimelineItemInProgress
          // itemList={itemList}
          onEditItem={(editItem) => {
            const item = editItem || {} as MitraSPKItemDetail;
            setEditItem(item);
          }}
          onDeleteItem={(item) => {
            setDeleteItem(item || null);
          }}
        />

        <TimelineItemCompleted />
      </ol>
    </>
  );
}

const DetailTab = () => {
  const [editItem, setEditItem] = useState<MitraSPKItemDetail | null>(null);
  const [deleteItem, setDeleteItem] = useState<MitraSPKItemDetail | null>(null);

  return (
    <>
      <p className="mb-6 font-bold text-lg">Status Pengerjaan</p>
      <TaskTimeline setDeleteItem={setDeleteItem} setEditItem={setEditItem} />
      <EditItemModal isOpen={!!editItem} onClose={() => setEditItem(null)} item={editItem} />
      <DeleteItemModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} itemId={deleteItem?.id!} />
    </>
  );
}

interface History {
  id: string;
  trxNumber: string;
  notes: string;  // example: <b>Super Admin</b> melakukan perubahan detail transaksi pada <b>21 September 2025 22:33</b>
  logDate: string // example: 2025-09-21T15:33:00.000Z
}

const RiwayatTab = () => {
  const transaction = React.useContext(TransactionContext);

  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction.transactionDetail) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/transaction/history?trxNumber=${transaction.transactionDetail?.trxNumber}`);
          setHistory(response.data);
        } catch (error) {
          console.error("Error fetching history:", error);
        }
        finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [transaction.transactionDetail]);

  if (loading) {
    return <div className="text-center text-gray-400">
      <p>Memuat riwayat...</p>
    </div>
  }

  if (history.length > 0) {
    return <>
      <p className="mb-6 font-bold text-lg">Riwayat</p>
      <ol className="relative border-s border-black/40 dark:border-gray-700">
        {history.map((task, index) => (
          <li key={index} className="mb-10 ms-4">
            <div className="absolute w-3 h-3 bg-mainColor rounded-full mt-1.5 -start-1.5  dark:border-mainDark dark:bg-mainDark flex items-center justify-center">
              <CheckIcon className="text-white" />
            </div>
            <div className="flex-1">
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                ({new Date(task.logDate).toLocaleDateString()} - {new Date(task.logDate).toLocaleTimeString()})
              </time>
              <h3
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {task.notes.replace(/<[^>]*>/g, "")}
              </h3>
            </div>
          </li>
        ))}
      </ol>
    </>
  }

  return <>
    <p className="mb-6 font-bold text-lg">Riwayat Pengerjaan</p>
    <div className="text-center text-gray-400">
      <p>Belum ada riwayat pengerjaan</p>
    </div>
  </>
}


interface ImagePreviewModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onDelete: () => void;
  isReadOnly: boolean;
}

const ImagePreviewModal = ({ isOpen, imageSrc, onClose, onDelete, isReadOnly }: ImagePreviewModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Hide header and footer navigation
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      const nav = document.querySelector('nav');

      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (nav) nav.style.display = 'none';

      return () => {
        // Restore on unmount
        document.body.style.overflow = 'unset';
        if (header) header.style.display = '';
        if (footer) footer.style.display = '';
        if (nav) nav.style.display = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1999] bg-black/90 flex items-center justify-center" onClick={onClose}>
      {/* Delete button */}
      {!isReadOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            onClose();
          }}
          className="absolute bottom-8 right-1/2 translate-x-1/2 z-[1000] px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
        >
          <FaX size={14} />
          Hapus Foto
        </button>
      )}

      {/* Image */}
      <img
        src={imageSrc}
        alt="Preview"
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

interface AttachmentImageProps {
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  label?: string;
  className?: string;
  allowUpload?: boolean;
  src?: string;
  width?: number;
  height?: number;
  loading?: boolean;
  isReadOnly?: boolean;
}

const UploadPhoto = ({
  onUpload = () => { },
  onDelete = () => { },
  label = "Upload Image",
  className = "",
  allowUpload = true,
  src = "",
  width = 200,
  height = 200,
  loading = false,
  isReadOnly = false
}: AttachmentImageProps) => {
  const ALLOWED_FILE_SIZE = 10 * 1024 * 1024; // 5MB
  const context = React.useContext(TransactionContext);
  const setIsImagePreviewOpen = context.setIsImagePreviewOpen;

  const [imageSrc, setImageSrc] = useState<string>(src);
  const [currentLoading, setCurrentLoading] = useState<boolean>(loading);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  useEffect(() => {
    setCurrentLoading(loading);
  }, [loading]);

  // Sync preview state with context
  useEffect(() => {
    if (setIsImagePreviewOpen) {
      setIsImagePreviewOpen(showPreview);
    }
  }, [showPreview, setIsImagePreviewOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);

      // check if filesize is allowed
      if (file.size > ALLOWED_FILE_SIZE) {
        alert("Ukuran file terlalu besar. Maksimal ukuran file adalah 10MB.");
        return;
      }

      setImageSrc(fileUrl);
      onUpload(file);
    }
  }

  if (currentLoading) {
    return <div className={cn(className, "flex items-center justify-center relative w-full h-full aspect-square rounded-md overflow-hidden")}>
      <div className="flex-1 aspect-square border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-400/10 rounded-md flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-mainColor rounded-full animate-spin" />
      </div>
    </div>
  }


  return <>
    <ImagePreviewModal
      isOpen={showPreview}
      imageSrc={imageSrc}
      onClose={() => setShowPreview(false)}
      onDelete={() => {
        setImageSrc("");
        onDelete();
      }}
      isReadOnly={isReadOnly}
    />

    <div className={cn(className, "flex items-center justify-center relative w-full h-full aspect-square rounded-md overflow-hidden")}>
      {
        imageSrc ? (
          <div
            className="flex flex-1 items-center justify-center h-full relative cursor-pointer"
            onClick={() => setShowPreview(true)}
          >
            <img
              src={imageSrc}
              alt={label}
              width={width}
              height={height}
              className="w-full h-full object-cover"
            />
          </div>)
          : (
            <div className="flex-1 aspect-square border-2 border-dashed  border-gray-300 hover:border-gray-400 bg-gray-400/10 rounded-md flex items-center justify-center ">
              {/* invisible file input */}
              <input type="file" accept="image/*" className="w-full h-full opacity-0 cursor-pointer aspect-square" onChange={handleFileChange} disabled={isReadOnly} />
            </div>
          )
      }
    </div>
  </>

}

interface TransactionDocument {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  trxNumber: string;
  docType: "BEFORE" | "AFTER";
  docUrl: string;
  loading?: boolean;
}

const FotoTab = () => {
  const transaction = React.useContext(TransactionContext);
  const trxId = transaction.transactionDetail?.id; // replace with actual trxId from props or state

  const beforeImages = transaction.beforeImages!;
  const afterImages = transaction.afterImages!;
  const setBeforeImages = transaction.setBeforeImages!;
  const setAfterImages = transaction.setAfterImages!;

  // const imageRowCount = Math.ceil(Math.max(beforeImages.length + 1, afterImages.length + 1) / 3)
  const imageBeforeRowCount = Math.ceil(Math.max(beforeImages.length + 1, afterImages.length + 1) / 3)
  const imageAfterRowCount = Math.ceil(Math.max(afterImages.length + 1, afterImages.length + 1) / 3);

  const isReadOnly = useMemo(() => {
    if (!transaction.transactionDetail) return true;
    return transaction.transactionDetail.status !== SPK_STATUS.PROSES;
  }, [transaction.transactionDetail]);

  const handleUploadImage = async (file: File, type: "before" | "after") => {
    const newImageObj = {
      id: "",
      createdAt: "",
      createdBy: "",
      updatedAt: null,
      updatedBy: null,
      trxNumber: trxId!,
      docType: type === "before" ? "BEFORE" : "AFTER",
      docUrl: URL.createObjectURL(file),
      loading: true
    } as TransactionDocument;

    let index = 0;
    if (type == 'before') {
      index = beforeImages.length;
    } else {
      index = afterImages.length;
    }

    try {
      if (!file) return;
      if (!trxId) {
        alert("Transaksi belum disimpan. Silakan simpan transaksi terlebih dahulu sebelum mengunggah gambar.");
        return;
      }

      if (type === "before") {
        setBeforeImages((prev) => [...prev, newImageObj]);
      } else if (type === "after") {
        setAfterImages((prev) => [...prev, newImageObj]);
      }

      // upload image to server
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("docType", type === "before" ? "BEFORE" : "AFTER");

      await apiFormdata.post(`/transaction/${trxId}/documents`, formData);
      // await getImages(type);
    }
    catch (error) {
      console.error("Error uploading image:", error);
      alert("Gagal mengunggah gambar. Silakan coba lagi.");
    }
    finally {
      // refresh images
      if (type === "before") {
        // find by index and change loading to false
        setBeforeImages((prev) => prev.map((img, i) => i === index ? { ...img, loading: false } : img));
      }

      if (type === "after") {
        setAfterImages((prev) => prev.map((img, i) => i === index ? { ...img, loading: false } : img));
      }
    }
  }

  const handleDeleteImage = async (id: string, type: "before" | "after") => {
    if (!id) return;
    // update image to loading state
    if (type === "before") {
      setBeforeImages((prev) => prev.map((img) => img.id === id ? { ...img, loading: true } : img));
    }
    if (type === "after") {
      setAfterImages((prev) => prev.map((img) => img.id === id ? { ...img, loading: true } : img));
    }

    try {
      await api.delete(`/transaction/documents/${id}`);
      // await getImages(type);
    }
    catch (error) {
      console.error("Error deleting image:", error);
      alert("Gagal menghapus gambar. Silakan coba lagi.");
    }
    finally {
      // remove image from state
      if (type === "before") {
        setBeforeImages((prev) => prev.filter((img) => img.id !== id));
      }
      if (type === "after") {
        setAfterImages((prev) => prev.filter((img) => img.id !== id));
      }
    }
  }

  return <>
    <div className="bg-mainColor/20 p-2 rounded-md">
      <p>Bukti Pengerjaan</p>

    </div>

    <div className="mt-4">
      {/* foto sebelum */}
      <p className="mb-3">1. Foto Sebelum</p>

      {/* 3x3 before photo grid */}
      {
        [0].map(() => {
          let beforePlaceHolderUsed = false;

          return Array.from({ length: imageBeforeRowCount }).map((_, rowIndex) => {
            const startIndex = rowIndex * 3;
            const endIndex = startIndex + 3;

            const beforeRowImages = beforeImages.slice(startIndex, endIndex);

            return (
              <div className="flex flex-row gap-y-3">
                {[0, 1, 2].map((image, index) => {
                  const img = beforeRowImages[index];

                  if (!img) {
                    if (!beforePlaceHolderUsed && !isReadOnly) {
                      beforePlaceHolderUsed = true;
                      return (
                        <UploadPhoto key={index}
                          className="max-w-[33%] px-1"
                          onUpload={(file) => {
                            handleUploadImage(file, "before");
                          }}
                          onDelete={() => {
                            setBeforeImages((prev) => prev.filter((_, i) => i !== index));
                          }}
                        />
                      )
                    }
                    return (
                      <div key={index} className="max-w-[33%] px-1" />
                    )
                  }

                  return (
                    <UploadPhoto key={index}
                      className="max-w-[33%] px-1"
                      src={img.docUrl}
                      loading={img.loading}
                      isReadOnly={isReadOnly}
                      onUpload={(file) => {
                        if (file) {
                          setBeforeImages((prev) => [...prev, {
                            id: "",
                            createdAt: "",
                            createdBy: "",
                            updatedAt: null,
                            updatedBy: null,
                            trxNumber: trxId!,
                            docType: "BEFORE",
                            docUrl: URL.createObjectURL(file),
                            loading: true
                          }]);

                          handleUploadImage(file, "before");
                        }
                      }}
                      onDelete={() => {
                        handleDeleteImage(img.id, "before");
                      }}
                    />
                  )
                })}
              </div>
            )
          })
        })
      }




    </div>

    <div className="mt-4">
      {/* foto sebelum */}
      <p className="mb-3">2. Foto Setelah</p>

      {/* 3x3 after photo grid */}
      {
        [0].map((_, indexY) => {
          let afterPlaceHolderUsed = false;

          return Array.from({ length: imageAfterRowCount }).map((_, rowIndex) => {
            const startIndex = rowIndex * 3;
            const endIndex = startIndex + 3;

            const afterRowImages = afterImages.slice(startIndex, endIndex);

            return (
              <div className="flex flex-row gap-y-3">
                {[0, 1, 2].map((image, index) => {
                  const img = afterRowImages[index];
                  if (!img) {
                    if (!afterPlaceHolderUsed && !isReadOnly) {
                      afterPlaceHolderUsed = true;
                      return (
                        <UploadPhoto key={index}
                          className="max-w-[33%] px-1"
                          onUpload={(file) => {
                            handleUploadImage(file, "after");
                          }}
                          onDelete={() => {
                            setAfterImages((prev) => prev.filter((_, i) => i !== index));
                          }}
                        />
                      )
                    }


                    return (
                      <div key={index} className="max-w-[33%] px-1" />
                    )
                  }

                  return (
                    <UploadPhoto key={index}
                      className="max-w-[33%] px-1"
                      src={img.docUrl}
                      loading={img.loading}
                      isReadOnly={isReadOnly}
                      onUpload={(file) => {
                        if (file) {
                          setAfterImages((prev) => [...prev, {
                            id: "",
                            createdAt: "",
                            createdBy: "",
                            updatedAt: null,
                            updatedBy: null,
                            trxNumber: trxId!,
                            docType: "AFTER",
                            docUrl: URL.createObjectURL(file),
                            loading: true
                          }]);

                          handleUploadImage(file, "after");
                        }
                      }}
                      onDelete={() => {
                        handleDeleteImage(img.id, "after");
                      }}
                    />
                  )
                })}
              </div>
            )
          })
        })
      }
    </div>
  </>
}

const TransactionContext = React.createContext<{
  transactionDetail: MitraSPKDetail | null;
  customerDetail: MitraCustomerDetail | null;
  setTransactionDetail?: React.Dispatch<React.SetStateAction<MitraSPKDetail>>;
  handleAddItem?: (item: Item) => Promise<void>;
  handleDeleteItem?: (id: string) => Promise<void>;
  handleEditItem?: (id: string, item: Item) => Promise<void>;
  showUploadBefore: () => void;
  showUploadAfter: () => void;
  beforeImages?: Array<TransactionDocument>;
  afterImages?: Array<TransactionDocument>;
  setBeforeImages?: React.Dispatch<React.SetStateAction<Array<TransactionDocument>>>;
  setAfterImages?: React.Dispatch<React.SetStateAction<Array<TransactionDocument>>>;
  isImagePreviewOpen?: boolean;
  setIsImagePreviewOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  transactionDetail: null,
  customerDetail: null,
  setTransactionDetail: () => { },
  handleAddItem: async (item) => { },
  handleDeleteItem: async (id) => { },
  handleEditItem: async (id, item) => { },
  showUploadBefore: () => { },
  showUploadAfter: () => { },
  beforeImages: [],
  afterImages: [],
  setBeforeImages: () => { },
  setAfterImages: () => { },
  isImagePreviewOpen: false,
  setIsImagePreviewOpen: () => { },
});

export default function PekerjaanBerlangsung() {
  type TabType = "detail" | "riwayat" | "foto";
  const [currentTab, setCurrentTab] = useState<TabType>("detail");

  const tabs: { id: TabType; label: string }[] = [
    { id: "detail", label: "Detail" },
    { id: "riwayat", label: "Riwayat" },
    { id: "foto", label: "Foto" },
  ];

  const params = useParams();
  const [trxNumber, setTrxNumber] = useState("");

  const [transactionDetail, setTransactionDetail] = useState<MitraSPKDetail>(null as any);
  const [customerDetail, setCustomerDetail] = useState<MitraCustomerDetail>(null as any);
  const [extendAddress, setExtendAddress] = useState<boolean>(false);

  const [showUploadBefore, setShowUploadBefore] = useState<boolean>(false);
  const [showUploadAfter, setShowUploadAfter] = useState<boolean>(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState<boolean>(false);

  const [beforeImages, setBeforeImages] = useState<Array<TransactionDocument>>([]); // Replace with actual before images array
  const [afterImages, setAfterImages] = useState<Array<TransactionDocument>>([]); // Replace with actual after images array

  const getBannerTitle = useMemo(() => {
    switch (transactionDetail?.status) {
      case SPK_STATUS.BARU:
      case SPK_STATUS.PROSES:
        return "Pekerjaan Berlangsung";
      default:
        return "Riwayat Pekerjaan";
    }
  }, [transactionDetail?.status]);

  // get params from url
  useEffect(() => {
    if (!params || !params.id) return;
    const { id } = params; // Access the dynamic route parameter 'id'

    const trxNumberRaw = id?.toString() as string;
    const trxNumber = decodeURIComponent(trxNumberRaw);
    setTrxNumber(trxNumber);
  }, [params]);

  // get transaction detail from api
  useEffect(() => {
    if (!trxNumber) return;

    // fetch transaction detail from api
    const fetchTransactionDetail = async () => {
      try {
        const response = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
        setTransactionDetail(response.data as MitraSPKDetail);
      } catch (error) {
        console.error("Error fetching transaction detail:", error);
      }
    };

    fetchTransactionDetail();

  }, [trxNumber]);

  // get customer detail from api
  useEffect(() => {
    if (!transactionDetail) return;

    const fetchCustomerDetail = async () => {
      try {
        const response = await api.get(`/customer/id/${transactionDetail.customerId}`);
        const customerDetailResponse = response.data as MitraCustomerDetail;

        const [provinceRes, cityRes, districtRes, subDistrictRes] = await Promise.all([
          api.get(`/parameter/provinces`),
          api.get(`/parameter/cities?province=${customerDetailResponse.province}`),
          api.get(`/parameter/districts?province=${customerDetailResponse.province}&city=${customerDetailResponse.city}`),
          api.get(`/parameter/sub-districts?province=${customerDetailResponse.province}&city=${customerDetailResponse.city}&district=${customerDetailResponse.district}`)
        ]);

        const findLabel = (items: LocationData[], code: string) => {
          const item = items.find(item => item.paramKey === code);
          return item ? item.paramValue : code;
        };

        customerDetailResponse.province = findLabel(provinceRes.data, customerDetailResponse.province);
        customerDetailResponse.city = findLabel(cityRes.data, customerDetailResponse.city);
        customerDetailResponse.district = findLabel(districtRes.data, customerDetailResponse.district);
        customerDetailResponse.subDistrict = findLabel(subDistrictRes.data, customerDetailResponse.subDistrict);

        setCustomerDetail(customerDetailResponse);

      } catch (error) {
        console.error("Error fetching customer detail:", error);
      }
    };

    fetchCustomerDetail();
  }, [transactionDetail]);

  // get photos
  useEffect(() => {
    const getImages = async (type: "before" | "after" = "before") => {
      let url = `/transaction/${transactionDetail.id}/documents?docType=`;
      if (type === "before") {
        url += "BEFORE";
      } else {
        url += "AFTER";
      }

      const response = await api.get(url);
      const images: TransactionDocument[] = response.data || [];

      if (type === "before") {
        setBeforeImages(images);
      }

      if (type === "after") {
        setAfterImages(images);
      }
    }

    if (transactionDetail) {
      getImages("before");
      getImages("after");
    }
  }, [transactionDetail]);
  if (!transactionDetail || !customerDetail) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-mainColor rounded-full animate-spin" />
      </div>
      // <main className="pb-[20vh] relative">
      //   Memuat...
      // </main>
    );
  }

  const handleAddItem = async (item: Item) => {
    // api post to add item to transaction
    try {
      const payload = {
        serviceCategory: item.category,
        serviceCode: item.service,
        serviceType: item.type === "vakum" ? 0 : 1,
        servicePrice: item.price,
        promoCode: item.promoCode || "",
        promoType: item.promoType || "",
        promoAmount: item.promoAmount || 0,
        quantity: Number(item.quantity) || 1
      }

      await api.post(`/transaction-detail/${transactionDetail.id}`, payload);
      // refresh transaction detail
      const updatedTransaction = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
      setTransactionDetail(updatedTransaction.data as MitraSPKDetail);

    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  const handleDeleteItem = async (id: string) => {
    // api delete to delete item from transaction
    try {
      await api.delete(`/transaction-detail/${transactionDetail.id}/${id}`);
      // refresh transaction detail
      const updatedTransaction = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
      setTransactionDetail(updatedTransaction.data as MitraSPKDetail);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  const handleEditItem = async (id: string, item: Item) => {
    // api put to edit item from transaction
    try {
      const payload = {
        // serviceCategory: item.category,
        // serviceCode: item.service,
        serviceType: item.type === "vakum" ? 0 : 1,
        servicePrice: item.price,
        promoCode: item.promoCode || "",
        promoType: item.promoType || "",
        promoAmount: item.promoAmount || 0,
        quantity: Number(item.quantity) || 1
      }

      // delete and add new item
      // await api.delete(`/transaction-detail/${transactionDetail.id}/${id}`);
      await api.put(`/transaction-detail/${transactionDetail.id}/${item.id}`, payload);
      // refresh transaction detail

      const updatedTransaction = await api.get(`/transaction/detail?trxNumber=${trxNumber}`);
      setTransactionDetail(updatedTransaction.data as MitraSPKDetail);

    }
    catch (error) {
      console.error("Error editing item:", error);
    }
  }

  const toggleUploadBefore = () => {
    setShowUploadBefore(!showUploadBefore);
  }

  const toggleUploadAfter = () => {
    setShowUploadAfter(!showUploadAfter);
  }



  return (
    <TransactionContext.Provider value={{
      transactionDetail,
      customerDetail,
      setTransactionDetail,
      handleAddItem,
      handleDeleteItem,
      handleEditItem,
      showUploadBefore: toggleUploadBefore,
      showUploadAfter: toggleUploadAfter,
      beforeImages,
      afterImages,
      setBeforeImages,
      setAfterImages,
      isImagePreviewOpen,
      setIsImagePreviewOpen

    }}>
      <main className="pb-[20vh] relative">
        <PageBanner
          title={getBannerTitle}
          hide={isImagePreviewOpen}
        />
        <div className="bg-white dark:bg-slate-800 mx-4 rounded-md -m-8 z-30 relative">
          {/* preview */}
          <div>
            {/* summary */}
            <div className="flex items-center justify-between p-4">
              <div className="mr-4">
                <p className="text-lg font-bold">{customerDetail.fullname}</p>
                <p className="text-sm text-orange-400">Nomor Transaksi: {trxNumber}</p>
                <p className={cn("text-sm mt-2 cursor-pointer", extendAddress ? "line-clamp-none" : "line-clamp-1")} onClick={() => setExtendAddress(!extendAddress)}>
                  {customerDetail.address}, {customerDetail.subDistrict}, {customerDetail.district}, {customerDetail.city}, {customerDetail.province}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-mainColor flex items-center justify-center rounded-md">
                  <div className="w-10 h-10">
                    <img src="/assets/mitra-icon.png" className="w-full h-full" alt="Mitra" />
                  </div>
                </div>
              </div>
            </div>

            {/* map */}
            <div className="flex w-full px-4 max-h-48 justify-between">
              <iframe
                src={`https://maps.google.com/maps?q=${customerDetail.latitude},${customerDetail.longitude}&z=14&output=embed`}
                loading="lazy"
                className="w-full h-48 rounded-md"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* divider */}
            <div className="grid grid-cols-5 pb-3 border-b border-bottom-dash border-gray-500"></div>

            {/* Dates and status */}
            <div className="flex mt-4 text-sm justify-around">
              <div className="flex items-center gap-1">
                <AiFillCalendar />
                <p>{new Date(transactionDetail.trxDate).toLocaleDateString('en-GB')}</p>
              </div>
              <div className="flex items-center gap-1">
                <AiFillClockCircle />
                <p>{new Date(transactionDetail.trxDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} WIB</p>
              </div>
              <div className="flex items-center gap-1 text-[#0369A1]">
                <BsClipboard2CheckFill />
                <p>{findStatusLabel(transactionDetail.status)}</p>
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
              <DetailTab />
            )}
            {currentTab === "riwayat" && (
              <RiwayatTab />
            )}
            {currentTab === "foto" && (
              <FotoTab />
            )}
          </div>
        </div>
      </main>
      <DialogWrapper
        className="w-10/12"
        open={showUploadBefore}
        onOpenChange={() => {
          setShowUploadBefore(false);
        }}
      >
        <DialogTitle title="Detail Item Pengerjaan" />
        <div className="p-2 flex flex-col items-center justify-center">
          <img src="/assets/upload.png" className="max-w-1/2" alt="Upload" />
          <p className="font-semibold my-2">Upload Foto</p>
          <p className="text-sm text-gray-500 mb-4">Unggah foto sebelum mulai pengerjaan</p>

          <button
            className="bg-mainColor text-white w-full py-2 px-4 rounded-md"
            onClick={() => {
              setCurrentTab("foto");
              setShowUploadBefore(false);
            }}
          >
            Unggah Sekarang
          </button>

        </div>

      </DialogWrapper>

      <DialogWrapper
        className="w-10/12"
        open={showUploadAfter}
        onOpenChange={() => {
          setShowUploadAfter(false);
        }}
      >
        <DialogTitle title="Detail Item Pengerjaan" />
        <div className="p-2 flex flex-col items-center justify-center">
          <img src="/assets/upload.png" className="max-w-1/2" alt="Upload" />
          <p className="font-semibold my-2">Upload Foto</p>
          <p className="text-sm text-gray-500 mb-4">Unggah foto sesudah pengerjaan</p>

          <button
            className="bg-mainColor text-white w-full py-2 px-4 rounded-md"
            onClick={() => {
              setCurrentTab("foto");
              setShowUploadAfter(false);
            }}
          >
            Unggah Sekarang
          </button>

        </div>

      </DialogWrapper>
    </TransactionContext.Provider>
  );
}
