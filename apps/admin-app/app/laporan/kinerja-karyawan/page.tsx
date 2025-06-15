"use client";
import Link from "next/link";
import { useState } from "react";
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
import { useParameterStore } from "@shared/utils/useParameterStore";

export default function KinerjaKaryawanPage() {
  const [reportType, setReportType] = useState<"ringkasan" | "detail">("ringkasan");
  const [searchInput, setSearchInput] = useState("");

  const { roleMapping, branchMapping } = useParameterStore();

  console.log('======role==============================');
  console.log(roleMapping);
  console.log('====================================');

  // filter aktif
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // filter sementara
  const [tempStatus, setTempStatus] = useState<number>(0);
  const [tempBranch, setTempBranch] = useState<string>("");
  const [tempRole, setTempRole] = useState<string>("");
  const [tempStartDate, setTempStartDate] = useState<Date>();
  const [tempEndDate, setTempEndDate] = useState<Date>();

  const handleApplyFilters = () => {
    setStatusFilter(tempStatus);
    setBranchFilter(tempBranch);
    setRoleFilter(tempRole);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const handleResetFilters = () => {
    setTempStatus(0);
    setTempBranch("");
    setTempRole("");
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };

  const handleCancelFilters = () => {
    setTempStatus(statusFilter);
    setTempBranch(branchFilter);
    setTempRole(roleFilter);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  // Convert roleMapping object to array format for SelectFilter
  const roleOptions = roleMapping
    ? Object.entries(roleMapping).map(([value, label]) => ({
      label: label,
      value: value
    }))
    : [];

  return (
    <>
      <Breadcrumbs label="Kinerja Karyawan" />
      <Wrapper>
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex items-center space-x-4 min-w-[200px]">

                  <RadioGroup
                    value={reportType}
                    onValueChange={(value) => setReportType(value as "ringkasan" | "detail")}
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
                  >
                    <IoClose size={16} />
                  </button>
                )}
              </div>

              <GroupFilter
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onCancel={handleCancelFilters}
              >
                <SelectFilter
                  label="Nama Karyawan"
                  id="userName"
                  placeholder="Pilih Karyawan"
                  value={tempRole}
                  optionsString={Object.entries(roleMapping).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  onChange={setTempRole}
                />
                <SelectFilter
                  label="Akses Pengguna"
                  id="role"
                  placeholder="Pilih Role"
                  value={tempRole}
                  optionsString={Object.entries(roleMapping).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  onChange={setTempRole}
                />
                <SelectFilter
                  label="Cabang"
                  id="branch"
                  placeholder="Pilih Cabang"
                  value={tempBranch}
                  optionsString={Object.entries(branchMapping).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  onChange={setTempBranch}
                />
                <div className="flex items-center space-x-4">
                  <Label className={`w-1/2 font-semibold capitalize`}>
                    Tanggal awal
                  </Label>

                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempStartDate}
                    onChange={(date) => setTempStartDate(date)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className={`w-1/2 font-semibold capitalize`}>
                    Tanggal akhir
                  </Label>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={tempEndDate}
                    onChange={(date) => setTempEndDate(date)}
                  />
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
      </Wrapper>
    </>
  );
}