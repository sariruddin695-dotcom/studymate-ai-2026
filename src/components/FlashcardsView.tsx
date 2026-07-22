import React, { useState } from "react";
import {
  Layers,
  Plus,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Trash2,
  Sparkles,
  BookOpen
} from "lucide-react";
import { FlashcardDeck, Flashcard } from "../types";

interface FlashcardsViewProps {
  decks: FlashcardDeck[];
  onAddDeck: (deck: Omit<FlashcardDeck, "id" | "createdAt">) => void;
  onDeleteDeck: (id: string) => void;
  onToggleMasteredCard: (deckId: string, cardId: string) => void;
  onNavigateToAI: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  decks,
  onAddDeck,
  onDeleteDeck,
  onToggleMasteredCard,
  onNavigateToAI,
}) => {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(
    decks[0]?.id || null
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Manual Deck Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckSubject, setDeckSubject] = useState("Computer Science");
  const [cardInputs, setCardInputs] = useState<{ front: string; back: string }[]>([
    { front: "", back: "" },
    { front: "", back: "" },
  ]);

  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];

  const handleNextCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
  };

  const handlePrevCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) =>
      prev === 0 ? activeDeck.cards.length - 1 : prev - 1
    );
  };

  const handleAddCardRow = () => {
    setCardInputs([...cardInputs, { front: "", back: "" }]);
  };

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;

    const validCards = cardInputs.filter(
      (c) => c.front.trim().length > 0 && c.back.trim().length > 0
    );

    if (validCards.length === 0) return;

    onAddDeck({
      title: deckTitle,
      subject: deckSubject,
      cards: validCards.map((c, idx) => ({
        id: `card-${Date.now()}-${idx}`,
        front: c.front,
        back: c.back,
        mastered: false,
      })),
    });

    setIsAddModalOpen(false);
    setDeckTitle("");
    setCardInputs([
      { front: "", back: "" },
      { front: "", back: "" },
    ]);
  };

  const currentCard: Flashcard | undefined = activeDeck?.cards[currentCardIndex];

  const masteredCount = activeDeck?.cards.filter((c) => c.mastered).length || 0;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-7 w-7 text-indigo-600" />
            <span>Interactive Flashcards</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Practice active recall with flip flashcards or generate custom decks with Gemini AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNavigateToAI}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:from-indigo-500 hover:to-blue-500 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AI Flashcard Generator</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
          >
            <Plus className="h-4 w-4" />
            <span>New Manual Deck</span>
          </button>
        </div>
      </div>

      {/* Decks Selection Tabs */}
      {decks.length > 0 && (
        <div className="flex overflow-x-auto gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 no-scrollbar">
          {decks.map((deck) => {
            const isSelected = activeDeckId === deck.id;
            return (
              <button
                key={deck.id}
                onClick={() => {
                  setActiveDeckId(deck.id);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`flex flex-1 min-w-[140px] items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div className="text-left max-w-[110px] truncate">
                  <p>{deck.title}</p>
                  <p className={`text-[10px] font-normal ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                    {deck.cards.length} cards
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Flashcard Practice Stage */}
      {!activeDeck || activeDeck.cards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Layers className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            No flashcard decks available
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Click "AI Flashcard Generator" to create instant decks with Gemini, or add one manually!
          </p>
          <button
            onClick={onNavigateToAI}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Deck with AI</span>
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Active Deck Info & Progress Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {activeDeck.title}
              </h2>
              <p className="text-xs text-slate-500">
                Card {currentCardIndex + 1} of {activeDeck.cards.length} • Subject: {activeDeck.subject}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {masteredCount} / {activeDeck.cards.length} Mastered
              </span>
              <button
                onClick={() => onDeleteDeck(activeDeck.id)}
                title="Delete Deck"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Flip Card Component */}
          {currentCard && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="group relative h-80 w-full cursor-pointer rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">
                  {isFlipped ? "Answer (Back)" : "Question (Front)"}
                </span>
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <RotateCw className="h-3.5 w-3.5" />
                  Click card to flip
                </span>
              </div>

              {/* Card Main Text */}
              <div className="my-auto flex items-center justify-center px-4">
                <p
                  className={`text-lg font-bold sm:text-xl transition-all duration-300 ${
                    isFlipped
                      ? "text-indigo-700 dark:text-indigo-300"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              {/* Mastered Indicator Footer */}
              <div className="flex items-center justify-between border-t border-slate-100/80 pt-3 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMasteredCard(activeDeck.id, currentCard.id);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    currentCard.mastered
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{currentCard.mastered ? "Mastered Concept" : "Mark as Mastered"}</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  {currentCardIndex + 1} / {activeDeck.cards.length}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevCard}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <RotateCw className="h-4 w-4" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNextCard}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Deck Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Deck</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeckSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Deck Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. World History Dates"
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={deckSubject}
                    onChange={(e) => setDeckSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              {/* Cards Inputs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Flashcards
                </label>
                {cardInputs.map((card, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800 space-y-2">
                    <input
                      type="text"
                      placeholder={`Card #${idx + 1} Question (Front)`}
                      value={card.front}
                      onChange={(e) => {
                        const next = [...cardInputs];
                        next[idx].front = e.target.value;
                        setCardInputs(next);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder={`Card #${idx + 1} Answer (Back)`}
                      value={card.back}
                      onChange={(e) => {
                        const next = [...cardInputs];
                        next[idx].back = e.target.value;
                        setCardInputs(next);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddCardRow}
                  className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  + Add Another Card
                </button>
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
                  Save Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
