import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  CheckCircle2
} from "lucide-react";

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMinutes: (minutes: number, subject: string) => void;
}

type Mode = "focus" | "shortBreak" | "longBreak";

const MODE_MINUTES: Record<Mode, number> = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  onLogMinutes,
}) => {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODE_MINUTES.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [subject, setSubject] = useState("Computer Science");

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (soundEnabled) {
        playBeepSound();
      }
      if (mode === "focus") {
        onLogMinutes(MODE_MINUTES.focus, subject);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, soundEnabled, subject, onLogMinutes]);

  const playBeepSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setSecondsLeft(MODE_MINUTES[newMode] * 60);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(MODE_MINUTES[mode] * 60);
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Focus Pomodoro Timer</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
          {[
            { id: "focus" as Mode, label: "Focus (25m)" },
            { id: "shortBreak" as Mode, label: "Break (5m)" },
            { id: "longBreak" as Mode, label: "Long (15m)" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`rounded-xl py-1.5 text-xs font-bold transition ${
                mode === m.id
                  ? "bg-white text-indigo-700 shadow dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="my-6">
          <span className="text-6xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
            {formatTime(secondsLeft)}
          </span>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {mode === "focus" ? "🎯 Stay Focused" : "☕ Take a Break"}
          </p>
        </div>

        {/* Subject Tag */}
        {mode === "focus" && (
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Subject for this Focus Session:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-center text-xs font-bold text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md transition active:scale-95 ${
              isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>

          <button
            onClick={handleReset}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Log Button */}
        {mode === "focus" && (
          <button
            onClick={() => {
              onLogMinutes(MODE_MINUTES.focus, subject);
              onClose();
            }}
            className="w-full rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            + Log {MODE_MINUTES.focus} Minutes Now
          </button>
        )}
      </div>
    </div>
  );
};
