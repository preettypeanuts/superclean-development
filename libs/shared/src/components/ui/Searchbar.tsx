import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";

export const Searchbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Reset search
    const handleResetSearch = () => {
        setSearchTerm("");
        setIsSearching(false);
    };

    return (
        <section>
            <div>
                {!isSearching ? (
                    <button onClick={() => setIsSearching(true)} className="p-2 rounded-full">
                        <RiSearchLine />
                    </button>
                ) : (
                    <label className="input input-sm rounded-full bg-opacity-0 focus-within:dark:bg-black focus-within:bg-white flex items-center gap-[6px] p-2 border border-gray-300 dark:border-neutral-500">
                        <RiSearchLine />
                        <input
                            value={searchTerm}
                            onChange={handleSearchChange}
                            type="text"
                            className="grow placeholder:text-black dark:placeholder:text-white outline-none"
                        />
                        <button onClick={handleResetSearch} className="p-[2px] bg-neutral-500/20 rounded-full -mr-1 text-lg">
                            <IoIosClose />
                        </button>
                    </label>
                )}
            </div>
        </section>
    );
};
