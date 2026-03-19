'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, Bell, Search, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Activity, label: 'Herd Activity', href: '/dashboard/activity' },
    { icon: Users, label: 'Sponsors', href: '/dashboard/sponsors' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0 z-10">
        <div className="h-20 flex items-center px-6 border-b border-zinc-100">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center">
              <span className="font-outfit font-bold text-lg text-white leading-none">W</span>
            </div>
            <span className="font-outfit font-semibold text-lg text-zinc-950">WHP Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-zinc-950 text-white shadow-md shadow-zinc-950/10" 
                    : "text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 transition-all w-full text-left">
             <LogOut className="w-5 h-5 text-zinc-400" />
             Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search data, sponsors, activities..." 
              className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-full pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all placeholder:text-zinc-400"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-zinc-50 transition-colors">
              <Bell className="w-5 h-5 text-zinc-500" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-px h-6 bg-zinc-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-zinc-950 group-hover:text-zinc-700 transition-colors">Admin Lead</p>
                <p className="text-xs text-zinc-500">Conservation Dept</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <Image
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f5f5f5"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
