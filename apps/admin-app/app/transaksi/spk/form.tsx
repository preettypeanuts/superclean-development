// "use client";
// import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Wrapper } from "@shared/components/Wrapper";
// import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
// import { Input } from "libs/ui-components/src/components/ui/input";
// import { Label } from "libs/ui-components/src/components/ui/label";
// import { Button } from "libs/ui-components/src/components/ui/button";
// import { Textarea } from "libs/ui-components/src/components/ui/textarea";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "libs/ui-components/src/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "libs/ui-components/src/components/ui/tabs";
// import { useToast } from "libs/ui-components/src/hooks/use-toast";
// import { api } from "libs/utils/apiClient";
// import { useLocationData } from "@shared/utils/useLocationData";
// import { PiWarningCircleFill } from "react-icons/pi";
// import { LuPlus } from "react-icons/lu";
// import MultiSelect from "libs/ui-components/src/components/multi-select";
// import { formatDateInput } from "libs/utils/formatDate";
// import { SPKTableDetail } from "libs/ui-components/src/components/spk-table-detail";
// import { DialogWrapper } from "libs/ui-components/src/components/dialog-wrapper";
// import { formatRupiah } from "libs/utils/formatRupiah";
// import { Category, Service, useCategoryStore, useCategoryStore2, useServiceLookup } from "libs/utils/useCategoryStore";
// import { RupiahInput } from "@ui-components/components/rupiah-input";
// import { RadioGroup, RadioGroupItem } from "@ui-components/components/ui/radio-group";
// import { Header } from "@shared/components/Header";
// import { Check, ChevronsUpDown, Cross, Plus, PlusCircle, Search, AlertTriangle } from "lucide-react";
// import { DatePicker } from "@ui-components/components/date-picker";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// export interface WhatsAppComboboxProps {
//   onCustomerSelect: (customer: CustomerSearchResult) => void;
//   placeholder?: string;
// }

// export interface CustomerSearchResult {
//   id: string,
//   noWhatsapp: string,
//   fullname: string,
//   address: string,
//   subDistrict: string,
//   district: string,
//   city: string,
//   province: string,
//   status: 0 | 1,
//   customerType: "Pribadi" | "Perusahaan" | null,
// }

// export interface SPKCustomer {
//   customerId: string;
// }

// // Searchable Combobox Component untuk WhatsApp
// export function WhatsAppCombobox2({
//   onCustomerSelect,
//   placeholder = "Masukkan No Whatsapp"
// }: WhatsAppComboboxProps) {
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [results, setSearchResult] = useState<CustomerSearchResult[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       const search = searchQuery.trim();
//       if (search.length >= 3) {
//         setLoading(true);
//         api.get(`/customer/page?search=${encodeURIComponent(search)}&page=1&limit=10`)
//           .then((res) => {
//             setSearchResult(res?.data[0] || []);
//           })
//           .catch(() => setSearchResult([]))
//           .finally(() => setLoading(false));
//       } else {
//         setSearchResult([]);
//       }
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [searchQuery]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;
//     setSearchQuery(newValue);
//     setOpen(true);
//   };

//   const handleSelectCustomer = (customer: any) => {
//     setSearchQuery(customer.noWhatsapp);
//     onCustomerSelect(customer);
//     setOpen(false);
//   };

//   const handleClearSelection = () => {
//     setSearchQuery("");
//     setOpen(false);
//   };

//   return (
//     <div className="relative w-full">
//       <div
//         className={`flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring cursor-text ${open ? "ring-1 ring-ring" : ""
//           }`}
//         onClick={() => setOpen(true)}
//       >
//         <div className="flex items-center gap-2 flex-1">
//           <Search className="h-4 w-4 text-muted-foreground shrink-0" />
//           <input
//             type="text"
//             placeholder={placeholder}
//             value={searchQuery}
//             onChange={handleInputChange}
//             onFocus={() => setOpen(true)}
//             className="bg-transparent border-none outline-none flex-1 placeholder:text-muted-foreground"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       </div>

//       {open && (
//         <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
//           <div className="max-h-[300px] overflow-y-auto no-scrollbar">
//             {loading && (
//               <div className="px-2 py-6 text-center text-sm text-muted-foreground">
//                 Loading...
//               </div>
//             )}
//             {!loading && searchQuery.trim().length < 3 && (
//               <div className="px-2 py-4 text-center text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2 justify-center">
//                   <Search size={18} />
//                   Masukkan minimal 3 karakter
//                 </div>
//               </div>
//             )}
//             {!loading && searchQuery.trim().length >= 3 && results.length === 0 && (
//               <div className="px-2 py-6 text-center text-sm text-muted-foreground">
//                 Tidak ditemukan
//               </div>
//             )}
//             {results.map((customer) => (
//               <div
//                 key={customer.id}
//                 className="relative flex cursor-pointer select-none border-b flex-col rounded-sm px-2 py-2 text-sm outline-none hover:bg-baseLight dark:hover:bg-baseDark hover:text-accent-foreground"
//                 onClick={() => handleSelectCustomer(customer)}
//               >
//                 <div className="flex items-center gap-2">
//                   <Check
//                     className={`h-4 w-4 ${searchQuery === customer.noWhatsapp ? "opacity-100" : "opacity-0"
//                       }`}
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium">{customer.fullname} - {customer.noWhatsapp}</p>
//                     <p className="text-xs text-muted-foreground">{customer.address}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {searchQuery ? (
//         <button
//           onClick={handleClearSelection}
//           className="absolute right-3 top-1/2 rotate-45 -translate-y-1/2 h-4 w-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center text-xs"
//           type="button"
//         >
//           <Plus className="opacity-50" />
//         </button>
//       ) : (
//         <button
//           className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full flex items-center justify-center text-xs"
//           type="button"
//         >
//           <ChevronsUpDown className="opacity-50" />
//         </button>
//       )}

//       {open && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// export interface PromoResponse {
//   amount: number;
//   code: string;
//   type: "Persentase" | "Nominal";
// }

// export type PromoSPKItem = PromoResponse

// export type SPKItemForm = {
//   id?: string;

//   category: Category | null;
//   service: Service | null;

//   // kategori: string;
//   // kategoriCode: string;

//   // kode: string;
//   // layanan: string;
//   // satuan: string;
//   // harga: number;

//   type: "vakum" | "cuci";
//   jumlah: number;

//   promo: PromoSPKItem | null;

//   // promo: number;
//   // promoCode?: string;
//   // promoType?: string;

// }

// export type SPKItemResponse = {
//   id: string;
//   trxNumber: string;
//   serviceCategory: string;
//   serviceCode: string;
//   serviceType: number;
//   quantity: number;
//   promoCode: string;
//   servicePrice: number;
//   totalPrice: number;
//   promoPrice: number;
//   isPl: number;
//   isDelete: number;
//   service: {
//     id: string;
//     code: string;
//     name: string;
//     category: string;
//     unit: string;
//     vacuumPrice: number;
//     cleanPrice: number;
//     status: number;
//     createdAt: string;
//     createdBy: string;
//     updatedAt: string;
//     updatedBy: string;
//   };
// }

// type SPKItemFormProps = {
//   id?: string;
//   isEditMode?: boolean;
//   isDialogOpen: boolean;
//   setIsDialogOpen: Dispatch<SetStateAction<boolean>>;

//   formData?: SPKItemForm;
//   setFormData: Dispatch<SetStateAction<SPKItemForm>>;
//   onSubmit: () => void;
// }

// const SPKItemForm = ({
//   isEditMode,
//   formData: formDataTable = {
//     id: "",
//     category: null,
//     service: null,
//     jumlah: 0,
//     type: "vakum",
//     promo: null
//   },
//   setFormData: setFormDataTable,
//   onSubmit,
//   isDialogOpen,
//   setIsDialogOpen,
// }: SPKItemFormProps) => {
//   const { categories, loading: loadingParams } = useCategoryStore2();
//   const { services, loading: loadingServices } = useServiceLookup(formDataTable.category?.paramKey);

//   const [loadingPromo, setLoadingPromo] = useState(false);

//   // resetFormDialog function
//   const resetFormDialog = () => {
//     setFormDataTable({
//       id: "",
//       category: null,
//       service: null,
//       jumlah: 0,
//       type: "vakum",
//       promo: null
//     });
//   };

//   // Function untuk fetch promo berdasarkan serviceCode dan quantity
//   const fetchPromo = async (serviceCode: string, quantity: string): Promise<PromoResponse | null> => {
//     if (!serviceCode || !quantity || parseInt(quantity) <= 0) {
//       return null
//     }

//     setLoadingPromo(true);
//     try {
//       const response = await api.get(`/promo/current?serviceCode=${serviceCode}&quantity=${quantity}`);

//       return {
//         amount: response.data?.amount || 0,
//         code: response.data?.code || "",
//         type: response.data?.promoType || ""
//       };
//     } catch (error) {
//       console.error("Error fetching promo:", error);
//       return null;
//     } finally {
//       setLoadingPromo(false);
//     }
//   };

//   useEffect(() => {
//     // Jika formDataTable berubah (misal karena edit), fetch promo baru
//     const loadPromo = async () => {
//       if (formDataTable.service?.serviceCode && formDataTable.jumlah && formDataTable.jumlah > 0) {
//         const promoData = await fetchPromo(formDataTable.service.serviceCode, formDataTable.jumlah.toString());
//         setFormDataTable(prev => ({
//           ...prev,
//           promo: promoData
//         }));
//       } else {
//         // Reset promo jika serviceCode atau jumlah tidak valid
//         setFormDataTable(prev => ({
//           ...prev,
//           promo: null
//         }));
//       }
//     };

//     loadPromo();
//   }, [formDataTable.service, formDataTable.jumlah]);


//   const handleChangeTable = async (field: string, value: any) => {
//     setFormDataTable(prev => {
//       const newData = { ...prev, [field]: value };

//       // Jika kategori berubah, reset serviceCode dan promo
//       if (field === "kategori") {
//         newData.service = null;
//         newData.promo = null;
//       }

//       return newData;
//     });

//     // Auto fetch promo jika serviceCode dan jumlah sudah ada
//     // setTimeout(async () => {
//     //   const currentData = { ...formDataTable, [field]: value };

//     //   if ((field === "serviceCode" || field === "jumlah") &&
//     //     currentData.serviceCode &&
//     //     currentData.jumlah &&
//     //     parseInt(currentData.jumlah) > 0) {

//     //     const promoData = await fetchPromo(currentData.serviceCode, currentData.jumlah);

//     //     setFormDataTable(prev => ({
//     //       ...prev,
//     //       promo: promoData.amount,
//     //       promoCode: promoData.code,
//     //       promoType: promoData.type
//     //     }));
//     //   }
//     // }, 100);
//   };

//   const price = useMemo(() => {
//     if (formDataTable.type === "vakum") {
//       return formDataTable.service?.vacuumPrice || 0;
//     } else if (formDataTable.type === "cuci") {
//       return formDataTable.service?.cleanPrice || 0;
//     }
//     return 0;
//   }, [formDataTable.service, formDataTable.type]);

//   const promo = useMemo(() => {
//     if (formDataTable.promo) {
//       const {
//         amount: promoAmount,
//         type: promoType,
//       } = formDataTable.promo

//       if (promoType == 'Nominal') {
//         return promoAmount
//       } else if (promoType == 'Persentase') {
//         return (promoAmount * price * (formDataTable.jumlah || 0)) / 100
//       }
//     }

//     return 0;

//   }, [formDataTable.promo, price, formDataTable.jumlah]);

//   const subtotal = useMemo(() => {
//     const total = price * (formDataTable.jumlah || 0);
//     return total - promo;
//   }, [price, formDataTable.jumlah, promo]);

//   return (
//     <>
//       <DialogWrapper
//         open={isDialogOpen}
//         onOpenChange={(open) => {
//           setIsDialogOpen(open);
//         }}
//         headItem={
//           <>
//             <Header label={isEditMode ? "Edit SPK Item" : "Tambah SPK Baru"} />
//           </>
//         }
//       >
//         <div className="mx-2">
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <Label htmlFor="category" className="w-1/4">
//                 Kategori
//               </Label>
//               <Select
//                 onValueChange={(value) => handleChangeTable("kategori", value)}
//                 value={formDataTable.category?.paramValue}
//                 disabled={loadingParams}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Pilih Kategori" />
//                 </SelectTrigger>
//                 <SelectContent className="z-[999]">
//                   <SelectGroup>
//                     <SelectLabel>Kategori</SelectLabel>
//                     {loadingParams ? (
//                       <SelectItem value="loading" disabled>
//                         Loading...
//                       </SelectItem>
//                     ) : (
//                       categories.map((cat) => (
//                         <SelectItem key={cat.paramKey} value={cat.paramKey}>
//                           {cat.paramValue}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center space-x-4">
//               <Label htmlFor="unit" className="w-1/4">
//                 Layanan
//               </Label>
//               <Select
//                 onValueChange={(value) => handleChangeTable("layanan", value)}
//                 value={formDataTable.service?.serviceCode}
//                 disabled={loadingServices || !formDataTable.category}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue
//                     placeholder={
//                       !formDataTable.category
//                         ? "Pilih kategori terlebih dahulu"
//                         : loadingServices
//                           ? "Loading..."
//                           : "Pilih Layanan"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent className="z-[999]">
//                   <SelectGroup>
//                     <SelectLabel>Layanan</SelectLabel>
//                     {loadingServices ? (
//                       <SelectItem value="loading" disabled>
//                         Loading...
//                       </SelectItem>
//                     ) : services.length === 0 ? (
//                       <SelectItem value="no-data" disabled>
//                         Tidak ada layanan untuk kategori ini
//                       </SelectItem>
//                     ) : (
//                       services.map((service) => (
//                         <SelectItem key={service.serviceCode} value={service.serviceCode}>
//                           {service.serviceName}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectGroup>
//                 </SelectContent>

//               </Select>
//             </div>

//             <div className="flex items-center space-x-4">
//               <Label htmlFor="jumlah" className="w-1/4 font-semibold">Jumlah</Label>
//               <Input
//                 placeholder="Masukkan Jumlah"
//                 type="number"
//                 value={formDataTable.jumlah}
//                 onChange={(e) => handleChangeTable("jumlah", e.target.value)}
//               />
//             </div>

//             <div className="flex items-center space-x-4">
//               <Label htmlFor="tipe" className="w-[20%] font-semibold">Tipe</Label>
//               <RadioGroup
//                 value={formDataTable.type}
//                 onValueChange={(value) => handleChangeTable("tipe", value)}
//                 className="flex items-center gap-5"
//                 disabled={!(formDataTable.category?.paramValue === "GENERAL" || formDataTable.category?.paramValue === "BLOWER")}
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="vakum" id="vakum" />
//                   <Label htmlFor="vakum">Vakum</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="cuci" id="cuci" />
//                   <Label htmlFor="cuci">Cuci</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             <div className="flex items-center space-x-4">
//               <Label htmlFor="harga" className="w-1/4 font-semibold">Harga</Label>
//               <RupiahInput
//                 disabled
//                 placeholder="Rp. 0"
//                 value={formatRupiah(price)}
//               />
//             </div>

//             <div className="flex items-center space-x-4">
//               <Label htmlFor="promo" className="w-1/4 font-semibold">Promo</Label>
//               <div className="flex items-center space-x-2 w-full">
//                 <div className="relative flex-1">
//                   <Input
//                     value={formatRupiah(promo)}
//                     className="bg-muted/50 cursor-not-allowed text-right"
//                     readOnly
//                     placeholder="Rp. 0"
//                   />
//                   {loadingPromo && (
//                     <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
//                     </div>
//                   )}
//                 </div>
//                 {/* <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={handleCheckPromo}
//                       disabled={loadingPromo || !formDataTable.serviceCode || !formDataTable.jumlah}
//                       className="px-3 py-1 h-10 whitespace-nowrap"
//                   >
//                       Cek Promo
//                   </Button> */}
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <Label htmlFor="subtotal" className="w-1/4 font-bold text-lg">Subtotal</Label>
//               <Input
//                 value={formatRupiah(subtotal)}
//                 className="!border-0 !text-lg font-bold text-right"
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 mt-4">
//           <Button
//             variant="outline2"
//             onClick={() => {
//               setIsDialogOpen(false);
//               resetFormDialog();
//             }}
//           >
//             Kembali
//           </Button>
//           <Button
//             variant="main"
//             onClick={onSubmit}
//           >
//             {isEditMode ? "Perbarui" : "Tambah"}
//           </Button>
//         </div>
//       </DialogWrapper>

//     </>
//   )
// }


// export type SPKResponse = {
//   id: string;
//   trxNumber: string;
//   customerId: string;
//   branchId: string;
//   totalPrice: number;
//   discountPrice: number;
//   promoPrice: number;
//   finalPrice: number;
//   trxDate: string;
//   status: number;
//   details: Array<SPKItemResponse>;
// }


// export interface SPKForm {
//   id?: string;
//   customer: CustomerSearchResult | null;
//   cleaningStaffList: string[];
//   blowerStaffList: string[];
//   trxDate: string | null;
//   manualDiscount?: number;
// }

// export type SPKErrors = {

// }

// export interface SPKFormProps {
//   router: AppRouterInstance;
//   isEditMode?: boolean;

//   id?: string;
//   formData: SPKForm;
//   setFormData: Dispatch<SetStateAction<SPKForm>>;
//   errors: SPKErrors;
//   setErrors: Dispatch<SetStateAction<SPKErrors>>;
//   onSubmit: () => void;
// }



// export const EditSPKForm = ({
//   router,
//   isEditMode = false,
//   id,
//   formData,
//   setFormData,
//   errors,
//   setErrors,
//   onSubmit
// }: SPKFormProps) => {
//   const { toast } = useToast();

//   const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

//   const [spkItems, setSPKItems] = useState<SPKItemForm[]>([]);
//   const [isEditSPKItem, setIsEditSPKItem] = useState(false);
//   const [selectedSPKItem, setSelectedSPKItem] = useState<SPKItemForm>({
//     id: "",
//     category: null,
//     service: null,
//     jumlah: 0,
//     type: "vakum",
//     promo: null
//   });

//   const [openDialog, setOpenDialog] = useState(false);


//   const [locationLabels, setLocationLabels] = useState({
//     provinceName: "",
//     cityName: "",
//     districtName: "",
//     subDistrictName: ""
//   });
//   const { provinces, cities, districts, subDistricts } = useLocationData(
//     selectedCustomer?.province,
//     selectedCustomer?.city,
//     selectedCustomer?.district
//   );

//   useEffect(() => {
//     if (selectedCustomer) {
//       const getLocationLabel = (items: any[], code: string) => {
//         const item = items.find(item => item.paramKey === code);
//         return item ? item.paramValue : code;
//       };

//       setLocationLabels({
//         provinceName: getLocationLabel(provinces, selectedCustomer.province),
//         cityName: getLocationLabel(cities, selectedCustomer.city),
//         districtName: getLocationLabel(districts, selectedCustomer.district),
//         subDistrictName: getLocationLabel(subDistricts, selectedCustomer.subDistrict)
//       });
//     } else {
//       setLocationLabels({
//         provinceName: "",
//         cityName: "",
//         districtName: "",
//         subDistrictName: ""
//       });
//     }
//   }, [formData.customer]);


//   const [cleaningStaffList, setCleaningStaffList] = useState<any[]>([]);
//   const [blowerStaffList, setBlowerStaffList] = useState<any[]>([]);
//   const [loadingCleaningStaff, setLoadingCleaningStaff] = useState(false);
//   const [loadingBlowerStaff, setLoadingBlowerStaff] = useState(false);

//   const handleCleaningStaffChange = (selectedStaffIds: string[]) => {
//     setFormData(prev => ({
//       ...prev,
//       cleaningStaffList: selectedStaffIds
//     }));
//   };

//   const handleBlowerStaffChange = (selectedStaffIds: string[]) => {
//     setFormData(prev => ({
//       ...prev,
//       blowerStaffList: selectedStaffIds
//     }));
//   };

//   // Function untuk fetch staff data
//   const fetchStaffData = async (roleId: string, city: string, setStaffList: Function, setLoading: Function) => {
//     if (!roleId || !city) {
//       setStaffList([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.get(`/user/lookup?roleId=${roleId}&city=${city}`);
//       setStaffList(response?.data || []);
//     } catch (error) {
//       console.error(`Error fetching ${roleId} staff:`, error);
//       setStaffList([]);
//       toast({
//         title: "Error",
//         description: `Gagal mengambil data petugas ${roleId.toLowerCase()}`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effect untuk fetch staff data ketika customer berubah
//   useEffect(() => {
//     if (selectedCustomer?.city) {
//       fetchStaffData("CLEANER", selectedCustomer.city, setCleaningStaffList, setLoadingCleaningStaff);
//       fetchStaffData("BLOWER", selectedCustomer.city, setBlowerStaffList, setLoadingBlowerStaff);
//     } else {
//       setCleaningStaffList([]);
//       setBlowerStaffList([]);
//     }
//   }, [selectedCustomer?.city]);

//   // handleAddSPKItem function (update - tanpa total calculation)
//   const handleAddSPKItem = () => {
//     // Validasi form
//     if (!selectedSPKItem.category || !selectedSPKItem.service || !selectedSPKItem.jumlah) {
//       toast({
//         title: "Peringatan",
//         description: "Harap lengkapi semua field yang wajib diisi",
//         variant: "destructive",
//       });
//       return;
//     }

//     // const totalHargaSebelumPromo = selectedSPKItem.harga * selectedSPKItem.jumlah;

//     // // Validasi: promo tidak boleh lebih besar dari total harga item
//     // if (selectedSPKItem.promo > totalHargaSebelumPromo) {
//     //   toast({
//     //     title: "Peringatan",
//     //     description: "Promo tidak boleh lebih besar dari total harga item",
//     //     variant: "destructive",
//     //   });
//     //   return;
//     // }

//     // check if serviceCode exists in other SPK items
//     const existingItem = spkItems.find(item => item.service?.serviceCode === selectedSPKItem.service?.serviceCode);
//     if (existingItem) {
//       toast({
//         title: "Peringatan",
//         description: "Layanan ini sudah ada di daftar SPK",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (isEditSPKItem) {
//       setSPKItems(prev => prev.map(item =>
//         item.service?.serviceCode === selectedSPKItem.service?.serviceCode
//           ? { ...selectedSPKItem }
//           : item
//       ));

//       toast({
//         title: "Berhasil",
//         description: "Item SPK berhasil diperbarui",
//         variant: "default",
//       });
//     } else {
//       // Mode tambah - add new item
//       const newId = Date.now().toString();
//       setSPKItems(prev => [...prev, { ...selectedSPKItem, id: newId }]);

//       toast({
//         title: "Berhasil",
//         description: "Item SPK berhasil ditambahkan",
//         variant: "default",
//       });
//     }

//     setOpenDialog(false);
//   };

//   const handleSelectCustomer = (customer: CustomerSearchResult) => {

//   }


//   // Header table tanpa kolom total
//   const DataHeaderSPKDetail = [
//     { key: "no", label: "#" },
//     { key: "kode", label: "Kode Service" },
//     { key: "layanan", label: "Layanan" },
//     { key: "kategori", label: "Kategori" },
//     { key: "jumlah", label: "Jumlah" },
//     { key: "satuan", label: "Satuan" },
//     { key: "harga", label: "Harga Satuan" },
//     { key: "totalHarga", label: "Total Harga" },
//     { key: "promo", label: "Promo" },
//     { key: "menu", label: "Aksi" }
//   ];


//   const totals = useMemo(() => {
//     const totalPrice = spkItems.reduce((sum, item) => {
//       const price = item.type === "vakum" ? item.service?.vacuumPrice || 0 : item.service?.cleanPrice || 0;
//       return sum + (price * (item.jumlah || 0));
//     }, 0);

//     const totalPromo = spkItems.reduce((sum, item) => {
//       if (item.promo) {
//         const { amount: promoAmount, type: promoType } = item.promo;
//         const price = item.type === "vakum" ? item.service?.vacuumPrice || 0 : item.service?.cleanPrice || 0;
//         if (promoType === "Nominal") {
//           return sum + promoAmount;
//         } else if (promoType === "Persentase") {
//           return sum + ((promoAmount * price * (item.jumlah || 0)) / 100);
//         }
//       }
//       return sum;
//     }, 0);

//     const isInvalidTotal = totalPromo > totalPrice;

//     return {
//       totalPrice,
//       totalReductions: totalPromo,
//       isInvalidTotal
//     };
//   }, [spkItems]);


//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   // Validasi dasar
//   //   if (spkItems.length === 0) {
//   //     toast({
//   //       title: "Peringatan",
//   //       description: "Harap tambahkan minimal satu item SPK",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   if (!selectedCustomer?.id) {
//   //     toast({
//   //       title: "Peringatan",
//   //       description: "Harap pilih customer terlebih dahulu",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   if (formData.cleaningStaff.length === 0 && formData.blowerStaff.length === 0) {
//   //     toast({
//   //       title: "Peringatan",
//   //       description: "Harap pilih minimal satu petugas",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   if (totals.isInvalidTotal) {
//   //     toast({
//   //       title: "Peringatan",
//   //       description: "Total pengurangan (promo + diskon) tidak boleh lebih besar dari total harga",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   // Prepare data sesuai expected request body
//   //   const submitData = {
//   //     customerId: selectedCustomer.id,
//   //     discountPrice: totals.totalReductions, // Total promo + diskon manual
//   //     trxDate: new Date(formData.trxDate).toISOString(),
//   //     assigns: formData.cleaningStaff,
//   //     blowers: formData.blowerStaff,
//   //     details: spkItems.map(item => ({
//   //       serviceCategory: item.kategoriCode,
//   //       serviceCode: item.kode,
//   //       serviceType: item.tipe === "vakum" ? 0 : 1,
//   //       servicePrice: item.harga,
//   //       quantity: item.jumlah,
//   //       promoCode: item.promoCode || "",
//   //       promoType: item.promoType || "",
//   //       promoAmount: item.promo
//   //     }))
//   //   };

//   //   try {
//   //     await api.post("/transaction", submitData);
//   //     toast({
//   //       title: "Berhasil",
//   //       description: "SPK berhasil ditambahkan!",
//   //       variant: "default",
//   //     });
//   //     router.push("/transaksi/spk");
//   //   } catch (error: any) {
//   //     console.error("Error response:", error.response?.data || error.message);
//   //     toast({
//   //       title: "Gagal",
//   //       description: "Terjadi kesalahan saat menambahkan SPK.",
//   //       variant: "destructive",
//   //     });
//   //   }
//   // };

//   return <>
//     <Breadcrumbs label="Tambah SPK" />
//     <Wrapper>
//       <Tabs defaultValue="detail" className="-mt-2">
//         <TabsList>
//           <TabsTrigger value="detail">Detail</TabsTrigger>
//           <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
//           <TabsTrigger value="foto">Foto</TabsTrigger>
//         </TabsList>
//         <div className="w-full border-t my-3 -mx-10"></div>

//         <TabsContent value="detail">
//           <div className="flex flex-col gap-4">
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-2 gap-20">
//                 <div className="col-span-1 space-y-4">
//                   {/* WhatsApp Combobox */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">No Whatsapp</Label>
//                     <WhatsAppCombobox2
//                       onCustomerSelect={handleSelectCustomer}
//                       placeholder="Masukkan No Whatsapp"
//                     />
//                   </div>

//                   {/* Nama Pelanggan - View Only */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Nama Pelanggan</Label>
//                     <Input
//                       id="customerName"
//                       value={formData.customer?.fullname}
//                       placeholder="Nama Pelanggan akan terisi otomatis"
//                       readOnly
//                       className="bg-muted/50 cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Alamat - View Only */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Alamat</Label>
//                     <Textarea
//                       id="address"
//                       value={formData.customer?.address}
//                       placeholder="Alamat akan terisi otomatis"
//                       rows={4}
//                       className="resize-none bg-muted/50 cursor-not-allowed"
//                       readOnly
//                     />
//                   </div>
//                 </div>

//                 <div className="col-span-1 space-y-4">
//                   {/* Provinsi - View Only */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Provinsi</Label>
//                     <Input
//                       value={locationLabels.provinceName}
//                       placeholder="Provinsi akan terisi otomatis"
//                       readOnly
//                       className="bg-muted/50 cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Kab/Kota - View Only */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Kab/Kota</Label>
//                     <Input
//                       value={locationLabels.cityName}
//                       placeholder="Kota/Kabupaten akan terisi otomatis"
//                       readOnly
//                       className="bg-muted/50 cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Kecamatan - View Only */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Kecamatan</Label>
//                     <Input
//                       value={locationLabels.districtName}
//                       placeholder="Kecamatan akan terisi otomatis"
//                       readOnly
//                       className="bg-muted/50 cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Kelurahan - View Only */}
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Kelurahan</Label>
//                     <Input
//                       value={locationLabels.subDistrictName}
//                       placeholder="Kelurahan akan terisi otomatis"
//                       readOnly
//                       className="bg-muted/50 cursor-not-allowed"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="w-full border-t my-7"></div>

//               <div className="grid grid-cols-2 gap-20">
//                 <div className="col-span-1 space-y-4">
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Petugas Cleaning</Label>
//                     <MultiSelect
//                       staffList={cleaningStaffList}
//                       selected={formData.cleaningStaffList}
//                       onSelectionChange={handleCleaningStaffChange}
//                       placeholder="Pilih petugas cleaning"
//                       loading={loadingCleaningStaff}
//                     />
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Tanggal Transaksi</Label>
//                     <DatePicker
//                       value={formData.trxDate ? new Date(formData.trxDate) : null}
//                       onChange={(date) => {
//                         if (date) {
//                           setFormData(prev => ({
//                             ...prev,
//                             trxDate: formatDateInput(date.toISOString())
//                           }));
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-span-1 space-y-4">
//                   <div className="flex items-center space-x-4">
//                     <Label className="w-[40%] font-semibold">Petugas Blower</Label>
//                     <MultiSelect
//                       staffList={blowerStaffList}
//                       selected={formData.blowerStaffList}
//                       onSelectionChange={handleBlowerStaffChange}
//                       placeholder="Pilih petugas blower"
//                       loading={loadingBlowerStaff}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>

//             <div className="w-full border-t mt-7"></div>

//             <div className="mt-5 space-y-3">
//               <div className="flex justify-end">
//                 <Button
//                   icon={<LuPlus size={16} />}
//                   className="pl-2 pr-4"
//                   iconPosition="left"
//                   variant="default"
//                   onClick={() => {
//                     // resetFormDialog();
//                     setOpenDialog(true);
//                   }}
//                 >
//                   Tambah
//                 </Button>
//               </div>
//               <SPKTableDetail
//                 data={spkItems}
//                 columns={DataHeaderSPKDetail}
//                 currentPage={1}
//                 limit={10}
//                 fetchData={() => console.log("Fetching data...")}
//               // onDelete={handleDeleteSPKItem}
//               // onEdit={handleEditSPKItem}
//               />
//             </div>

//             {/* Summary Section - Moved to bottom */}
//             <div className="grid grid-cols-2 gap-20 mt-8 border-t pt-6">
//               <div className="col-span-1"></div>
//               <div className="col-span-1 space-y-4">
//                 <div className="flex items-center space-x-4">
//                   <Label className="w-[40%] font-semibold flex items-center gap-1">
//                     Total Harga
//                     {totals.isInvalidTotal && (
//                       <div className="relative group">
//                         <AlertTriangle className="h-4 w-4 text-red-500" />
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//                           Total pengurangan tidak boleh lebih besar dari total harga
//                         </div>
//                       </div>
//                     )}
//                   </Label>
//                   <Input
//                     className={`text-right ${totals.isInvalidTotal ? 'border-red-500 bg-red-50' : ''}`}
//                     disabled
//                     value={formatRupiah(totals.totalPrice)}
//                   />
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <Label className="w-[40%] font-semibold">Total Promo</Label>
//                   <Input className="text-right" disabled value={formatRupiah(totals.totalPromo)} />
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <Label className="w-[40%] font-semibold">Diskon Manual</Label>
//                   <RupiahInput
//                     placeholder="Rp. 0"
//                     value={formData.manualDiscount ? formatRupiah(formData.manualDiscount) : ''}
//                     onValueChange={setManualDiscount}
//                     className="text-right"
//                   />
//                 </div>

//                 <div className="flex items-center justify-between mt-5 px-3 py-2 bg-neutral-20 dark:bg-darkColor rounded-lg">
//                   <Label className="w-[50%] font-bold text-2xl">Total Akhir</Label>
//                   <Label className="text-right font-bold text-2xl">{formatRupiah(totals.finalPrice)}</Label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end mt-6 gap-2">
//               <Button onClick={() => router.back()} variant="outline2">
//                 Kembali
//               </Button>
//               <Button
//                 type="submit"
//                 variant="main"
//                 onClick={handleSubmit}
//                 disabled={totals.isInvalidTotal}
//               >
//                 Simpan
//               </Button>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="riwayat">
//           <div className="text-muted-foreground">Tab Riwayat kosong (dummy)</div>
//         </TabsContent>

//         <TabsContent value="foto">
//           <div className="text-muted-foreground">Tab Foto kosong (dummy)</div>
//         </TabsContent>
//       </Tabs>
//     </Wrapper>

//     <SPKItemForm
//       id={id}
//       formData={selectedSPKItem}
//       setFormData={setFormData}
//       onSubmit={onSubmit}
//       isDialogOpen={openDialog}
//       setIsDialogOpen={setOpenDialog}
//       isEditMode={!!selectedSPKItem}
//     />
//   </>
// }


