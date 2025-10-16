"use client";

import React, { useState, useRef, useEffect } from "react";
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
  X,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Fetch user profile to get avatarUrl
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.apiAccessToken) return;
      
      try {
        const res = await fetch(`${API}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.apiAccessToken}`,
            Accept: "*/*",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (session?.apiAccessToken) {
      fetchProfile();
    }
  }, [session?.apiAccessToken, API]);

  // Get avatar URL with priority: profile.avatarUrl -> session -> DiceBear -> fallback
  const avatarUrl = 
    profile?.avatarUrl || 
    session?.user?.image ||
    (session?.user?.name 
      ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.name)}`
      : "/avatar2.svg");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebarItems = [
    { icon: Home, label: "Home", href: "/dashboard", path: "/dashboard" },
    {
      icon: BookOpen,
      label: "Library",
      href: "/dashboard/library",
      path: "/dashboard/library",
    },
    {
      icon: BarChart3,
      label: "Report",
      href: "/dashboard/report",
      path: "/dashboard/report",
    },
    {
      icon: Activity,
      label: "Activity",
      href: "/dashboard/activity",
      path: "/dashboard/activity",
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    router.push("/dashboard/logout");
  };

  const Sidebar = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-5 sm:p-4 border-b relative">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center">
                <Image
                  src="/logo-stackquiz.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-base sm:text-xl text-gray-800">
                STACK<span className="text-yellow">QUIZ</span>
              </span>
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
                    ? "btn-secondary btn-text shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Mobile-only: Profile & Notifications */}
            <div className="lg:hidden pt-4 mt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  router.push("/dashboard/notifications");
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full transition-all duration-200"
              >
                <Bell className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-base">Notifications</span>
              </button>

              <button
                onClick={() => {
                  router.push("/dashboard/profile");
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full transition-all duration-200"
              >
                <User className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-base">Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all duration-200"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-base">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        {/* 📘 Need Help Card - bottom */}
        <div className="p-3 sm:p-4 mt-auto">
          <div className="btn-secondary btn-text rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
            <h4 className="font-semibold text-center text-base sm:text-lg mb-4">
              Need help?
            </h4>

            <div className="flex justify-center">
              <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>

            <p className="text-sm sm:text-base text-center opacity-90 mb-5">
              Please check our docs
            </p>

            <a
              href="/docs"
              className="block w-full text-center bg-white text-orange-600 px-3 py-2.5 rounded-2xl text-sm sm:text-base font-semibold hover:bg-orange-50 transition-colors"
            >
              DOCUMENTATION
            </a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
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
                {pathname === "/dashboard"
                  ? "Dashboard"
                  : pathname === "/dashboard/library"
                  ? "Library"
                  : pathname === "/dashboard/report"
                  ? "Report"
                  : pathname === "/dashboard/activity"
                  ? "Activity"
                  : pathname === "/dashboard/profile"
                  ? "Profile"
                  : pathname === "/dashboard/notifications"
                  ? "Notifications"
                  : "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Type here..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-48 lg:w-64"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              <Link
                href="/quizbuilder"
                className="btn-secondary btn-text px-3 sm:px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Quiz</span>
                <span className="sm:hidden text-xs">Create</span>
              </Link>

              {/* Desktop-only: Avatar Dropdown & Bell */}
              <div className="hidden lg:flex items-center gap-4">
                <button 
                  onClick={() => router.push("/dashboard/notifications")}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center hover:scale-105 cursor-pointer"
                  >
                    <Image
                      src={avatarUrl}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-yellow-400 shadow-md"
                      unoptimized
                    />

                  </div>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          router.push("/dashboard/profile");
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Settings className="w-4 h-4 mr-3" /> Profile Settings
                      </button>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;