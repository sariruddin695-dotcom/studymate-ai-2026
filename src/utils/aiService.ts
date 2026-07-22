// Client utility to interface with StudyMate AI Gemini endpoints
export interface AIChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export async function askAIAssistant(
  prompt: string,
  context?: Record<string, any>,
  history: AIChatMessage[] = []
): Promise<string> {
  try {
    const res = await fetch("/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context, history }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to communicate with AI server");
    }

    const data = await res.json();
    return data.response;
  } catch (error: any) {
    console.warn("Server AI route failed, applying offline smart fallback response:", error);
    return getOfflineFallbackAnswer(prompt);
  }
}

export async function summarizeText(text: string, format: string = "bullet-points"): Promise<string> {
  try {
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, format }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to summarize text");
    }

    const data = await res.json();
    return data.summary;
  } catch (error: any) {
    console.warn("Server AI summarize route failed, generating client fallback summary:", error);
    return generateOfflineSummary(text);
  }
}

export async function generateAIFlashcards(
  topic: string,
  text?: string,
  count: number = 5
): Promise<{ front: string; back: string }[]> {
  try {
    const res = await fetch("/api/ai/generate-flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, text, count }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate flashcards");
    }

    const data = await res.json();
    return data.flashcards || [];
  } catch (error: any) {
    console.warn("Server AI flashcards route failed, generating offline flashcards:", error);
    return generateOfflineFlashcards(topic, count);
  }
}

export async function getHomeworkHelp(problem: string, subject?: string): Promise<string> {
  try {
    const res = await fetch("/api/ai/homework-help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, subject }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate homework solution");
    }

    const data = await res.json();
    return data.solution;
  } catch (error: any) {
    console.warn("Server AI homework help route failed:", error);
    return `### 🎯 Problem Statement\n${problem}\n\n### 💡 Concept & Key Idea\nTo solve this problem, identify given values, apply standard principles, and verify constraints.\n\n### 📝 Step-by-Step Solution\n1. Analyze input terms.\n2. Apply main theorem or algorithm.\n3. Simplify final equation.\n\n*(Note: Configure GEMINI_API_KEY in server environment for dynamic step-by-step AI solutions.)*`;
  }
}

export async function generateStudyPlan(subjects: string[], days: number, hours: number): Promise<string> {
  try {
    const res = await fetch("/api/ai/generate-study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects, daysUntilExam: days, hoursPerDay: hours }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate study plan");
    }

    const data = await res.json();
    return data.plan;
  } catch (error: any) {
    console.warn("Server AI study plan route failed:", error);
    return generateOfflineStudyPlan(subjects, days, hours);
  }
}

// Client Fallback generators when API endpoint is unavailable
function getOfflineFallbackAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("math") || p.includes("calculus") || p.includes("derivative") || p.includes("integral")) {
    return `### 🧮 Math & Calculus Tutor Explanation\n\nWhen tackling calculus or algebraic problems:\n\n1. **Identify the Core Operation**: Check if you need derivatives ($f'(x)$) or integrals ($\int f(x)dx$).\n2. **Common Rules**:
- Power Rule: $\\frac{d}{dx}[x^n] = n x^{n-1}$
- Product Rule: $(uv)' = u'v + uv'$
- Integration by Parts: $\\int u dv = uv - \\int v du$\n\n3. **Practice Tip**: Break complex equations into nested sub-expressions.`;
  }
  if (p.includes("code") || p.includes("python") || p.includes("java") || p.includes("algorithm")) {
    return `### 💻 Computer Science & Code Explanation\n\nKey steps for solving coding and algorithmic questions:\n\n- **Analyze Space & Time Complexity**: Aim for $O(n \\log n)$ or $O(n)$ where possible.\n- **Data Structure Choice**: Stacks for LIFO operations, Queues for FIFO, Hash Tables for $O(1)$ lookup.\n- **Dry Run Test Cases**: Test boundary conditions (empty lists, 0 values, single element).`;
  }
  return `### 🎓 StudyMate AI Explanation\n\nHere is a structured overview regarding: **"${prompt}"**\n\n- **Core Concept**: Focus on understanding foundational definitions before jumping into advanced applications.\n- **Key Takeaways**:
  1. Break material into 25-minute Pomodoro focus blocks.
  2. Test active recall by writing key terms without looking at notes.
  3. Teach concepts back in your own words to solidify retention.\n\n*(Connect your Gemini API key in Secrets for full live generative AI power!)*`;
}

function generateOfflineSummary(text: string): string {
  const lines = text.split("\n").filter(l => l.trim().length > 0);
  return `### 📝 Key Summary & Revision Notes\n\n**Main Points Extracted:**\n` +
    lines.slice(0, 5).map(line => `- **Key Concept**: ${line.substring(0, 120)}...`).join("\n") +
    `\n\n**💡 Exam Memory Hook**: Focus on active recall and self-quizzing these main points.`;
}

function generateOfflineFlashcards(topic: string, count: number): { front: string; back: string }[] {
  return [
    { front: `What is the primary definition of ${topic || "this topic"}?`, back: "The foundational principle that establishes core properties and behaviors." },
    { front: `What is a practical real-world application of ${topic || "this topic"}?`, back: "Utilized in analysis, system design, and academic research to solve structured problems." },
    { front: `Name one key rule or constraint related to ${topic || "this topic"}.`, back: "Always ensure boundary conditions and initial parameters are validated." },
  ].slice(0, count);
}

function generateOfflineStudyPlan(subjects: string[], days: number, hours: number): string {
  const subjList = subjects.length > 0 ? subjects : ["Core Subject 1", "Core Subject 2"];
  return `### 📅 Smart Study Schedule (${days} Days Target)\n\n| Day | Subject | Focus Session (${hours} hrs/day) | Technique |\n|---|---|---|---|\n` +
    Array.from({ length: Math.min(days, 5) }).map((_, i) => {
      const s = subjList[i % subjList.length];
      return `| Day ${i + 1} | **${s}** | ${hours} hours (Pomodoro 25/5) | Active Recall & Problem Sets |`;
    }).join("\n") +
    `\n\n**💡 Daily Strategy**: Dedicate the first 45 minutes to weak topics before proceeding to general revision.`;
}
