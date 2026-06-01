import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

/* ━━━ TYPEWRITER HOOK ━━━ */
function useTypewriter(text, speed = 35, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const delayTimer = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay, enabled]);
  return { displayed, done };
}

/* ━━━ BLOB BACKGROUND (login/auth + Studio-entrance style — slow drifting blobs that appear & disappear) ━━━ */
function OnboardingBlobBg() {
  return (
    <div className="ob-blob-field" aria-hidden="true">
      <span className="ob-blob ob-blob-1" />
      <span className="ob-blob ob-blob-2" />
      <span className="ob-blob ob-blob-3" />
      <span className="ob-blob ob-blob-4" />
      <span className="ob-blob ob-blob-5" />
      <span className="ob-blob ob-blob-6" />
      <span className="ob-blob ob-blob-7" />
      <span className="ob-blob ob-blob-8" />
      <span className="ob-blob ob-blob-9" />
      <span className="ob-blob-grain" />
    </div>
  );
}

/* ━━━ CONFETTI BURST (fires once on mount) ━━━ */
const CONFETTI_COLORS = ["#604DFF", "#8B7AFF", "#A294FF", "#1DB954", "#FFD166", "#FF6B9D", "#4ECDC4"];
function ConfettiBurst() {
  const pieces = useRef(
    Array.from({ length: 44 }, () => ({
      tx: (Math.random() * 2 - 1) * 260,
      ty: Math.random() * 420 - 120,
      r: Math.random() * 720 - 360,
      delay: Math.random() * 0.12,
      dur: 0.9 + Math.random() * 0.7,
      w: 6 + Math.random() * 7,
      h: 9 + Math.random() * 9,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      radius: Math.random() > 0.5 ? "2px" : "50%",
    }))
  ).current;
  return createPortal(
    <div className="ob-confetti">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="ob-confetti-piece"
          style={{
            "--tx": `${p.tx}px`, "--ty": `${p.ty}px`, "--r": `${p.r}deg`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
            width: p.w, height: p.h, background: p.color, borderRadius: p.radius,
          }}
        />
      ))}
    </div>,
    document.body
  );
}

/* ━━━ ICONS ━━━ */
const OI = ({ n, s = 20 }) => {
  const p = { width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  const icons = {
    check: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    skip: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>,
    play: <svg style={p} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    home: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    globe: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    mail: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    card: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    image: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    inbox: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
    star: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    building: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><path d="M9 22v-4h6v4"/></svg>,
    upload: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    sparkle: <svg style={p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>,
    settings: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    chart: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    briefcase: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    folder: <svg style={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  };
  return icons[n] || null;
};

/* ━━━ LANCED MARK (app-icon avatar — real logo glyph on white) ━━━ */
function LancedMark({ size = 34, className = "ob-msg-avatar" }) {
  return (
    <span className={className} aria-label="Lanced" style={{ width: size, height: size }}>
      <svg viewBox="0 0 695 695" width="62%" height="62%" aria-hidden="true">
        <defs>
          <linearGradient id="ob-mark-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#604DFF" />
            <stop offset="0.55" stopColor="#8B7AFF" />
            <stop offset="1" stopColor="#A294FF" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ob-mark-grad)"
          d="M548.51,591.55c-53.38-44.75-123.94-71.84-201.01-71.84s-147.64,27.09-201.01,71.84c169.77-173.27,201.01-335.73,201.01-488.09,0,152.36,23.02,316.32,201.01,488.09Z"
        />
      </svg>
    </span>
  );
}

/* ━━━ STEP ICON RESOLVER ━━━ */
function stepIconName(step) {
  if (step.icon && typeof step.icon === "string") return step.icon;
  const id = (step.id || "").toLowerCase();
  if (/business|agency|company|detail/.test(id)) return "building";
  if (/logo|photo|image|media|portfolio/.test(id)) return "image";
  if (/team|member|client/.test(id)) return "users";
  if (/plan|billing|pay|card/.test(id)) return "card";
  if (/verif|email/.test(id)) return "mail";
  if (/physical|spec|professional|skill|stage|resume/.test(id)) return "star";
  return "star";
}

/* ━━━ WELCOME SCREEN ━━━ */
function OnboardingWelcome({ config, firstName, userType, onContinue }) {
  const welcomeConfig = userType === "existing" ? config.welcome.existingUser : config.welcome.newUser;
  const lines = welcomeConfig.lines.map(l => ({ ...l, text: l.text.replace("{firstName}", firstName || "there") }));
  const [lineIdx, setLineIdx] = useState(0);     // line currently being typed
  const [typed, setTyped] = useState(() => lines.map(() => ""));
  const [showCta, setShowCta] = useState(false);

  // Type each line in sequence, like the Studio Entrance prompt
  useEffect(() => {
    if (lineIdx >= lines.length) {
      const t = setTimeout(() => setShowCta(true), 500);
      return () => clearTimeout(t);
    }
    const text = lines[lineIdx].text;
    const startDelay = lineIdx === 0 ? 450 : 280;
    let ci = 0;
    let iv = null;
    const startT = setTimeout(() => {
      iv = setInterval(() => {
        ci++;
        setTyped(prev => { const n = [...prev]; n[lineIdx] = text.slice(0, ci); return n; });
        if (ci >= text.length) {
          clearInterval(iv);
          setTimeout(() => setLineIdx(i => i + 1), 480);
        }
      }, 38);
    }, startDelay);
    return () => { clearTimeout(startT); if (iv) clearInterval(iv); };
  }, [lineIdx]);

  return (
    <div className="ob-welcome">
      <OnboardingBlobBg />
      <div className="ob-welcome-content">
        {lines.map((line, idx) => {
          if (idx > lineIdx) return null;
          const variant = line.type === "hero" ? " ob-welcome-hero"
            : line.type === "brand" ? " ob-welcome-brand"
            : line.type === "tagline" ? " ob-welcome-tagline" : "";
          const isTyping = idx === lineIdx && idx < lines.length;
          return (
            <div key={idx} className={`ob-welcome-line${variant}`}>
              <span>{typed[idx]}</span>
              {isTyping && <span className="ob-cursor" />}
            </div>
          );
        })}
        {showCta && (
          <button className="ob-welcome-cta ob-fade-up ob-visible" onClick={onContinue}>
            {welcomeConfig.cta} <OI n="arrow" s={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ━━━ PURPOSE SELECTION ━━━ */
function OnboardingPurpose({ config, selected, onSelect, onContinue }) {
  const tw = useTypewriter("What would you like to use Lanced for?", 30, 200, true);
  const [showCards, setShowCards] = useState(false);
  useEffect(() => { if (tw.done) setTimeout(() => setShowCards(true), 300); }, [tw.done]);

  return (
    <div className="ob-purpose">
      <OnboardingBlobBg />
      <div className="ob-purpose-content">
      <div className="ob-purpose-header">
        <span className="ob-purpose-typed">{tw.displayed}</span>
        {!tw.done && <span className="ob-cursor" />}
      </div>
      <div className="ob-purpose-sub ob-fade-up" style={{ opacity: showCards ? 1 : 0 }}>Select all that apply</div>
      <div className={`ob-purpose-grid${showCards ? " ob-show" : ""}`}>
        {config.purposes.map((p, i) => (
          <button
            key={p.id}
            className={`ob-purpose-card${selected.includes(p.id) ? " ob-selected" : ""}`}
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => onSelect(p.id)}
          >
            <span className="ob-purpose-icon"><OI n={p.icon} s={19} /></span>
            <span className="ob-purpose-label">{p.label}</span>
            {selected.includes(p.id) && <span className="ob-purpose-check"><OI n="check" s={14} /></span>}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <button className="ob-purpose-continue ob-fade-up ob-visible" onClick={onContinue}>
          Continue <OI n="arrow" s={16} />
        </button>
      )}
      </div>
    </div>
  );
}

/* ━━━ CONVERSATION MESSAGE ━━━ */
function ConversationMessage({ text, delay = 0, onDone }) {
  const [show, setShow] = useState(false);
  const tw = useTypewriter(text, 25, 0, show);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => { if (tw.done && onDone) onDone(); }, [tw.done]);

  if (!show) return null;
  return (
    <div className="ob-msg ob-msg-lanced ob-chat-in">
      <LancedMark />
      <div className="ob-msg-bubble">
        <span>{tw.displayed}</span>
        {!tw.done && <span className="ob-cursor ob-cursor-sm" />}
      </div>
    </div>
  );
}

/* ━━━ CONVERSATION ACTION (user clicks) ━━━ */
function ConversationAction({ label, onClick, secondary, secondaryLabel, onSecondary, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  if (!show) return null;
  return (
    <div className="ob-msg ob-msg-actions ob-chat-in">
      <button className="ob-action-btn ob-action-primary" onClick={onClick}>{label} <OI n="arrow" s={14} /></button>
      {secondary && <button className="ob-action-btn ob-action-secondary" onClick={onSecondary}>{secondaryLabel}</button>}
    </div>
  );
}

/* ━━━ CONVERSATION FORM STEP ━━━ */
function ConversationFormStep({ step, data, onChange, onSubmit, onSkip, isEditing, onCancel }) {
  const [errors, setErrors] = useState({});
  const StepComponent = step.component;

  const handleSubmit = () => {
    if (step.validate) {
      const result = step.validate(data);
      if (!result.valid) { setErrors(result.errors); return; }
    }
    setErrors({});
    onSubmit();
  };

  return (
    <div className="ob-msg ob-msg-form ob-chat-in">
      <div className={`ob-form-card${isEditing ? " ob-form-sheet" : ""}`}>
        <StepComponent data={data} onChange={onChange} errors={errors} />
        <div className="ob-form-actions">
          <button className="ob-action-btn ob-action-primary" onClick={handleSubmit}>
            {isEditing ? "Save changes" : "Save & Continue"} <OI n="arrow" s={14} />
          </button>
          {isEditing
            ? <button className="ob-action-btn ob-action-secondary" onClick={onCancel}>Cancel</button>
            : step.skippable && <button className="ob-action-btn ob-action-secondary" onClick={onSkip}>{step.skipLabel || "Skip for now"}</button>}
        </div>
      </div>
    </div>
  );
}

/* ━━━ COMPLETED STEP IN CHAT ━━━ */
function ConversationCompleted({ label }) {
  return (
    <div className="ob-msg ob-msg-done ob-chat-in">
      <span className="ob-done-check"><OI n="check" s={14} /></span>
      <span className="ob-done-label">{label}</span>
    </div>
  );
}

/* ━━━ STEPS PANEL (always-visible right rail — color-coded progress) ━━━ */
function stepDisplayStatus(step, rawStatus, idx, activeStepIdx, data) {
  if (rawStatus === "complete") {
    const verified = /verif|email/.test((step.id || "").toLowerCase()) || data?.verified === true;
    return verified
      ? { kind: "verified", label: "Verified" }
      : { kind: "completed", label: "Completed" };
  }
  if (rawStatus === "skipped") return { kind: "skipped", label: "Skipped" };
  if (idx === activeStepIdx) return { kind: "attention", label: "Need attention" };
  return { kind: "pending", label: "Not yet started" };
}

function OnboardingStepsPanel({ config, state, activeStepIdx, onJumpTo }) {
  const allSteps = config.dataSteps;
  const total = allSteps.length;
  const doneCount = allSteps.filter(s => {
    const st = state.steps[s.id]?.status;
    return st === "complete" || st === "skipped";
  }).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <aside className="ob-steps-panel">
      <div className="ob-sp-header">
        <div className="ob-sp-title">Your setup</div>
        <div className="ob-sp-sub">{doneCount} of {total} complete</div>
        <div className="ob-sp-bar"><span style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="ob-sp-list">
        {allSteps.map((step, idx) => {
          const rawStatus = state.steps[step.id]?.status || "pending";
          const { kind, label } = stepDisplayStatus(step, rawStatus, idx, activeStepIdx, state.steps[step.id]?.data);
          const clickable = idx <= activeStepIdx || rawStatus === "complete" || rawStatus === "skipped";
          const isActive = idx === activeStepIdx;
          return (
            <button
              key={step.id}
              className={`ob-sp-item ob-sp-${kind}${isActive ? " ob-sp-current" : ""}`}
              onClick={() => clickable && onJumpTo(step.id)}
              disabled={!clickable}
            >
              <span className="ob-sp-ic">
                {kind === "completed" || kind === "verified"
                  ? <OI n="check" s={15} />
                  : <OI n={stepIconName(step)} s={16} />}
              </span>
              <span className="ob-sp-body">
                <span className="ob-sp-name">{step.title}</span>
                <span className={`ob-sp-status ob-sp-st-${kind}`}>{label}</span>
              </span>
              {clickable && <span className="ob-sp-chev"><OI n="arrow" s={14} /></span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/* ━━━ STATIC MESSAGE (already typed, no animation) ━━━ */
function StaticMessage({ text }) {
  return (
    <div className="ob-msg ob-msg-lanced">
      <LancedMark />
      <div className="ob-msg-bubble">{text}</div>
    </div>
  );
}

/* ━━━ ONBOARDING SIDEBAR (faithful re-creation of the real app sidebar — locked during setup) ━━━ */
const DEFAULT_NAV = [
  { icon: "home", label: "Home" },
  { icon: "inbox", label: "Inbox" },
  { icon: "users", label: "Team" },
  { icon: "chart", label: "Analytics" },
  { icon: "settings", label: "Settings" },
];
function OnboardingSidebar({ config, firstName }) {
  const items = config.navItems && config.navItems.length ? config.navItems : DEFAULT_NAV;
  const [locked, setLocked] = useState(null);
  const timer = useRef(null);

  const flash = (label) => {
    setLocked(label);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLocked(null), 4200);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const initial = (firstName || "L").trim().charAt(0).toUpperCase();

  return (
    <nav className="sidebar ob-sidebar" aria-label="App navigation (locked during setup)">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sb-mark"><img src="/lanced-logo.svg" alt="Lanced" /></div>
          <div>
            <div className="sb-name">Lanced</div>
            <div className="sb-email">{config.sidebarLabel || config.appName || "App"}</div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        {items.map((it, i) => (
          it.type === "divider"
            ? <div key={`d-${i}`} className="sidebar-divider" />
            : (
              <button
                key={i}
                className={`sidebar-item ob-sidebar-item${locked === it.label ? " ob-sb-buzz" : ""}`}
                onClick={() => flash(it.label)}
              >
                <OI n={it.icon} s={18} />
                <span className="sb-label">{it.label}</span>
                <span className="sb-tip">{it.label}</span>
              </button>
            )
        ))}
      </div>

      <div className="sidebar-acct ob-sidebar-acct" onClick={() => flash("your account")}>
        <div className="sa-avatar ob-sa-avatar">{initial}</div>
        <div className="sa-text" style={{ flex: 1, minWidth: 0 }}>
          <div className="sa-name">{firstName || "Your account"}</div>
          <div className="sa-email">{config.sidebarLabel || config.appName}</div>
        </div>
      </div>

      {locked && createPortal(
        <div className="ob-nav-popup-wrap" onClick={() => setLocked(null)}>
          <div className="ob-nav-popup" onClick={e => e.stopPropagation()}>
            <span className="ob-nav-popup-ic"><OI n="sparkle" s={18} /></span>
            <div className="ob-nav-popup-body">
              <div className="ob-nav-popup-title">Finish your setup first</div>
              <div className="ob-nav-popup-sub">Complete your onboarding to unlock <b>{locked}</b> and the rest of your workspace.</div>
            </div>
            <button className="ob-nav-popup-x" onClick={() => setLocked(null)}>Got it</button>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}

/* ━━━ MAIN CONVERSATION ENGINE ━━━ */
function OnboardingConversation({ config, state, setState, onComplete, firstName }) {
  const scrollRef = useRef(null);
  const [activeStepIdx, setActiveStepIdx] = useState(() => {
    const idx = config.dataSteps.findIndex(s => {
      const st = state.steps[s.id]?.status;
      return !st || st === "pending" || st === "in-progress";
    });
    return idx >= 0 ? idx : 0;
  });
  const [phase, setPhase] = useState("intro");
  const [showForm, setShowForm] = useState(false);
  const [returnIdx, setReturnIdx] = useState(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [formData, setFormData] = useState(() => {
    const step = config.dataSteps[activeStepIdx];
    return { ...(step?.defaults || {}), ...(state.steps[step?.id]?.data || {}) };
  });
  const isEditing = returnIdx !== null;

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 120);
    }
  }, []);

  useEffect(() => { scrollToBottom(); }, [phase, showForm, activeStepIdx, scrollToBottom]);

  const currentStep = config.dataSteps[activeStepIdx];
  const isLastStep = activeStepIdx >= config.dataSteps.length - 1;

  const completedSteps = config.dataSteps.slice(0, activeStepIdx).map(s => ({
    id: s.id,
    title: s.title,
    successMessage: s.successMessage,
    status: state.steps[s.id]?.status || "complete",
  }));

  const handleFormChange = (field, value) => {
    setFormData(d => ({ ...d, [field]: value }));
  };

  const goToStep = (idx) => {
    const step = config.dataSteps[idx];
    const st = state.steps[step?.id]?.status;
    const alreadyDone = st === "complete" || st === "skipped";
    setActiveStepIdx(idx);
    setFormData({ ...(step?.defaults || {}), ...(state.steps[step?.id]?.data || {}) });
    // Revisiting a finished step → open its form straight away for editing
    setShowForm(alreadyDone);
    setPhase(alreadyDone ? "form" : "intro");
  };

  const advanceStep = (status = "complete") => {
    setState(prev => ({
      ...prev,
      steps: { ...prev.steps, [currentStep.id]: { status, data: status === "skipped" ? null : formData } },
    }));

    if (status === "complete") setConfettiKey(k => k + 1);

    // If editing an earlier step, jump back to where we left off
    if (isEditing && returnIdx > activeStepIdx) {
      const ret = returnIdx;
      setReturnIdx(null);
      goToStep(ret);
      return;
    }
    setReturnIdx(null);

    if (isLastStep) {
      onComplete();
      return;
    }
    goToStep(activeStepIdx + 1);
  };

  const handleJumpTo = (stepId) => {
    const idx = config.dataSteps.findIndex(s => s.id === stepId);
    if (idx < 0 || idx === activeStepIdx) return;
    // Jumping backward to edit a finished step — remember where to return
    if (idx < activeStepIdx) setReturnIdx(prev => Math.max(prev ?? 0, activeStepIdx));
    else setReturnIdx(null);
    goToStep(idx);
  };

  return (
    <div className="ob-conversation-layout">
      <OnboardingBlobBg />
      {confettiKey > 0 && <ConfettiBurst key={confettiKey} />}
      <div className="ob-conversation-main">
      <div className="ob-conversation-area" ref={scrollRef}>
        <div className="ob-conversation-inner">
          {/* Completed steps as static history */}
          {completedSteps.map(s => (
            <div key={s.id}>
              <ConversationCompleted label={s.title} />
              {s.successMessage && <StaticMessage text={s.successMessage} />}
            </div>
          ))}

          {/* Current step messages — accumulate, never unmount */}
          {currentStep && (
            <>
              {currentStep.intro && (
                <ConversationMessage
                  key={`intro-${currentStep.id}`}
                  text={currentStep.intro}
                  delay={completedSteps.length > 0 ? 200 : 400}
                  onDone={() => { if (phase === "intro") setPhase("prompt"); }}
                />
              )}
              {(phase === "prompt" || phase === "action" || phase === "form" || !currentStep.intro) && (
                <ConversationMessage
                  key={`prompt-${currentStep.id}`}
                  text={currentStep.prompt}
                  delay={currentStep.intro ? 300 : (completedSteps.length > 0 ? 200 : 400)}
                  onDone={() => { if (phase === "prompt" || phase === "intro") setPhase("action"); }}
                />
              )}
              {(phase === "action" || phase === "form") && !showForm && (
                <ConversationAction
                  key={`action-${currentStep.id}`}
                  label={currentStep.cta || "Let's do it"}
                  onClick={() => { setShowForm(true); setPhase("form"); }}
                  secondary={currentStep.skippable}
                  secondaryLabel={currentStep.skipLabel || "Skip for now"}
                  onSecondary={() => advanceStep("skipped")}
                  delay={200}
                />
              )}
              {showForm && (
                <ConversationFormStep
                  key={`form-${currentStep.id}`}
                  step={currentStep}
                  data={formData}
                  onChange={handleFormChange}
                  onSubmit={() => advanceStep("complete")}
                  onSkip={() => advanceStep("skipped")}
                  isEditing={isEditing}
                  onCancel={isEditing ? () => { const r = returnIdx; setReturnIdx(null); goToStep(r); } : null}
                />
              )}
            </>
          )}
        </div>
      </div>
      </div>

      <OnboardingStepsPanel config={config} state={state} activeStepIdx={activeStepIdx} onJumpTo={handleJumpTo} />
    </div>
  );
}

/* ━━━ LEARNING CONVERSATION (chat thread — accumulates & scrolls) ━━━ */
function OnboardingLearning({ config, state, setState, onDone }) {
  const relevantSteps = config.learningSteps.filter(ls =>
    ls.purposes.some(p => state.purposes?.includes(p))
  );
  const scrollRef = useRef(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [msgReady, setMsgReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [history, setHistory] = useState([]); // [{ id, prompt, mode, label }]

  const allDone = relevantSteps.length === 0 || currentIdx >= relevantSteps.length;
  const step = allDone ? null : relevantSteps[currentIdx];

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 120);
    }
  }, []);
  useEffect(() => { scrollToBottom(); }, [currentIdx, msgReady, showVideo, allDone, scrollToBottom]);

  const advance = (mode) => {
    if (step) {
      setHistory(h => [...h, { id: step.id, prompt: step.prompt, mode, label: step.videoTitle || step.cta || "Quick guide" }]);
      setState(prev => ({ ...prev, learningCompleted: [...(prev.learningCompleted || []), step.id] }));
    }
    setMsgReady(false);
    setShowVideo(false);
    setCurrentIdx(i => i + 1);
  };

  return (
    <div className="ob-conversation-layout ob-learning-layout">
      <OnboardingBlobBg />
      <div className="ob-conversation-main">
        <div className="ob-conversation-area" ref={scrollRef}>
          <div className="ob-conversation-inner">
            <StaticMessage text={config.learningIntro || "You've got the essentials down. Here are a few quick guides picked just for you."} />

            {/* Watched / skipped guides stay in the thread */}
            {history.map(h => (
              <div key={h.id}>
                <StaticMessage text={h.prompt} />
                <ConversationCompleted label={h.mode === "watched" ? `Watched · ${h.label}` : `Skipped · ${h.label}`} />
              </div>
            ))}

            {/* Current guide */}
            {step && (
              <>
                <ConversationMessage key={step.id} text={step.prompt} delay={300} onDone={() => setMsgReady(true)} />
                {msgReady && !showVideo && (
                  <div className="ob-msg ob-msg-actions ob-chat-in">
                    <button className="ob-action-btn ob-action-primary" onClick={() => setShowVideo(true)}>
                      <OI n="play" s={13} /> {step.cta || "Watch quick guide"}
                    </button>
                    <button className="ob-action-btn ob-action-secondary" onClick={() => advance("skipped")}>{step.skipLabel || "I'll explore on my own"}</button>
                  </div>
                )}
                {showVideo && (
                  <div className="ob-msg ob-msg-video ob-chat-in">
                    <div className="ob-video-card">
                      <div className="ob-video-frame">
                        {step.videoSrc ? (
                          <video src={step.videoSrc} controls autoPlay className="ob-video-el" />
                        ) : (
                          <div className="ob-video-placeholder">
                            <div className="ob-video-play"><OI n="play" s={22} /></div>
                            <div className="ob-video-ph-label">{step.videoTitle || step.cta || "Quick guide"}</div>
                            <div className="ob-video-ph-sub">Video coming soon</div>
                          </div>
                        )}
                      </div>
                      <div className="ob-form-actions">
                        <button className="ob-action-btn ob-action-primary" onClick={() => advance("watched")}>Continue <OI n="arrow" s={14} /></button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Wrap-up */}
            {allDone && (
              <>
                <StaticMessage text="That's everything! You're ready to explore Lanced." />
                <div className="ob-msg ob-msg-actions ob-chat-in">
                  <button className="ob-action-btn ob-action-primary" onClick={onDone}>Start using Lanced <OI n="arrow" s={14} /></button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━ MAIN ONBOARDING GATE ━━━ */
export default function UniversalOnboarding({ config, state, setState, onComplete, firstName, embedded = false }) {
  if (!state) return null;

  const handleWelcomeContinue = () => {
    setState(prev => ({ ...prev, stage: "purpose" }));
  };

  const handlePurposeSelect = (id) => {
    setState(prev => ({
      ...prev,
      purposes: prev.purposes?.includes(id) ? prev.purposes.filter(p => p !== id) : [...(prev.purposes || []), id],
    }));
  };

  const handlePurposeContinue = () => {
    setState(prev => ({ ...prev, stage: "conversation" }));
  };

  const handleConversationComplete = () => {
    setState(prev => ({ ...prev, stage: "learning" }));
  };

  const handleLearningDone = () => {
    setState(prev => ({ ...prev, stage: "complete" }));
    if (onComplete) onComplete();
  };

  return (
    <div className={embedded ? "ob-root ob-embedded" : "ob-root"}>
      <style>{ONBOARDING_CSS}</style>

      {state.stage === "welcome" && (
        <OnboardingWelcome
          config={config}
          firstName={firstName}
          userType={state.userType}
          onContinue={handleWelcomeContinue}
        />
      )}

      {state.stage === "purpose" && (
        <OnboardingPurpose
          config={config}
          selected={state.purposes || []}
          onSelect={handlePurposeSelect}
          onContinue={handlePurposeContinue}
        />
      )}

      {state.stage === "conversation" && (
        <OnboardingConversation
          config={config}
          state={state}
          setState={setState}
          onComplete={handleConversationComplete}
          firstName={firstName}
        />
      )}

      {state.stage === "learning" && (
        <OnboardingLearning
          config={config}
          state={state}
          setState={setState}
          onDone={handleLearningDone}
        />
      )}
    </div>
  );
}

/* ━━━ HELPER: Create initial state ━━━ */
export function createOnboardingState(config, userType = "new", firstName = "") {
  const steps = {};
  config.dataSteps.forEach(s => { steps[s.id] = { status: "pending", data: null }; });
  return {
    userType,
    firstName,
    stage: "welcome",
    purposes: [],
    steps,
    learningCompleted: [],
    dismissed: false,
  };
}

/* ━━━ CSS ━━━ */
const ONBOARDING_CSS = `
/* ── Root ── */
.ob-root{position:fixed;inset:0;z-index:200;background:var(--bg);font-family:var(--sans);color:var(--tx);display:flex;flex-direction:column;overflow:hidden}
/* Embedded mode — onboarding lives inside the real app's .main (real sidebar stays visible) */
.ob-embedded{position:absolute;inset:0;z-index:80}
.ob-main-host{position:relative}
.ob-embedded .ob-conversation-layout{padding-left:0}

/* ── Blob Background (auth + Studio-entrance style — slow drift, appear & disappear) ── */
.ob-blob-field{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;background:#f8f6ff}
.dark .ob-blob-field{background:var(--bg)}
.ob-blob{position:absolute;border-radius:50%;filter:blur(110px) saturate(1.2);will-change:transform,opacity;opacity:0;mix-blend-mode:multiply}
.dark .ob-blob{mix-blend-mode:screen}
.ob-blob-1{width:560px;height:560px;background:radial-gradient(circle,rgba(96,77,255,.55),rgba(96,77,255,.04) 70%);top:-12%;left:-6%;animation:ob-drift-a 30s ease-in-out infinite}
.ob-blob-2{width:480px;height:480px;background:radial-gradient(circle,rgba(139,122,255,.5),rgba(139,122,255,.04) 70%);top:8%;right:-8%;animation:ob-drift-b 38s ease-in-out infinite;animation-delay:-6s}
.ob-blob-3{width:420px;height:420px;background:radial-gradient(circle,rgba(162,148,255,.45),rgba(120,100,240,.04) 70%);bottom:-14%;left:24%;animation:ob-drift-c 34s ease-in-out infinite;animation-delay:-12s}
.ob-blob-4{width:360px;height:360px;background:radial-gradient(circle,rgba(120,100,230,.45),rgba(96,77,255,.04) 70%);top:34%;left:46%;animation:ob-drift-d 42s ease-in-out infinite;animation-delay:-3s}
.ob-blob-5{width:320px;height:320px;background:radial-gradient(circle,rgba(167,139,250,.42),rgba(120,100,240,.04) 70%);bottom:14%;right:18%;animation:ob-drift-a 36s ease-in-out infinite;animation-delay:-18s}
.ob-blob-6{width:300px;height:300px;background:radial-gradient(circle,rgba(96,77,255,.4),rgba(139,122,255,.04) 70%);top:6%;left:36%;animation:ob-drift-b 32s ease-in-out infinite;animation-delay:-9s}
.ob-blob-7{width:380px;height:380px;background:radial-gradient(circle,rgba(139,122,255,.4),rgba(96,77,255,.03) 70%);bottom:2%;left:4%;animation:ob-drift-c 44s ease-in-out infinite;animation-delay:-22s}
.ob-blob-8{width:280px;height:280px;background:radial-gradient(circle,rgba(180,165,255,.4),rgba(150,130,240,.03) 70%);top:46%;right:6%;animation:ob-drift-d 28s ease-in-out infinite;animation-delay:-15s}
.ob-blob-9{width:240px;height:240px;background:radial-gradient(circle,rgba(120,100,230,.38),rgba(96,77,255,.03) 70%);top:60%;left:14%;animation:ob-drift-a 40s ease-in-out infinite;animation-delay:-26s}
@keyframes ob-drift-a{0%{transform:translate3d(0,0,0) scale(.85);opacity:0}20%{opacity:.6}50%{transform:translate3d(70px,50px,0) scale(1.12);opacity:.7}80%{opacity:.45}100%{transform:translate3d(-30px,90px,0) scale(.9);opacity:0}}
@keyframes ob-drift-b{0%{transform:translate3d(0,0,0) scale(.9);opacity:0}22%{opacity:.55}50%{transform:translate3d(-60px,40px,0) scale(1.15);opacity:.68}78%{opacity:.4}100%{transform:translate3d(40px,-50px,0) scale(.92);opacity:0}}
@keyframes ob-drift-c{0%{transform:translate3d(0,0,0) scale(.88);opacity:0}25%{opacity:.5}50%{transform:translate3d(50px,-60px,0) scale(1.1);opacity:.62}80%{opacity:.4}100%{transform:translate3d(-50px,30px,0) scale(.95);opacity:0}}
@keyframes ob-drift-d{0%{transform:translate3d(0,0,0) scale(.92);opacity:0}24%{opacity:.5}50%{transform:translate3d(-40px,-50px,0) scale(1.08);opacity:.6}78%{opacity:.38}100%{transform:translate3d(60px,40px,0) scale(.9);opacity:0}}
.ob-blob-grain{position:absolute;inset:-10%;pointer-events:none;opacity:.22;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
@media(prefers-reduced-motion:reduce){.ob-blob{animation:none!important;opacity:.5!important}}

/* ── Welcome Screen ── */
.ob-welcome{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
.ob-welcome-content{position:relative;z-index:1;text-align:center;max-width:640px;padding:40px}
.ob-welcome-line{font-size:clamp(26px,3.6vw,42px);font-weight:300;line-height:1.22;margin-bottom:6px;letter-spacing:-.02em;color:var(--tx);min-height:1.2em}
.ob-welcome-hero{font-size:clamp(30px,4.4vw,50px);font-weight:400;letter-spacing:-.03em;color:var(--tx)}
.ob-welcome-brand{font-size:clamp(38px,5.6vw,64px);font-weight:500;letter-spacing:-.035em;line-height:1.06;margin-bottom:16px;background:linear-gradient(120deg,var(--ac) 0%,#8B7AFF 55%,#A294FF 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.ob-welcome-tagline{font-size:clamp(15px,1.7vw,20px);font-weight:300;letter-spacing:.01em;line-height:1.5;color:var(--g4);max-width:32ch;margin:14px auto 4px}
.ob-welcome-line.ob-fade-up{animation:ob-welcome-rise .9s cubic-bezier(.16,1,.3,1) both}
@keyframes ob-welcome-rise{from{opacity:0;transform:translateY(26px);filter:blur(6px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
.ob-welcome-cta{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;border:none;border-radius:14px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;margin-top:30px;transition:transform .2s,box-shadow .2s}
.ob-welcome-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(96,77,255,.3)}

/* ── Typewriter Cursor ── */
.ob-cursor{display:inline-block;width:2px;height:.85em;background:var(--ac);margin-left:2px;vertical-align:middle;animation:ob-blink 1s step-end infinite}
.ob-cursor-sm{height:.7em;width:1.5px}
@keyframes ob-blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── Fade Up Animation ── */
.ob-fade-up{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
.ob-fade-up.ob-visible{opacity:1;transform:translateY(0)}

/* ── Purpose Selection ── */
.ob-purpose{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;overflow-y:auto}
.ob-purpose-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;width:100%}
.ob-purpose-header{font-size:clamp(24px,3.6vw,38px);font-weight:400;text-align:center;margin-bottom:8px;letter-spacing:-.025em;color:var(--tx);min-height:1.4em}
.ob-purpose-typed{display:inline}
.ob-purpose-sub{font-size:14px;font-weight:300;color:var(--g4);margin-bottom:32px;transition:opacity .5s}
.ob-purpose-grid{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:680px}
.ob-purpose-grid:not(.ob-show) .ob-purpose-card{opacity:0;transform:translateY(16px)}
.ob-purpose-grid.ob-show .ob-purpose-card{animation:ob-card-in .4s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0ms)}
.ob-purpose-card{position:relative;display:flex;align-items:center;gap:10px;padding:12px 20px;background:rgba(255,255,255,.6);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,.65);border-radius:14px;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--tx);cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s;opacity:0;box-shadow:0 4px 18px rgba(122,102,255,.05)}
.ob-purpose-card:hover{border-color:color-mix(in oklab,var(--ac) 50%,transparent);box-shadow:0 4px 18px rgba(96,77,255,.12)}
.ob-purpose-card.ob-selected{border-color:var(--ac);background:rgba(96,77,255,.08)}
.ob-purpose-icon{display:flex;align-items:center;color:var(--ac)}
.ob-purpose-label{white-space:nowrap}
.ob-purpose-check{position:absolute;top:-6px;right:-6px;width:22px;height:22px;background:var(--ac);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:ob-pop .25s cubic-bezier(.16,1,.3,1)}
.ob-purpose-continue{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;border:none;border-radius:14px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;margin-top:40px;transition:transform .2s,box-shadow .2s}
.ob-purpose-continue:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(96,77,255,.3)}
@keyframes ob-card-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes ob-pop{from{transform:scale(0)}to{transform:scale(1)}}

/* ── Conversation Layout (sits to the right of the fixed app sidebar) ── */
.ob-conversation-layout{position:relative;width:100%;height:100%;display:flex;flex-direction:row;overflow:hidden;padding-left:var(--sb-w,240px)}
.ob-conversation-main{position:relative;z-index:1;flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}
.ob-conversation-area{position:relative;z-index:1;flex:1;overflow-y:auto;padding:48px 28px 80px;display:flex;justify-content:center}
.ob-conversation-inner{width:100%;max-width:640px;display:flex;flex-direction:column;gap:16px}

/* ── Onboarding Sidebar (real .sidebar classes; locked during setup) ── */
.ob-sidebar{animation:ob-rail-in .5s cubic-bezier(.16,1,.3,1)}
@keyframes ob-rail-in{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
.ob-sidebar-item{cursor:pointer}
.ob-sb-buzz{animation:ob-nav-buzz .4s}
@keyframes ob-nav-buzz{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
.ob-sa-avatar{display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:#fff;background:linear-gradient(135deg,#7A66FF,#4A35E0)}
.ob-sidebar-acct{cursor:pointer}

/* ── Nav Lock Popup (slides up from below) ── */
.ob-nav-popup-wrap{position:fixed;left:0;right:0;bottom:0;z-index:320;display:flex;justify-content:center;padding:0 16px 26px;pointer-events:none}
.ob-nav-popup{pointer-events:auto;display:flex;align-items:center;gap:14px;max-width:440px;width:100%;padding:14px 16px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(48px);backdrop-filter:blur(48px);border:1px solid rgba(255,255,255,.65);border-radius:16px;box-shadow:0 16px 50px rgba(20,18,40,.18),0 3px 10px rgba(20,18,40,.08);animation:ob-popup-up .42s cubic-bezier(.16,1,.3,1)}
@keyframes ob-popup-up{from{opacity:0;transform:translateY(120%)}to{opacity:1;transform:translateY(0)}}
.ob-nav-popup-ic{width:38px;height:38px;flex-shrink:0;border-radius:11px;display:flex;align-items:center;justify-content:center;background:color-mix(in oklab,var(--ac) 14%,transparent);color:var(--ac)}
.ob-nav-popup-body{flex:1;min-width:0}
.ob-nav-popup-title{font-size:14px;font-weight:600;letter-spacing:-.01em}
.ob-nav-popup-sub{font-size:13px;font-weight:300;color:var(--g4);margin-top:1px;line-height:1.4}
.ob-nav-popup-x{flex-shrink:0;padding:8px 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;font-family:var(--sans);font-size:13px;font-weight:500;cursor:pointer;transition:transform .15s}
.ob-nav-popup-x:hover{transform:translateY(-1px)}

/* ── Chat Messages ── */
.ob-msg{display:flex;gap:10px;align-items:flex-start}
.ob-msg-lanced{align-items:flex-start}
.ob-msg-avatar{width:34px;height:34px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(96,77,255,.18);border:1px solid color-mix(in oklab,var(--g2) 80%,transparent)}
.ob-msg-avatar svg{display:block}
.ob-msg-bubble{background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(28px) saturate(1.3);backdrop-filter:blur(28px) saturate(1.3);border:1px solid rgba(255,255,255,.6);border-radius:3px 18px 18px 18px;padding:14px 18px;font-size:15px;font-weight:400;line-height:1.55;max-width:80%;box-shadow:0 6px 22px rgba(122,102,255,.06),0 1px 2px rgba(20,18,40,.03)}

/* ── Chat Entrance Animation ── */
.ob-chat-in{animation:ob-chat-enter .35s cubic-bezier(.16,1,.3,1)}
@keyframes ob-chat-enter{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ── Action Buttons ── */
.ob-msg-actions{padding-left:42px;display:flex;gap:8px;flex-wrap:wrap}
.ob-action-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:12px;font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:none}
.ob-action-primary{background:linear-gradient(135deg,var(--ac),#604DFF);color:#fff}
.ob-action-primary:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(96,77,255,.25)}
.ob-action-secondary{background:var(--sf);color:var(--g5);border:1px solid var(--g2)}
.ob-action-secondary:hover{border-color:var(--g3);color:var(--tx)}

/* ── Form Card ── */
.ob-msg-form{padding-left:42px;width:100%}
.ob-form-card{background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(48px) saturate(1.4);backdrop-filter:blur(48px) saturate(1.4);border:1px solid rgba(255,255,255,.65);border-radius:22px;padding:26px 28px;max-width:660px;width:100%;animation:ob-form-expand .35s cubic-bezier(.16,1,.3,1);box-shadow:0 10px 40px rgba(122,102,255,.08),0 2px 6px rgba(20,18,40,.03)}
@keyframes ob-form-expand{from{opacity:0;transform:scale(.97) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.ob-form-sheet{animation:ob-form-sheet-up .42s cubic-bezier(.16,1,.3,1)}
@keyframes ob-form-sheet-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
.ob-form-card .ob-field{margin-bottom:16px}
.ob-form-card .ob-field:last-of-type{margin-bottom:20px}
.ob-form-card .ob-field label{display:block;font-size:12px;font-weight:600;color:var(--g5);margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
.ob-form-card .ob-field input,.ob-form-card .ob-field select,.ob-form-card .ob-field textarea{width:100%;padding:11px 15px;border:1px solid rgba(0,0,0,.07);border-radius:12px;font-family:var(--sans);font-size:14px;background:rgba(255,255,255,.55);color:var(--tx);transition:border-color .2s,box-shadow .2s,background .2s;outline:none}
.ob-form-card .ob-field input:focus,.ob-form-card .ob-field select:focus,.ob-form-card .ob-field textarea:focus{border-color:#7A66FF;background:rgba(255,255,255,.8);box-shadow:0 0 0 3px rgba(122,102,255,.08)}
.ob-form-card .ob-field label{font-weight:500}
.ob-form-card .ob-field input.ob-error,.ob-form-card .ob-field select.ob-error{border-color:var(--red)}
.ob-form-card .ob-field .ob-field-error{font-size:12px;color:var(--red);margin-top:4px}
.ob-form-card .ob-field textarea{min-height:80px;resize:vertical}
.ob-form-actions{display:flex;gap:8px;flex-wrap:wrap}

/* ── In-form interactive selectors (artist types / styles) ── */
.ob-pick-grid{display:flex;flex-wrap:wrap;gap:10px}
.ob-pick-card{position:relative;display:flex;align-items:center;gap:9px;padding:11px 16px;background:var(--bg);border:1.5px solid var(--g2);border-radius:13px;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--tx);cursor:pointer;transition:border-color .18s,background .18s,box-shadow .18s,transform .18s;animation:ob-card-in .38s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0ms)}
.ob-pick-card:hover{border-color:var(--ac);box-shadow:0 2px 12px rgba(96,77,255,.1)}
.ob-pick-card.ob-on{border-color:var(--ac);background:rgba(96,77,255,.07)}
.ob-pick-ic{font-size:19px;line-height:1}
.ob-pick-chk{position:absolute;top:-6px;right:-6px;width:20px;height:20px;background:var(--ac);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:ob-pop .25s cubic-bezier(.16,1,.3,1)}
.ob-styles-reveal{animation:ob-form-expand .4s cubic-bezier(.16,1,.3,1)}
.ob-style-chip{padding:7px 14px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--g2);background:transparent;color:var(--g5);font-family:var(--sans);transition:all .16s;animation:ob-card-in .34s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0ms)}
.ob-style-chip:hover{border-color:var(--ac);color:var(--ac)}
.ob-style-chip.ob-on{border-color:var(--ac);background:rgba(96,77,255,.08);color:var(--ac)}

/* ── In-form plan cards ── */
.ob-plan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ob-plan-card{position:relative;display:flex;flex-direction:column;text-align:left;padding:18px 16px;border-radius:16px;border:1.5px solid var(--g2);background:var(--bg);cursor:pointer;font-family:var(--sans);transition:border-color .2s,box-shadow .2s,transform .2s}
.ob-plan-card:hover{border-color:color-mix(in oklab,var(--ac) 55%,var(--g2));transform:translateY(-2px)}
.ob-plan-card.ob-on{border-color:var(--ac);background:rgba(96,77,255,.05);box-shadow:0 8px 24px rgba(96,77,255,.14)}
.ob-plan-badge{position:absolute;top:-10px;left:16px;background:var(--ac);color:#fff;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:3px 9px;border-radius:20px}
.ob-plan-name{font-size:15px;font-weight:700;color:var(--tx)}
.ob-plan-tagline{font-size:11.5px;color:var(--g4);line-height:1.4;margin-top:3px;min-height:30px}
.ob-plan-price{font-size:22px;font-weight:800;margin-top:8px;letter-spacing:-.02em}
.ob-plan-price span{font-size:12px;font-weight:600;color:var(--g4)}
.ob-plan-div{height:1px;background:var(--g2);margin:12px 0}
.ob-plan-feat{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:var(--g5);line-height:1.45;margin-bottom:6px}
.ob-plan-feat svg{flex-shrink:0;margin-top:2px}
.ob-plan-pick{margin-top:auto;padding-top:12px;font-size:12px;font-weight:700;color:var(--ac);display:flex;align-items:center;gap:6px}
.dark .ob-plan-card,.dark .ob-pick-card{background:var(--g1);border-color:var(--g3)}
.dark .ob-plan-card.ob-on,.dark .ob-pick-card.ob-on{background:rgba(122,102,255,.1);border-color:var(--ac)}
@media(max-width:680px){.ob-plan-grid{grid-template-columns:1fr}}

/* ── Completed Step Marker ── */
.ob-msg-done{display:flex;align-items:center;gap:8px;padding:6px 0;color:var(--green);font-size:13px;font-weight:500}
.ob-done-check{width:24px;height:24px;background:rgba(29,185,84,.12);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--green)}
.ob-done-label{color:var(--g4)}

/* ── Steps Panel (always-visible right rail) ── */
.ob-steps-panel{position:sticky;top:18px;z-index:2;width:320px;flex-shrink:0;align-self:flex-start;display:flex;flex-direction:column;margin:18px 18px 18px 4px;max-height:calc(100% - 36px);border-radius:22px;background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(48px) saturate(1.4);backdrop-filter:blur(48px) saturate(1.4);border:1px solid rgba(255,255,255,.65);box-shadow:0 18px 50px rgba(20,18,40,.12),0 3px 10px rgba(20,18,40,.05);overflow-y:auto;animation:ob-panel-in .5s cubic-bezier(.16,1,.3,1)}
@keyframes ob-panel-in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
.ob-sp-header{padding:24px 22px 16px;position:sticky;top:0;z-index:1;background:rgba(255,255,255,.45);-webkit-backdrop-filter:blur(40px) saturate(1.3);backdrop-filter:blur(40px) saturate(1.3);border-bottom:1px solid rgba(255,255,255,.45)}
.ob-sp-title{font-size:16px;font-weight:600;letter-spacing:-.01em}
.ob-sp-sub{font-size:12.5px;color:var(--g4);margin-top:3px}
.ob-sp-bar{margin-top:12px;height:5px;border-radius:3px;background:var(--g2);overflow:hidden}
.ob-sp-bar span{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--ac),#8B7AFF);transition:width .5s cubic-bezier(.16,1,.3,1)}
.ob-sp-list{display:flex;flex-direction:column;gap:6px;padding:14px 14px 24px}
.ob-sp-item{display:flex;align-items:center;gap:12px;padding:12px 12px;border-radius:13px;background:none;border:1px solid transparent;font-family:var(--sans);cursor:pointer;transition:background .16s,border-color .16s,transform .12s;text-align:left;width:100%;color:var(--tx)}
.ob-sp-item:not(:disabled):hover{background:color-mix(in oklab,var(--g1) 70%,transparent);border-color:color-mix(in oklab,var(--g2) 70%,transparent)}
.ob-sp-item:disabled{cursor:default;opacity:.62}
.ob-sp-current{background:color-mix(in oklab,var(--ac) 8%,transparent)!important;border-color:color-mix(in oklab,var(--ac) 35%,transparent)!important}
.ob-sp-ic{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:var(--g1);color:var(--g5)}
.ob-sp-completed .ob-sp-ic,.ob-sp-verified .ob-sp-ic{background:color-mix(in oklab,var(--green) 16%,transparent);color:var(--green)}
.ob-sp-attention .ob-sp-ic{background:color-mix(in oklab,#E8973A 18%,transparent);color:#E8973A}
.ob-sp-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.ob-sp-name{font-size:14px;font-weight:600;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ob-sp-status{font-size:12px;font-weight:600;letter-spacing:.01em}
.ob-sp-st-completed,.ob-sp-st-verified{color:var(--green)}
.ob-sp-st-attention{color:#E8973A}
.ob-sp-st-skipped{color:var(--g4)}
.ob-sp-st-pending{color:var(--g3)}
.ob-sp-chev{color:var(--g3);flex-shrink:0;display:flex;align-items:center}
.ob-sp-current .ob-sp-chev{color:var(--ac)}

/* ── Learning Section ── */
.ob-learning,.ob-learning-done{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;gap:16px;overflow:hidden}
.ob-learning .ob-msg,.ob-learning-done .ob-msg{position:relative;z-index:1;max-width:640px;width:100%}

/* ── Learning Video Card ── */
.ob-msg-video{padding-left:44px;width:100%;max-width:640px}
.ob-video-card{width:100%;max-width:520px;background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(48px) saturate(1.4);backdrop-filter:blur(48px) saturate(1.4);border:1px solid rgba(255,255,255,.65);border-radius:20px;padding:14px;animation:ob-form-expand .35s cubic-bezier(.16,1,.3,1);box-shadow:0 10px 40px rgba(122,102,255,.08)}
.ob-video-frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:14px;background:linear-gradient(135deg,rgba(96,77,255,.14),rgba(139,122,255,.06))}
.ob-video-el{width:100%;height:100%;object-fit:cover;display:block}
.ob-video-placeholder{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center}
.ob-video-play{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--ac),#604DFF);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(96,77,255,.4);padding-left:4px;animation:ob-pulse 2.4s ease-in-out infinite}
@keyframes ob-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.ob-video-ph-label{font-size:15px;font-weight:600;color:var(--tx)}
.ob-video-ph-sub{font-size:12px;color:var(--g4);text-transform:uppercase;letter-spacing:.06em}

/* ── Confetti ── */
.ob-confetti{position:fixed;inset:0;z-index:400;pointer-events:none}
.ob-confetti-piece{position:absolute;top:42%;left:50%;opacity:0;animation-name:ob-confetti-burst;animation-timing-function:cubic-bezier(.2,.7,.3,1);animation-fill-mode:forwards}
@keyframes ob-confetti-burst{0%{transform:translate(-50%,-50%) rotate(0) scale(.6);opacity:0}12%{opacity:1}100%{transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) rotate(var(--r)) scale(1);opacity:0}}
@media(prefers-reduced-motion:reduce){.ob-confetti{display:none}}

/* ── Demo Trigger Button ── */
.ob-demo-trigger{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:100;display:inline-flex;align-items:center;gap:8px;padding:8px 20px;background:linear-gradient(135deg,var(--ac),#604DFF);color:#fff;border:none;border-radius:20px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 2px 12px rgba(96,77,255,.25);transition:all .2s;letter-spacing:.01em}
.ob-demo-trigger:hover{transform:translateX(-50%) translateY(-1px);box-shadow:0 4px 20px rgba(96,77,255,.35)}

/* ── Dark Mode Overrides ── */
.dark .ob-root{background:var(--bg)}
.dark .ob-msg-bubble{background:color-mix(in oklab,var(--sf) 80%,transparent);border-color:var(--g2)}
.dark .ob-form-card{background:color-mix(in oklab,var(--sf) 82%,transparent);border-color:var(--g2)}
.dark .ob-video-card{background:color-mix(in oklab,var(--sf) 82%,transparent);border-color:var(--g2)}
.dark .ob-purpose-card{background:color-mix(in oklab,var(--sf) 80%,transparent)}
.dark .ob-form-card .ob-field input,.dark .ob-form-card .ob-field select,.dark .ob-form-card .ob-field textarea{background:var(--g1);border-color:var(--g3);color:var(--tx)}
.dark .ob-form-card .ob-field input:focus,.dark .ob-form-card .ob-field select:focus,.dark .ob-form-card .ob-field textarea:focus{background:var(--sf);border-color:var(--ac)}
.dark .ob-purpose-card{background:var(--sf);border-color:var(--g2)}
.dark .ob-purpose-card:hover{border-color:var(--ac)}
.dark .ob-purpose-card.ob-selected{background:rgba(122,102,255,.1);border-color:var(--ac)}
.dark .ob-action-secondary{background:var(--sf);border-color:var(--g3);color:var(--g5)}
.dark .ob-nav-popup{background:color-mix(in oklab,var(--sf) 82%,transparent);border-color:var(--g2)}
.dark .ob-steps-panel{background:color-mix(in oklab,var(--sf) 72%,transparent);border-color:var(--g2)}
.dark .ob-sp-header{background:color-mix(in oklab,var(--sf) 78%,transparent);border-color:var(--g2)}
.dark .ob-sp-ic{background:var(--g1)}
.dark .ob-msg-avatar{background:#fff}
.dark .ob-done-check{background:rgba(46,204,113,.12)}

/* ── Responsive ── */
@media(max-width:980px){
  .ob-steps-panel{width:288px}
}
@media(max-width:768px){
  .ob-welcome-line{font-size:clamp(22px,6vw,36px)}
  .ob-purpose-header{font-size:clamp(20px,5vw,32px)}
  .ob-conversation-layout{flex-direction:column;padding-left:0}
  .ob-sidebar{display:none}
  .ob-conversation-main{order:2;flex:1}
  .ob-conversation-area{padding:20px 12px 80px}
  .ob-form-card{padding:16px}
  .ob-msg-bubble{max-width:90%}
  .ob-steps-panel{order:1;width:auto;flex-direction:column;max-height:34vh;margin:12px 12px 0;border-radius:18px}
  .ob-sp-list{flex-direction:row;overflow-x:auto;padding:12px;gap:8px}
  .ob-sp-item{flex-direction:column;align-items:flex-start;min-width:150px;width:auto}
  .ob-sp-chev{display:none}
}
`;
