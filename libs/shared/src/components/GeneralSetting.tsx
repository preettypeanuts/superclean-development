"use client"
import { useEffect, useState } from "react";
import { Label } from "../../../ui-components/src/components/ui/label";
import { Input } from "../../../ui-components/src/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../ui-components/src/components/ui/select";
import { Button } from "../../../ui-components/src/components/ui/button";
import { useTheme } from "next-themes";
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

export const GeneralSetting = () => {
    const [brandName, setBrandName] = useState("Superclean");
    const [logo, setLogo] = useState<File | null>(null);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(resolvedTheme);

    // Update state saat tema berubah
    useEffect(() => {
        setCurrentTheme(resolvedTheme);
    }, [resolvedTheme]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setLogo(file);
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Input Brand Name */}
            <div className="flex items-center space-x-4">
                <Label className="w-1/4" htmlFor="brand-name">Nama Brand</Label>
                <Input
                    id="brand-name"
                    placeholder="Masukkan nama brand"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                />
            </div>

            {/* Input Brand Logo */}
            <div className="flex items-center space-x-4">
                <Label className="w-1/4" htmlFor="brand-logo">Logo Brand</Label>
                <Input
                    id="brand-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    
                />
                {logo && (
                    <p className="text-xs text-muted-foreground">
                        {logo.name} ({Math.round(logo.size / 1024)} KB)
                    </p>
                )}
            </div>

            {/* Select Theme */}
            <div className="flex items-center space-x-4">
                <Label className="w-1/4" htmlFor="theme">Tema</Label>
                <Select value={theme} onValueChange={(val: string) => setTheme(val)}>
                    <SelectTrigger id="theme">
                        <SelectValue placeholder="Pilih tema" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light" onClick={() => setTheme("light")}>Terang</SelectItem>
                        <SelectItem value="dark" onClick={() => setTheme("dark")}>Gelap</SelectItem>
                        <SelectItem value="system" onClick={() => setTheme("system")}>Ikuti Sistem</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tombol Simpan */}
            <div className="flex items-center space-x-4">
                <div className="w-[19.7%]"></div>
                <Button>Simpan Perubahan</Button>
            </div>
        </div>
    );
};
