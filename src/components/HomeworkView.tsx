import React, { useState } from "react";
import {
  FileText,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  Award,
  AlertCircle,
  X,
  BookOpen
} from "lucide-react";
import { HomeworkItem, HomeworkStatus, Priority } from "../types";
import { getHomeworkHelp } from "../utils/aiService";

interface HomeworkViewProps {
  homework: HomeworkItem[];
  onAddHomework: (hw: Omit<HomeworkItem, "id" | "createdAt">) => void;
  onUpdateHomework: (id: string, hw: Partial<HomeworkItem>) => void;
  onDeleteHomework: (id: string) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  homework,
  onAddHomework,
  onUpdateHomework,
  onDeleteHomework,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHw, setEditingHw] = useState<HomeworkItem | null>(null);

  // AI Homework Modal State
  const [aiModalHw, setAiModalHw] = useState<HomeworkItem | null>(null);
  const [aiSolution, setAiSolution] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    subject: string;
    teacher: string;
    dueDate: string;
    status: HomeworkStatus;
    priority: Priority;
    score: string;
    description: string;
  }>({
    title: "",
    subject: "Computer Science",
    teacher: "",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    status: "not_started",
    priority: "medium",
    score: "",
    description: "",
  });

  const handleOpenAdd = () => {
    setEditingHw(null);
    setFormData({
      title: "",
      subject: "Computer Science",
      teacher: "",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      status: "not_started",
      priority: "medium",
      score: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hw: HomeworkItem) => {
    setEditingHw(hw);
    setFormData({
      title: hw.title,
      subject: hw.subject,
      teacher: hw.teacher || "",
      dueDate: hw.dueDate,
      status: hw.status,
      priority: hw.priority,
      score: hw.score || "",
      description: hw.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingHw) {
      onUpdateHomework(editingHw.id, formData);
    } else {
      onAddHomework(formData);
    }
    setIsModalOpen(false);
  };

  const handleGetAIHelp = async (hw: HomeworkItem) => {
    setAiModalHw(hw);
    setIsAiLoading(true);
    setAiSolution("");
    const solution = await getHomeworkHelp(
      `${hw.title}\nDetails: ${hw.description || ""}`,
      hw.subject
    );
    setAiSolution(solution);
    setIsAiLoading(false);

    // Save generated solution to homework card
    onUpdateHomework(hw.id, { aiHelpGenerated: solution });
  };

  // Status Badge Colors
  const getStatusBadge = (status: HomeworkStatus) => {
    switch (status) {
      case "completed":
      case "submitted":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-600" />
            <span>Homework & Assignments Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Keep track of all class assignments, submission dates, and grades.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95 sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Assignments Grid */}
      {homework.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            No homework assignments logged
          </p>
          <p className="text-xs text-slate-500">
            Click "Add Assignment" to add your coursework and homework due dates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {homework.map((hw) => (
            <div
              key={hw.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {hw.subject}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(hw.status)}`}>
                    {hw.status.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {hw.title}
                  </h3>
                  {hw.teacher && (
                    <p className="text-xs text-slate-500">Teacher: {hw.teacher}</p>
                  )}
                </div>

                {hw.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {hw.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Due: {hw.dueDate}</span>
                </div>

                {hw.score && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Award className="h-4 w-4" />
                    <span>Grade: {hw.score}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleGetAIHelp(hw)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:from-indigo-950/60 dark:to-blue-950/60 dark:text-indigo-300"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Get AI Help</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(hw)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteHomework(hw.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingHw ? "Edit Assignment" : "Add Assignment"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures Lab 3"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics 101"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Teacher / Instructor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Henderson"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as HomeworkStatus })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Grade / Score
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 95/100 or A"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Assignment Problem Statement / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste problem details here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 active:scale-95"
                >
                  {editingHw ? "Update Assignment" : "Add Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Solution Modal */}
      {aiModalHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Homework Helper: {aiModalHw.title}
                </h2>
              </div>
              <button
                onClick={() => setAiModalHw(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-10 w-10 text-indigo-600 animate-spin" />
                  <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Gemini AI is analyzing the homework problem...
                  </p>
                  <p className="text-xs text-slate-500">Generating step-by-step concepts, formulas, and solution.</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl bg-slate-50 p-5 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 whitespace-pre-wrap">
                  {aiSolution}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setAiModalHw(null)}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
