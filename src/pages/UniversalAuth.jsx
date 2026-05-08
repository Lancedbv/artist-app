import { useState } from "react";

const TYPES = [
  {
    id: "artist",
    label: "Artist",
    desc: "Dancers, performers & choreographers",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/>
        <path d="M6.5 21 9 12l-3.5 2"/>
        <path d="M17.5 21 15 12l3.5 2"/>
        <path d="M12 12v4"/>
        <path d="M9 16l3 5 3-5"/>
      </svg>
    ),
  },
  {
    id: "agency",
    label: "Agency",
    desc: "Talent agencies & management",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "company",
    label: "Company",
    desc: "Ballet, dance & theater companies",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <path d="M12 12v.01"/>
        <path d="M2 12h20"/>
      </svg>
    ),
  },
];

function BrushBackground() {
  return (
    <div className="brush-field" style={{ "--brush-intensity": 0.7 }}>
      <div className="brush a" />
      <div className="brush b" />
      <div className="brush c" />
      <div className="brush d" />
      <div className="brush e" />
      <div className="brush f" />
      <div className="brush-grain" />
    </div>
  );
}

export default function UniversalAuth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("type");
  const [selectedType, setSelectedType] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");

  const [animatingOut, setAnimatingOut] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(false);

  function transitionTo(newMode, newStep) {
    setAnimatingOut(true);
    setTimeout(() => {
      setMode(newMode);
      setStep(newStep);
      setAnimatingOut(false);
      setAnimatingIn(true);
      setTimeout(() => setAnimatingIn(false), 300);
    }, 200);
  }

  function handleSelectType(typeId) {
    setSelectedType(typeId);
    transitionTo("signup", "form");
  }

  function handleLogin() {
    onAuth({ mode: "login", email, password });
  }

  function handleSignup() {
    onAuth({ mode: "signup", email, password, firstName, lastName, type: selectedType, orgName, companyType, role, city, website });
  }

  function goToSignup() {
    transitionTo("signup", "type");
  }

  function goToLogin() {
    transitionTo("login", "form");
  }

  const orgLabels = { agency: "Agency name", company: "Company name" };
  const subLabels = {
    artist: "Join the performing arts network",
    agency: "Set up your agency on Lanced",
    company: "Set up your company on Lanced",
  };

  const cardClass = `ua-card${animatingOut ? " ua-card-out" : ""}${animatingIn ? " ua-card-in" : ""}`;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ua-page">
        <BrushBackground />

        <div className={cardClass}>
          <div className="ua-logo">
            <a href="https://lanced.eu" target="_blank" rel="noreferrer">
              <img src="/lanced-logo.svg" alt="Lanced" />
            </a>
          </div>

          {mode === "login" && (
            <>
              <h1>Welcome back</h1>
              <p className="ua-sub">Sign in to your dashboard</p>
              <div className="ua-fields">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button className="ua-btn-primary" onClick={handleLogin}>
                  Sign In
                </button>
              </div>
              <p className="ua-switch">
                Don't have an account?{" "}
                <a onClick={goToSignup}>Create one</a>
              </p>
            </>
          )}

          {mode === "signup" && step === "type" && (
            <>
              <h1>Get started</h1>
              <p className="ua-sub">Choose how you'll use Lanced</p>
              <div className="ua-types">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    className={`ua-type-card${selectedType === t.id ? " selected" : ""}`}
                    onClick={() => handleSelectType(t.id)}
                  >
                    <div className="ua-type-icon">{t.icon}</div>
                    <div className="ua-type-info">
                      <div className="ua-type-label">{t.label}</div>
                      <div className="ua-type-desc">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="ua-switch">
                Already have an account?{" "}
                <a onClick={goToLogin}>Sign in</a>
              </p>
            </>
          )}

          {mode === "signup" && step === "form" && (
            <>
              <h1>Create your account</h1>
              <p className="ua-sub">{subLabels[selectedType] || "Join Lanced"}</p>

              <button className="ua-type-badge" onClick={() => transitionTo("signup", "type")}>
                <span className="ua-type-badge-icon">
                  {TYPES.find((t) => t.id === selectedType)?.icon}
                </span>
                <span>{TYPES.find((t) => t.id === selectedType)?.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>

              <div className="ua-fields">
                <div className="ua-row">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {(selectedType === "company" || selectedType === "agency") && (
                  <>
                    <input
                      type="text"
                      placeholder={orgLabels[selectedType]}
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                    <div className="ua-select-wrap">
                      <select
                        value={companyType}
                        onChange={(e) => setCompanyType(e.target.value)}
                      >
                        <option value="" disabled>
                          {selectedType === "company" ? "Company type" : "Agency type"}
                        </option>
                        {selectedType === "company" ? (
                          <>
                            <option value="dance_company">Dance Company</option>
                            <option value="theater">Theater</option>
                            <option value="opera">Opera</option>
                            <option value="freelance_company">Freelance Company</option>
                            <option value="school">School</option>
                            <option value="academy">Academy</option>
                          </>
                        ) : (
                          <>
                            <option value="talent_agency">Talent Agency</option>
                            <option value="management">Management</option>
                            <option value="booking_agency">Booking Agency</option>
                            <option value="casting_agency">Casting Agency</option>
                          </>
                        )}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Your role / job title"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <div className="ua-row">
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <input
                        type="url"
                        placeholder="Website (optional)"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
                <button className="ua-btn-primary" onClick={handleSignup}>
                  Create Account
                </button>
              </div>
              <p className="ua-switch">
                Already have an account?{" "}
                <a onClick={goToLogin}>Sign in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap');

/* ── Brand color ── */
:root { --violet: #604dff; }

/* ============ Brush-stroke gradient backdrop ============ */
.ua-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Manrope', system-ui, sans-serif;
  background: #f8f7fb;
}

.brush-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  --brush-intensity: 0.7;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 60%, transparent 100%);
          mask-image: radial-gradient(ellipse at center, #000 60%, transparent 100%);
}

.brush {
  position: absolute;
  top: 50%;
  left: 50%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  opacity: 0;
  will-change: transform, opacity;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  filter: blur(40px) saturate(1.5) contrast(1.15);
  mix-blend-mode: multiply;
}

.brush.a {
  background-image: radial-gradient(
    ellipse 60% 45% at 50% 50%,
    color-mix(in oklab, var(--violet) 95%, transparent) 0%,
    color-mix(in oklab, var(--violet) 70%, transparent) 35%,
    color-mix(in oklab, var(--violet) 25%, transparent) 65%,
    transparent 80%
  );
}
.brush.b {
  background-image: radial-gradient(
    ellipse 70% 40% at 45% 55%,
    color-mix(in oklab, var(--violet) 90%, transparent) 0%,
    color-mix(in oklab, var(--violet) 60%, transparent) 40%,
    color-mix(in oklab, var(--violet) 20%, transparent) 70%,
    transparent 82%
  );
}
.brush.c {
  background-image: radial-gradient(
    ellipse 55% 50% at 55% 45%,
    color-mix(in oklab, var(--violet) 95%, transparent) 0%,
    color-mix(in oklab, var(--violet) 65%, transparent) 38%,
    color-mix(in oklab, var(--violet) 25%, transparent) 68%,
    transparent 80%
  );
}
.brush.d {
  background-image: radial-gradient(
    ellipse 65% 35% at 50% 50%,
    color-mix(in oklab, var(--violet) 85%, transparent) 0%,
    color-mix(in oklab, var(--violet) 55%, transparent) 42%,
    color-mix(in oklab, var(--violet) 20%, transparent) 72%,
    transparent 85%
  );
}
.brush.e {
  background-image: radial-gradient(ellipse 60% 60% at 50% 50%,
    color-mix(in oklab, var(--violet) 80%, transparent) 0%,
    color-mix(in oklab, var(--violet) 40%, transparent) 45%,
    transparent 78%);
}
.brush.f {
  background-image: radial-gradient(ellipse 65% 55% at 50% 50%,
    color-mix(in oklab, var(--violet) 75%, transparent) 0%,
    color-mix(in oklab, var(--violet) 35%, transparent) 50%,
    transparent 80%);
}

.brush-grain {
  position: absolute;
  inset: -10%;
  pointer-events: none;
  opacity: 0.28;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

@keyframes sweep-a {
  0%   { transform: translate3d(-90%, -40%, 0) rotate(-8deg) scale(1.05); opacity: 0; }
  15%  { opacity: calc(0.85 * var(--brush-intensity)); }
  50%  { transform: translate3d(0%, -10%, 0) rotate(4deg) scale(1.25); opacity: calc(1 * var(--brush-intensity)); }
  85%  { opacity: calc(0.7 * var(--brush-intensity)); }
  100% { transform: translate3d(90%, 20%, 0) rotate(12deg) scale(1.1); opacity: 0; }
}
@keyframes sweep-b {
  0%   { transform: translate3d(80%, 30%, 0) rotate(8deg) scale(1.1); opacity: 0; }
  20%  { opacity: calc(0.8 * var(--brush-intensity)); }
  50%  { transform: translate3d(-10%, 10%, 0) rotate(-6deg) scale(1.3); opacity: calc(1 * var(--brush-intensity)); }
  80%  { opacity: calc(0.75 * var(--brush-intensity)); }
  100% { transform: translate3d(-100%, 40%, 0) rotate(-14deg) scale(1.15); opacity: 0; }
}
@keyframes sweep-c {
  0%   { transform: translate3d(-80%, 50%, 0) rotate(-4deg) scale(0.95); opacity: 0; }
  18%  { opacity: calc(0.85 * var(--brush-intensity)); }
  50%  { transform: translate3d(20%, 30%, 0) rotate(6deg) scale(1.2); opacity: calc(0.95 * var(--brush-intensity)); }
  82%  { opacity: calc(0.75 * var(--brush-intensity)); }
  100% { transform: translate3d(100%, 60%, 0) rotate(14deg) scale(1.05); opacity: 0; }
}
@keyframes sweep-d {
  0%   { transform: translate3d(80%, -50%, 0) rotate(10deg) scale(1.0); opacity: 0; }
  20%  { opacity: calc(0.75 * var(--brush-intensity)); }
  50%  { transform: translate3d(0%, 0%, 0) rotate(-8deg) scale(1.25); opacity: calc(0.9 * var(--brush-intensity)); }
  80%  { opacity: calc(0.7 * var(--brush-intensity)); }
  100% { transform: translate3d(-90%, 30%, 0) rotate(-18deg) scale(1.1); opacity: 0; }
}
@keyframes sweep-e {
  0%   { transform: translate3d(-70%, -70%, 0) rotate(15deg) scale(0.9); opacity: 0; }
  20%  { opacity: calc(0.7 * var(--brush-intensity)); }
  50%  { transform: translate3d(30%, -50%, 0) rotate(-10deg) scale(1.15); opacity: calc(0.85 * var(--brush-intensity)); }
  80%  { opacity: calc(0.65 * var(--brush-intensity)); }
  100% { transform: translate3d(110%, -30%, 0) rotate(-22deg) scale(1.0); opacity: 0; }
}
@keyframes sweep-f {
  0%   { transform: translate3d(60%, 70%, 0) rotate(-12deg) scale(1.0); opacity: 0; }
  22%  { opacity: calc(0.7 * var(--brush-intensity)); }
  50%  { transform: translate3d(-20%, 50%, 0) rotate(8deg) scale(1.2); opacity: calc(0.9 * var(--brush-intensity)); }
  80%  { opacity: calc(0.6 * var(--brush-intensity)); }
  100% { transform: translate3d(-100%, 30%, 0) rotate(20deg) scale(1.05); opacity: 0; }
}

.brush.a { width: 80%; aspect-ratio: 16/9; animation: sweep-a 32s linear infinite; }
.brush.b { width: 70%; aspect-ratio: 5/3;  animation: sweep-b 44s linear infinite; animation-delay: -10s; }
.brush.c { width: 90%; aspect-ratio: 16/9; animation: sweep-c 38s linear infinite; animation-delay: -22s; }
.brush.d { width: 65%; aspect-ratio: 4/3;  animation: sweep-d 50s linear infinite; animation-delay: -16s; }
.brush.e { width: 55%; aspect-ratio: 1/1;  animation: sweep-e 56s linear infinite; animation-delay: -28s; }
.brush.f { width: 60%; aspect-ratio: 6/5;  animation: sweep-f 48s linear infinite; animation-delay: -8s; }

@media (prefers-reduced-motion: reduce) {
  .brush { animation: none !important; opacity: 0.6 !important; transform: translate3d(-50%, -50%, 0) !important; }
}

/* ── Card ── */
.ua-card {
  width: 440px;
  max-width: calc(100vw - 32px);
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(48px);
  -webkit-backdrop-filter: blur(48px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 28px;
  padding: 48px 40px;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow:
    0 8px 40px rgba(122, 102, 255, 0.07),
    0 1px 6px rgba(0, 0, 0, 0.03);
  animation: uaScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.ua-card-out {
  animation: uaFadeOut 0.2s ease forwards;
}
.ua-card-in {
  animation: uaFadeIn 0.3s ease forwards;
}

@keyframes uaScaleIn {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes uaFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-6px); }
}
@keyframes uaFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Logo ── */
.ua-logo {
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
}
.ua-logo a {
  display: inline-block;
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.2s;
}
.ua-logo a:hover { transform: scale(1.05); }
.ua-logo img {
  height: 72px;
  width: auto;
  display: block;
  border-radius: 18px;
}

/* ── Typography ── */
.ua-card h1 {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 26px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 6px;
  line-height: 1.2;
}
.ua-sub {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.38);
  margin-bottom: 28px;
  line-height: 1.5;
}

/* ── Fields wrapper ── */
.ua-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

/* ── Inline row (first/last name, city/website) ── */
.ua-row {
  display: flex;
  gap: 10px;
}
.ua-row > input {
  flex: 1;
  min-width: 0;
}

/* ── Inputs ── */
.ua-card input,
.ua-card select {
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(255, 255, 255, 0.55);
  color: #1a1a2e;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 14px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.ua-card input::placeholder { color: rgba(0, 0, 0, 0.22); }
.ua-card input:focus,
.ua-card select:focus {
  border-color: #7A66FF;
  box-shadow: 0 0 0 3px rgba(122, 102, 255, 0.08);
}

/* ── Select ── */
.ua-select-wrap {
  position: relative;
}
.ua-select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  padding-right: 40px;
}
.ua-select-wrap select:invalid,
.ua-select-wrap select option[value=""][disabled] {
  color: rgba(0, 0, 0, 0.22);
}
.ua-select-wrap select option {
  color: #1a1a2e;
}
.ua-select-wrap::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

/* ── Primary Button ── */
.ua-btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #7A66FF, #4A35E0);
  color: #fff;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(96, 77, 255, 0.22);
}
.ua-btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(96, 77, 255, 0.28);
}
.ua-btn-primary:active { transform: translateY(0); }

/* ── Switch Link ── */
.ua-switch {
  margin-top: 22px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.3);
}
.ua-switch a {
  color: #7A66FF;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
}
.ua-switch a:hover { text-decoration: underline; }

/* ── Type Selector Cards ── */
.ua-types {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
}

.ua-type-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-family: 'Manrope', system-ui, sans-serif;
}
.ua-type-card:hover {
  border-color: rgba(122, 102, 255, 0.25);
  background: rgba(122, 102, 255, 0.04);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(122, 102, 255, 0.08);
}
.ua-type-card.selected {
  border-color: #7A66FF;
  background: rgba(122, 102, 255, 0.06);
  box-shadow: 0 4px 16px rgba(122, 102, 255, 0.12);
}

.ua-type-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(122, 102, 255, 0.08);
  color: #7A66FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ua-type-card:hover .ua-type-icon,
.ua-type-card.selected .ua-type-icon {
  background: rgba(122, 102, 255, 0.14);
}

.ua-type-info {
  flex: 1;
  min-width: 0;
}
.ua-type-label {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.2;
}
.ua-type-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  line-height: 1.3;
  margin-top: 2px;
}

/* ── Type Badge (on form step) ── */
.ua-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(122, 102, 255, 0.15);
  background: rgba(122, 102, 255, 0.05);
  color: #7A66FF;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s;
}
.ua-type-badge:hover {
  background: rgba(122, 102, 255, 0.1);
}
.ua-type-badge-icon {
  display: flex;
  align-items: center;
}
.ua-type-badge-icon svg {
  width: 18px;
  height: 18px;
}
.ua-type-badge > svg {
  opacity: 0.5;
  margin-left: 2px;
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .ua-card {
    padding: 36px 24px;
    border-radius: 24px;
  }
  .ua-logo img { height: 60px; }
  .ua-card h1 { font-size: 24px; }
  .ua-type-card { padding: 14px 16px; gap: 12px; }
  .ua-type-icon { width: 42px; height: 42px; border-radius: 12px; }
}
`;
