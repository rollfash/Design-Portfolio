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
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path
          d="M 150 200 C 140 180, 160 140, 180 130 C 200 120, 220 140, 210 160 C 200 180, 180 170, 190 150 C 200 130, 250 80, 280 70 C 290 65, 260 120, 250 140 C 240 160, 240 180, 260 170 C 280 160, 300 140, 320 130 C 330 125, 340 120, 350 130 C 360 140, 340 160, 330 170 M 200 180 C 220 180, 300 160, 350 150"
          stroke="currentColor"
          strokeWidth="2"
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
