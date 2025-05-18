"use client"
import { Wrapper } from "@shared/components/Wrapper";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RupiahInput } from "@ui-components/components/rupiah-input";
import { Button } from "@ui-components/components/ui/button";
import { Checkbox } from "@ui-components/components/ui/checkbox";
import { Input } from "@ui-components/components/ui/input";
import { Label } from "@ui-components/components/ui/label";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const Title = ({ children }: { children: ReactNode }) => (
  <p className="px-2 py-2 bg-mainColor/10 rounded-md font-semibold text-mainDark mb-3">
    {children}
  </p>
)

export default function PengaturanPage() {
  const router = useRouter();
  return (
    <>
      <Breadcrumbs label="Pengaturan" />
      <Wrapper className="space-y-6">
        <main>
          <Title>
            Informasi Rekening
          </Title>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="namaPerusahaan" className="w-1/4 font-semibold">Nama Perusahaan</Label>
              <Input placeholder="Masukkan Nama Perusahaan" id="namaPerusahaan" />
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="rekeningPerusahaan" className="w-1/4 font-semibold">Rekening Perusahaan</Label>
              <Input placeholder="Masukkan Rekening Perusahaan" id="rekeningPerusahaan" />
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="bankPenerbit" className="w-1/4 font-semibold">Bank Penerbit</Label>
              <Input placeholder="Masukkan Penerbit" id="bankPenerbit" />
            </div>
          </div>
        </main>

        <main>
          <Title>
            Target Karyawan
          </Title>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="kantorPusat" className="w-1/4 font-semibold">Kantor Pusat</Label>
              <RupiahInput placeholder="Rp 0" id="kantorPusat" />
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="kantorCabang" className="w-1/4 font-semibold">Kantor Cabang</Label>
              <RupiahInput placeholder="Rp 0" id="kantorCabang" />
            </div>
          </div>
        </main>

        <main>
          <Title>
            Pemberitahuan
          </Title>
          <div className="text-sm mb-2">
            Pilih saluran yang Anda inginkan untuk mengirim notifikasi dari aplikasi
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="sms" />
              <Label
                htmlFor="sms"
              >
                SMS
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="email" />
              <Label
                htmlFor="email"
              >
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="whatsapp" />
              <Label
                htmlFor="whatsapp"
              >
                Whatsapp
              </Label>
            </div>
          </div>
        </main>
        <div className="flex justify-end w-full space-x-2">
          <Button type="button" variant="outline2" onClick={() => router.push("/master-data/karyawan")}>
            Kembali
          </Button>
          <Button type="submit" variant="main">
            Simpan
          </Button>
        </div>
      </Wrapper >
    </>
  );
}



