"use client";
/* ══ AssistantChat.tsx — the shared chat surface for Co-pilot ══
   Used by the Co-pilot page and by the prompt builder (compact,
   with a one-click Apply when the reply contains a ```cyrus-plan). ══ */
import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { btn } from "./ui";

export type ChatTurn = { role: "user" | "assistant"; content: string; model?: string; demo?: boolean };

/* pull the first ```cyrus-plan fenced JSON block out of a reply */
export function extractPlan(text: string): { slots: Record<string, string> } | null {
  const m = text.match(/```cyrus-plan\s*([\s\S]*?)```/);
  if (!m) return null;
  try {
    const j = JSON.parse(m[1]);
    if (j && typeof j.slots === "object" && j.slots) {
      const slots: Record<string, string> = {};
      for (const [k, v] of Object.entries(j.slots as Record<string, unknown>)) if (typeof v === "string") slots[k] = v;
      return Object.keys(slots).length ? { slots } : null;
    }
  } catch { /* not valid JSON - just show the text */ }
  return null;
}

const stripPlan = (t: string) => t.replace(/```cyrus-plan[\s\S]*?```/g, "").replace(/\n{3,}/g, "\n\n").trim();

export default function AssistantChat({
  mode = "assistant", context, placeholder, starters, compact, onApplyPlan,
}: {
  mode?: "assistant" | "builder";
  context?: string;
  placeholder?: string;
  starters?: string[];
  compact?: boolean;
  onApplyPlan?: (plan: { slots: Record<string, string> }) => void;
}) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [turns, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setErr("");
    setInput("");
    const next: ChatTurn[] = [...turns, { role: "user", content: q }];
    setTurns(next);
    setBusy(true);
    const res = await api.assistant(next.map((t) => ({ role: t.role, content: t.content })), mode, context);
    setBusy(false);
    if (!res?.reply) { setErr("Co-pilot didn't answer - try again in a moment."); return; }
    setTurns([...next, { role: "assistant", content: res.reply, model: res.model, demo: res.demo }]);
  };

  return (
    <div className={`flex flex-col ${compact ? "" : "min-h-[420px]"}`}>
      {/* transcript */}
      <div className={`flex-1 overflow-y-auto ${compact ? "max-h-[300px]" : "max-h-[56vh]"} pr-1`}>
        {!turns.length && !busy && (
          <div className="py-6 text-center">
            <p className="text-cocoa text-[14px] leading-[1.65] max-w-[460px] mx-auto">
              {mode === "builder"
                ? "Describe what you're building and the coach tunes the slots - then you apply its plan with one tap."
                : "Ask about hackathons, the matcher, artifacts, free APIs or sign-in - Co-pilot answers in plain language."}
            </p>
            {starters && (
              <div className="flex gap-2 flex-wrap justify-center mt-4">
                {starters.map((s) => (
                  <button key={s} onClick={() => void send(s)}
                    className="font-mono text-[11px] font-semibold bg-cream border border-line rounded-full px-3 py-1.5 text-cocoa hover:border-accent hover:text-rust transition-colors cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="grid gap-3 py-3">
          {turns.map((t, i) => (
            <div key={i} className={t.role === "user" ? "flex justify-end" : "flex"}>
              <div className={t.role === "user"
                ? "max-w-[85%] bg-coffee text-foam rounded-[16px] rounded-br-[6px] px-4 py-2.5 text-[13.5px] leading-[1.6]"
                : "max-w-[92%] bg-cream border border-line rounded-[16px] rounded-bl-[6px] px-4 py-2.5"}>
                {t.role === "assistant" && (
                  <span className="block font-mono text-[9.5px] font-bold uppercase tracking-[.1em] text-dim mb-1.5">
                    {t.model}{t.demo ? " - offline mode" : " - open-source model"}
                  </span>
                )}
                <span className="whitespace-pre-wrap text-[13.5px] leading-[1.6]">{stripPlan(t.content)}</span>
                {t.role === "assistant" && onApplyPlan && extractPlan(t.content) && (
                  <button onClick={() => onApplyPlan(extractPlan(t.content)!)}
                    className={btn("primary", "sm") + " mt-2.5"}>Apply this plan</button>
                )}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex">
              <div className="bg-cream border border-line rounded-[16px] rounded-bl-[6px] px-4 py-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse [animation-delay:300ms]" />
                <span className="font-mono text-[10.5px] text-dim ml-1">thinking</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {err && <p className="font-mono text-[11px] text-brick py-2">{err}</p>}
      </div>

      {/* composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); void send(input); }}
        className="flex gap-2 pt-3 border-t border-line">
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder ?? (mode === "builder" ? "I'm building a…" : "Ask Co-pilot…")}
          aria-label={mode === "builder" ? "Message the prompt coach" : "Message Co-pilot"}
          className="flex-1 min-w-0 bg-paper border border-line rounded-xl px-4 py-2.5 text-[14px] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(180,96,44,.12)]" />
        <button type="submit" disabled={busy || !input.trim()} className={btn("primary", "md") + " disabled:opacity-40 disabled:cursor-not-allowed shrink-0"}>
          Send
        </button>
        {turns.length > 0 && (
          <button type="button" onClick={() => { setTurns([]); inputRef.current?.focus(); }}
            className="font-mono text-[10px] uppercase tracking-[.1em] text-dim hover:text-rust cursor-pointer transition-colors self-center shrink-0 px-1">clear</button>
        )}
      </form>
    </div>
  );
}
