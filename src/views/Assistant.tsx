"use client"
/* ══ Assistant.tsx — cyrus's own helper, on an open-source model ══
   Full-page chat against the Hugging Face Inference Llama endpoint
   (offline helper when no token is configured). Help about every
   page of the site, in plain language.                           ══ */
import { Link } from "@/lib/router";
import { Eyebrow, Word, btn } from "../components/ui";
import AssistantChat from "../components/AssistantChat";

const W = "max-w-[1240px] mx-auto px-6";

const STARTERS = [
  "Which hackathon fits a TypeScript + React stack?",
  "How does the org matcher score organizations?",
  "What is the master prompt builder?",
  "Where do I find free APIs to build with?",
  "How does sign-in and cross-device sync work?",
];

const TOPIC: [string, string, string][] = [
  ["Hackathons", "/hackathons", "Live windows, prize pools and countdowns for every open event."],
  ["Dashboard pages", "/dashboard", "Saved shelf, watchlist, matcher, mentors - each on its own page now."],
  ["Artifacts", "/tools", "Design and prompt tools with live demos and copy-paste prompts."],
  ["Prompt builder", "/tools/builder", "One combined prompt for Cursor, Claude or ChatGPT, tuned per slot."],
  ["Free APIs", "/apis", "No-cost endpoints you can call from a browser, grouped by category."],
  ["Program archive", "/opensource", "Thousands of accepted GSoC, LFX and Outreachy projects."],
];

export default function Assistant() {
  return (
    <div className={`${W} pt-12 pb-16`}>
      <div className="max-w-[720px]">
        <Eyebrow>Helper</Eyebrow>
        <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(30px,4.6vw,50px)] leading-[1.05] mt-2">
          Ask <Word>cyrus</Word> anything
        </h1>
        <p className="text-cocoa text-[16px] leading-[1.7] mt-3.5">
          Our own assistant, running on an open-source Llama model served through Hugging Face Inference.
          It knows every page of this site - deadlines, the matcher, artifacts, free APIs, sign-in - and
          answers in plain language instead of sending you through five menus.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-10 items-start">
        <div className="bg-card border border-line rounded-[24px] p-6 shadow-soft">
          <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-line">
            <span className="w-[30px] h-[30px] rounded-[9px] bg-accent grid place-items-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.4 6.4l2.8 2.8M14.8 14.8l2.8 2.8M17.6 6.4l-2.8 2.8M9.2 14.8l-2.8 2.8" /></svg>
            </span>
            <div className="min-w-0">
              <b className="block font-display text-[14.5px]">cyrus helper</b>
              <span className="font-mono text-[10px] text-dim">open-source model - answers stay about this site</span>
            </div>
            <Link to="/tools/builder" className={btn("outline", "sm") + " ml-auto shrink-0 max-[560px]:hidden"}>Prompt coach</Link>
          </div>
          <AssistantChat mode="assistant" starters={STARTERS} placeholder="Ask the helper…" />
        </div>

        <aside className="grid gap-4">
          <div className="bg-card border border-line rounded-[20px] p-5 shadow-soft">
            <h3 className="font-mono text-[9.5px] font-bold uppercase tracking-[.12em] text-dim mb-3">Good first questions</h3>
            <div className="grid gap-2">
              {["Which hackathons close this month?", "How do I build a prompt for a SaaS dashboard?", "What should a first-time GSoC applicant read?", "Which free APIs need no key at all?"].map((q) => (
                <p key={q} className="text-[12.5px] text-cocoa leading-[1.55] border-l-2 border-accent/40 pl-3">{q}</p>
              ))}
            </div>
          </div>
          <div className="bg-card border border-line rounded-[20px] p-5 shadow-soft">
            <h3 className="font-mono text-[9.5px] font-bold uppercase tracking-[.12em] text-dim mb-3">Or go straight there</h3>
            <div className="grid gap-1">
              {TOPIC.map(([l, to, d]) => (
                <Link key={l} to={to} className="group rounded-xl px-2.5 py-2 hover:bg-cream transition-colors">
                  <b className="block text-[13px] font-semibold">{l}</b>
                  <span className="block text-[11.5px] text-dim leading-[1.5] line-clamp-1">{d}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-coffee border border-bean rounded-[20px] p-5 text-foam">
            <h3 className="font-mono text-[9.5px] font-bold uppercase tracking-[.12em] text-ember mb-2.5">How it runs</h3>
            <p className="text-[12.5px] leading-[1.65] text-foam/85">
              Chat is routed through Hugging Face Inference to an open-weights Llama chat model. Your messages
              go to the model only - nothing is stored, nothing trains a system. Without a token configured the
              page still works on a built-in offline helper, and it always says which one answered.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
