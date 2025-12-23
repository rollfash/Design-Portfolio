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
          d="M40 100 C 50 90, 60 130, 70 110 C 80 90, 90 70, 100 90 C 110 110, 100 130, 110 120 C 120 110, 130 90, 140 100 S 160 120, 170 110 C 180 100, 190 90, 200 100 C 210 110, 220 120, 230 110 S 250 90, 260 100 C 270 110, 280 120, 290 110 S 310 90, 320 100 C 330 110, 340 120, 350 110"
          stroke="currentColor"
          strokeWidth="2.5"
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
