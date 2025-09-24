import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoffeeRating } from "./CoffeeRating";
import { TouchNumberInput } from "./TouchNumberInput";
import { Camera, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  beanName: string;
  packageImage?: string;
  inputGrams: number;
  outputGrams: number;
  brewingTime: number;
  grindSize: string;
  tasteRating: number;
  flavorNotesRating: number;
}

interface RecipeFormProps {
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
  initialRecipe?: Recipe;
}

export const RecipeForm = ({ onSave, onCancel, initialRecipe }: RecipeFormProps) => {
  const [formData, setFormData] = useState({
    beanName: initialRecipe?.beanName || "",
    packageImage: initialRecipe?.packageImage || "",
    inputGrams: initialRecipe?.inputGrams || 0,
    outputGrams: initialRecipe?.outputGrams || 0,
    brewingTime: initialRecipe?.brewingTime || 0,
    grindSize: initialRecipe?.grindSize || "",
    tasteRating: initialRecipe?.tasteRating || 0,
    flavorNotesRating: initialRecipe?.flavorNotesRating || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beanName.trim()) return;
    
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          packageImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isValid = formData.beanName.trim() && formData.inputGrams > 0 && formData.outputGrams > 0;

  return (
    <Card className="w-full max-w-md mx-auto shadow-soft border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-center">
          {initialRecipe ? 'Edit Recipe' : 'New Recipe'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="beanName">Bean Name</Label>
            <Input
              id="beanName"
              value={formData.beanName}
              onChange={(e) => setFormData(prev => ({ ...prev, beanName: e.target.value }))}
              placeholder="e.g., Ethiopian Yirgacheffe"
              className="border-coffee-light focus:ring-coffee-medium"
            />
          </div>

          <div className="space-y-2">
            <Label>Package Image</Label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="justify-start gap-2"
              >
                <Camera className="h-4 w-4" />
                {formData.packageImage ? 'Change Image' : 'Add Image'}
              </Button>
              {formData.packageImage && (
                <div className="aspect-[4/3] max-w-32 overflow-hidden rounded-md">
                  <img 
                    src={formData.packageImage} 
                    alt="Package preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <TouchNumberInput
              value={formData.inputGrams}
              onChange={(value) => setFormData(prev => ({ ...prev, inputGrams: value }))}
              label="Input Coffee"
              placeholder="18"
              min={0}
              max={50}
              step={0.5}
              unit="g"
            />
            
            <TouchNumberInput
              value={formData.outputGrams}
              onChange={(value) => setFormData(prev => ({ ...prev, outputGrams: value }))}
              label="Output Espresso"
              placeholder="36"
              min={0}
              max={100}
              step={0.5}
              unit="g"
            />
          </div>

          <div className="space-y-4">
            <TouchNumberInput
              value={formData.brewingTime}
              onChange={(value) => setFormData(prev => ({ ...prev, brewingTime: value }))}
              label="Brewing Time"
              placeholder="30"
              min={0}
              max={120}
              step={0.5}
              unit="sec"
            />
            
            <div className="space-y-2">
              <Label htmlFor="grindSize">Grind Size</Label>
              <Input
                id="grindSize"
                value={formData.grindSize}
                onChange={(e) => setFormData(prev => ({ ...prev, grindSize: e.target.value }))}
                placeholder="Fine, Medium, Coarse..."
                className="h-12 text-lg border-coffee-light focus:ring-coffee-medium"
              />
            </div>
          </div>

          <div className="space-y-6">
            <CoffeeRating
              rating={formData.tasteRating}
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, tasteRating: rating }))}
              label="Taste Quality"
            />
            
            <CoffeeRating
              rating={formData.flavorNotesRating}
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, flavorNotesRating: rating }))}
              label="Flavor Complexity"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid}
              className={cn(
                "flex-1 gap-2",
                "bg-gradient-coffee hover:opacity-90 text-primary-foreground"
              )}
            >
              <Save className="h-4 w-4" />
              Save Recipe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};