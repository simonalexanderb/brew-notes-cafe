import React from "react";
import { cn } from "@/lib/utils";

interface AromaRadarProps {
  data: {
    fragrance: number;
    aroma: number;
    flavor: number;
    sweetness: number;
    acidity: number;
    body: number;
    aftertaste: number;
    balance: number;
  };
  size?: number;
  className?: string;
  showLabels?: boolean;
}

export const AromaRadar = ({
  data,
  size = 300,
  className,
  showLabels = true,
}: AromaRadarProps) => {
  const center = size / 2;
  const radius = (size / 2) * 0.75; // Leave space for labels
  const maxVal = 10;

  // Order of axes matches the reference image concept
  const axes = [
    { key: "fragrance", label: "Fragrance", angle: -90 }, // Top
    { key: "flavor", label: "Flavor", angle: -45 }, // Top Right
    { key: "aroma", label: "Aroma", angle: 0 }, // Right
    { key: "aftertaste", label: "Aftertaste", angle: 45 }, // Bottom Right
    { key: "balance", label: "Impression", angle: 90 }, // Bottom (using Balance as Impression)
    { key: "mouthfeel", label: "Mouthfeel", angle: 135 }, // Bottom Left (using Body as Mouthfeel)
    { key: "acidity", label: "Acidity", angle: 180 }, // Left
    { key: "sweetness", label: "Sweetness", angle: 225 }, // Top Left
  ];

  // Map data to axes (handling key mapping)
  const getValue = (key: string) => {
    switch (key) {
      case "mouthfeel": return data.body;
      case "balance": return data.balance; // Mapped to Impression label
      default: return (data as any)[key] || 0;
    }
  };

  // Helper to calculate coordinates
  const getCoordinates = (value: number, angle: number) => {
    const angleRad = (angle * Math.PI) / 180;
    const distance = (value / maxVal) * radius;
    return {
      x: center + distance * Math.cos(angleRad),
      y: center + distance * Math.sin(angleRad),
    };
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Axes */}
        {axes.map((axis) => {
          const end = getCoordinates(maxVal, axis.angle);
          return (
            <g key={axis.key}>
              {/* Axis Line */}
              <line
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/30"
              />
              
              {/* Ticks (3, 6, 9) */}
              {[3, 6, 9].map((tick) => {
                const tickPos = getCoordinates(tick, axis.angle);
                const tickLen = 3; // Length of tick mark perpendicular to axis
                // Calculate perpendicular angle
                const perpAngle = ((axis.angle + 90) * Math.PI) / 180;
                const dx = tickLen * Math.cos(perpAngle);
                const dy = tickLen * Math.sin(perpAngle);
                
                return (
                  <line
                    key={tick}
                    x1={tickPos.x - dx}
                    y1={tickPos.y - dy}
                    x2={tickPos.x + dx}
                    y2={tickPos.y + dy}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-muted-foreground/30"
                  />
                );
              })}

              {/* Label */}
              {showLabels && (
                <text
                  x={getCoordinates(maxVal + 2.5, axis.angle).x}
                  y={getCoordinates(maxVal + 2.5, axis.angle).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] uppercase tracking-wider fill-muted-foreground font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {axis.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Data Points */}
        {axes.map((axis) => {
          const value = getValue(axis.key);
          const pos = getCoordinates(value, axis.angle);
          
          if (value === 0) return null;

          return (
            <g key={axis.key}>
              {/* Point */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4"
                className="fill-foreground"
              />
              {/* Value Label next to point */}
              <text
                x={pos.x + (axis.angle > 90 || axis.angle < -90 ? -10 : 10)}
                y={pos.y + (axis.angle > 0 && axis.angle < 180 ? 10 : -5)}
                textAnchor="middle"
                className="text-[10px] font-bold fill-foreground"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
