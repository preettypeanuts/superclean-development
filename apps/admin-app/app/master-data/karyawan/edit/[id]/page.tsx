"use client"
import { usePathname } from 'next/navigation';
import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { dataKaryawan } from "../../page";
import slugify from "libs/utils/slugify"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select"
import { useRouter } from 'next/navigation';
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { Checkbox } from "libs/ui-components/src/components/ui/checkbox";
import { useState } from 'react';

export default function DetailKaryawan() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();
    const router = useRouter();

    const detailKaryawan = dataKaryawan.find(karyawan => slugify(karyawan.name) === id);
    const [status, setStatus] = useState(detailKaryawan?.status || false);

    return (
        <Wrapper>
            <Header label={`Edit Profil ${detailKaryawan ? detailKaryawan.name : ""}`} />
            {detailKaryawan && (
                <form className='space-y-4'>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="userName" className="w-1/4 font-semibold">Username</Label>
                        <Input id="userName" defaultValue={detailKaryawan.userName} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="name" className="w-1/4 font-semibold">Name</Label>
                        <Input id="name" defaultValue={detailKaryawan.name} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="phone" className="w-1/4 font-semibold">Phone</Label>
                        <Input type='text' id="phone" defaultValue={detailKaryawan.phone} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="status" className="w-[20%] font-semibold">Status</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="status" checked={status} onCheckedChange={(checked) => setStatus(checked === true)} />
                            <Label htmlFor="status" className="font-semibold">{status ? "Aktif" : "Non-Aktif"}</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="cabang" className="w-1/4">Cabang</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={detailKaryawan.cabang} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ubah lokasi cabang</SelectLabel>
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
                            <Button type="button" variant={"destructive"} className="text-foreground w-[10lvw]" onClick={() => router.push('/master-data/karyawan')}>
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