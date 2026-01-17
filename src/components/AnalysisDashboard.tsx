import React from "react";
import { cn } from "@/lib/utils";
import { Recipe } from "@/lib/api";

interface AnalysisDashboardProps {
  recipe: Recipe;
}

export const AnalysisDashboard = ({ recipe }: AnalysisDashboardProps) => {
  // Helper to generate profile text
  const getProfileText = () => {
    const highNotes = [];
    if (recipe.sweetness >= 7) highNotes.push("sweet");
    if (recipe.acidity >= 7) highNotes.push("bright/acidic");
    if (recipe.body >= 7) highNotes.push("full-bodied");
    if (recipe.flavor >= 7) highNotes.push("flavorful");

    const lowNotes = [];
    if (recipe.acidity <= 3) lowNotes.push("low acidity");
    if (recipe.sweetness <= 3) lowNotes.push("low sweetness");

    let text = "This coffee presents a ";
    if (highNotes.length > 0) {
      text += highNotes.join(" and ") + " profile";
    } else {
      text += "balanced profile";
    }

    if (lowNotes.length > 0) {
      text += `, with ${lowNotes.join(" and ")}.`;
    } else {
      text += ".";
    }

    return text;
  };

  const bars = [
    { label: "Sweet", value: recipe.sweetness },
    { label: "Acid", value: recipe.acidity },
    { label: "Body", value: recipe.body },
    { label: "Aroma", value: recipe.aroma },
  ];

  return (
    <div className="space-y-6">
      {/* Taste Profile Card */}
      <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <span>💡</span> Taste Profile
        </h3>
        <p className="text-lg font-medium leading-relaxed">
          {getProfileText()}
        </p>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          {recipe.sweetness >= 6 && <span className="flex items-center gap-1">🍯 Sweet</span>}
          {recipe.acidity >= 6 && <span className="flex items-center gap-1">🍋 Bright</span>}
          {recipe.body >= 6 && <span className="flex items-center gap-1">🍫 Full</span>}
          {recipe.flavor >= 6 && <span className="flex items-center gap-1">🌸 Complex</span>}
        </div>
      </div>

      {/* Aroma Distribution (Micro Bars) */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Aroma Distribution
        </h3>
        <div className="space-y-2">
          {bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="w-12 text-xs font-medium text-muted-foreground">{bar.label}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(bar.value / 10) * 100}%` }}
                />
              </div>
              <span className="w-4 text-xs font-bold tabular-nums text-right">{bar.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
