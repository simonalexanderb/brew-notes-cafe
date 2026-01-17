import React from "react";
import { cn } from "@/lib/utils";

interface MiniRadarProps {
  data: {
    sweetness: number;
    acidity: number;
    body: number;
    flavor: number; // Using Flavor as a proxy for "Intensity/Aroma" or "Bitter" equivalent
  };
  size?: number;
  className?: string;
}

export const MiniRadar = ({ data, size = 85 }: MiniRadarProps) => {
  const center = size / 2;
  const radius = (size / 2) * 0.65; // Reduced radius to fit labels

  // 4 axes: sweetness (top), flavor (right), body (bottom), acidity (left)
  const axes = [
    { key: "sweetness", label: "Süß", angle: -90 }, // Top
    { key: "flavor", label: "Geschmack", angle: 0 },      // Right
    { key: "body", label: "Körper", angle: 90 },       // Bottom
    { key: "acidity", label: "Säure", angle: 180 },   // Left
  ];

  // Calculate point positions
  const getPoint = (value: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const distance = (value / 10) * radius;
    return {
      x: center + distance * Math.cos(rad),
      y: center + distance * Math.sin(rad),
    };
  };

  // Generate polygon points
  const points = axes
    .map((axis) => {
      const value = (data as any)[axis.key] || 0;
      const point = getPoint(value, axis.angle);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  // Grid circles at 3, 6, 9
  const gridLevels = [3, 6, 9];

  return (
    <svg 
      width={size} 
      height={size} 
      className="overflow-visible animate-in zoom-in-90 duration-500 ease-out"
    >
      {/* Grid circles */}
      {gridLevels.map((level) => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 10) * radius}
          fill="none"
          stroke="#D9D3CD"
          strokeWidth="0.5"
          className="opacity-50"
        />
      ))}

      {/* Axis lines */}
      {axes.map((axis) => {
        const end = getPoint(10, axis.angle);
        return (
          <line
            key={axis.key}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="#D9D3CD"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={points}
        fill="#BBAE9F20"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary transition-all duration-500"
      />

      {/* Data points */}
      {axes.map((axis) => {
        const value = (data as any)[axis.key] || 0;
        const point = getPoint(value, axis.angle);
        return (
          <circle
            key={`point-${axis.key}`}
            cx={point.x}
            cy={point.y}
            r="2"
            className="fill-primary"
          />
        );
      })}

      {/* Axis labels */}
      {axes.map((axis) => {
        const labelDistance = radius + 10;
        const rad = (axis.angle * Math.PI) / 180;
        const labelX = center + labelDistance * Math.cos(rad);
        const labelY = center + labelDistance * Math.sin(rad);
        
        return (
          <text
            key={`label-${axis.key}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#786E66"
            className="text-[8px] font-medium uppercase tracking-wider"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
};
