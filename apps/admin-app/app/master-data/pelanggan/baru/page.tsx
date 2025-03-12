"use client";

import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import slugify from "libs/utils/slugify"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select"
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { Textarea } from "@ui-components/components/ui/textarea";
export default function NewPelanggan() {
    return (
        <Wrapper>
            <Header label={`Tambah Pelanggan Baru`} />
            <form className='space-y-4'>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="userName" className="w-1/4 font-semibold">Nama Lengkap</Label>
                    <Input placeholder="Masukkan Nama Lengkap" id="namaLengkap" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">No. Whatsapp</Label>
                    <Input placeholder="Masukkan nomor Whatsapp" type='text' id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Alamat</Label>
                    <Textarea placeholder="Masukkan alamat" id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Provinsi</Label>
                    <Input placeholder="Masukkan Provinsi" type='text' id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Kota</Label>
                    <Input placeholder="Masukkan Kota" type='text' id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Kecamatan</Label>
                    <Input placeholder="Masukkan Kecamatan" type='text' id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Kelurahan</Label>
                    <Input placeholder="Masukkan Kelurahan" type='text' id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Kode Pos</Label>
                    <Input placeholder="Masukkan Kode Pos" type='text' id="wa" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="name" className="w-1/4 font-semibold">Tanggal Daftar</Label>
                    <Input className="flex w-full" placeholder="Masukkan Tanggal Daftar" type="date" id="date" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="cabang" className="w-1/4">Didaftarkan Oleh</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={"Pilih PIC Pendaftaran"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="jabodetabek">Jabodetabek</SelectItem>
                                <SelectItem value="bandung">Bandung</SelectItem>
                                <SelectItem value="jogja">Jogja</SelectItem>
                                <SelectItem value="surabaya">Surabaya</SelectItem>
                                <SelectItem value="semarang">Semarang</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="w-1/4"></div>
                    <div className=" space-x-2 flex w-full">
                        <Button type="button" variant={"destructive"} className="text-foreground w-[10lvw]" onClick={() => window.history.back()}>
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
        </Wrapper>
    )
}