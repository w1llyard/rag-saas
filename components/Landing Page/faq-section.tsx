import React from "react";
import DotPattern from "./dot-pattern";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does RAG SaaS work?",
      answer:
        "RAG SaaS uses Retrieval-Augmented Generation to create AI chatbots trained on your documents. You upload your documents, our system processes them into embeddings, and then when users ask questions, the AI retrieves relevant information and generates accurate, context-aware answers.",
    },
    {
      question: "What types of documents can I upload?",
      answer:
        "Currently, we support PDF, TXT, and Markdown (MD) files. We're working on adding support for more file types including DOCX, HTML, and CSV in the near future.",
    },
    {
      question: "Do I need my own Gemini API key?",
      answer:
        "Yes, you'll need to provide your own Gemini API key to power the AI models. This gives you full control over your usage and costs. You can easily get a key from Google AI Studio.",
    },
    {
      question: "How much does it cost?",
      answer:
        "We offer a 14-day free trial with no credit card required. After that, our Pro plan starts at $49/month for 5 chatbots and 10,000 queries. We also offer custom Enterprise plans for larger organizations.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use bank-level encryption for all data at rest and in transit. Your documents are stored securely, and we never use your data to train our models. You maintain full ownership of your content.",
    },
    {
      question: "Can I customize the appearance of the chatbot?",
      answer:
        "Yes, you can fully customize the appearance of your chatbot widget including colors, position, theme, and more to match your brand and website design.",
    },
  ];

  return (
    <section
      id="faq"
      className="w-full py-20 md:py-32 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative"
    >
      <DotPattern className="opacity-30" />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Find answers to common questions about RAG SaaS and how it can help
            your business.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <AccordionItem value={`faq-${i}`} className="border-border/40">
                  <AccordionTrigger className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-purple-600 data-[state=open]:to-pink-600 data-[state=open]:bg-clip-text data-[state=open]:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
