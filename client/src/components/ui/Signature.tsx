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
          d="M160 240 C 170 200, 240 80, 260 60 C 255 90, 220 160, 210 180 C 230 160, 280 140, 300 130"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary drop-shadow-sm opacity-90"
          style={{ pathLength: finalPathLength, opacity: finalOpacity }}
          initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
        />
      </svg>
    </div>
  );
}
