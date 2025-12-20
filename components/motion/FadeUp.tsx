"use client"
import React from "react";
import { motion } from "framer-motion";

const FadeUp = ({
  children,
  delay = 0,
  className,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
