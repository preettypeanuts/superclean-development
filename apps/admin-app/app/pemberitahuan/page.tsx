"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui-components/components/ui/tabs";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Wrapper } from "@shared/components/Wrapper";
import { Button } from "@ui-components/components/ui/button";
import { Checkbox } from "@ui-components/components/ui/checkbox";
import { IoMdTrash } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useMemo, useState } from "react";
import { DeleteDialog } from "@ui-components/components/delete-dialog";

type Notification = {
  id: number;
  date: string;
  title: string;
  desc: string;
  read: boolean;
};

const TabItems = [
  { value: "all", label: "Semuanya" },
  { value: "unread", label: "Belum Dibaca" },
  { value: "read", label: "Sudah Dibaca" },
];

const initialDummy: Notification[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  date: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)).toISOString(),
  title: ["SPK Baru", "Pembayaran Diterima", "Layanan Selesai", "User Baru", "Diskon Baru", "Perubahan Jadwal", "Maintenance Sistem", "SPK Ditolak", "Laporan Bulanan", "Notifikasi Sistem", "Feedback Customer", "Reminder Jadwal"][i],
  desc: "Ini adalah deskripsi notifikasi dummy untuk " + i,
  read: Math.random() < 0.5,
}));

function NotificationList({
  items,
  selectedIds,
  toggleCheckbox,
}: {
  items: Notification[];
  selectedIds: number[];
  toggleCheckbox: (id: number) => void;
}) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center border-b pb-5">Tidak ada pemberitahuan.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className={`${
            !item.read ? "bg-baseLight/70 dark:bg-baseDark" : "bg-white"
          } flex gap-2 pl-3 pr-4 py-2 border rounded-lg`}
        >
          <div className="w-fit ml-[1px] mt-[1px]">
            <Checkbox
              checked={selectedIds.includes(item.id)}
              onCheckedChange={() => toggleCheckbox(item.id)}
              className="bg-white dark:bg-black"
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold">{item.title}</h4>
              <span className="text-xs text-muted-foreground">
                {new Date(item.date).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function PemberitahuanPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialDummy);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    setIsDialogOpen(false);
  };

  const all = notifications;
  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications]);
  const read = useMemo(() => notifications.filter((n) => n.read), [notifications]);

  return (
    <>
      <Breadcrumbs label="Pemberitahuan" />
      <Wrapper className="overflow-hidden !p-0">
        <Tabs defaultValue="all" className="-mt-2 relative mx-5">
          <div className="sticky top-0 border-b pb-3 -mx-5 px-5 bg-white/50 backdrop-blur-md z-10">
            <div className="flex items-center justify-between pt-5">
              <TabsList>
                {TabItems.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="space-x-2">
                <Button disabled={selectedIds.length === 0}>
                  <IoCheckmarkCircle />
                  Tandai Sudah Dibaca
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={selectedIds.length === 0}
                >
                  <IoMdTrash />
                  Hapus
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all">
            <NotificationList
              items={all}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
            />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList
              items={unread}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
            />
          </TabsContent>
          <TabsContent value="read">
            <NotificationList
              items={read}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
            />
          </TabsContent>
        </Tabs>
      </Wrapper>

      <DeleteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        isLoading={false}
        title={`Kamu yakin ingin menghapus ${selectedIds.length} pemberitahuan?`}
        itemName="pemberitahuan"
        cancelLabel="Batal"
        confirmLabel="Hapus"
      />
    </>
  );
}
