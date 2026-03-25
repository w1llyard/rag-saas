import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  ArrowRight,
  Bot,
  Check,
  ExternalLink,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import ShimmerButton from "./shimmer-button";
import TypewriterText from "./typewriter-text";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import GradientBlur from "./gradient-blur";
import GridPattern from "./grid-pattern";
import FloatingElements from "./floating-elements";

const HeroSection = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  const handleLogin = () => {
    router.push("/auth");
  };

  return (
    <section
      ref={heroRef}
      className="w-full py-20 md:py-32 relative overflow-hidden"
    >
      <GridPattern />
      <FloatingElements />

      <div className="container p-4 md:p-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <Badge className="mb-4 w-fit rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 border-0">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Powered by Gemini AI
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turn Your{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Documents
              </span>{" "}
              into Smart AI Chatbots
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              <TypewriterText text="Upload PDFs, TXTs, or Markdown, then ask questions and get context-aware answers powered by Gemini AI." />
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <ShimmerButton
                    size="lg"
                    className="rounded-full h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 size-4" />
                  </ShimmerButton>
                </Link>
              ) : (
                <ShimmerButton
                  size="lg"
                  onClick={handleLogin}
                  className="rounded-full h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                >
                  Get Started
                  <ArrowRight className="ml-2 size-4" />
                </ShimmerButton>
              )}
              <ShimmerButton
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 text-base border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </ShimmerButton>
            </div>
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="size-4 text-purple-600" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-4 text-purple-600" />
                <span>Free Trial</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-4 text-purple-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    R
                  </div>
                  <span className="font-medium text-sm">RAG SaaS Widget</span>
                </div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-xs bg-white/50 dark:bg-gray-800/50"
                >
                  <ExternalLink className="size-3" />
                  Embed
                </Badge>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-sm">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 text-sm max-w-[80%] shadow-sm">
                      <p>
                        Hello! I'm your document assistant. Ask me anything
                        about your uploaded content.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start justify-end">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 rounded-lg p-3 text-sm max-w-[80%] shadow-sm">
                      <p>What's the main feature of your product?</p>
                    </div>
                    <div className="size-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-sm">
                      <span className="text-xs font-medium">U</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-sm">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 text-sm max-w-[80%] shadow-sm">
                      <p>
                        Based on your documents, our main feature is the ability
                        to create AI chatbots trained on your specific content.
                        You can upload PDFs, TXTs, or Markdown files, and our
                        system will process them to create a knowledge base for
                        your chatbot.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ask a question..."
                        className="w-full rounded-full border border-gray-200/50 dark:border-gray-700/50 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      />
                      <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 text-white shadow-sm hover:shadow-md transition-shadow">
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code snippet overlay */}
            <div className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-4 w-[200px] transform rotate-6">
              <div className="text-xs font-mono text-gray-800 dark:text-gray-300 overflow-hidden">
                <div className="text-purple-600 dark:text-purple-400">
                  {"<script>"}
                </div>
                <div>{"  window.ragWidget.init({"}</div>
                <div className="pl-4">{'chatbotId: "cb_123",'}</div>
                <div className="pl-4">{'position: "bottom-right"'}</div>
                <div>{"})"}</div>
                <div className="text-purple-600 dark:text-purple-400">
                  {"</script>"}
                </div>
              </div>
            </div>

            <GradientBlur
              className="-bottom-6 -right-6 -z-10 h-[300px] w-[300px]"
              color="purple"
            />
            <GradientBlur
              className="-top-6 -left-6 -z-10 h-[300px] w-[300px]"
              color="blue"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
