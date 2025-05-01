"use client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LuListFilter } from "react-icons/lu";
import { useCategoryStore } from "../../../utils/useCategoryStore";

interface FilterCategoryServicesProps {
  catFilter: string;
  setcatFilter: (branch: string) => void;
}

export function FilterCategoryLayanan({ catFilter, setcatFilter }: FilterCategoryServicesProps) {
  const { catLayananMapping = {} } = useCategoryStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          icon={<LuListFilter size={16} />}
          iconPosition="left"
          variant="outline"
        >
          {catFilter && catLayananMapping[catFilter]
            ? catLayananMapping[catFilter]
            : "Kategori"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 border-none">
        <DropdownMenuRadioGroup
          value={catFilter}
          onValueChange={(val) => {
            console.log("Selected Kategori:", val);
            setcatFilter(val);
          }}

        >
          <DropdownMenuRadioItem value="">
            Semua Layanan
          </DropdownMenuRadioItem>
          {Object.entries(catLayananMapping).map(([code, name]) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              className={
                catFilter === code
                  ? "bg-mainColor/50 dark:bg-mainColor/30"
                  : ""
              }
            >
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
