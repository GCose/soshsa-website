import { Search } from "lucide-react";
import useDebounce from "@/utils/debounce";
import { useState, useEffect } from "react";
import { SearchBarProps } from "@/types/interface/dashboard";
import Input from "./InputField";

const SearchBar = ({ onSearch, className = "", ...props }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <Search size={20} />
      </div>

      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10 bg-teal-50! focus:bg-white! rounded-lg"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
};

export default SearchBar;
