"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../../ui-components/src/components/ui/tabs";
import { Button } from "../../../../ui-components/src/components/ui/button";
import { Checkbox } from "../../../../ui-components/src/components/ui/checkbox";
import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsCheckCircle } from "react-icons/bs";
import { DeleteDialog } from "../../../../ui-components/src/components/delete-dialog";

// Dummy data
const allNotifications = [
    {
        id: 1,
        date: "12/02/2025",
        title: "SPK Baru",
        desc: "SPK baru telah masuk ke sistem. Silakan cek detailnya dan lakukan proses selanjutnya",
        read: false
    },
    {
        id: 2,
        date: "12/02/2025",
        title: "SPK Baru",
        desc: "SPK baru telah masuk ke sistem. Silakan cek detailnya dan lakukan proses selanjutnya",
        read: false
    },
    {
        id: 3,
        date: "12/02/2025",
        title: "Pembayaran Diterima",
        desc: "Transaksi dengan nomor TRX-001 telah melakukan pembayaran",
        read: true
    },
    {
        id: 4,
        date: "12/02/2025",
        title: "Pembayaran Diterima",
        desc: "Transaksi dengan nomor TRX-001 telah melakukan pembayaran",
        read: false
    },
    {
        id: 5,
        date: "12/02/2025",
        title: "SPK Baru",
        desc: "SPK baru telah masuk ke sistem. Silakan cek detailnya dan lakukan proses selanjutnya",
        read: false
    },
    {
        id: 6,
        date: "12/02/2025",
        title: "SPK Baru",
        desc: "SPK baru telah masuk ke sistem. Silakan cek detailnya dan lakukan proses selanjutnya",
        read: false
    },
    {
        id: 7,
        date: "12/02/2025",
        title: "Pembayaran Diterima",
        desc: "Transaksi dengan nomor TRX-001 telah melakukan pembayaran",
        read: false
    },
    {
        id: 8,
        date: "12/02/2025",
        title: "Pembayaran Diterima",
        desc: "Transaksi dengan nomor TRX-001 telah melakukan pembayaran",
        read: false
    }
];

const TabItems = [
    { value: "all", label: "Semuanya" },
    { value: "unread", label: "Belum Dibaca" },
    { value: "read", label: "Sudah Dibaca" },
];

// Notification Card Component
const NotificationCard = ({ notification, isSelected, onToggle }) => {
    return (
        <div className={`${!notification.read ? "bg-[#F0FAF9]" : "bg-white"} flex gap-3 pl-3 pr-4 py-3 border rounded-lg`}>
            <div className="w-fit mt-1">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggle}
                    className="bg-white"
                />
            </div>
            <div className="w-full">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500">{notification.date}</span>
                    {notification.read && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                            <BsCheckCircle />
                            Sudah Dibaca
                        </span>
                    )}
                </div>
                <h4 className="text-sm font-bold mb-1">{notification.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{notification.desc}</p>
            </div>
        </div>
    );
};

type Notification = {
    id: number;
    date: string;
    title: string;
    desc: string;
    read: boolean;
};

interface NotificationListProps {
    items: Notification[];
    selectedIds: number[];
    toggleCheckbox: (id: number) => void;
}

function NotificationList({ items, selectedIds, toggleCheckbox }: NotificationListProps) {
    if (items.length === 0) {
        return <p className="text-gray-500 text-center py-8">Tidak ada pemberitahuan.</p>;
    }

    return (
        <div className="space-y-2">
            {items.map((item: Notification) => (
                <NotificationCard
                    key={item.id}
                    notification={item}
                    isSelected={selectedIds.includes(item.id)}
                    onToggle={() => toggleCheckbox(item.id)}
                />
            ))}
        </div>
    );
}

export const NotificationListItems = () => {
    const [notifications, setNotifications] = useState(allNotifications);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    // Dialog state management
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleCheckbox = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleMarkAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) =>
                selectedIds.includes(n.id) ? { ...n, read: true } : n
            )
        );
        setSelectedIds([]);
    };

    const handleDeleteConfirmation = () => {
        if (selectedIds.length === 0) return;
        setIsDialogOpen(true);
    };

    const handleDelete = () => {
        setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
        setSelectedIds([]);
        setIsDialogOpen(false);
    };

    const unread = notifications.filter((n) => !n.read);
    const read = notifications.filter((n) => n.read);

    // Get selected notifications count for dialog
    const selectedCount = selectedIds.length;

    return (
        <main className="flex items-center justify-center mx-5 relative !-mt-0">
            <Tabs defaultValue="all" className="flex flex-col items-center justify-center w-full">
                <div className="w-full">
                    <TabsList className="bg-[#F0FAF9] w-full mb-3">
                        {TabItems.map((tab) => (
                            <TabsTrigger key={tab.value} className="w-full text-[14px]" value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="grid grid-cols-2 w-full gap-2">
                        <Button
                            size="sm"
                            className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded"
                            disabled={selectedIds.length === 0}
                            onClick={handleMarkAsRead}
                        >
                            <IoCheckmarkCircleOutline />
                            Tandai Sudah Dibaca
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="text-sm px-3 py-1 rounded"
                            disabled={selectedIds.length === 0}
                            onClick={handleDeleteConfirmation}
                        >
                            <IoMdTrash />
                            Hapus
                        </Button>
                    </div>
                </div>

                <TabsContent className="w-full !px-0" value="all">
                    <NotificationList
                        items={notifications}
                        selectedIds={selectedIds}
                        toggleCheckbox={toggleCheckbox}
                    />
                </TabsContent>

                <TabsContent className="w-full !px-0" value="unread">
                    <NotificationList
                        items={unread}
                        selectedIds={selectedIds}
                        toggleCheckbox={toggleCheckbox}
                    />
                </TabsContent>

                <TabsContent className="w-full !px-0" value="read">
                    <NotificationList
                        items={read}
                        selectedIds={selectedIds}
                        toggleCheckbox={toggleCheckbox}
                    />
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                isLoading={false}
                title={`Kamu yakin menghapus ${selectedCount} pemberitahuan${selectedCount > 1 ? '' : ''}?`}
                itemName={`${selectedCount} pemberitahuan`}
                cancelLabel="Batal"
                confirmLabel="Hapus"
            />
        </main>
    );
};