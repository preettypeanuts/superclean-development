"use client"
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { RiNotification4Fill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

export const NavigationBar = () => {
    const [activeTab, setActiveTab] = useState('beranda');

    const navigationItems = [
        {
            id: 'beranda',
            label: 'Beranda',
            icon: AiFillHome,
            path: '/'
        },
        {
            id: 'pemberitahuan',
            label: 'Pemberitahuan',
            icon: RiNotification4Fill,
            path: '/pemberitahuan'
        },
        {
            id: 'profil',
            label: 'Profil',
            icon: MdAccountCircle,
            path: '/profil'
        }
    ];

    const router = useRouter();

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        const item = navigationItems.find(nav => nav.id === tabId);
        if (item) {
            router.push(item.path);
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full h-[90px] shadow-secondaryShadow flex items-center justify-evenly backdrop-blur-xl bg-white/70 rounded-t-2xl z-50">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                    <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`
                            relative flex flex-col gap-[4px] items-center justify-center 
                            transition-all duration-300 ease-in-out
                            py-2 px-4 rounded-xl
                            ${isActive 
                                ? 'text-mainColor' 
                                : 'text-muted-foreground hover:text-mainColor/70'
                            }
                        `}
                    >
                        
                        {/* Icon with active state animation */}
                        <div className={`
                            transition-all duration-300 ease-in-out
                            ${isActive ? 'transform' : ''}
                        `}>
                            <Icon size={26} />
                        </div>
                        
                        {/* Label with active state styling */}
                        <p className={`
                            text-[14px] font-medium transition-all duration-300
                            ${isActive ? 'text-mainColor font-semibold' : 'text-muted-foreground'}
                        `}>
                            {item.label}
                        </p>
                        
                    </button>
                );
            })}
        </nav>
    );
};

