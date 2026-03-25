import { ArrowRight, LogIn, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { clientSignOut } from "@/lib/auth/client-sign-out";
import ShimmerButton from "./shimmer-button";
import Link from "next/link";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const { isAuthenticated, isLoading } = useUserStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    router.push("/auth");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await clientSignOut();
      if (error) {
        console.error("Logout error:", error);
      }
      setMobileMenuOpen(false);
      await router.refresh();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <motion.header
      style={{ opacity: isScrolled ? headerOpacity : 1 }}
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 shadow-sm border-b border-border/40"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg">
            R
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            RAG SaaS
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
          >
            Features
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
          >
            How It Works
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
          >
            Testimonials
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
          >
            Pricing
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
          >
            FAQ
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full" />
          </Link>
        </nav>
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated && !isLoading ? (
            <>
              <Link href="/dashboard">
                <ShimmerButton
                  variant="outline"
                  className="rounded-full text-sm font-medium border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
                >
                  Dashboard
                  <ArrowRight className="ml-2 size-4" />
                </ShimmerButton>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-full text-sm font-medium border-border text-muted-foreground hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="mr-2 size-4" />
                {isLoggingOut ? "Signing out…" : "Log out"}
              </Button>
            </>
          ) : (
            <ShimmerButton
              variant="outline"
              onClick={handleLogin}
              className="rounded-full text-sm font-medium border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
            >
              <LogIn className="mr-2 size-4" />
              Sign In
            </ShimmerButton>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {mounted && theme === "dark" ? (
              <Moon className="size-[18px]" />
            ) : (
              <Sun className="size-[18px]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
        >
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {isAuthenticated && !isLoading ? (
                <>
                  <Link
                    href="/dashboard"
                    className="py-2 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="justify-start py-2 text-sm font-medium text-red-600"
                  >
                    <LogOut className="mr-2 size-4" />
                    {isLoggingOut ? "Signing out…" : "Log out"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="justify-start py-2 text-sm font-medium"
                >
                  <LogIn className="mr-2 size-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default NavBar;
