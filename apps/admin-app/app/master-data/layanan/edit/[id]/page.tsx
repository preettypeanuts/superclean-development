"use client"
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

export default function DetailLayanan() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const router = useRouter();

    const detailLayanan = dataLayanan.find(layanan => slugify(layanan.namaLayanan) === id);

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
                        <Label htmlFor="kategori" className="w-1/4 font-semibold">Kategori</Label>
                        <Input id="kategori" defaultValue={detailLayanan.kategori} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="hargaVacuum" className="w-1/4 font-semibold">Harga Vacuum</Label>
                        <Input type='number' id="hargaVacuum" defaultValue={detailLayanan.hargaVacuum} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="hargaCuci" className="w-1/4 font-semibold">Harga Cuci</Label>
                        <Input type='number' id="hargaCuci" defaultValue={detailLayanan.hargaCuci} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-1/4 font-semibold">Status</Label>
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={detailLayanan.status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ubah status layanan</SelectLabel>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="non-aktif">Non-Aktif</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
