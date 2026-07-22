import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Sparkles,
  Clock,
  Trash2,
  Edit2,
  X,
  MapPin,
  BookOpen
} from "lucide-react";
import { TimetableSlot, DayOfWeek } from "../types";
import { generateStudyPlan } from "../utils/aiService";

interface TimetableViewProps {
  timetable: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, "id">) => void;
  onDeleteSlot: (id: string) => void;
  onSetTimetable: (slots: TimetableSlot[]) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const COLOR_OPTIONS = [
  { label: "Indigo", value: "bg-indigo-500" },
  { label: "Blue", value: "bg-blue-500" },
  { label: "Amber", value: "bg-amber-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Violet", value: "bg-violet-500" },
  { label: "Rose", value: "bg-rose-500" },
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetable,
  onAddSlot,
  onDeleteSlot,
  onSetTimetable,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiPlanModalOpen, setIsAiPlanModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<TimetableSlot, "id">>({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    subject: "Computer Science",
    topic: "Algorithms",
    location: "Hall B1",
    color: "bg-indigo-500",
  });

  // AI Generator state
  const [aiSubjects, setAiSubjects] = useState("Computer Science, Calculus, Physics");
  const [aiDays, setAiDays] = useState(7);
  const [aiHours, setAiHours] = useState(3);
  const [aiResultPlan, setAiResultPlan] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleOpenAddModal = (day?: DayOfWeek) => {
    setFormData({
      day: day || selectedDay,
      startTime: "09:00",
      endTime: "10:30",
      subject: "Computer Science",
      topic: "",
      location: "",
      color: "bg-indigo-500",
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;
    onAddSlot(formData);
    setIsAddModalOpen(false);
  };

  const handleGenerateAIPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiGenerating(true);
    const subjs = aiSubjects.split(",").map((s) => s.trim());
    const planText = await generateStudyPlan(subjs, aiDays, aiHours);
    setAiResultPlan(planText);
    setIsAiGenerating(false);
  };

  const currentDaySlots = timetable.filter((s) => s.day === selectedDay);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-7 w-7 text-indigo-600" />
            <span>Study Timetable & Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Plan your weekly lecture schedule, study blocks, and revision sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAiPlanModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow transition hover:from-indigo-500 hover:to-blue-500 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AI Study Schedule Generator</span>
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add Class Slot</span>
          </button>
        </div>
      </div>

      {/* Days Tabs Header */}
      <div className="flex overflow-x-auto gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 no-scrollbar">
        {DAYS_OF_WEEK.map((day) => {
          const count = timetable.filter((s) => s.day === day).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex flex-1 min-w-[100px] flex-col items-center justify-center rounded-xl py-2.5 px-3 transition ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-xs font-bold">{day}</span>
              <span
                className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {count} {count === 1 ? "Slot" : "Slots"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Timetable List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedDay}'s Schedule
          </h2>
          <button
            onClick={() => handleOpenAddModal(selectedDay)}
            className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            + Add to {selectedDay}
          </button>
        </div>

        {currentDaySlots.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              No classes or study sessions scheduled for {selectedDay}
            </p>
            <p className="text-xs text-slate-500">
              Click "+ Add to {selectedDay}" to add lecture blocks or revision times.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {currentDaySlots
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-2 rounded-full ${slot.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.location && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {slot.location}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {slot.subject}
                      </h3>
                      {slot.topic && (
                        <p className="text-xs text-slate-500">{slot.topic}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSlot(slot.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Timetable Slot
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Day of Week
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Topic / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms Lecture"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hall B1"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Color Tag
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Smart Schedule Generator Modal */}
      {isAiPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Study Schedule Generator
                </h2>
              </div>
              <button
                onClick={() => setIsAiPlanModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAIPlan} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subjects (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={aiSubjects}
                  onChange={(e) => setAiSubjects(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Days Available
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={aiDays}
                    onChange={(e) => setAiDays(parseInt(e.target.value) || 7)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Daily Goal (Hours/Day)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={aiHours}
                    onChange={(e) => setAiHours(parseInt(e.target.value) || 3)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAiGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isAiGenerating ? "Generating Plan with Gemini..." : "Generate Custom Schedule"}</span>
              </button>
            </form>

            {aiResultPlan && (
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Generated Study Plan:
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl bg-slate-50 p-4 text-xs text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 whitespace-pre-wrap">
                  {aiResultPlan}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
