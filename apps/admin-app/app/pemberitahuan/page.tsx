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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeleteDialog } from "@ui-components/components/delete-dialog";
import { api } from "@shared/utils/apiClient";
import { useToast } from "@ui-components/hooks/use-toast";

type Notification = {
  id: string;
  title: string;
  detail: string;
  recipient: string;
  isRead: boolean;
  status: boolean;
  createdAt: string;
};

const TabItems = [
  { value: "all", label: "Semuanya" },
  { value: "unread", label: "Belum Dibaca" },
  { value: "read", label: "Sudah Dibaca" },
];

function NotificationList({
  items,
  selectedIds,
  toggleCheckbox,
}: {
  items: Notification[];
    selectedIds: string[];
    toggleCheckbox: (id: string) => void;
}) {
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    if (selectedIds.length > 0) {
      if (!selectionMode) setSelectionMode(true);
    } else {
      setSelectionMode(false);
    }
  }, [selectedIds]);

  if (items.length === 0) {
    return <p className="text-muted-foreground text-center border-b pb-5">Tidak ada pemberitahuan.</p>;
  }

  return (
    <>
      <ul className="space-y-2">
        {items.map((item, index) => {
          return <>
            <li
              key={item.id}
              className={`${item.isRead ? "bg-white dark:bg-black" : "bg-baseLight/70 dark:bg-baseDark"} cursor-pointer flex gap-2 pl-3 pr-4 py-2 border rounded-lg`}
              onClick={() => {
                toggleCheckbox(item.id);
              }}
            >
              <div className="w-fit ml-[1px] mt-[1px]">
                {selectionMode && (
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    className="bg-white dark:bg-black"
                  />
                )}
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-semibold">{item.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
              </div>
            </li>
          </>
        })}
      </ul>
    </>
  );
}

export default function PemberitahuanPage() {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [reload, setReload] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const toggleCheckbox = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRead = async () => {
    try {
      setSubmitLoading(true);
      const promises: Promise<any>[] = [];
      selectedIds.forEach((id) => {
        promises.push(
          api.put(`/notification/${id}/read`, {})
        );
      });

      await Promise.all(promises);

      toast({
        title: "success",
        description: `${selectedIds.length} pemberitahuan telah ditandai sudah dibaca.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    } finally {
      resetStates();
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitLoading(true);
      const promises: Promise<any>[] = [];
      selectedIds.forEach((id) => {
        promises.push(
          api.delete(`/notification/${id}`, {})
        );
      });

      await Promise.all(promises);
      toast({
        title: "success",
        description: `${selectedIds.length} pemberitahuan telah dihapus.`,
        variant: "success",
      });
    }
    catch (error) {
      console.error("Error deleting notifications:", error);
    }
    finally {
      resetStates();
    }
  };

  const all = notifications;
  const unread = useMemo(() => notifications.filter((n) => !n.isRead), [notifications]);
  const read = useMemo(() => notifications.filter((n) => n.isRead), [notifications]);

  const [page, setPage] = useState(1);
  const [noMoreData, setNoMoreData] = useState(false);
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState(false);

  const resetStates = () => {
    setNotifications([]);
    setPage(1);
    setNoMoreData(false);
    setSelectedIds([]);
    setSubmitLoading(false);
    setIsDialogOpen(false);
  }

  const fetchMoreData = async (pageNumber) => {
    if (isLoading) return;
    if (noMoreData) return;

    try {
      setIsLoading(true);
      // Simulate fetching data from an API
      const response = await api.get(`/notification?page=${pageNumber}&limit=${itemsPerPage}`)
      const newData = response.data;

      const newDatas = [...notifications, ...newData]; // make 10 copies

      setNotifications(newDatas)
      setPage((prev) => prev + 1);
      if (newData.length < itemsPerPage) {
        setNoMoreData(true);
      }

    }
    catch (error) {
      console.error("Error fetching notifications:", error);
      setIsLoading(false);
    }
    finally {
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMoreData(page);
  }, [reload]);

  useEffect(() => {
    setIsLoading(false);
  }, [notifications]);


  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !noMoreData) {
            fetchMoreData(page);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, noMoreData]
  );

  return (
    <>
      <Breadcrumbs label="Pemberitahuan" count={notifications.length} />
      <Wrapper className="overflow-hidden !p-0">
        <Tabs defaultValue="all" className="-mt-2 relative mx-5">
          <div className="sticky top-0 border-b pb-3 -mx-5 px-5 backdrop-blur-md z-10">
            <div className="flex items-center justify-between pt-5">
              <TabsList>
                {TabItems.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} onClick={() => {
                    setSelectedIds([]);
                  }}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="space-x-2">
                <Button loading={submitLoading} disabled={selectedIds.length === 0 || submitLoading} onClick={() => { handleRead(); }}>
                  <IoCheckmarkCircle />
                  Tandai Sudah Dibaca
                </Button>
                <Button
                  loading={submitLoading}
                  variant="destructive"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={selectedIds.length === 0 || submitLoading}
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

            <div ref={lastPostElementRef} className="h-10 mt-4">
              {isLoading && <p className="text-center text-sm text-muted-foreground">Loading...</p>}
              {all.length > 0 && noMoreData && <p className="text-center text-sm text-muted-foreground">Tidak ada lagi pemberitahuan.</p>}
            </div>
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList
              items={unread}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
            />

            <div ref={lastPostElementRef} className="h-10 mt-4">
              {isLoading && <p className="text-center text-sm text-muted-foreground">Loading...</p>}
              {unread.length > 0 && noMoreData && <p className="text-center text-sm text-muted-foreground">Tidak ada lagi pemberitahuan.</p>}
            </div>
          </TabsContent>
          <TabsContent value="read">
            <NotificationList
              items={read}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
            />

            <div ref={lastPostElementRef} className="h-10 mt-4">
              {isLoading && <p className="text-center text-sm text-muted-foreground">Loading...</p>}
              {read.length > 0 && noMoreData && <p className="text-center text-sm text-muted-foreground">Tidak ada lagi pemberitahuan.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </Wrapper>

      <DeleteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        isLoading={submitLoading}
        title={`Kamu yakin ingin menghapus ${selectedIds.length} pemberitahuan?`}
        itemName="pemberitahuan"
        cancelLabel="Batal"
        confirmLabel="Hapus"
      />
    </>
  );
}
