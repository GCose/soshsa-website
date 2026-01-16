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
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        onChange={handleSearch}
        className="
          w-full pl-12 pr-4 py-2.5
          bg-white border border-gray-300 rounded-lg
          text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          transition-colors
        "
        placeholder="Search..."
        {...props}
      />
    </div>
  );
};

export default SearchBar;
