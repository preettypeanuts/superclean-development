"use client"
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { dataLayanan } from "../../page";
import slugify from "libs/utils/slugify"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select"
import { useRouter } from 'next/navigation';
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";

export default function DetailLayanan() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const router = useRouter();

    const detailLayanan = dataLayanan.find(layanan => slugify(layanan.namaLayanan) === id);
    const [status, setStatus] = useState(detailLayanan?.status || false);

    return (
        <Wrapper>
            <Header label={`Edit Profil ${detailLayanan ? detailLayanan.namaLayanan : ""}`} />
            {detailLayanan && (
                <form className='space-y-4'>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="kodeLayanan" className="w-1/4 font-semibold">Kode Layanan</Label>
                        <Input id="kodeLayanan" defaultValue={detailLayanan.kodeLayanan} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="namaLayanan" className="w-1/4 font-semibold">Nama Layanan</Label>
                        <Input id="namaLayanan" defaultValue={detailLayanan.namaLayanan} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-1/4 font-semibold">Kategori</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={detailLayanan.kategori} />
                            </SelectTrigger>
                            <SelectContent>
                                {dataLayanan.map((layanan, index) => (
                                    <SelectItem key={index} value="aktif">{layanan.kategori}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-1/4 font-semibold">Satuan</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={detailLayanan.satuan} />
                            </SelectTrigger>
                            <SelectContent>
                                {dataLayanan.map((layanan, index) => (
                                    <SelectItem key={index} value="aktif">{layanan.satuan}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {detailLayanan.kategori === "General" ? (
                        <div className="flex items-center space-x-4">
                            <Label htmlFor="hargaGeneral" className="w-1/4 font-semibold">Harga General</Label>
                            <Input type='number' id="hargaGeneral" defaultValue={detailLayanan.hargaGeneral} />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center space-x-4">
                                <Label htmlFor="hargaCuci" className="w-1/4 font-semibold">Harga Cuci</Label>
                                <Input type='number' id="hargaCuci" defaultValue={detailLayanan.hargaCuci} />
                            </div>
                            <div className="flex items-center space-x-4">
                                <Label htmlFor="hargaVacuum" className="w-1/4 font-semibold">Harga Vacuum</Label>
                                <Input type='number' id="hargaVacuum" defaultValue={detailLayanan.hargaVacuum} />
                            </div>
                        </>
                    )}

                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-[20%] font-semibold">Status</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="status" checked={status} onCheckedChange={(checked) => setStatus(checked === true)} />
                            <Label htmlFor="status" className="font-semibold">{status ? "Aktif" : "Tidak Aktif"}</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4"></div>
                        <div className=" space-x-2 flex w-full">
                            <Button type="button" variant={"destructive"} className="text-foreground w-[10lvw]" onClick={() => router.push('/master-data/layanan')}>
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
