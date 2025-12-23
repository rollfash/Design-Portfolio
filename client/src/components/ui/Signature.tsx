import { motion, useTransform, MotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignatureProps {
  progress: MotionValue<number>;
  className?: string;
}

// Separate component to handle hooks for each path segment
function SignaturePath({ 
  d, 
  progress, 
  shouldReduceMotion 
}: { 
  d: string; 
  progress: MotionValue<number>; 
  shouldReduceMotion: boolean | null;
}) {
  
  // Map global progress to this path's 0-1 completion
  // Use slightly later start/end to sync with hero reveal nicely
  const pathProgress = useTransform(
    progress, 
    [0.1, 0.9], 
    [0, 1],
    { clamp: true }
  );

  const opacity = useTransform(pathProgress, [0, 0.01], [0, 1], { clamp: true });
  
  const finalPathLength = shouldReduceMotion ? 1 : pathProgress;

  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth="15" // Thicker stroke for this large scale SVG
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      style={{ 
        pathLength: finalPathLength,
        opacity: opacity
      }}
      className="text-primary drop-shadow-sm"
    />
  );
}

export function Signature({ progress, className }: SignatureProps) {
  const shouldReduceMotion = useReducedMotion();

  // The specific SVG path provided by the user
  const signaturePath = "M782.462,1866.924C727.279,1945.059 616.914,2101.328 540.528,2222.71C447.294,2370.862 202.41,2795.792 223.058,2755.84C243.706,2715.888 523.147,2201.784 664.414,1982.997C786.58,1793.793 956.625,1587.888 1070.659,1443.118C1159.454,1330.391 1252.962,1221.349 1348.617,1114.381C1472.896,975.402 1702.745,728.18 1816.333,609.247C1885.083,537.262 1972.239,452.005 2030.146,400.779C2071.652,364.063 2160.662,292.536 2163.78,301.89C2166.898,311.245 2092.15,409.333 2048.855,456.905C1986.558,525.356 1878.157,629.303 1790,712.596C1697.777,799.729 1594.997,892.146 1495.519,979.708C1394.987,1068.198 1286.367,1151.825 1186.807,1243.537C1061.826,1358.665 864.958,1551.884 745.633,1670.479C652.099,1763.441 536.723,1889.971 470.857,1955.107C432.805,1992.738 374.704,2043.597 350.438,2061.295C343.657,2066.241 319.667,2067.554 325.259,2061.295C355.912,2026.994 458.76,1917.536 534.351,1855.487C634.154,1773.565 801.464,1650.409 924.073,1569.764C1035.097,1496.74 1179.509,1421.977 1270.006,1371.619C1334.905,1335.506 1399.606,1298.709 1467.056,1267.621C1555.729,1226.751 1708.99,1152.857 1802.042,1126.401C1873.865,1105.981 1983.219,1099.216 2025.365,1108.886C2051.718,1114.932 2071.162,1165.811 2054.923,1184.422C2038.685,1203.032 1967.528,1217.446 1927.935,1220.548C1890.734,1223.462 1852.689,1215.066 1817.368,1203.032C1776.133,1188.983 1711.91,1141.362 1680.527,1136.254C1659.844,1132.887 1648.355,1164.168 1629.075,1172.38C1609.37,1180.773 1580.178,1184.422 1562.297,1186.611C1548.891,1188.253 1532.74,1180.043 1521.792,1185.516C1510.845,1190.99 1509.809,1214.524 1496.614,1219.453C1481.47,1225.109 1444.494,1202.266 1430.93,1219.453C1407.029,1249.74 1378.749,1382.749 1353.205,1401.177C1327.662,1419.605 1285.275,1296.275 1277.669,1330.02C1251.761,1444.966 1224.392,1837.242 1197.754,2090.853";

  return (
    <div className={cn("pointer-events-none select-none flex items-center justify-center", className)}>
      <svg
        viewBox="0 -400 2400 3400" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <SignaturePath
            d={signaturePath}
            progress={progress}
            shouldReduceMotion={shouldReduceMotion}
        />
      </svg>
    </div>
  );
}
