import { motion, useTransform, MotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignatureProps {
  progress: MotionValue<number>;
  className?: string;
}

export function Signature({ progress, className }: SignatureProps) {
  const shouldReduceMotion = useReducedMotion();

  // Paths for the signature animation
  // These simulate a handwritten signature. 
  // TODO: Replace these path strings with the 'd' attributes from your "signature svg.svg" file
  const paths = [
    // "G"
    "M60 80 C 50 70, 50 40, 80 40 C 95 40, 100 60, 90 75 C 80 90, 60 90, 70 70",
    // "al"
    "M100 80 C 95 70, 105 65, 110 70 C 115 75, 115 90, 115 90 L 115 50",
    // " "
    "M125 90 L 135 90",
    // "S"
    "M150 80 C 145 90, 140 85, 145 75 C 150 65, 155 65, 150 55",
    // "h"
    "M160 50 L 160 90 M 160 70 C 165 60, 175 60, 175 90",
    // "in"
    "M185 70 L 185 90 M 195 70 L 195 90 M 195 70 C 200 60, 210 60, 210 90",
    // underline loop
    "M40 110 C 100 120, 200 100, 260 115"
  ];

  return (
    <div className={cn("pointer-events-none select-none flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 300 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {paths.map((d, index) => {
          // Calculate timing for each path segment
          // We distribute the total 0-1 progress among all paths
          const segmentLength = 1 / paths.length;
          const start = index * segmentLength;
          const end = (index + 1) * segmentLength;
          
          // Map global progress to this path's 0-1 completion
          // clamp: true ensures the path stays fully drawn once progress passes 'end'
          const pathProgress = useTransform(
            progress, 
            [start, end], 
            [0, 1],
            { clamp: true }
          );

          const finalPathLength = shouldReduceMotion ? 1 : pathProgress;

          return (
            <motion.path
              key={index}
              d={d}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              style={{ 
                pathLength: finalPathLength,
                opacity: useTransform(pathProgress, [0, 0.01], [0, 1], { clamp: true }) // Fade in quickly to avoid dots
              }}
              className="text-primary drop-shadow-sm"
            />
          );
        })}
      </svg>
    </div>
  );
}
