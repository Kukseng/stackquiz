'use client';

import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Activity, 
  User, 
  LogOut, 
  Search, 
  Plus,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const sidebarItems = [
    { icon: Home, label: 'Home', href: '/dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Library', href: '/dashboard/library', path: '/dashboard/library' },
    { icon: BarChart3, label: 'Report', href: '/dashboard/report', path: '/dashboard/report' },
    { icon: Activity, label: 'Activity', href: '/dashboard/activity', path: '/dashboard/activity' },
  ];

  const accountItems = [
    { icon: User, label: 'Profile', href: '/dashboard/profile', path: '/dashboard/profile' },
    { icon: LogOut, label: 'Log Out', href: '/logout', path: '/logout' },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 sm:p-4 border-b relative">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-8 sm:h-8  flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-base sm:text-xl text-gray-800">STACKQUIZ</span>
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="p-3 sm:p-4 flex-1 overflow-y-auto">
          <div className="space-y-1 sm:space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-[#f97316] text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 className="px-3 sm:px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
              ACCOUNT PAGES
            </h3>
            <div className="space-y-1 sm:space-y-2">
              {accountItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-[#f97316] text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Documentation Card */}
        <div className="m-3 sm:m-4 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all">
      {/* Title */}
      <h4 className="font-semibold text-center text-base sm:text-lg mb-4">
        Need help?
      </h4>

      {/* Icon Container */}
      <div className="flex justify-center">
        <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-center opacity-90 mb-5">
        Please check our docs
      </p>

      {/* Button */}
      <button className="w-full bg-white text-orange-600 px-3 py-2.5 rounded-2xl text-sm sm:text-base font-semibold hover:bg-orange-50 transition-colors">
        DOCUMENTATION
      </button>
    </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-2 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {pathname === '/dashboard' ? 'Dashboard' :
                 pathname === '/dashboard/library' ? 'Library' :
                 pathname === '/dashboard/report' ? 'Report' :
                 pathname === '/dashboard/activity' ? 'Activity' :
                 pathname === '/dashboard/profile' ? 'Profile' : 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Type here..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-48 lg:w-64"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              
              {/* Mobile Search Button */}
              <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="bg-[#f97316] text-white px-3 sm:px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Quiz</span>
                <span className="sm:hidden text-xs">Create</span>
              </button>
              
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm sm:text-base">    <User />
</span>
              </div>
              
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;