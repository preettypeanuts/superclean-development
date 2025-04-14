import { Header } from "@shared/components/Header";
import { GeneralSetting } from "@shared/components/GeneralSetting";
import { Wrapper } from "@shared/components/Wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-components/components/ui/tabs";

export default async function PengaturanPage() {
  return (
    <Wrapper className="min-h-full">
      <Header label="Pengaturan" />
      <Tabs defaultValue="umum" className="">
        <TabsList className=" bg-mainColor/20 dark:bg-mainColor/30">
          <TabsTrigger value="umum" >Umum</TabsTrigger>
          <TabsTrigger value="profil">Profil Pengguna</TabsTrigger>
          <TabsTrigger value="akses">Akses Pengguna</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
        </TabsList>
        <TabsContent value="umum">
          <GeneralSetting />
        </TabsContent>
        <TabsContent value="profil">
          Settings component
        </TabsContent>
        <TabsContent value="akses">
          Settings component
        </TabsContent>
        <TabsContent value="notifikasi">
          Settings component
        </TabsContent>
      </Tabs>
    </Wrapper>
  );
}


