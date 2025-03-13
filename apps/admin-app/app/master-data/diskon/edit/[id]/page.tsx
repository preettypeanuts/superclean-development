"use client"
import { usePathname } from 'next/navigation';
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { dataPelanggan } from "../../page";
import slugify from "libs/utils/slugify"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select"
import { useRouter } from 'next/navigation';
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

export default function EditPelanggan() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const router = useRouter();

    const detailPelanggan = dataPelanggan.find(pelanggan => slugify(pelanggan.name) === id);

    return (
        <Wrapper>
            <Header label={`Edit Profil ${detailPelanggan ? detailPelanggan.name : ""}`} />
            {detailPelanggan && (
                <form className='space-y-4'>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="name" className="w-1/4 font-semibold">Name</Label>
                        <Input id="name" defaultValue={detailPelanggan.name} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="phone" className="w-1/4 font-semibold">Phone</Label>
                        <Input type='text' id="phone" defaultValue={detailPelanggan.phone} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="alamat" className="w-1/4 font-semibold">Alamat</Label>
                        <Input type='text' id="alamat" defaultValue={detailPelanggan.alamat} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="provinsi" className="w-1/4 font-semibold">Provinsi</Label>
                        <Input type='text' id="provinsi" defaultValue={detailPelanggan.provinsi} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="kota" className="w-1/4 font-semibold">Kota</Label>
                        <Input type='text' id="kota" defaultValue={detailPelanggan.kota} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="kecamatan" className="w-1/4 font-semibold">Kecamatan</Label>
                        <Input type='text' id="kecamatan" defaultValue={detailPelanggan.kecamatan} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="kodePos" className="w-1/4 font-semibold">Kode Pos</Label>
                        <Input type='text' id="kodePos" defaultValue={detailPelanggan.kodePos} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="tanggalDaftar" className="w-1/4 font-semibold">Tanggal Daftar</Label>
                        <Input type='text' id="tanggalDaftar" defaultValue={detailPelanggan.tanggalDaftar} disabled />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="didaftarkanOleh" className="w-1/4 font-semibold">Didaftarkan Oleh</Label>
                        <Input type='text' id="didaftarkanOleh" defaultValue={detailPelanggan.didaftarkanOleh} disabled />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-1/4 font-semibold">Status</Label>
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={detailPelanggan.status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ubah status pelanggan</SelectLabel>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="non-aktif">Non-Aktif</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4"></div>
                        <div className=" space-x-2 flex w-full">
                            <Button type="button" variant={"destructive"} className="text-foreground w-[10lvw]" onClick={() => router.push('/master-data/pelanggan')}>
                                <TbCancel />
                                Batal
                            </Button>
                            <Button type="submit" variant={"default"} className="bg-success text-foreground hover:bg-green-600 w-[10lvw]">
                                <LuSave />
                                Simpan
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Wrapper>
    );
}
