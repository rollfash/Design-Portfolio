import { motion, useTransform, MotionValue, useReducedMotion, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignatureProps {
  progress: MotionValue<number>;
  className?: string;
}

export function Signature({ progress, className }: SignatureProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Map scroll progress (0 to 1) to reveal percentage (0 to 100)
  const reveal = useTransform(progress, [0, 1], [0, 100]);
  const opacity = useTransform(progress, [0, 0.05], [0, 1]);

  const finalReveal = shouldReduceMotion ? 100 : reveal;
  const finalOpacity = shouldReduceMotion ? 1 : opacity;
  
  // Create a dynamic mask gradient that moves from left to right
  const maskImage = useMotionTemplate`linear-gradient(90deg, black ${finalReveal}%, transparent ${finalReveal}%)`;

  return (
    <div className={cn("pointer-events-none select-none flex items-center justify-center", className)}>
      <motion.div
        style={{ 
          maskImage: maskImage,
          WebkitMaskImage: maskImage, // Safari support
          opacity: finalOpacity
        }}
        className="w-full h-full flex items-center justify-center"
      >
        <img 
          src="/signature.png" 
          alt="Signature" 
          className="w-full h-full object-contain opacity-80 dark:invert dark:opacity-90"
        />
      </motion.div>
    </div>
  );
}

