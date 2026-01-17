import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw, Check, Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BrewingSessionProps {
  recipe: {
    id?: number; // Optional because it might not be passed in some contexts, but needed for update
    beanName: string;
    inputGrams: number;
    outputGrams: number;
    grindSize: number;
    brewingTime: number;
    // Taste profile fields (optional)
    fragrance?: number;
    aroma?: number;
    flavor?: number;
    sweetness?: number;
    acidity?: number;
    body?: number;
    aftertaste?: number;
    balance?: number;
    aroma_tags?: string;
    // Filter fields
    filterInputGrams?: number;
    filterWaterGrams?: number;
    filterBrewingTemperature?: number;
    filterBloomingTime?: number;
    filterBrewingTime?: number;
    filterGrindSize?: number;
    filterFragrance?: number;
    filterAroma?: number;
    filterFlavor?: number;
    filterSweetness?: number;
    filterAcidity?: number;
    filterBody?: number;
    filterAftertaste?: number;
    filterBalance?: number;
    filterAromaTags?: string;
    brewMethod?: string;
  };

  onClose: () => void;
  onUpdateRecipe?: (id: number, data: any) => Promise<void>; 
  forcedMethod?: "espresso" | "filter";
}

import { TasteProfileInput } from "./AromaInput";
import { TagSelector } from "./TagSelector";
import { AromaRadar } from "./AromaRadar";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { updateRecipe } from "@/lib/api";

export const BrewingSession = ({ recipe, onClose, onUpdateRecipe, forcedMethod }: BrewingSessionProps) => {
  const effectiveMethod = forcedMethod || recipe.brewMethod || "espresso";
  const isFilter = effectiveMethod === "filter";

  // Map active fields based on method
  const activeData = {
    inputGrams: isFilter ? recipe.filterInputGrams : recipe.inputGrams,
    // For Filter, we use Water Grams as the target "output" usually, or explicit output if tracked?
    // Using filterWaterGrams as the distinct target value for filter
    outputGrams: isFilter ? recipe.filterWaterGrams : recipe.outputGrams, 
    grindSize: isFilter ? recipe.filterGrindSize : recipe.grindSize,
    brewingTime: isFilter ? recipe.filterBrewingTime : recipe.brewingTime,
    
    // Taste
    fragrance: isFilter ? recipe.filterFragrance : recipe.fragrance,
    aroma: isFilter ? recipe.filterAroma : recipe.aroma,
    flavor: isFilter ? recipe.filterFlavor : recipe.flavor,
    sweetness: isFilter ? recipe.filterSweetness : recipe.sweetness,
    acidity: isFilter ? recipe.filterAcidity : recipe.acidity,
    body: isFilter ? recipe.filterBody : recipe.body,
    aftertaste: isFilter ? recipe.filterAftertaste : recipe.aftertaste,
    balance: isFilter ? recipe.filterBalance : recipe.balance,
    aroma_tags: isFilter ? recipe.filterAromaTags : recipe.aroma_tags,
  };

  const [step, setStep] = useState<"prep" | "brew" | "finish" | "rate">("prep");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
  // Taste Profile State
  const [tasteProfile, setTasteProfile] = useState({
    fragrance: activeData.fragrance || 0,
    aroma: activeData.aroma || 0,
    flavor: activeData.flavor || 0,
    sweetness: activeData.sweetness || 0,
    acidity: activeData.acidity || 0,
    body: activeData.body || 0,
    aftertaste: activeData.aftertaste || 0,
    balance: activeData.balance || 0,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(
    activeData.aroma_tags ? activeData.aroma_tags.split(",").filter(Boolean) : []
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleTasteChange = (key: string, value: number) => {
    setTasteProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveRating = async () => {
    if (!recipe.id) {
      console.error("Cannot save: Recipe ID is missing");
      return;
    }
    setIsSaving(true);
    try {
      // Construct update data, mapping back to correct fields
      const updatedData: any = { ...recipe };
      
      if (isFilter) {
         updatedData.filterFragrance = tasteProfile.fragrance;
         updatedData.filterAroma = tasteProfile.aroma;
         updatedData.filterFlavor = tasteProfile.flavor;
         updatedData.filterSweetness = tasteProfile.sweetness;
         updatedData.filterAcidity = tasteProfile.acidity;
         updatedData.filterBody = tasteProfile.body;
         updatedData.filterAftertaste = tasteProfile.aftertaste;
         updatedData.filterBalance = tasteProfile.balance;
         updatedData.filterAromaTags = selectedTags.join(",");
      } else {
         Object.assign(updatedData, tasteProfile);
         updatedData.aroma_tags = selectedTags.join(",");
      }

      
      // Call API directly or via prop
      if (onUpdateRecipe) {
        await onUpdateRecipe(recipe.id, updatedData);
      } else {
        await updateRecipe(recipe.id, updatedData as any);
      }
      
      onClose();
    } catch (error) {
      console.error("Failed to save rating:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Wake Lock: Keep screen on during brewing
  useEffect(() => {
    const requestWakeLock = async () => {
      if ("wakeLock" in navigator && step === "brew") {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
          console.log("Wake Lock activated");
        } catch (err) {
          console.error("Wake Lock error:", err);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          console.log("Wake Lock released");
        } catch (err) {
          console.error("Wake Lock release error:", err);
        }
      }
    };

    if (step === "brew") {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [step]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Haptic feedback helper
  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleFinish = () => {
    setIsRunning(false);
    setStep("finish");
    vibrate(200); // Haptic feedback on finish
  };

  const handleStartBrewing = () => {
    setStep("brew");
    vibrate(100); // Haptic feedback on start
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
    vibrate(50); // Haptic feedback on play/pause
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimer(0);
    vibrate([50, 50, 50]); // Haptic feedback on reset
  };

  // Calculate progress percentage for circular indicator
  const progressPercentage = (activeData.brewingTime || 0) > 0 
    ? Math.min((timer / (activeData.brewingTime || 1)) * 100, 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      {/* Close Button - Fixed */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 h-14 w-14 rounded-full hover:bg-muted/50 active:scale-95 transition-transform z-50"
        onClick={onClose}
      >
        <X className="h-7 w-7" />
      </Button>

      {/* Progress Bar - Fixed */}
      <div className="fixed top-0 left-0 w-full h-2 bg-muted z-40">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{
            width:
              step === "prep" ? "33%" : step === "brew" ? "66%" : "100%",
          }}
        />
      </div>

      <div className="min-h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="w-full max-w-md space-y-8 text-center my-auto pt-12 pb-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-muted-foreground">
            {recipe.beanName}
          </h2>
          <h1 className="text-4xl font-bold tracking-tight">
            {step === "prep"
              ? "Preparation"
              : step === "brew"
              ? "Brewing"
              : "Enjoy!"}
          </h1>
        </div>

        {/* Content */}
        <div className="py-8">
          {step === "prep" && (
            <div className={cn("grid gap-6", isFilter ? "grid-cols-2" : "grid-cols-2")}>
              {/* Coffee In */}
              <div className="space-y-1">
                <div className="text-4xl xs:text-5xl font-bold text-primary">
                  {activeData.inputGrams}
                  <span className="text-xl text-muted-foreground ml-1">g</span>
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Coffee</div>
              </div>

              {/* Grind Size */}
              <div className="space-y-1">
                <div className="text-4xl xs:text-5xl font-bold text-primary">
                  {activeData.grindSize}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Grind</div>
              </div>

              {isFilter && (
                <>
                  {/* Filter Water (Total) */}
                  <div className="space-y-1">
                    <div className="text-4xl xs:text-5xl font-bold text-primary">
                      {activeData.outputGrams}
                      <span className="text-xl text-muted-foreground ml-1">g</span>
                    </div>
                    <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Water</div>
                  </div>

                  {/* Temperature */}
                   <div className="space-y-1">
                    <div className="text-4xl xs:text-5xl font-bold text-primary">
                      {recipe.filterBrewingTemperature || 94}
                      <span className="text-xl text-muted-foreground ml-1">°C</span>
                    </div>
                    <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Temp</div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "brew" && (
            <div className="space-y-6">
              {isFilter ? (
                /* Filter Brewing View - Split Layout */
                <div className="flex flex-col h-full gap-4">
                  {/* Upper Half: Blooming */}
                  <div className="flex-1 bg-muted/20 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 border border-border/50 relative overflow-hidden">
                     {/* Active Indicator for Blooming */}
                     {timer <= (recipe.filterBloomingTime || 30) && isRunning && (
                        <div className="absolute top-0 right-0 p-2">
                           <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                        </div>
                     )}
                     
                     <h3 className="text-lg font-medium uppercase tracking-wider text-muted-foreground">Blooming Phase</h3>
                     <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="space-y-1">
                           <div className="text-4xl font-bold text-foreground">
                             {formatTime(recipe.filterBloomingTime || 30)}
                           </div>
                           <div className="text-xs uppercase tracking-wider text-muted-foreground">Time</div>
                        </div>
                        <div className="space-y-1">
                           <div className="text-4xl font-bold text-foreground">
                             {(activeData.inputGrams || 0) * 2}
                             <span className="text-lg text-muted-foreground ml-1">g</span>
                           </div>
                           <div className="text-xs uppercase tracking-wider text-muted-foreground">Water</div>
                        </div>
                     </div>
                  </div>

                  {/* Lower Half: Total Brewing */}
                  <div className="flex-1 bg-muted/20 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 border border-border/50 relative">
                     <h3 className="text-lg font-medium uppercase tracking-wider text-muted-foreground">Total Brew</h3>
                     
                     <div className="flex flex-col items-center gap-2">
                        {/* Always show Target Time */}
                         <div className="text-7xl font-bold text-primary tabular-nums">
                            {formatTime(activeData.brewingTime || 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target Time
                          </div>

                        {/* Conditionally show Running Timer */}
                        {showTimer && (
                           <div className="flex flex-col items-center mt-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                              <div className="text-5xl font-bold text-foreground tabular-nums">
                                {formatTime(timer)}
                              </div>
                              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                                Current Time
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Toggle Button */}
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTimer(!showTimer)}
                        className="absolute bottom-4 right-4 text-xs text-muted-foreground hover:text-primary gap-1"
                      >
                        {showTimer ? <Check className="h-3 w-3" /> : <TimerIcon className="h-3 w-3" />}
                        {showTimer ? "Hide Timer" : "Show Timer"}
                      </Button>
                  </div>

                  {/* Controls - Only visible when Show Timer is active */}
                   {showTimer && (
                     <div className="flex justify-center gap-6 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-16 w-16 rounded-full active:scale-95 transition-transform"
                          onClick={handleToggleTimer}
                        >
                          {isRunning ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-16 w-16 rounded-full active:scale-95 transition-transform"
                          onClick={handleResetTimer}
                        >
                          <RotateCcw className="h-7 w-7" />
                        </Button>
                    </div>
                   )}
                </div>
              ) : (
                /* Standard Espresso View (Existing) */
                <>
                  {/* Circular Progress Indicator */}
                  {showTimer && (
                    <div className="relative w-64 h-64 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="128"
                          cy="128"
                          r="120"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted/30"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="128"
                          cy="128"
                          r="120"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 120}`}
                          strokeDashoffset={`${2 * Math.PI * 120 * (1 - progressPercentage / 100)}`}
                          className="text-primary transition-all duration-1000 ease-linear"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Timer display in center */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl md:text-7xl font-bold text-primary tabular-nums">
                          {formatTime(timer)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Target: {formatTime(activeData.brewingTime || 0)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Target weight and time display */}
                  {!showTimer && (
                    <div className="space-y-6">
                      {/* Target Output Weight */}
                      <div className="space-y-2">
                        <div className="text-8xl md:text-9xl font-bold text-primary tabular-nums">
                          {activeData.outputGrams}
                          <span className="text-4xl text-muted-foreground ml-2">g</span>
                        </div>
                        <p className="text-lg text-muted-foreground font-medium">
                          Target Output
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      {/* Target Time (for users without scale) */}
                      <div className="space-y-2">
                        <div className="text-6xl md:text-7xl font-bold text-primary tabular-nums">
                          {formatTime(activeData.brewingTime || 0)}
                        </div>
                        <p className="text-base text-muted-foreground font-medium">
                          Target Time
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timer controls */}
                  {showTimer && (
                    <div className="flex justify-center gap-6">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-full active:scale-95 transition-transform"
                        onClick={handleToggleTimer}
                      >
                        {isRunning ? (
                          <Pause className="h-7 w-7" />
                        ) : (
                          <Play className="h-7 w-7 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-full active:scale-95 transition-transform"
                        onClick={handleResetTimer}
                      >
                        <RotateCcw className="h-7 w-7" />
                      </Button>
                    </div>
                  )}

                  {/* Toggle view button */}
                  <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground hover:text-primary h-12 text-base"
                    onClick={() => setShowTimer(!showTimer)}
                  >
                    <TimerIcon className="h-5 w-5" />
                    {showTimer ? "Show Target Weight" : "Show Timer"}
                  </Button>
                </>
              )}
            </div>
          )}

          {step === "finish" && (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="h-12 w-12 text-primary" />
              </div>
              <p className="text-xl text-muted-foreground">
                Brew completed successfully.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setStep("rate")}
                className="w-full max-w-xs"
              >
                Rate this Brew (Optional)
              </Button>
            </div>
          )}

          {step === "rate" && (
            <div className="space-y-8 text-left max-w-lg mx-auto overflow-y-auto max-h-[calc(100vh-200px)] pb-32">
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-medium">Rate Aroma & Taste</h3>
                <p className="text-sm text-muted-foreground">Adjust the sliders to match your experience</p>
              </div>

              {/* Radar Preview */}
              <div className="flex justify-center py-4">
                <AromaRadar data={tasteProfile} size={280} />
              </div>

              {/* Input Sliders */}
              <TasteProfileInput data={tasteProfile} onChange={handleTasteChange} />

              {/* Tags */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Aroma Tags</h3>
                <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center pt-4">
          {step === "prep" && (
            <Button
              size="lg"
              className="w-full max-w-xs text-xl h-16 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
              onClick={handleStartBrewing}
            >
              Start Brewing
            </Button>
          )}

          {step === "brew" && (
            <Button
              size="lg"
              variant={isRunning ? "secondary" : "default"}
              className="w-full max-w-xs text-xl h-16 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
              onClick={handleFinish}
            >
              Finish Brew
            </Button>
          )}

          {step === "finish" && (
            <Button
              size="lg"
              className="w-full max-w-xs text-xl h-16 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
              onClick={onClose}
            >
              Close
            </Button>
          )}

          {step === "rate" && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={onClose}
                className="flex-1 max-w-[150px]"
              >
                Skip
              </Button>
              <Button
                size="lg"
                onClick={handleSaveRating}
                disabled={isSaving}
                className="flex-1 max-w-[150px] shadow-lg"
              >
                {isSaving ? "Saving..." : "Save Rating"}
              </Button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
