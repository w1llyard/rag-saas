import React, { useEffect, useState } from "react";
import DotPattern from "./dot-pattern";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote:
        "RAG SaaS has transformed how we handle customer support. Our response time has decreased by 70% while maintaining high accuracy.",
      author: "Sarah Johnson",
      title: "Head of Customer Success",
      company: "TechCorp Inc.",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
    {
      quote:
        "Implementing the chatbot on our documentation site has reduced support tickets by 45%. The setup was incredibly simple.",
      author: "Michael Chen",
      title: "CTO",
      company: "DevFlow",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
    {
      quote:
        "The ability to train the AI on our internal documents has been game-changing for our team's productivity and knowledge sharing.",
      author: "Emily Rodriguez",
      title: "Knowledge Manager",
      company: "Global Solutions",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="testimonials"
      className="w-full py-20 md:py-32 overflow-hidden relative"
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
            What Our Customers Say
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Don't just take our word for it. See how RAG SaaS is helping
            businesses improve their customer support and knowledge management.
          </p>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-purple-100/20 to-background dark:from-background dark:via-purple-900/10 dark:to-background rounded-2xl"></div>

          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-background/80 backdrop-blur-sm shadow-2xl">
            <div className="p-8 md:p-12">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: activeTestimonial === i ? 1 : 0,
                    x: activeTestimonial === i ? 0 : 20,
                    position: activeTestimonial === i ? "relative" : "absolute",
                    zIndex: activeTestimonial === i ? 10 : -10,
                  }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="size-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl italic mb-6 max-w-3xl mx-auto">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="size-16 rounded-full overflow-hidden mb-3 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.author}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.title}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center pb-6">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`size-2 rounded-full transition-all ${
                      activeTestimonial === i
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-125"
                        : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                    }`}
                    aria-label={`View testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
