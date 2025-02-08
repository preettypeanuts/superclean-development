import { FaClipboardList, FaFileInvoice, FaCog, FaUserCircle } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";

export const navigationItems = {
    menu: {
        label: "Main Menu",
        contents: [
            {
                label: "Dashboard",
                path: "/",
                icon: <TbLayoutDashboardFilled />,
            },
            {
                label: "Management",
                path: "/management",
                icon: <FaClipboardList />,
                subs: [
                    { name: "Orders", path: "/orders" },
                    { name: "Clients", path: "/clients" },
                    { name: "Partners", path: "/partners" },
                ]
            },
            {
                label: "Finance",
                path: "/finance",
                icon: <FaFileInvoice />,
                subs: [
                    { name: "Orders", path: "/orders" },
                    { name: "Clients", path: "/clients" },
                    { name: "Partners", path: "/partners" },
                ]
            }
        ]
    },
    settings: {
        label: "Settings",
        contents: [
            {
                label: "Profile",
                path: "/profile",
                icon: <FaUserCircle />,
            },
            {
                label: "Preferences",
                path: "/preferences",
                icon: <FaCog />,
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
    headLine: "Welcome Back!",
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
