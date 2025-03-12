import { Wrapper } from "@shared/components/Wrapper";
import { Header } from "@shared/components/Header";
import slugify from "libs/utils/slugify"
import { Input } from "libs/ui-components/src/components/ui/input";
import { Label } from "libs/ui-components/src/components/ui/label";
import { Button } from "libs/ui-components/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select"
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

export default function NewLayanan() {
    return (
        <Wrapper>
            <Header label={`Tambah Karyawan Baru`} />
            <form className='space-y-4'>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="userName" className="w-1/4 font-semibold">Kode Layanan</Label>
                    <Input placeholder="Masukkan kode layanan" id="userName" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="name" className="w-1/4 font-semibold">Nama Layanan</Label>
                    <Input placeholder="Masukkan nama layanan" id="name" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="cabang" className="w-1/4">Kategori</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={"Pilih kategori layanan"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Kategori</SelectLabel>
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
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Harga Vacum</Label>
                    <Input placeholder="Rp,-" type='number' id="phone" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="phone" className="w-1/4 font-semibold">Harga Cuci</Label>
                    <Input placeholder="Rp,-" type='number' id="phone" />
                </div>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="status" className="w-1/4 font-semibold">Status</Label>
                    <Select >
                        <SelectTrigger className="w-full">
                            <SelectValue className="placeholder:text-opacity-0" placeholder="Pilih status karyawan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="non-aktif">Non-Aktif</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
               
                <div className="flex items-center space-x-4">
                    <div className="w-1/4"></div>
                    <div className=" space-x-2 flex w-full">
                        <Button type="button" variant={"destructive"} className="text-foreground w-[10lvw]">
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