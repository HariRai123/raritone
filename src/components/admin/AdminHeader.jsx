import {
  Bell,
  Menu,
  UserCircle,
} from "lucide-react";

function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur sm:px-6">

      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-medium text-neutral-900">
          Admin Panel
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100"
        >
          <Bell className="h-5 w-5 text-neutral-600" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-black" />
        </button>

        <div className="ml-1 flex items-center gap-2 border-l border-neutral-200 pl-3">

          <UserCircle className="h-8 w-8 text-neutral-500" />

          <div className="hidden sm:block">

            <p className="text-xs font-medium text-neutral-900">
              Administrator
            </p>

            <p className="text-[11px] text-neutral-400">
              Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default AdminHeader;