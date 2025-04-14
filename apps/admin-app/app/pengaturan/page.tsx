import { Header } from "@shared/components/Header";
import { Wrapper } from "@shared/components/Wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs"; 

export default async function PengaturanPage() {
  return (
    <Wrapper className="min-h-full">
      <Header label="Pengaturan" />
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className=" bg-mainColor/20 dark:bg-mainColor/30">
          <TabsTrigger value="account">Umum</TabsTrigger>
          <TabsTrigger value="password">Profil Pengguna</TabsTrigger>
          <TabsTrigger value="akses">Akses Pengguna</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </Wrapper>
  );
}


