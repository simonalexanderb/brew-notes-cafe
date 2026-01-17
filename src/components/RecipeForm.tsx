import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import imageCompression from "browser-image-compression";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoffeeRating } from "./CoffeeRating";
import { TouchNumberInput } from "./TouchNumberInput";
import { Camera, Save, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TasteProfileInput } from "./AromaInput";
import { TagSelector } from "./TagSelector";
import { AromaRadar } from "./AromaRadar";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { TimeInput } from "./TimeInput";
import { AnimatePresence, motion } from "framer-motion";

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
  // New fields
  fragrance?: number;
  aroma?: number;
  flavor?: number;
  sweetness?: number;
  acidity?: number;
  body?: number;
  aftertaste?: number;
  balance?: number;
  aroma_tags?: string;
  // New features
  brewMethod?: string;
  filterInputGrams?: number;
  filterWaterGrams?: number;
  filterBrewingTemperature?: number;
  filterBloomingTime?: number;
  filterBrewingTime?: number;
  filterGrindSize?: number;
  filterTasteRating?: number;
  filterFlavorNotesRating?: number;
  filterFragrance?: number;
  filterAroma?: number;
  filterFlavor?: number;
  filterSweetness?: number;
  filterAcidity?: number;
  filterBody?: number;
  filterAftertaste?: number;
  filterBalance?: number;
  filterAromaTags?: string;
}

interface RecipeFormProps {
  onSave: (recipe: Omit<Recipe, "id">) => void;
  onCancel: () => void;
  initialRecipe?: Recipe;
  initialMethod?: "espresso" | "filter";
}

export const RecipeForm = ({
  onSave,
  onCancel,
  initialRecipe,
  initialMethod,
}: RecipeFormProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    beanName: initialRecipe?.beanName || "",
    packageImage: initialRecipe?.packageImage || "",
    inputGrams: initialRecipe?.inputGrams || 0,
    outputGrams: initialRecipe?.outputGrams || 0,
    brewingTime: initialRecipe?.brewingTime || 0,
    grindSize: initialRecipe?.grindSize || 0,
    tasteRating: initialRecipe?.tasteRating || 0,
    flavorNotesRating: initialRecipe?.flavorNotesRating || 0,
    fragrance: initialRecipe?.fragrance || 0,
    aroma: initialRecipe?.aroma || 0,
    flavor: initialRecipe?.flavor || 0,
    sweetness: initialRecipe?.sweetness || 0,
    acidity: initialRecipe?.acidity || 0,
    body: initialRecipe?.body || 0,
    aftertaste: initialRecipe?.aftertaste || 0,
    balance: initialRecipe?.balance || 0,
    aroma_tags: initialRecipe?.aroma_tags || "",
    // New fields
    brewMethod: initialMethod || initialRecipe?.brewMethod || "espresso",
    filterInputGrams: initialRecipe?.filterInputGrams || 0,
    filterWaterGrams: initialRecipe?.filterWaterGrams || 0,
    filterBrewingTemperature: initialRecipe?.filterBrewingTemperature || 0,
    filterBloomingTime: initialRecipe?.filterBloomingTime || 0,
    filterBrewingTime: initialRecipe?.filterBrewingTime || 0,
    filterGrindSize: initialRecipe?.filterGrindSize || 0,
    filterTasteRating: initialRecipe?.filterTasteRating || 0,
    filterFlavorNotesRating: initialRecipe?.filterFlavorNotesRating || 0,
    filterFragrance: initialRecipe?.filterFragrance || 0,
    filterAroma: initialRecipe?.filterAroma || 0,
    filterFlavor: initialRecipe?.filterFlavor || 0,
    filterSweetness: initialRecipe?.filterSweetness || 0,
    filterAcidity: initialRecipe?.filterAcidity || 0,
    filterBody: initialRecipe?.filterBody || 0,
    filterAftertaste: initialRecipe?.filterAftertaste || 0,
    filterBalance: initialRecipe?.filterBalance || 0,
    filterAromaTags: initialRecipe?.filterAromaTags || "",
  });
  
  const isEspresso = formData.brewMethod === "espresso";

  // Helper to get/set flavor data based on method
  const getFlavorData = () => ({
    tasteRating: isEspresso ? formData.tasteRating : formData.filterTasteRating,
    flavorNotesRating: isEspresso ? formData.flavorNotesRating : formData.filterFlavorNotesRating,
    fragrance: isEspresso ? formData.fragrance : formData.filterFragrance,
    aroma: isEspresso ? formData.aroma : formData.filterAroma,
    flavor: isEspresso ? formData.flavor : formData.filterFlavor,
    sweetness: isEspresso ? formData.sweetness : formData.filterSweetness,
    acidity: isEspresso ? formData.acidity : formData.filterAcidity,
    body: isEspresso ? formData.body : formData.filterBody,
    aftertaste: isEspresso ? formData.aftertaste : formData.filterAftertaste,
    balance: isEspresso ? formData.balance : formData.filterBalance,
    aroma_tags: isEspresso ? formData.aroma_tags : formData.filterAromaTags,
  });

  const handleTasteChange = (key: string, value: number) => {
    if (isEspresso) {
      setFormData((prev) => ({ ...prev, [key]: value }));
    } else {
      // Map standard keys to filter keys
      const map: Record<string, string> = {
        tasteRating: "filterTasteRating",
        flavorNotesRating: "filterFlavorNotesRating",
        fragrance: "filterFragrance",
        aroma: "filterAroma",
        flavor: "filterFlavor",
        sweetness: "filterSweetness",
        acidity: "filterAcidity",
        body: "filterBody",
        aftertaste: "filterAftertaste",
        balance: "filterBalance",
      };
      const filterKey = map[key];
      if (filterKey) {
        setFormData((prev) => ({ ...prev, [filterKey]: value }));
      }
    }
  };

  const handleTagsChange = (tags: string[]) => {
    const joined = tags.join(",");
    setSelectedTags(tags);
    if (isEspresso) {
      setFormData((prev) => ({ ...prev, aroma_tags: joined }));
    } else {
      setFormData((prev) => ({ ...prev, filterAromaTags: joined }));
    }
  };

  // Sync selected tags when brew method changes
  useEffect(() => {
    const currentTagsString = isEspresso ? formData.aroma_tags : formData.filterAromaTags;
    setSelectedTags(currentTagsString ? currentTagsString.split(",").filter(Boolean) : []);
  }, [formData.brewMethod]);


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
    (isEspresso 
      ? formData.inputGrams > 0 && formData.outputGrams > 0
      : formData.filterInputGrams > 0 && formData.filterWaterGrams > 0);

  const flavorData = getFlavorData();

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm border-0 bg-white/60 dark:bg-card/70 backdrop-blur p-2 md:p-8 transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-center">
          {initialRecipe ? "Edit" : "New"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brew Method Toggle */}
          <div className="flex justify-center pb-2">
            <div className="flex p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, brewMethod: "espresso" }))}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  formData.brewMethod === "espresso" 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Espresso
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, brewMethod: "filter" }))}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  formData.brewMethod === "filter" 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Filter
              </button>
            </div>
          </div>

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

          {isEspresso ? (
            /* ESPRESSO FIELDS */
            <>
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
            </>
          ) : (
            /* FILTER FIELDS */
            <>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <TouchNumberInput
                    value={formData.filterInputGrams}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, filterInputGrams: value }))
                    }
                    label="Input (Grams)"
                    placeholder="20"
                    min={0}
                    max={100}
                    step={0.5}
                    unit="g"
                  />
                </div>
                <div className="flex-1">
                  <TouchNumberInput
                    value={formData.filterWaterGrams}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, filterWaterGrams: value }))
                    }
                    label="Water (Grams)"
                    placeholder="300"
                    min={0}
                    max={1000}
                    step={5}
                    unit="g"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <TouchNumberInput
                    value={formData.filterBrewingTemperature}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, filterBrewingTemperature: value }))
                    }
                    label="Temperature"
                    placeholder="94"
                    min={0}
                    max={100}
                    step={1}
                    unit="°C"
                  />
                </div>
                <div className="flex-1">
                  <TimeInput
                    value={formData.filterBloomingTime}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, filterBloomingTime: value }))
                    }
                    label="Blooming"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1">
                  <TimeInput
                    value={formData.filterBrewingTime}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, filterBrewingTime: value }))
                    }
                    label="Total Time"
                  />
                </div>
                <div className="flex-1">
                  <TouchNumberInput
                    value={formData.filterGrindSize}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, filterGrindSize: value }))
                    }
                    label="Grind Size"
                    placeholder="18"
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </>
          )}

          {/* Aroma & Geschmacksprofil */}
          <div className="border-t pt-6">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📊</span> Aroma & Geschmacksprofil ({isEspresso ? "Espresso" : "Filter"})
              </h3>
              {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-8 overflow-hidden"
              >
                {/* Radar Preview */}
                <div className="flex justify-center py-4 bg-muted/20 rounded-xl">
                  <AromaRadar 
                    data={{
                      fragrance: flavorData.fragrance,
                      aroma: flavorData.aroma,
                      flavor: flavorData.flavor,
                      sweetness: flavorData.sweetness,
                      acidity: flavorData.acidity,
                      body: flavorData.body,
                      aftertaste: flavorData.aftertaste,
                      balance: flavorData.balance,
                    }} 
                    size={280} 
                  />
                </div>

                {/* Analysis Dashboard Preview */}
                <AnalysisDashboard 
                  recipe={{
                    ...formData,
                    // Use standard fields for ID/Name
                    id: initialRecipe?.id ? Number(initialRecipe.id) : undefined,
                    bean_name: formData.beanName,
                    // Map active fields
                    input_grams: isEspresso ? formData.inputGrams : formData.filterInputGrams,
                    output_grams: formData.outputGrams, // unused in filter
                    brewing_time: isEspresso ? formData.brewingTime : formData.filterBrewingTime,
                    grind_size: isEspresso ? formData.grindSize : formData.filterGrindSize,
                    // Map flavor - Explicitly map ALL flavor fields used by dashboard
                    taste_rating: flavorData.tasteRating,
                    flavor_complexity: flavorData.flavorNotesRating,
                    fragrance: flavorData.fragrance,
                    aroma: flavorData.aroma,
                    flavor: flavorData.flavor,
                    sweetness: flavorData.sweetness,
                    acidity: flavorData.acidity,
                    body: flavorData.body,
                    aftertaste: flavorData.aftertaste,
                    balance: flavorData.balance,
                  }} 
                />

                {/* Eingabe-Regler */}
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground uppercase tracking-wider text-sm">Detaillierte Bewertung</h4>
                  <TasteProfileInput 
                    data={{
                      fragrance: flavorData.fragrance,
                      aroma: flavorData.aroma,
                      flavor: flavorData.flavor,
                      sweetness: flavorData.sweetness,
                      acidity: flavorData.acidity,
                      body: flavorData.body,
                      aftertaste: flavorData.aftertaste,
                      balance: flavorData.balance,
                    }} 
                    onChange={handleTasteChange} 
                  />
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground uppercase tracking-wider text-sm">Aroma-Tags</h4>
                  <TagSelector selectedTags={selectedTags} onChange={handleTagsChange} />
                </div>
              </motion.div>
            )}
            </AnimatePresence>
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