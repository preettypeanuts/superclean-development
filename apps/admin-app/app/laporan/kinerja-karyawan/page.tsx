"use client";

import { useState } from "react";
import { DatePicker } from "@ui-components/components/date-picker";
import { Wrapper } from "@shared/components/Wrapper";
import { Input } from "@ui-components/components/ui/input";
import { Button } from "@ui-components/components/ui/button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Search } from "lucide-react";
import { SelectData } from "@ui-components/components/select-data";
import { PaginationNumber } from "@ui-components/components/pagination-number";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "@ui-components/components/select-filter";
import Link from "next/link";
import { FaFileExcel, FaFilePdf } from "react-icons/fa6";

export default function KinerjaKaryawanPage() {
  const [searchInput, setSearchInput] = useState("");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Breadcrumbs label="Kinerja Karyawan" />
      <Wrapper>
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari nama karyawan atau cabang"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-[30lvw]"
                  icon={<Search size={16} />}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    <IoClose size={16} />
                  </button>
                )}
              </div>

              <GroupFilter
                onApply={() => { }}
                onReset={() => { }}
                onCancel={() => { }}
              >
                <SelectFilter
                  label="Status Transaksi"
                  id="status"
                  placeholder="Pilih Status"
                  value=""
                  optionsNumber={[
                    { label: "Menunggu Bayar", value: 3 },
                    { label: "Sudah Bayar", value: 4 },
                    { label: "Selesai", value: 5 },
                  ]}
                  onChange={() => { }}
                />
                <SelectFilter
                  label="Cabang"
                  id="branch"
                  placeholder="Pilih Cabang"
                  value=""
                  optionsString={[]}
                  onChange={() => { }}
                />
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal awal</Label>
                  <DatePicker label="DD/MM/YYYY" value={null} onChange={() => { }} />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal akhir</Label>
                  <DatePicker label="DD/MM/YYYY" value={null} onChange={() => { }} />
                </div>
              </GroupFilter>

              <Button variant="main">Cari</Button>
            </div>
            <div className="space-x-2">
              <Link href="#">
                <Button type="submit" variant={"main"}>
                  <FaFilePdf />
                  Ekspor  PDF
                </Button>
              </Link>
              <Link href="#">
                <Button type="submit">
                  <FaFileExcel size={16} />
                  Ekspor Data Excel
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-muted-foreground text-sm py-7 my-3 border-y">
            Saat ini belum ada data yang dapat ditampilkan
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Label className="text-xs">Tidak ada data ditampilkan</Label>
          <PaginationNumber
            totalPages={1}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </Wrapper>
    </>
  );
}
