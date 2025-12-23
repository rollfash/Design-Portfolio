import { motion, useTransform, MotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignatureProps {
  progress: MotionValue<number>;
  className?: string;
}

export function Signature({ progress, className }: SignatureProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Map scroll progress (0 to 1) to path length (0 to 1)
  // If reduced motion, always show full path
  const pathLength = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 0.1], [0, 1]);

  const finalPathLength = shouldReduceMotion ? 1 : pathLength;
  const finalOpacity = shouldReduceMotion ? 1 : opacity;

  return (
    <div className={cn("pointer-events-none select-none", className)}>
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path
          d="M50 120 C 60 80, 80 140, 100 120 C 120 100, 140 60, 160 90 S 200 160, 220 120 C 240 80, 280 60, 300 100 S 340 140, 360 110 L 380 120"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary drop-shadow-sm"
          style={{ pathLength: finalPathLength, opacity: finalOpacity }}
          initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
        />
      </svg>
    </div>
  );
}
