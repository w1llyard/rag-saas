import { motion } from "framer-motion";
import DotPattern from "./dot-pattern";
import Image from "next/image";

export default function LogoSlider() {
  return (
    <section className="w-full py-12 border-y bg-gradient-to-r from-muted/30 via-muted/10 to-muted/30 relative">
      <DotPattern className="opacity-50" />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100"></div>
                <Image
                  src={`/placeholder-logo.svg`}
                  alt={`Company logo ${i}`}
                  width={120}
                  height={60}
                  className="h-8 w-auto opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 relative"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
