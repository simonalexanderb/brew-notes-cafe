import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TAG_GROUPS = {
  Fruit: ["Berry", "Citrus", "Stone Fruit", "Apple", "Grape"],
  Sweet: ["Caramel", "Chocolate", "Honey", "Vanilla", "Brown Sugar"],
  Floral: ["Jasmine", "Rose", "Chamomile", "Lavender"],
  NuttySpicy: ["Almond", "Hazelnut", "Cinnamon", "Clove", "Nutmeg"],
  Other: ["Earthy", "Herbal", "Fermented", "Tea-like", "Vegetal"],
};

export const TagSelector = ({ selectedTags, onChange }: TagSelectorProps) => {
  const [customTag, setCustomTag] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("Fruit");

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      onChange([...selectedTags, customTag]);
      setCustomTag("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-muted/30 rounded-lg border border-border/50">
        {selectedTags.length === 0 && (
          <span className="text-muted-foreground text-sm italic">No tags selected</span>
        )}
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => toggleTag(tag)}
              className="hover:bg-primary/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Group Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {Object.keys(TAG_GROUPS).map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setActiveGroup(group)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeGroup === group
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Tags in Active Group */}
      <div className="flex flex-wrap gap-2">
        {(TAG_GROUPS as any)[activeGroup].map((tag: string) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={cn(
              "px-4 py-2 rounded-full text-sm border transition-all",
              selectedTags.includes(tag)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary/50"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <Input
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          placeholder="Add custom tag..."
          onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
          className="rounded-full"
        />
        <Button
          onClick={addCustomTag}
          size="icon"
          className="rounded-full shrink-0"
          disabled={!customTag}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
