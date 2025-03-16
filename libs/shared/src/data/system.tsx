import { FaHandsHelping } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { HiDocumentReport } from "react-icons/hi";
import { FaChartSimple } from "react-icons/fa6";
import { RiNotification4Fill, RiUserSettingsFill } from "react-icons/ri";

export const navigationItems = {
    menu: {
        label: "Main Menu",
        contents: [
            {
                label: "Dashboard",
                path: "/",
                icon: <TbLayoutDashboardFilled />,
                subs: []
            },
            {
                label: "master data",
                path: "/master-data",
                icon: <FaChartSimple />,
                subs: [
                    { name: "karyawan", path: "/master-data/karyawan" },
                    { name: "pelanggan", path: "/master-data/pelanggan" },
                    { name: "layanan", path: "/master-data/layanan" },
                    { name: "diskon", path: "/master-data/diskon" },
                ]
            },
            {
                label: "transaksi",
                path: "/transaksi",
                icon: <FaHandsHelping />,
                subs: [
                    { name: "SPK", path: "/transaksi/SPK" },
                    { name: "settlement", path: "/transaksi/settlement" },
                ]
            },
            // {
            //     label: "public",
            //     path: "/public",
            //     icon: <FaGlobe />,
            //     subs: [
            //         { name: "konfirmasi pembayaran", path: "/konfirmasi-pembayaran" },
            //         { name: "rating", path: "/rating" },
            //         { name: "Partners", path: "/partners" },
            //     ]
            // },
            {
                label: "laporan",
                path: "/laporan",
                icon: <HiDocumentReport />,
                subs: [
                    { name: "pemesanan", path: "/pemesanan" },
                    { name: "teknisi", path: "/teknisi" },
                ]
            }
        ]
    },
    settings: {
        label: "Pengaturan",
        contents: [
            {
                label: "settings",
                path: "/settings",
                icon: <RiUserSettingsFill />,
                subs: []
            },
            {
                label: "pemberitahuan",
                path: "/pemberitahuan",
                icon: <RiNotification4Fill />,
                subs: []
            }
        ]
    }
};

export const registerPageData = {
    headLine: "Daftar Sebagai Admin",
    tagLine: "Hanya pengguna yang berwenang yang dapat mendaftar sebagai admin.",
    bgImage: "https://images.unsplash.com/photo-1541261376025-872d4f4dd733?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    forms: [
        {
            label: "Nama Lengkap",
            name: "fullName",
            type: "text",
            placeholder: "Masukkan nama lengkap Anda",
            required: true,
        },
        {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Gunakan email resmi perusahaan",
            required: true,
        },
        {
            label: "Kata Sandi",
            name: "password",
            type: "password",
            placeholder: "Buat kata sandi yang kuat",
            required: true,
        },
        {
            label: "Konfirmasi Kata Sandi",
            name: "confirmPassword",
            type: "password",
            placeholder: "Ulangi kata sandi Anda",
            required: true,
        },
    ]
};

export const loginPageData = {
    headLine: "Login",
    tagLine: "Silakan masuk untuk melanjutkan.",
    bgImage: "https://images.unsplash.com/photo-1567857171318-944337972f90?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    forms: [
        {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Masukkan email Anda",
            required: true,
        },
        {
            label: "Kata Sandi",
            name: "password",
            type: "password",
            placeholder: "Masukkan kata sandi Anda",
            required: true,
        }
    ]
};
