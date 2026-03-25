import { motion } from "framer-motion";
import React from "react";
import FloatingElements from "./floating-elements";
import GridPattern from "./grid-pattern";
import { Code, FileText, MessageSquare, Upload } from "lucide-react";

const HowItWorkSection = () => {
  const howItWorks = [
    {
      step: "01",
      title: "Sign Up & Connect",
      description:
        "Create an account and connect your Gemini API key to get started.",
      icon: <Upload className="size-6" />,
    },
    {
      step: "02",
      title: "Upload Documents",
      description:
        "Upload your PDFs, TXTs, or Markdown files to train your chatbot.",
      icon: <FileText className="size-6" />,
    },
    {
      step: "03",
      title: "Install Widget",
      description:
        "Add the embed widget to your website with a simple code snippet.",
      icon: <Code className="size-6" />,
    },
    {
      step: "04",
      title: "Start Chatting",
      description:
        "Ask questions and get accurate, context-aware answers from your documents.",
      icon: <MessageSquare className="size-6" />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full py-20 md:py-32 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden"
    >
      <GridPattern className="opacity-20" />
      <FloatingElements />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Simple Process, Powerful Results
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Get started in minutes and transform your documents into interactive
            AI chatbots.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 md:gap-12 relative">
          {howItWorks.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4 group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/25">
                {step.icon}
              </div>
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 text-purple-800 dark:text-purple-200 text-xs font-bold shadow-sm">
                {step.step}
              </div>
              <h3 className="text-xl font-bold group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorkSection;
