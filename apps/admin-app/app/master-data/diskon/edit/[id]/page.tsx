"use client"
import { usePathname } from 'next/navigation';
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { discountData } from "../../page";
import slugify from "libs/utils/slugify"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select"
import { useRouter } from 'next/navigation';
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

export default function EditDiskon() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const router = useRouter();

    const detailDiskon = discountData.find(diskon => slugify(diskon.namaDiskon) === id);

    return (
        <Wrapper>
            <Header label={`Edit Diskon ${detailDiskon ? detailDiskon.namaDiskon : ""}`} />
            {detailDiskon && (
                <form className='space-y-4'>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="kodeDiskon" className="w-1/4 font-semibold">Kode Diskon</Label>
                        <Input id="kodeDiskon" defaultValue={detailDiskon.kodeDiskon} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="namaDiskon" className="w-1/4 font-semibold">Nama Diskon</Label>
                        <Input type='text' id="namaDiskon" defaultValue={detailDiskon.namaDiskon} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="potonganHarga" className="w-1/4 font-semibold">Potongan Harga</Label>
                        <Input type='text' id="potonganHarga" defaultValue={detailDiskon.potonganHarga} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="layanan" className="w-1/4 font-semibold">Layanan</Label>
                        <Input type='text' id="layanan" defaultValue={detailDiskon.layanan} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="minimal" className="w-1/4 font-semibold">Minimal Item</Label>
                        <Input type='number' id="minimal" defaultValue={detailDiskon.minimal} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="masaBerlaku" className="w-1/4 font-semibold">Masa Berlaku</Label>
                        <Input type='text' id="masaBerlaku" defaultValue={detailDiskon.masaBerlaku} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="category" className="w-1/4 font-semibold">Category</Label>
                        <Input type='text' id="category" defaultValue={detailDiskon.category} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-1/4 font-semibold">Satuan</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={detailDiskon.category} />
                            </SelectTrigger>
                            <SelectContent>
                                {discountData.map((disc, index) => (
                                    <SelectItem key={index} value="aktif">{disc.category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-1/4"></div>
                        <div className=" space-x-2 flex w-full">

                            <Button type="button" variant={"destructive"} className="text-foreground w-[10lvw]" onClick={() => router.push('/master-data/diskon')}>
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
