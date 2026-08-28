import { Heart, Home, Search, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
const items=[{to:"/",icon:Home,label:"Home"},{to:"/products",icon:Search,label:"Browse"},{to:"/wishlist",icon:Heart,label:"Wishlist"},{to:"/profile",icon:UserRound,label:"Profile"}];
function BottomNav(){return <nav className="fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-2xl border border-neutral-200 bg-white/95 p-2 shadow-xl backdrop-blur lg:hidden" aria-label="Main navigation">{items.map(({to,icon:Icon,label})=><NavLink key={to} to={to} className={({isActive})=>`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition ${isActive?"bg-black text-white":"text-neutral-500 hover:bg-neutral-100"}`}><Icon className="h-4 w-4"/><span>{label}</span></NavLink>)}</nav>}
export default BottomNav;
