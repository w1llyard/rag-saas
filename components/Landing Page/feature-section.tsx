import React, { useRef } from "react";
import GridPattern from "./grid-pattern";
import { CardContent } from "../ui/card";
import { motion, useInView } from "framer-motion";
import AnimatedCard from "./animated-card";
import { Code, Database, FileText, Layers, MessageSquare, Shield } from "lucide-react";

const FeatureSection = () => {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      title: "Upload & Parse Documents",
      description:
        "Easily upload PDFs, TXTs, or Markdown files and automatically parse their content.",
      icon: <FileText className="size-5" />,
    },
    {
      title: "Vector Search with Supabase",
      description:
        "Store and search document embeddings with Supabase for lightning-fast retrieval.",
      icon: <Database className="size-5" />,
    },
    {
      title: "Contextual Q&A",
      description:
        "Get accurate, context-aware answers powered by Google's Gemini AI models.",
      icon: <MessageSquare className="size-5" />,
    },
    {
      title: "Multiple Chatbots",
      description:
        "Create and manage multiple chatbots for different document sets or use cases.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Embed Anywhere",
      description:
        "Add your chatbot to any website with our lightweight JavaScript widget.",
      icon: <Code className="size-5" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security for your sensitive documents and data.",
      icon: <Shield className="size-5" />,
    },
  ];

  return (
    <section
      id="features"
      ref={featuresRef}
      className="w-full py-20 md:py-32 relative"
    >
      <GridPattern className="opacity-30" />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful RAG Capabilities
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Our platform provides everything you need to create, deploy, and
            manage AI chatbots trained on your documents.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={featuresInView ? "show" : "hidden"}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="size-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </AnimatedCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
