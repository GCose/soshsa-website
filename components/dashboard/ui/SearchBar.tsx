import { Search } from "lucide-react";
import { SearchBarProps } from "@/types/interface/dashboard";

const SearchBar = ({ onSearch, className = "", ...props }: SearchBarProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        onChange={handleSearch}
        className="
         w-full pl-8 pr-4 py-2 bg-white border-y border-gray-300
          text-gray-900 placeholder:text-gray-400
          focus:outline-none focus-visible:outline-none
          focus:border-teal-400
          transition-colors
        "
        placeholder="Search..."
        style={{ boxShadow: "none", outline: "none" }}
        {...props}
      />
    </div>
  );
};

export default SearchBar;
