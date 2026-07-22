import React, { useState } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Calendar,
  Trash2,
  Copy,
  Check,
  Zap,
  ArrowRight
} from "lucide-react";
import {
  askAIAssistant,
  summarizeText,
  generateAIFlashcards,
  getHomeworkHelp,
  generateStudyPlan,
  AIChatMessage
} from "../utils/aiService";
import { FlashcardDeck } from "../types";

interface AIAssistantViewProps {
  onSaveFlashcardDeck: (deck: Omit<FlashcardDeck, "id" | "createdAt">) => void;
  onIncrementAIQueries: () => void;
  initialQuestion?: string;
}

type AIToolMode = "chat" | "summarizer" | "flashcards" | "homework" | "studyplan";

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onSaveFlashcardDeck,
  onIncrementAIQueries,
  initialQuestion = "",
}) => {
  const [activeMode, setActiveMode] = useState<AIToolMode>("chat");

  // Mode 1: Chat State
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am your AI Study Companion powered by Gemini. Ask me any study question, ask for step-by-step math help, or paste text to summarize!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState(initialQuestion);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Mode 2: Summarizer State
  const [summaryInputText, setSummaryInputText] = useState("");
  const [summaryOutput, setSummaryOutput] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Mode 3: Flashcard State
  const [fcTopic, setFcTopic] = useState("");
  const [fcText, setFcText] = useState("");
  const [fcCount, setFcCount] = useState(5);
  const [generatedFc, setGeneratedFc] = useState<{ front: string; back: string }[]>([]);
  const [isGeneratingFc, setIsGeneratingFc] = useState(false);
  const [isFcSaved, setIsFcSaved] = useState(false);

  // Mode 4: Homework Solver State
  const [hwProblem, setHwProblem] = useState("");
  const [hwSubject, setHwSubject] = useState("Computer Science");
  const [hwSolution, setHwSolution] = useState("");
  const [isSolvingHw, setIsSolvingHw] = useState(false);

  // Mode 5: Study Plan State
  const [planSubjects, setPlanSubjects] = useState("Calculus, Computer Science, Physics");
  const [planDays, setPlanDays] = useState(7);
  const [planHours, setPlanHours] = useState(3);
  const [planOutput, setPlanOutput] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);

  // Copy helper
  const [copied, setCopied] = useState(false);
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Chat Submission
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isChatLoading) return;

    const userText = inputPrompt;
    setInputPrompt("");
    const userMsg: AIChatMessage = {
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);
    onIncrementAIQueries();

    const responseText = await askAIAssistant(userText, {}, chatMessages);

    const aiMsg: AIChatMessage = {
      sender: "ai",
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, aiMsg]);
    setIsChatLoading(false);
  };

  // Summarize Submission
  const handleSummarizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summaryInputText.trim() || isSummarizing) return;
    setIsSummarizing(true);
    onIncrementAIQueries();
    const result = await summarizeText(summaryInputText);
    setSummaryOutput(result);
    setIsSummarizing(false);
  };

  // Flashcards Submission
  const handleFlashcardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcTopic.trim() && !fcText.trim()) return;
    setIsGeneratingFc(true);
    setIsFcSaved(false);
    onIncrementAIQueries();
    const cards = await generateAIFlashcards(fcTopic, fcText, fcCount);
    setGeneratedFc(cards);
    setIsGeneratingFc(false);
  };

  const handleSaveDeckToApp = () => {
    if (generatedFc.length === 0) return;
    onSaveFlashcardDeck({
      title: fcTopic || "AI Study Flashcards",
      subject: fcTopic.split(" ")[0] || "General",
      cards: generatedFc.map((c, i) => ({
        id: `card-ai-${Date.now()}-${i}`,
        front: c.front,
        back: c.back,
        mastered: false,
      })),
    });
    setIsFcSaved(true);
  };

  // Homework Solver Submission
  const handleHomeworkSolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwProblem.trim() || isSolvingHw) return;
    setIsSolvingHw(true);
    onIncrementAIQueries();
    const solution = await getHomeworkHelp(hwProblem, hwSubject);
    setHwSolution(solution);
    setIsSolvingHw(false);
  };

  // Study Plan Submission
  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlanning) return;
    setIsPlanning(true);
    onIncrementAIQueries();
    const subjs = planSubjects.split(",").map((s) => s.trim());
    const plan = await generateStudyPlan(subjs, planDays, planHours);
    setPlanOutput(plan);
    setIsPlanning(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-indigo-600" />
          <span>Gemini AI Study Assistant & Tutor</span>
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Your personal academic AI tutor for answering questions, generating notes, flashcards, and homework solutions.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        {[
          { id: "chat" as AIToolMode, label: "Ask AI Tutor", icon: BookOpen },
          { id: "summarizer" as AIToolMode, label: "Note Summarizer", icon: FileText },
          { id: "flashcards" as AIToolMode, label: "Flashcard Creator", icon: Layers },
          { id: "homework" as AIToolMode, label: "Homework Solver", icon: HelpCircle },
          { id: "studyplan" as AIToolMode, label: "Study Plan", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: Interactive Chat */}
      {activeMode === "chat" && (
        <div className="flex h-[600px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">StudyMate AI Tutor</h2>
                <p className="text-[10px] text-emerald-600 font-semibold">● Powered by Gemini 3.6 Flash</p>
              </div>
            </div>

            <button
              onClick={() =>
                setChatMessages([
                  {
                    sender: "ai",
                    text: "Chat cleared! What study topic shall we explore next?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ])
              }
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed sm:text-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold p-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>StudyMate AI is typing...</span>
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form
            onSubmit={handleSendChat}
            className="flex items-center gap-2 border-t border-slate-100 p-4 dark:border-slate-800"
          >
            <input
              type="text"
              placeholder="Ask any study question (e.g., 'Explain binary search trees', 'Solve x² - 4 = 0')..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isChatLoading}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50 sm:text-sm active:scale-95"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* MODE 2: Note Summarizer */}
      {activeMode === "summarizer" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Lecture Notes & Chapter Summarizer
            </h2>
            <p className="text-xs text-slate-500 mb-4">Paste textbook excerpts or lecture notes to extract core takeaways.</p>

            <form onSubmit={handleSummarizeSubmit} className="space-y-4">
              <textarea
                rows={6}
                placeholder="Paste study material or textbook chapter text here..."
                value={summaryInputText}
                onChange={(e) => setSummaryInputText(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
              />

              <button
                type="submit"
                disabled={!summaryInputText.trim() || isSummarizing}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSummarizing ? "Summarizing with Gemini..." : "Generate Summary"}</span>
              </button>
            </form>
          </div>

          {summaryOutput && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Summary Output</h3>
                <button
                  onClick={() => handleCopyText(summaryOutput)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Copied" : "Copy Notes"}</span>
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl bg-slate-50 p-5 text-xs text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 whitespace-pre-wrap">
                {summaryOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: AI Flashcards Creator */}
      {activeMode === "flashcards" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              AI Flashcard Deck Creator
            </h2>
            <p className="text-xs text-slate-500 mb-4">Enter a study topic or text passage to generate custom flashcard decks.</p>

            <form onSubmit={handleFlashcardSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Topic / Subject Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Photosynthesis & Cellular Respiration"
                    value={fcTopic}
                    onChange={(e) => setFcTopic(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Number of Cards
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={fcCount}
                    onChange={(e) => setFcCount(parseInt(e.target.value) || 5)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Text Material (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste specific textbook notes to base the flashcards on..."
                  value={fcText}
                  onChange={(e) => setFcText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingFc}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGeneratingFc ? "Generating Flashcards..." : "Generate Deck"}</span>
              </button>
            </form>
          </div>

          {generatedFc.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generated Deck ({generatedFc.length} Cards)
                </h3>
                <button
                  onClick={handleSaveDeckToApp}
                  disabled={isFcSaved}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 disabled:bg-emerald-800"
                >
                  <Check className="h-4 w-4" />
                  <span>{isFcSaved ? "Saved to Flashcards!" : "Save Deck to App"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {generatedFc.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2"
                  >
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Card #{i + 1} Question:
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.front}</p>
                    <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-500">Answer:</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{card.back}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: Homework Solver */}
      {activeMode === "homework" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Step-by-Step Homework Solver
            </h2>
            <p className="text-xs text-slate-500 mb-4">Paste tricky problem statements or equations for detailed explanations.</p>

            <form onSubmit={handleHomeworkSolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Homework Problem Statement / Question
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Find the integral of x * e^(2x) dx using integration by parts..."
                  value={hwProblem}
                  onChange={(e) => setHwProblem(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!hwProblem.trim() || isSolvingHw}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSolvingHw ? "Solving Problem..." : "Solve & Explain Step-by-Step"}</span>
              </button>
            </form>
          </div>

          {hwSolution && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">AI Solution Breakdown</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl bg-slate-50 p-5 text-xs text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 whitespace-pre-wrap">
                {hwSolution}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 5: AI Study Schedule Plan */}
      {activeMode === "studyplan" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              AI Timetable & Exam Preparation Planner
            </h2>
            <p className="text-xs text-slate-500 mb-4">Input your upcoming target exams and available hours to build a study schedule.</p>

            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Subjects (Comma Separated)
                </label>
                <input
                  type="text"
                  value={planSubjects}
                  onChange={(e) => setPlanSubjects(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Days Remaining
                  </label>
                  <input
                    type="number"
                    value={planDays}
                    onChange={(e) => setPlanDays(parseInt(e.target.value) || 7)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Hours Per Day
                  </label>
                  <input
                    type="number"
                    value={planHours}
                    onChange={(e) => setPlanHours(parseInt(e.target.value) || 3)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPlanning}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isPlanning ? "Creating Schedule..." : "Generate Study Schedule"}</span>
              </button>
            </form>
          </div>

          {planOutput && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Custom Schedule Plan</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl bg-slate-50 p-5 text-xs text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 whitespace-pre-wrap">
                {planOutput}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
