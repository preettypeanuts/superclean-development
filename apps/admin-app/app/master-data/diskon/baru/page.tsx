"use client";

import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "libs/ui-components/src/components/ui/select";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { Textarea } from "@ui-components/components/ui/textarea";

export default function NewDiscount() {
    return (
        <Wrapper>
            <Header label={`Tambah Diskon Baru`} />
            <form className='space-y-4'>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="kodeDiskon" className="w-1/4 font-semibold">Kode Diskon</Label>
                    <Input placeholder="Masukkan Kode Diskon" id="kodeDiskon" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="namaDiskon" className="w-1/4 font-semibold">Nama Diskon</Label>
                    <Input placeholder="Masukkan Nama Diskon" id="namaDiskon" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="potonganHarga" className="w-1/4 font-semibold">Potongan Harga</Label>
                    <Input placeholder="Masukkan Potongan Harga" type='number' id="potonganHarga" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="category" className="w-1/4 font-semibold">Kategori</Label>
                    <Input placeholder="Masukkan Kategori" id="category" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="layanan" className="w-1/4 font-semibold">Layanan</Label>
                    <Input placeholder="Masukkan Layanan" id="layanan" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="minimalItem" className="w-1/4 font-semibold">Minimal Item</Label>
                    <Input placeholder="Masukkan Minimal Item" type='number' id="minimalItem" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="masaBerlaku" className="w-1/4 font-semibold">Masa Berlaku</Label>
                    <Input className="flex w-full" placeholder="Masukkan Masa Berlaku" type="date" id="masaBerlaku" />
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
