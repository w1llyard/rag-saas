import { motion } from 'framer-motion';
import React from 'react'
import { Card } from '../ui/card';

const AnimatedCard = ({ children, className = "", delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`group ${className}`}
    >
      <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/20 hover:-translate-y-1">
        {children}
      </Card>
    </motion.div>
  );

export default AnimatedCard
