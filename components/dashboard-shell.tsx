"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useUserStore } from "@/store/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { clientSignOut } from "@/lib/auth/client-sign-out";
import { getAvatarInitials } from "@/utils/utils";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const { userData: user, isAuthenticated } = useUserStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      current: pathname === "/dashboard",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
      current: pathname === "/dashboard/help",
    },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await clientSignOut();
      if (error) {
        console.error("Logout error:", error);
      }
      await router.refresh();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-background pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white">
                R
              </div>
              <span>RAG SaaS</span>
            </div>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center w-full justify-start px-2"
                >
                  <div className="flex items-center">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user?.profile_picture_url ?? ''}
                        alt="@shadcn"
                      />
                      <AvatarFallback>{getAvatarInitials(user ? user.name! : 'C')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium">
                        {user?.name ?? ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email ?? ''}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Signing out…" : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        {/* Mobile menu backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-background z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white">
                R
              </div>
              <span>RAG SaaS</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex items-center">
              <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <User className="size-4" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.name ?? "Account"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={toggleTheme}
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Signing out…" : "Log out"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 md:hidden flex items-center h-16 bg-background border-b px-4 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 shrink-0"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="font-semibold truncate min-w-0">RAG SaaS</div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-red-600"
            onClick={handleLogout}
            disabled={isLoggingOut || !isAuthenticated}
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={toggleTheme}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <main className="flex-1 pb-16 md:pb-0">
          <div className="py-6 px-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
