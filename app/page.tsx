"use client";

import Link from "next/link";
import {
  Github,
} from "lucide-react";
import HeroSection from "@/components/Landing Page/hero-section";
import DotPattern from "@/components/Landing Page/dot-pattern";
import LogoSlider from "@/components/Landing Page/logo-slider";
import FeatureSection from "@/components/Landing Page/feature-section";
import HowItWorkSection from "@/components/Landing Page/how-it-work-section";
import TestimonialsSection from "@/components/Landing Page/testimonial-section";
import DemoSection from "@/components/Landing Page/demo-section";
import PricingSection from "@/components/Landing Page/pricing-section";
import FAQSection from "@/components/Landing Page/faq-section";
import NavBar from "@/components/Landing Page/nav-bar";

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col relative overflow-hidden">
      <NavBar />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeatureSection/>

        {/* Logo Section */}
        <LogoSlider />

        {/* How It Works Section */}
        <HowItWorkSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Demo Section */}
        <DemoSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />

      </main>

      <footer className="w-full py-12 border-t border-border/40 bg-gradient-to-r from-muted/20 to-muted/10 relative">
        <DotPattern className="opacity-20" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg">
                R
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                RAG SaaS
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/terms"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text"
              >
                Privacy
              </Link>
              <Link
                href="https://github.com/AntonioErdeljac/next13-ai-saas-starter"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text"
              >
                <Github className="mr-2 size-4 inline-block" />
                Github
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
