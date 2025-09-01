"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  User,
  LogOut,
  HelpCircle,
  Menu,
  X
} from "lucide-react";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Report", href: "/report", icon: FileText },
  { name: "Activity", href: "/activity", icon: BarChart3 },
];

const accountItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Log Out", href: "/logout", icon: LogOut },
];

export default function SidebarComponent() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 mt-2">
            <div className="relative">
              {/* Logo icon - 3D stack effect */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg transform rotate-12"></div>
              <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg transform -rotate-12"></div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg"></div>
            </div>
            <span className="text-xl font-bold text-gray-800">
              STACK<span className="text-orange-500">QUIZZ</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${
                        isActive(item.href)
                          ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                          : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Account Pages Section */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Account Pages
              </h3>
              <ul className="space-y-2">
                {accountItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${
                          isActive(item.href)
                            ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                            : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        }
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Help Card */}
          <div className="mt-auto">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-4 text-white text-center">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="font-semibold text-sm mb-2">Need help?</h4>
              <p className="text-xs text-orange-100 mb-3">
                Please check our docs
              </p>
              <button className="bg-white text-gray-800 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                DOCUMENTATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}