import { useEffect, useMemo, useState } from "react";
import titleKey from "@/assets/title-key.jpg";
import { BGS, SPRITES, type BgKey } from "./assets";
import { BOOKS, CONTACTS, PHASES } from "./story";
import type { Book, OnStage, Phase, PhonePhase, ScenePhase } from "./types";

type Screen = { name: "menu" | "sandbox" } | { name: "play"; index: number; story: boolean };
const SAVE = "nhango-progress";

export function Game() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  const [saved, setSaved] = useState(0);
  useEffect(() => setSaved(Number(localStorage.getItem(SAVE) ?? 0)), []);

  const finish = (index: number, story: boolean) => {
    if (story) {
      const next = index + 1;
      const best = Math.max(saved, next);
      localStorage.setItem(SAVE, String(best));
      setSaved(best);
      if (next < PHASES.length) return setScreen({ name: "play", index: next, story });
    }
    setScreen({ name: story ? "menu" : "sandbox" });
  };

  if (screen.name === "play") {
    const phase = PHASES[screen.index]!;
    return (
      <PhasePlayer
        key={phase.id}
        phase={phase}
        onExit={() => setScreen({ name: screen.story ? "menu" : "sandbox" })}
        onDone={() => finish(screen.index, screen.story)}
      />
    );
  }
  if (screen.name === "sandbox")
    return <Sandbox onBack={() => setScreen({ name: "menu" })} onPick={(i) => setScreen({ name: "play", index: i, story: false })} />;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img src={titleKey} alt="" className="anim-bg absolute inset-0 h-full w-full object-cover" />
      <div className="vn-veil absolute inset-0" />
      <div className="relative flex min-h-screen flex-col items-center justify-end gap-6 px-6 pb-16 text-center">
        <h1 className="font-display text-4xl text-primary drop-shadow-lg md:text-6xl">Nhango Storybook</h1>
        <p className="font-hand text-2xl text-foreground">Livro I · Livro II · Livro III</p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <MenuBtn onClick={() => setScreen({ name: "play", index: Math.min(saved, PHASES.length - 1), story: true })}>
            {saved > 0 ? `Continuar história (${Math.min(saved + 1, PHASES.length)}/${PHASES.length})` : "Modo História"}
          </MenuBtn>
          {saved > 0 && (
            <MenuBtn ghost onClick={() => { localStorage.setItem(SAVE, "0"); setSaved(0); setScreen({ name: "play", index: 0, story: true }); }}>
              Recomeçar do início
            </MenuBtn>
          )}
          <MenuBtn ghost onClick={() => setScreen({ name: "sandbox" })}>Modo Sandbox</MenuBtn>
        </div>
      </div>
    </main>
  );
}

function MenuBtn({ children, onClick, ghost }: { children: React.ReactNode; onClick: () => void; ghost?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-5 py-3 font-display text-lg transition hover:scale-105 ${ghost ? "vn-box text-foreground" : "bg-primary text-primary-foreground"}`}
    >
      {children}
    </button>
  );
}

const toneText: Record<Book, string> = { I: "text-book1", II: "text-book2", III: "text-book3" };
const toneBorder: Record<Book, string> = { I: "border-book1", II: "border-book2", III: "border-book3" };

function Sandbox({ onBack, onPick }: { onBack: () => void; onPick: (i: number) => void }) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-primary">Sandbox</h1>
          <button onClick={onBack} className="vn-box rounded-lg px-4 py-2">← Menu</button>
        </div>
        {(Object.keys(BOOKS) as Book[]).map((b) => (
          <section key={b} className="mb-10">
            <h2 className={`font-display text-2xl ${toneText[b]}`}>{BOOKS[b].title}</h2>
            <p className="mb-4 text-muted-foreground">{BOOKS[b].subtitle}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PHASES.map((p, i) => p.book !== b ? null : (
                <button key={p.id} onClick={() => onPick(i)} className={`vn-box overflow-hidden rounded-xl border-l-4 text-left transition hover:scale-[1.02] ${toneBorder[b]}`}>
                  {p.kind === "scene" ? (
                    <img src={BGS[firstBg(p)]} alt="" className="h-28 w-full object-cover" />
                  ) : (
                    <div className="flex h-28 items-center justify-center bg-phone text-4xl">📱</div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Fase {i + 1} · {p.day}</p>
                    <p className="font-display text-lg">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

const firstBg = (p: ScenePhase): BgKey => p.steps.find((s) => s.bg)?.bg ?? "sala";

function PhasePlayer({ phase, onExit, onDone }: { phase: Phase; onExit: () => void; onDone: () => void }) {
  const [intro, setIntro] = useState(true);
  if (intro)
    return (
      <main onClick={() => setIntro(false)} className="flex min-h-screen cursor-pointer flex-col items-center justify-center gap-3 px-6 text-center">
        <p className={`font-display text-xl ${toneText[phase.book]}`}>{BOOKS[phase.book].title}</p>
        <h1 className="anim-bubble font-display text-4xl md:text-5xl">{phase.title}</h1>
        <p className="font-hand text-2xl text-primary">{phase.day}</p>
        <p className="max-w-md text-muted-foreground">{phase.summary}</p>
        <p className="mt-8 animate-pulse text-sm text-muted-foreground">toque para começar</p>
      </main>
    );
  return phase.kind === "scene" ? <ScenePlayer phase={phase} onExit={onExit} onDone={onDone} /> : <PhonePlayer phase={phase} onExit={onExit} onDone={onDone} />;
}

const posClass = { left: "left-[2%] md:left-[8%]", center: "left-1/2 -translate-x-1/2", right: "right-[2%] md:right-[8%]" };

function ScenePlayer({ phase, onExit, onDone }: { phase: ScenePhase; onExit: () => void; onDone: () => void }) {
  const [i, setI] = useState(0);
  const state = useMemo(() => {
    let bg: BgKey = firstBg(phase);
    let chars: OnStage[] = [];
    for (let k = 0; k <= i; k++) {
      const s = phase.steps[k]!;
      if (s.bg) bg = s.bg;
      if (s.chars) chars = s.chars;
    }
    return { bg, chars };
  }, [i, phase]);
  const step = phase.steps[i]!;
  const next = () => (i + 1 < phase.steps.length ? setI(i + 1) : onDone());

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const speakerId = step.speaker?.toLowerCase();
  return (
    <main className="relative h-screen w-full select-none overflow-hidden" onClick={next}>
      <img key={state.bg} src={BGS[state.bg]} alt="" className="anim-bg absolute inset-0 h-full w-full object-cover" />
      <div className="vn-veil absolute inset-0" />
      <div key={i} className={`absolute inset-0 ${step.fx === "shake" ? "anim-shake" : ""}`}>
        {state.chars.map((c) => (
          <img
            key={c.id + c.pos}
            src={SPRITES[c.id]}
            alt={c.id}
            className={`anim-sprite absolute bottom-0 h-[62%] max-w-[48%] object-contain transition md:h-[78%] ${posClass[c.pos]} ${speakerId && speakerId !== c.id ? "opacity-70 brightness-75" : ""} ${step.fx === "hop" && speakerId === c.id ? "anim-hop" : ""}`}
          />
        ))}
      </div>
      <Toolbar onExit={onExit} progress={`${i + 1}/${phase.steps.length}`} />
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-6">
        <div className="vn-box anim-bubble relative mx-auto max-w-4xl rounded-xl p-5 pt-7 md:p-7 md:pt-9" key={`b${i}`}>
          <span className="nameplate absolute -top-4 left-4 px-5 py-1 text-sm md:text-base">{step.speaker ?? "Nhango"}</span>
          {step.act && <p className="mb-1 font-hand text-xl text-accent">*{step.act}*</p>}
          <p className={`text-base leading-relaxed md:text-xl ${step.speaker ? "" : "italic text-muted-foreground"}`}>{step.text}</p>
          <span className="absolute bottom-2 right-4 animate-pulse text-primary">▼</span>
        </div>
      </div>
    </main>
  );
}

function Toolbar({ onExit, progress }: { onExit: () => void; progress: string }) {
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
      <button onClick={(e) => { e.stopPropagation(); onExit(); }} className="vn-box rounded-lg px-3 py-1 text-sm">✕ Sair</button>
      <span className="vn-box rounded-lg px-3 py-1 text-sm text-muted-foreground">{progress}</span>
    </div>
  );
}

function PhonePlayer({ phase, onExit, onDone }: { phase: PhonePhase; onExit: () => void; onDone: () => void }) {
  const [n, setN] = useState(1);
  const done = n >= phase.messages.length;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setN((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [n, done]);
  useEffect(() => { document.getElementById("phone-end")?.scrollIntoView({ behavior: "smooth" }); }, [n]);

  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden" onClick={() => (done ? onDone() : setN(phase.messages.length))}>
      <img src={BGS.quarto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm" />
      <Toolbar onExit={onExit} progress={`${Math.min(n, phase.messages.length)}/${phase.messages.length}`} />
      <div className="anim-bubble relative flex h-[85vh] w-full max-w-sm flex-col overflow-hidden rounded-[2.5rem] border-8 border-phone bg-phone shadow-2xl">
        <div className="bg-secondary px-5 py-4 font-display">{CONTACTS[phase.contact] ?? phase.contact}</div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
          {phase.messages.slice(0, n).map((m, k) =>
            m.from === "sys" ? (
              <p key={k} className="anim-bubble text-center text-xs text-muted-foreground">{m.text}</p>
            ) : (
              <div key={k} className={`anim-bubble max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "me" ? "self-end bg-bubble-me" : "self-start bg-bubble-them"}`}>
                {m.text}
                {m.time && <span className="ml-2 text-[10px] opacity-60">{m.time}</span>}
              </div>
            ),
          )}
          <div id="phone-end" />
        </div>
        <p className="py-2 text-center text-xs text-muted-foreground">{done ? "toque para continuar" : "toque para pular"}</p>
      </div>
    </main>
  );
}
