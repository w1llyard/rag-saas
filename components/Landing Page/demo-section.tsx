import React from "react";
import GradientBlur from "./gradient-blur";
import { motion } from "framer-motion";
import ShimmerButton from "./shimmer-button";
import { Check, ExternalLink } from "lucide-react";
import GridPattern from "./grid-pattern";

const DemoSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative">
      <GridPattern className="opacity-70" />
      <div className="container px-4 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Embed Your Chatbot Anywhere
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our lightweight JavaScript widget makes it easy to add your
              document-trained chatbot to any website. Just copy and paste a
              simple code snippet, and you're ready to go.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "No iframes or complex setup required",
                "Customizable appearance to match your brand",
                "Responsive design works on all devices",
                "Minimal impact on page load performance",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="size-5 text-purple-600 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ShimmerButton className="w-fit rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25">
              View Documentation
              <ExternalLink className="ml-2 size-4" />
            </ShimmerButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-red-500 shadow-sm"></div>
                <div className="size-3 rounded-full bg-yellow-500 shadow-sm"></div>
                <div className="size-3 rounded-full bg-green-500 shadow-sm"></div>
                <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  index.html
                </div>
              </div>
              <div className="font-mono text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 overflow-x-auto shadow-inner">
                <pre className="text-gray-800 dark:text-gray-300">
                  <span className="text-purple-600 dark:text-purple-400">
                    {"<head>"}
                  </span>
                  {"\n  <!-- Other head elements -->\n"}
                  <span className="text-purple-600 dark:text-purple-400">
                    {
                      '  <script src="https://cdn.ragsaas.com/widget.js"></script>'
                    }
                  </span>
                  {"\n"}
                  <span className="text-purple-600 dark:text-purple-400">
                    {"</head>"}
                  </span>
                  {"\n\n"}
                  <span className="text-purple-600 dark:text-purple-400">
                    {"<body>"}
                  </span>
                  {"\n  <!-- Your website content -->\n\n"}
                  <span className="text-purple-600 dark:text-purple-400">
                    {"  <script>"}
                  </span>
                  {"\n    window.ragWidget.init({\n"}
                  <span className="text-green-600 dark:text-green-400">
                    {'      chatbotId: "cb_123456",\n'}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {'      position: "bottom-right",\n'}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {'      theme: "light",\n'}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {'      primaryColor: "#9333ea"\n'}
                  </span>
                  {"    });\n"}
                  <span className="text-purple-600 dark:text-purple-400">
                    {"  </script>"}
                  </span>
                  {"\n"}
                  <span className="text-purple-600 dark:text-purple-400">
                    {"</body>"}
                  </span>
                </pre>
              </div>
            </div>
            <GradientBlur
              className="-bottom-6 -right-6 -z-10 h-[200px] w-[200px]"
              color="orange"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
