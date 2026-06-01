import { useState } from "react";

/* ━━━ STEP FORM COMPONENTS ━━━ */

function PersonalInfoForm({ data, onChange, errors }) {
  return (
    <>
      <div className="ob-field">
        <label>Profile Photo</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: data.photo ? `url(${data.photo}) center/cover` : "var(--g1)",
            border: "2px dashed var(--g3)", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--g4)", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
          }}>
            {!data.photo && "Upload"}
          </div>
          <div style={{ fontSize: 13, color: "var(--g4)", lineHeight: 1.5 }}>
            A great headshot helps you stand out.<br />PNG or JPG. Max 2MB.
          </div>
        </div>
      </div>
      <div className="ob-field">
        <label>Bio *</label>
        <textarea
          value={data.bio || ""}
          onChange={e => onChange("bio", e.target.value)}
          placeholder="Tell us about yourself — your experience, style, and what you're looking for."
          rows={3}
          style={{ resize: "vertical", fontFamily: "var(--sans)" }}
          className={errors.bio ? "ob-error" : ""}
        />
        {errors.bio && <div className="ob-field-error">{errors.bio}</div>}
      </div>
      <div className="ob-field">
        <label>Pronouns</label>
        <select value={data.pronouns || ""} onChange={e => onChange("pronouns", e.target.value)}>
          <option value="">Prefer not to say</option>
          <option value="he/him">He/Him</option>
          <option value="she/her">She/Her</option>
          <option value="they/them">They/Them</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="ob-field">
        <label>Location</label>
        <input value={data.location || ""} onChange={e => onChange("location", e.target.value)} placeholder="e.g. Amsterdam, Netherlands" />
      </div>
    </>
  );
}

/* ── Artist types → styles (interactive, purpose-style click-through) ── */
const ARTIST_TYPES = [
  { id: "actor", label: "Actor", icon: "🎭" },
  { id: "dancer", label: "Dancer", icon: "💃" },
  { id: "singer", label: "Singer", icon: "🎤" },
  { id: "musician", label: "Musician", icon: "🎸" },
  { id: "model", label: "Model", icon: "📸" },
  { id: "choreographer", label: "Choreographer", icon: "🩰" },
  { id: "voice", label: "Voice Artist", icon: "🎙️" },
  { id: "presenter", label: "Presenter", icon: "🎬" },
];

const STYLES_BY_TYPE = {
  actor: ["Film", "Television", "Theatre", "Musical Theatre", "Commercial", "Voice-over", "Improv"],
  dancer: ["Contemporary", "Ballet", "Jazz", "Hip-hop", "Tap", "Ballroom", "Latin", "Breaking", "Modern", "Commercial", "Pointe"],
  singer: ["Pop", "Classical", "Jazz", "Musical Theatre", "R&B", "Opera", "Rock", "Folk"],
  musician: ["Guitar", "Piano", "Drums", "Bass", "Strings", "Brass", "Vocals", "Electronic"],
  model: ["Fashion", "Editorial", "Commercial", "Runway", "Fitness", "Beauty"],
  choreographer: ["Contemporary", "Commercial", "Hip-hop", "Ballet", "Musical Theatre", "Jazz"],
  voice: ["Commercials", "Animation", "Audiobooks", "Narration", "Gaming"],
  presenter: ["Live Events", "TV", "Corporate", "Online / Streaming"],
};

function ProfessionalInfoForm({ data, onChange, errors }) {
  const types = data.artistTypes || [];
  const stylesByType = data.styles || {};

  const toggleType = (id) => {
    if (types.includes(id)) {
      onChange("artistTypes", types.filter(t => t !== id));
      const next = { ...stylesByType }; delete next[id];
      onChange("styles", next);
    } else {
      onChange("artistTypes", [...types, id]);
    }
  };

  const toggleStyle = (typeId, style) => {
    const cur = stylesByType[typeId] || [];
    const next = cur.includes(style) ? cur.filter(s => s !== style) : [...cur, style];
    onChange("styles", { ...stylesByType, [typeId]: next });
  };

  return (
    <>
      <div className="ob-field">
        <label>What kind of artist are you? *</label>
        <div className="ob-pick-grid">
          {ARTIST_TYPES.map((t, i) => (
            <button key={t.id} type="button" onClick={() => toggleType(t.id)}
              className={`ob-pick-card${types.includes(t.id) ? " ob-on" : ""}`} style={{ "--d": `${i * 45}ms` }}>
              <span className="ob-pick-ic">{t.icon}</span>
              {t.label}
              {types.includes(t.id) && <span className="ob-pick-chk">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>}
            </button>
          ))}
        </div>
        {errors.artistTypes && <div className="ob-field-error" style={{ marginTop: 8 }}>{errors.artistTypes}</div>}
      </div>

      {types.map(typeId => {
        const t = ARTIST_TYPES.find(x => x.id === typeId);
        const opts = STYLES_BY_TYPE[typeId] || [];
        const sel = stylesByType[typeId] || [];
        return (
          <div key={typeId} className="ob-field ob-styles-reveal">
            <label>{t.icon} {t.label} — styles</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {opts.map((s, i) => (
                <button key={s} type="button" onClick={() => toggleStyle(typeId, s)}
                  className={`ob-style-chip${sel.includes(s) ? " ob-on" : ""}`} style={{ "--d": `${i * 28}ms` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="ob-field">
        <label>Union Status</label>
        <select value={data.unionStatus || ""} onChange={e => onChange("unionStatus", e.target.value)}>
          <option value="">Select...</option>
          <option value="union">Union member</option>
          <option value="non-union">Non-union</option>
          <option value="fi-core">Financial Core</option>
        </select>
      </div>
    </>
  );
}

function ShowreelForm({ data, onChange }) {
  return (
    <>
      <div className="ob-field">
        <label>Showreel link</label>
        <input value={data.reelUrl || ""} onChange={e => onChange("reelUrl", e.target.value)} placeholder="https://youtube.com/watch?v=…  or  vimeo.com/…" />
        <div style={{ fontSize: 12.5, color: "var(--g4)", marginTop: 6, lineHeight: 1.5 }}>
          A 60–90 second reel of your best work. YouTube or Vimeo both work great — this is the first thing casting directors watch.
        </div>
      </div>
    </>
  );
}

const PLANS = [
  {
    id: "free", name: "Free", price: "€0", color: "var(--g5)", tagline: "Find your next opportunity",
    features: ["Discover & apply to all calls", "Profile & resume", "Unlimited media library", "Network & inbox"],
  },
  {
    id: "pro", name: "Pro", price: "€4.99", color: "var(--ac)", recommended: true, tagline: "Manage your audition season — on & off Lanced",
    features: ["Everything in Free", "1 Work & 1 Portfolio", "Application tracking", "External applications", "Deadline planner & reminders", "Who viewed your profile", "Full Academy access"],
  },
  {
    id: "studio", name: "Studio", price: "€14.99", color: "#7c3aed", tagline: "Build your artistic presence",
    features: ["Everything in Pro", "5 Works & 5 Portfolios", "Your own artist website", "All themes & customization", "Press kits & analytics", "Password protection"],
  },
];

function PlanBillingForm({ data, onChange, errors }) {
  return (
    <>
      <div className="ob-field">
        <label>Choose your plan *</label>
        <div className="ob-plan-grid">
          {PLANS.map(plan => {
            const on = data.plan === plan.id;
            return (
              <button key={plan.id} type="button" onClick={() => onChange("plan", plan.id)}
                className={`ob-plan-card${on ? " ob-on" : ""}`}
                style={{ borderColor: on ? plan.color : plan.recommended ? "var(--ac)" : undefined }}>
                {plan.recommended && <div className="ob-plan-badge">Recommended</div>}
                <div className="ob-plan-name">{plan.name}</div>
                <div className="ob-plan-tagline">{plan.tagline}</div>
                <div className="ob-plan-price" style={{ color: plan.color }}>{plan.price}{plan.price !== "€0" && <span>/mo</span>}</div>
                <div className="ob-plan-div" />
                <div>
                  {plan.features.map((f, i) => (
                    <div key={i} className="ob-plan-feat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.color === "var(--g5)" ? "var(--g4)" : plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="ob-plan-pick">
                  {on ? <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Selected
                  </> : "Choose"}
                </div>
              </button>
            );
          })}
        </div>
        {errors.plan && <div className="ob-field-error" style={{ marginTop: 8 }}>{errors.plan}</div>}
        <div style={{ fontSize: 11.5, color: "var(--g4)", marginTop: 10, textAlign: "center" }}>
          Applying to opportunities on Lanced is always free. Cancel or switch anytime.
        </div>
      </div>
      {data.plan && data.plan !== "free" && (
        <div className="ob-field">
          <label>Billing Email</label>
          <input value={data.billingEmail || ""} onChange={e => onChange("billingEmail", e.target.value)} placeholder="your@email.com" />
        </div>
      )}
    </>
  );
}

/* ━━━ CONFIG ━━━ */
export const ONBOARDING_CONFIG = {
  appId: "artist",
  appName: "Lanced Artist",
  sidebarLabel: "Artist App",

  navItems: [
    { icon: "home", label: "Dashboard" },
    { icon: "users", label: "Profile" },
    { icon: "image", label: "Media Library" },
    { icon: "inbox", label: "Applications" },
    { icon: "card", label: "Plan" },
    { icon: "mail", label: "Inbox" },
    { type: "divider" },
    { icon: "globe", label: "Discover" },
    { icon: "chart", label: "Network" },
    { icon: "star", label: "Academy" },
    { type: "divider" },
    { icon: "sparkle", label: "Studio" },
  ],

  welcome: {
    newUser: {
      lines: [
        { text: "Welcome, {firstName},", type: "hero", delay: 0 },
        { text: "to Lanced.", type: "brand", delay: 900 },
        { text: "Where your talent finds its stage.", type: "tagline", delay: 1900 },
      ],
      cta: "Let's go",
    },
    existingUser: {
      lines: [
        { text: "Welcome back, {firstName},", type: "hero", delay: 0 },
        { text: "to the new Lanced.", type: "brand", delay: 900 },
        { text: "A lot has changed. Let us show you around.", type: "tagline", delay: 1900 },
      ],
      cta: "Show me what's new",
    },
  },

  purposes: [
    { id: "finding-work", label: "Finding work", icon: "briefcase" },
    { id: "applications", label: "Managing my applications", icon: "inbox" },
    { id: "showcasing", label: "Showcasing my work", icon: "image" },
    { id: "portfolios", label: "Creating portfolios", icon: "folder" },
    { id: "website", label: "Launching a website", icon: "globe" },
    { id: "other", label: "Something else", icon: "sparkle" },
  ],

  dataSteps: [
    {
      id: "personal-info",
      title: "Personal Info",
      intro: "Great choices! Let's build your profile.",
      prompt: "First, tell us a bit about yourself.",
      cta: "Let's do it",
      skippable: false,
      component: PersonalInfoForm,
      validate: (data) => {
        const errors = {};
        if (!data.bio?.trim()) errors.bio = "A short bio helps you stand out";
        return { valid: Object.keys(errors).length === 0, errors };
      },
      mapFromProfile: (profile) => ({
        photo: profile.photo, bio: profile.bio, pronouns: profile.pronouns, location: profile.location,
      }),
      successMessage: "Nice! Your profile is looking great already.",
    },
    {
      id: "professional-info",
      title: "Your Craft",
      prompt: "What kind of artist are you? Pick all that fit — then choose your styles.",
      cta: "Let's go",
      skippable: false,
      component: ProfessionalInfoForm,
      validate: (data) => {
        const errors = {};
        if (!data.artistTypes?.length) errors.artistTypes = "Pick at least one — this is how we match you to work";
        return { valid: Object.keys(errors).length === 0, errors };
      },
      mapFromProfile: (profile) => ({
        artistTypes: profile.artistTypes, styles: profile.styles, unionStatus: profile.unionStatus,
      }),
      successMessage: "Perfect. We'll use this to surface the right opportunities for you.",
    },
    {
      id: "showreel",
      title: "Showreel",
      prompt: "Now the fun part — add your showreel so people can see you in motion.",
      cta: "Add showreel",
      skipLabel: "I'll add it later",
      skippable: true,
      component: ShowreelForm,
      validate: () => ({ valid: true, errors: {} }),
      mapFromProfile: (profile) => ({ reelUrl: profile.reelUrl }),
      successMessage: "Looking good! Your reel is the first thing they'll watch.",
    },
    {
      id: "plan-billing",
      title: "Plan & Billing",
      prompt: "Last step — pick the plan that fits where you're headed.",
      cta: "Choose a plan",
      skippable: false,
      defaults: { plan: "pro" },
      component: PlanBillingForm,
      validate: (data) => {
        const errors = {};
        if (!data.plan) errors.plan = "Please select a plan";
        return { valid: Object.keys(errors).length === 0, errors };
      },
      mapFromProfile: () => ({ plan: "pro" }),
      successMessage: "Great choice. You're all set!",
    },
  ],

  learningSteps: [
    {
      id: "explore-opportunities",
      purposes: ["finding-work"],
      prompt: "Ready to find work? Here's how to browse and apply to opportunities on Lanced.",
      cta: "Show me how",
      skipLabel: "I'll explore on my own",
    },
    {
      id: "track-applications",
      purposes: ["applications"],
      prompt: "Keep track of every application — see status updates, messages, and callbacks all in one place.",
      cta: "See how it works",
      skipLabel: "Maybe later",
    },
    {
      id: "build-media-library",
      purposes: ["showcasing"],
      prompt: "Your media library is where all your photos, videos, and documents live — organized and ready to share.",
      cta: "Start building",
      skipLabel: "I'll do this later",
    },
    {
      id: "setup-portfolio",
      purposes: ["portfolios"],
      prompt: "Portfolios let you group your best work into collections — perfect for auditions and submissions.",
      cta: "Create a portfolio",
      skipLabel: "Skip for now",
    },
    {
      id: "launch-website",
      purposes: ["website"],
      prompt: "Your Lanced website is your personal stage — a clean, professional site that's always up to date.",
      cta: "Set up my website",
      skipLabel: "I'll check it out later",
    },
  ],

  whatsNew: {
    videoSrc: null,
    features: [
      { title: "Portfolios", description: "Create beautiful portfolio collections.", targetSelector: "[data-tour='portfolio']" },
      { title: "Applications", description: "Track and manage all your applications.", targetSelector: "[data-tour='applications']" },
      { title: "Website", description: "Launch your personal artist website.", targetSelector: "[data-tour='website']" },
    ],
  },
};
