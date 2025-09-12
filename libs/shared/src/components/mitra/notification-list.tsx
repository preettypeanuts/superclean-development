"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../../ui-components/src/components/ui/tabs";
import { Button } from "../../../../ui-components/src/components/ui/button";
import { Checkbox } from "../../../../ui-components/src/components/ui/checkbox";
import { useState, useEffect } from "react";
import { IoMdTrash } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsCheckCircle } from "react-icons/bs";
import { DeleteDialog } from "../../../../ui-components/src/components/delete-dialog";
import { api } from "../../../../utils/apiClient";

// Interface untuk data notification sesuai API response
interface Notification {
    id: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string | null;
    title: string;
    detail: string;
    recipient: string;
    isRead: boolean;
    status: boolean;
}

// Interface untuk response API
interface ApiResponse {
    status: string;
    data: Notification[];
}

const TabItems = [
    { value: "all", label: "Semuanya" },
    { value: "unread", label: "Belum Dibaca" },
    { value: "read", label: "Sudah Dibaca" },
];

// Notification Card Component
interface NotificationCardProps {
    notification: Notification;
    isSelected: boolean;
    onToggle: () => void;
}

const NotificationCard = ({ notification, isSelected, onToggle }: NotificationCardProps) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const stripHtml = (html: string) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    return (
        <div className={`${!notification.isRead ? "bg-[#F0FAF9]" : "bg-white"} flex gap-3 pl-3 pr-4 py-3 border rounded-lg`}>
            <div className="w-fit mt-1">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggle}
                    className="bg-white"
                />
            </div>
            <div className="w-full">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                    {notification.isRead && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                            <BsCheckCircle />
                            Sudah Dibaca
                        </span>
                    )}
                </div>
                <h4 className="text-sm font-bold mb-1">{notification.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{stripHtml(notification.detail)}</p>
            </div>
        </div>
    );
};

interface NotificationListProps {
    items: Notification[];
    selectedIds: string[];
    toggleCheckbox: (id: string) => void;
    loading: boolean;
}

function NotificationList({ items, selectedIds, toggleCheckbox, loading }: NotificationListProps) {
    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-white flex gap-3 pl-3 pr-4 py-3 border rounded-lg animate-pulse">
                        <div className="w-4 h-4 bg-gray-300 rounded mt-1"></div>
                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-start mb-1">
                                <div className="h-3 bg-gray-300 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-300 rounded w-full"></div>
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch notifications dari API
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response: ApiResponse = await api.get('/notification/mitra?page=1&limit=10');
            
            if (response && response.status === "success") {
                setNotifications(response.data);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleCheckbox = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleMarkAsRead = async () => {
        if (selectedIds.length === 0) return;

        try {
            setActionLoading(true);
            
            // Call API untuk mark as read setiap notification yang dipilih
            const updatePromises = selectedIds.map(id => 
                api.put(`/notification/${id}/read`)
            );
            
            await Promise.all(updatePromises);
            
            // Update UI setelah API berhasil
            setNotifications((prev) =>
                prev.map((n) =>
                    selectedIds.includes(n.id) ? { ...n, isRead: true } : n
                )
            );
            
            setSelectedIds([]);
        } catch (err) {
            console.error('Error marking as read:', err);
            setError('Gagal menandai notifikasi sebagai sudah dibaca');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (selectedIds.length === 0) return;
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;

        try {
            setActionLoading(true);
            setIsDialogOpen(false);
            
            // Call API untuk delete setiap notification yang dipilih
            const deletePromises = selectedIds.map(id => 
                api.delete(`/notification/${id}`)
            );
            
            await Promise.all(deletePromises);
            
            // Update UI setelah API berhasil
            setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
            setSelectedIds([]);
        } catch (err) {
            console.error('Error deleting notifications:', err);
            setError('Gagal menghapus notifikasi');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRetry = () => {
        fetchNotifications();
    };

    // Filter notifications berdasarkan read status
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const readNotifications = notifications.filter((n) => n.isRead);

    // Show error state
    if (error && !loading) {
        return (
            <main className="flex items-center justify-center mx-5">
                <div className="w-full max-w-md p-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={handleRetry} className="w-full">
                        Coba Lagi
                    </Button>
                </div>
            </main>
        );
    }

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
                            disabled={selectedIds.length === 0 || loading || actionLoading}
                            onClick={handleMarkAsRead}
                        >
                            <IoCheckmarkCircleOutline />
                            {actionLoading ? 'Memproses...' : 'Tandai Sudah Dibaca'}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="text-sm px-3 py-1 rounded"
                            disabled={selectedIds.length === 0 || loading || actionLoading}
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
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent className="w-full !px-0" value="unread">
                    <NotificationList
                        items={unreadNotifications}
                        selectedIds={selectedIds}
                        toggleCheckbox={toggleCheckbox}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent className="w-full !px-0" value="read">
                    <NotificationList
                        items={readNotifications}
                        selectedIds={selectedIds}
                        toggleCheckbox={toggleCheckbox}
                        loading={loading}
                    />
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                isLoading={actionLoading}
                title={`Kamu yakin menghapus ${selectedIds.length} pemberitahuan${selectedIds.length > 1 ? '' : ''}?`}
                itemName={`${selectedIds.length} pemberitahuan`}
                cancelLabel="Batal"
                confirmLabel="Hapus"
            />
        </main>
    );
};