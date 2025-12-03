import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import imageCompression from "browser-image-compression";
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
  grindSize: number;
  tasteRating: number;
  flavorNotesRating: number;
}

interface RecipeFormProps {
  onSave: (recipe: Omit<Recipe, "id">) => void;
  onCancel: () => void;
  initialRecipe?: Recipe;
}

export const RecipeForm = ({
  onSave,
  onCancel,
  initialRecipe,
}: RecipeFormProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [formData, setFormData] = useState({
    beanName: initialRecipe?.beanName || "",
    packageImage: initialRecipe?.packageImage || "",
    inputGrams: initialRecipe?.inputGrams || 0,
    outputGrams: initialRecipe?.outputGrams || 0,
    brewingTime: initialRecipe?.brewingTime || 0,
    grindSize: initialRecipe?.grindSize || 0,
    tasteRating: initialRecipe?.tasteRating || 0,
    flavorNotesRating: initialRecipe?.flavorNotesRating || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beanName.trim()) return;

    onSave(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Komprimieren
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 800,
        maxSizeMB: 0.2,
        useWebWorker: true,
        initialQuality: 0.7,
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          packageImage: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(compressed);
    }
  };

  const isValid =
    formData.beanName.trim() &&
    formData.inputGrams > 0 &&
    formData.outputGrams > 0;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm border-0 bg-white/60 dark:bg-card/70 backdrop-blur p-2 md:p-8 transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-center">
          {initialRecipe ? "Edit" : "New"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name und Bild wie gehabt */}
          <div className="space-y-2">
            <Label htmlFor="beanName">Name</Label>
            <Input
              id="beanName"
              value={formData.beanName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, beanName: e.target.value }))
              }
              placeholder="z.B., Ethiopian Yirgacheffe"
              className="border-coffee-light focus:ring-coffee-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageImage">Bild</Label>
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
                onClick={() => document.getElementById("image-upload")?.click()}
                className="justify-start gap-2"
              >
                <Camera className="h-4 w-4" />
                {formData.packageImage ? "Change Image" : "Add Image"}
              </Button>
              {formData.packageImage && (
                <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                  <DialogTrigger asChild>
                    <div
                      className="aspect-[4/3] max-w-32 overflow-hidden rounded-md cursor-zoom-in"
                      title="Bild vergrößert anzeigen"
                    >
                      <img
                        src={formData.packageImage}
                        alt="Package preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center bg-transparent shadow-none border-0 p-0">
                    <img
                      src={formData.packageImage}
                      alt="Großansicht"
                      className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg border"
                      style={{ cursor: 'zoom-out' }}
                    />
                    {/* X-Button nur auf Desktop anzeigen */}
                    <button
                      type="button"
                      onClick={() => setShowImageDialog(false)}
                      className="hidden sm:block absolute right-4 top-4 rounded-full bg-black/60 text-white p-2 hover:bg-black/80 focus:outline-none z-10"
                      aria-label="Schließen"
                    >
                      <span style={{ fontSize: 24, lineHeight: 1 }}>×</span>
                    </button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* In/Out nebeneinander */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <TouchNumberInput
                value={formData.inputGrams}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, inputGrams: value }))
                }
                label="In"
                placeholder="18"
                min={0}
                max={50}
                step={0.5}
                unit="g"
              />
            </div>
            <div className="flex-1">
              <TouchNumberInput
                value={formData.outputGrams}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, outputGrams: value }))
                }
                label="Out"
                placeholder="36"
                min={0}
                max={100}
                step={0.5}
                unit="ml"
              />
            </div>
          </div>

          {/* Brühzeit/Mahlgrad nebeneinander */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <TouchNumberInput
                value={formData.brewingTime}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, brewingTime: value }))
                }
                label="Brühzeit"
                placeholder="28"
                min={0}
                max={120}
                step={1}
                unit="sec"
              />
            </div>
            <div className="flex-1">
              <TouchNumberInput
                value={formData.grindSize}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, grindSize: value }))
                }
                label="Mahlgrad"
                placeholder="20"
                min={0}
                max={50}
                step={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CoffeeRating
                rating={formData.tasteRating}
                onRatingChange={(rating) =>
                  setFormData((prev) => ({ ...prev, tasteRating: rating }))
                }
                label="Wertung"
              />
            </div>
            <div className="space-y-6">
              <CoffeeRating
                rating={formData.flavorNotesRating}
                onRatingChange={(rating) =>
                  setFormData((prev) => ({
                    ...prev,
                    flavorNotesRating: rating,
                  }))
                }
                label="Geschmacksnoten"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Abbrechen
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
              Speichern
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};