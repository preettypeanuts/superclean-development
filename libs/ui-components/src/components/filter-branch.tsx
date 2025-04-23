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
import { useParameterStore } from "../../../utils/useParameterStore";

interface FilterBranchProps {
  branchFilter: string;
  setBranchFilter: (branch: string) => void;
}

export function FilterBranch({ branchFilter, setBranchFilter }: FilterBranchProps) {
  const { branchMapping = {}, loading: loadingParams } = useParameterStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          icon={<LuListFilter size={16} />}
          iconPosition="left"
          variant="outline"
        >
          {branchFilter && branchMapping[branchFilter]
            ? branchMapping[branchFilter]
            : "Cabang"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 border-none">
        <DropdownMenuRadioGroup
          value={branchFilter}
          onValueChange={(val) => {
            console.log("Selected Branch:", val);
            setBranchFilter(val);
          }}

        >
          <DropdownMenuRadioItem value="">
            Semua Cabang
          </DropdownMenuRadioItem>
          {Object.entries(branchMapping).map(([code, name]) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              className={
                branchFilter === code
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
