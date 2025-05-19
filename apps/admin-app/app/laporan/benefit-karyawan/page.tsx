"use client";
import Link from "next/link";
import { useState, useCallback } from "react";
import { DatePicker } from "@ui-components/components/date-picker";
import { Wrapper } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Label } from "@ui-components/components/ui/label";
import { IoClose } from "react-icons/io5";
import { GroupFilter } from "@ui-components/components/group-filter";
import { SelectFilter } from "@ui-components/components/select-filter";
import { FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";

export default function BenefitKaryawanPage() {
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Handler menggunakan useCallback untuk mencegah warning eslint react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(() => {
    // implementasi filter jika ada
  }, []);

  const handleResetFilter = useCallback(() => {
    setStatus("");
    setBranch("");
    setStartDate(null);
    setEndDate(null);
    setSearchInput("");
  }, []);

  const handleCancelFilter = useCallback(() => {
    // bisa set state atau close dialog filter jika ada
  }, []);

  return (
    <>
      <Breadcrumbs label="Benefit Karyawan" />
      <Wrapper>
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex items-center space-x-4 min-w-[300px]">
                  <RadioGroup
                    // value={pelanggan.customerType}
                    // onValueChange={(value) => handleSelectChange("customerType", value)}
                    className="flex items-center gap-5"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ringkasan" id="ringkasan" />
                      <Label className="w-1/2 capitalize" htmlFor="ringkasan">Ringkasan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="detail" id="detail" />
                      <Label className="w-1/2 capitalize" htmlFor="detail">Detail</Label>
                    </div>
                  </RadioGroup>
                </div>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    aria-label="Clear search"
                  >
                    <IoClose size={16} />
                  </button>
                )}
              </div>

              <GroupFilter
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                onCancel={handleCancelFilter}
              >
                <SelectFilter
                  label="Status Transaksi"
                  id="status"
                  placeholder="Pilih Status"
                  value={status}
                  optionsNumber={[
                    { label: "Menunggu Bayar", value: 3 },
                    { label: "Sudah Bayar", value: 4 },
                    { label: "Selesai", value: 5 },
                  ]}
                  onChange={(val) => setStatus(val)}
                />
                <SelectFilter
                  label="Cabang"
                  id="branch"
                  placeholder="Pilih Cabang"
                  value={branch}
                  optionsString={[]}
                  onChange={(val) => setBranch(val)}
                />
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal awal</Label>
                  <DatePicker label="DD/MM/YYYY" value={startDate} onChange={setStartDate} />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-1/2 font-semibold capitalize">Tanggal akhir</Label>
                  <DatePicker label="DD/MM/YYYY" value={endDate} onChange={setEndDate} />
                </div>
              </GroupFilter>

              <Button variant="main" onClick={handleApplyFilter}>Cari</Button>
            </div>
            <div className="space-x-2">
              <Link href="#" passHref>
                <Button type="button" variant="main">
                  <FaFilePdf />
                  Ekspor PDF
                </Button>
              </Link>
              <Link href="#" passHref>
                <Button type="button">
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
      </Wrapper>
    </>
  );
}
