import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
function SearchBar({value,onChange,placeholder="Browse"}){return <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"/><Input className="h-10 pl-9 pr-9" type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} aria-label="Search products"/>{value&&<button type="button" onClick={()=>onChange("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black"><X className="h-4 w-4"/></button>}</div>}
export default SearchBar;
