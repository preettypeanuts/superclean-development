import { useToast } from "libs/ui-components/src/hooks/use-toast";
import { api } from "libs/utils/apiClient";
import { formatRupiah } from "libs/utils/formatRupiah";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { TrxStatus } from "../../../shared/src/data/system";
import { DeleteDialog } from "./delete-dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface TableHeader {
  key: string;
  label: string;
}

interface SPK {
  id: string;
  trxNumber: string;
  noWhatsapp: string;
  customerName: string;
  branchId: string;
  finalPrice: number;
  trxDate: string;
  status: number;
  createdBy: string;
  createdAt: string;
  cleaner: string;
  includeBlower?: number;
}

interface DataTableProps {
  data: SPK[];
  columns: TableHeader[];
  currentPage: number;
  limit: number;
  fetchData: () => void; // Add fetchData property
}

export const SPKTable: React.FC<DataTableProps> = ({ data, columns, currentPage, limit, fetchData }) => {
  const { toast } = useToast();

  const [selectedSPK, setSelectedSPK] = useState<SPK | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    console.log(selectedSPK);

    try {
      const response = await api.put(`/transaction/${selectedSPK?.id}/status`, {
        status: TrxStatus.CANCEL
      });

      if (response.status === 'success') {
        toast({
          title: "Sukses!",
          description: `SPK ${selectedSPK?.trxNumber} berhasil dibatalkan.`,
        });
        fetchData();
      } else {
        toast({
          title: "Gagal!",
          description: "Terjadi kesalahan saat membatalkan SPK.",
          variant: "destructive",
        });
      }

      setTimeout(() => {
        fetchData();
      }, 500);

    } catch (error) {
      toast({
        title: "Error!",
        description: "Terjadi kesalahan. Coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setSelectedSPK(null);
    }
  };

  const statusColors: Record<string, string> = {
    "Baru": "bg-secondaryColor text-secondaryColorDark dark:bg-secondaryColorDark dark:text-secondaryColor",
    "Proses": "bg-yellow-100 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-100",
    "Batal": "bg-red-100 text-red-600 dark:bg-red-600 dark:text-red-100",
  };
  const pingColor: Record<string, string> = {
    "Baru": "bg-secondaryColorDark dark:brightness-125",
    "Proses": "dark:bg-yellow-300 bg-yellow-600",
    "Batal": "dark:bg-red-300 bg-red-600",
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((header) => (
              <TableHead
                key={header.key}
                className={`${header.key === "menu" ? "w-[100px]" : ""} truncate`}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((spk, rowIndex) => {
            return (
              <TableRow
                key={spk.id}
                className={rowIndex % 2 === 0 ? "" : "bg-neutral-300/20 dark:bg-neutral-500/20"}
              >
                {columns.map((header) => {
                  return (
                    <TableCell key={header.key} className={header.key === "menu" ? "!w-fit" : ""}>
                      {header.key === "menu" ? (
                        <div className="w-fit flex gap-2 items-center">
                          <Link href={`/transaksi/spk/edit/${spk.trxNumber}`}>
                            <Button size="icon" variant="main">
                              <HiMiniPencilSquare />
                            </Button>
                          </Link>
                          {
                            spk.status !== TrxStatus.CANCEL && (
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedSPK(spk);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <HiOutlineX className="h-6 w-6 text-white" />
                              </Button>
                            )
                          }
                        </div>
                      ) : header.key === "status" ? (
                        <p className={`badge rounded-md !font-medium border-0 ${statusColors[
                          (() => {
                            switch (spk.status) {
                              case TrxStatus.TODO: return "Baru";
                              case TrxStatus.ACCEPT: return "Proses";
                              case TrxStatus.CANCEL: return "Batal";
                              default: return spk.status;
                            }
                          })()
                        ]
                          }`}>
                          {(() => {
                            switch (spk.status) {
                              case TrxStatus.TODO: return "Baru";
                              case TrxStatus.ACCEPT: return "Proses";
                              case TrxStatus.CANCEL: return "Batal";
                              default: return spk.status;
                            }
                          })()}
                        </p>
                      ) : header.key === "id" ? (
                        <p>{(currentPage - 1) * limit + rowIndex + 1}</p>
                      ) : header.key === "cleaner" ? (
                        <p className="cursor-default" title={spk.cleaner}>
                          {spk.cleaner?.length > 30
                            ? spk.cleaner.slice(0, 30) + "..."
                            : spk.cleaner}
                        </p>
                      ) : header.key === "includeBlower" ? (
                        <p>{spk.includeBlower === 1 ? "Ya" : "Tidak"}</p>
                      ) :
                        header.key === "noWhatsapp" ? (
                          <p>{spk.noWhatsapp}</p>
                        ) : header.key === "finalPrice" ? (
                          <p>{formatRupiah(Number(spk.finalPrice))}</p>
                        ) : header.key === "trxDate" ? (
                          <p>{new Date(spk.trxDate).toLocaleDateString('en-GB')}</p>
                        ) : header.key === "trxNumber" ? (
                          <div className="flex items-center">
                            <div className={`mr-2 rounded-full w-[6px] h-[6px] ${pingColor[
                              (() => {
                                switch (spk.status) {
                                  case TrxStatus.TODO: return "Baru";
                                  case TrxStatus.ACCEPT: return "Proses";
                                  case TrxStatus.CANCEL: return "Batal";
                                  default: return spk.status;
                                }
                              })()
                            ]
                              }`}
                            ></div>
                            <p>{spk.trxNumber}</p>
                          </div>
                        ) : (
                          spk[header.key as keyof SPK]
                        )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {selectedSPK && (
        <DeleteDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onConfirm={() => handleDelete()}
          isLoading={false}
          icon={<HiOutlineX className="h-6 w-6 text-white" />}
          title={`Kamu yakin membatalkan SPK ${selectedSPK.trxNumber}?`}
          itemName={selectedSPK.customerName}
          cancelLabel="Batal"
          confirmLabel="Ya, Batalkan SPK"
        />
      )}
    </>
  );
};

