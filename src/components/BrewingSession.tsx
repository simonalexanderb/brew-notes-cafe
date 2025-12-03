import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw, Check, Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BrewingSessionProps {
  recipe: {
    beanName: string;
    inputGrams: number;
    outputGrams: number;
    grindSize: number;
    brewingTime: number;
  };
  onClose: () => void;
}

export const BrewingSession = ({ recipe, onClose }: BrewingSessionProps) => {
  const [step, setStep] = useState<"prep" | "brew" | "finish">("prep");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
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
  const progressPercentage = recipe.brewingTime > 0 
    ? Math.min((timer / recipe.brewingTime) * 100, 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-14 w-14 rounded-full hover:bg-muted/50 active:scale-95 transition-transform"
        onClick={onClose}
      >
        <X className="h-7 w-7" />
      </Button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{
            width:
              step === "prep" ? "33%" : step === "brew" ? "66%" : "100%",
          }}
        />
      </div>

      <div className="w-full max-w-md space-y-8 text-center">
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
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-6xl font-bold text-primary">
                  {recipe.inputGrams}
                  <span className="text-2xl text-muted-foreground ml-1">g</span>
                </div>
                <p className="text-muted-foreground font-medium">Coffee In</p>
              </div>
              <div className="space-y-2">
                <div className="text-6xl font-bold text-primary">
                  {recipe.grindSize}
                </div>
                <p className="text-muted-foreground font-medium">Grind Size</p>
              </div>
            </div>
          )}

          {step === "brew" && (
            <div className="space-y-6">
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
                      Target: {formatTime(recipe.brewingTime)}
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
                      {recipe.outputGrams}
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
                      {formatTime(recipe.brewingTime)}
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
        </div>
      </div>
    </div>
  );
};
