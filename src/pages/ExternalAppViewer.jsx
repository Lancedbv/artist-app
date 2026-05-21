import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const MOCK_MEDIA = {
  m1: { id: "m1", title: "Showreel 2026", type: "video", format: "MOV", duration: "3:24", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg" },
  m2: { id: "m2", title: "Headshot — Studio", type: "photo", format: "JPG", thumb: "/demo/artists/nisha-huizing.jpg" },
  m3: { id: "m3", title: "Full Body — Movement", type: "photo", format: "JPG", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221378.jpg" },
  m4: { id: "m4", title: "Resume 2026", type: "doc", format: "PDF", thumb: null },
  m5: { id: "m5", title: "Ballet Variation", type: "video", format: "MP4", duration: "2:15", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg" },
  m6: { id: "m6", title: "Contemporary Solo", type: "video", format: "MP4", duration: "3:40", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221579.jpg" },
};

const MOCK_DATA = {
  "royal-ballet-flan-lx5j2n": {
    companyName: "Royal Ballet of Flanders",
    role: "Guest Dancer — Spring 2027",
    motivation: "Dear Artistic Team,\n\nI am deeply passionate about classical ballet and have long admired the Royal Ballet of Flanders' unique approach to blending tradition with contemporary innovation. My training at the Royal Ballet School in London and subsequent experience with Akram Khan Company has given me a versatile foundation that I believe aligns perfectly with your company's artistic vision.\n\nI would be honoured to contribute my skills as a guest dancer for your Spring 2027 programme.",
    selectedMedia: ["m1", "m5", "m2", "m4"],
    requireEmail: true,
    requirePassword: false,
    password: "",
    artist: {
      name: "Amara Osei-Bonsu",
      photo: "/demo/artists/nisha-huizing.jpg",
      location: "London, UK",
      bio: "Contemporary & Afro-fusion dancer. Royal Ballet School graduate. Three seasons with Akram Khan Company as Lead Dancer.",
      styles: ["Contemporary", "Afro-fusion", "Floor Work", "Classical Ballet"],
      experience: [
        { title: "Lead Dancer", org: "Akram Khan Company", period: "2023 – 2026", type: "experience" },
        { title: "Corps de Ballet", org: "Royal Ballet", period: "2021 – 2023", type: "experience" },
        { title: "BA Dance Performance", org: "Royal Ballet School", period: "2018 – 2021", type: "education" },
        { title: "Summer Intensive — Gaga", org: "Batsheva Dance Company", period: "2022", type: "education" },
      ],
      awards: [
        { title: "Outstanding Young Dancer", org: "Critics' Circle National Dance Awards", year: "2024" },
      ],
    },
  },
  "ndt-audition-lx6r9p": {
    companyName: "NDT — Nederlands Dans Theater",
    role: "Company Dancer — Audition Tape",
    motivation: "Your company has been my dream since first seeing Jiří Kylián's 'Petite Mort' at the Holland Festival. My background in both classical and contemporary technique, combined with my experience in physical theatre, positions me well for NDT's diverse repertoire.\n\nI have enclosed my showreel, headshot, and CV for your consideration.",
    selectedMedia: ["m6", "m2", "m3", "m4"],
    requireEmail: true,
    requirePassword: true,
    password: "ndt2026",
    artist: {
      name: "Amara Osei-Bonsu",
      photo: "/demo/artists/nisha-huizing.jpg",
      location: "London, UK",
      bio: "Contemporary & Afro-fusion dancer. Royal Ballet School graduate. Three seasons with Akram Khan Company as Lead Dancer.",
      styles: ["Contemporary", "Afro-fusion", "Floor Work", "Classical Ballet"],
      experience: [
        { title: "Lead Dancer", org: "Akram Khan Company", period: "2023 – 2026", type: "experience" },
        { title: "Corps de Ballet", org: "Royal Ballet", period: "2021 – 2023", type: "experience" },
        { title: "BA Dance Performance", org: "Royal Ballet School", period: "2018 – 2021", type: "education" },
        { title: "Summer Intensive — Gaga", org: "Batsheva Dance Company", period: "2022", type: "education" },
      ],
      awards: [
        { title: "Outstanding Young Dancer", org: "Critics' Circle National Dance Awards", year: "2024" },
      ],
    },
  },
};

const MEDIA_ICONS = {
  video: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  photo: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
  doc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
};

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
body{font-family:'Manrope',system-ui,sans-serif;background:#FAFAFA;color:#1a1a1a;min-height:100vh}

.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:linear-gradient(135deg,#F8F7FF 0%,#F0EEFF 100%)}
.login-card{width:420px;max-width:100%;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:20px;padding:40px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.06)}
.login-logo{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:28px}
.login-logo img{height:28px}
.login-logo span{font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:-.02em}
.login-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:40px;background:rgba(96,77,255,.08);color:#604DFF;font-size:11px;font-weight:600;margin-bottom:20px}
.login-title{font-size:18px;font-weight:700;color:#1a1a1a;margin-bottom:4px}
.login-sub{font-size:13px;color:#888;margin-bottom:28px;line-height:1.5}
.login-field{margin-bottom:16px;text-align:left}
.login-field label{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#999;margin-bottom:6px}
.login-field input{width:100%;padding:12px 14px;border:1px solid rgba(0,0,0,.1);border-radius:12px;font-size:13px;font-family:inherit;color:#1a1a1a;background:#FAFAFA;outline:none;transition:all .15s}
.login-field input:focus{border-color:rgba(96,77,255,.5);background:#fff;box-shadow:0 0 0 3px rgba(96,77,255,.08)}
.login-btn{width:100%;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;margin-top:4px}
.login-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 16px rgba(96,77,255,.3)}
.login-error{color:#FF4757;font-size:12px;margin-top:8px}
.login-powered{font-size:11px;color:#999;margin-top:24px}
.login-powered a{color:#604DFF;text-decoration:none;font-weight:500}

.app-viewer{max-width:800px;margin:0 auto;padding:48px 24px 100px}

.av-header{text-align:center;margin-bottom:40px}
.av-header-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:40px;background:rgba(96,77,255,.08);color:#604DFF;font-size:11px;font-weight:600;letter-spacing:.02em;margin-bottom:16px}
.av-header h1{font-size:28px;font-weight:700;color:#1a1a1a;margin-bottom:6px;letter-spacing:-.02em}
.av-header h2{font-size:15px;font-weight:500;color:#888}

.av-section{margin-bottom:32px}
.av-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#999;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.av-section-title::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.06)}

.av-profile{display:flex;align-items:center;gap:20px;padding:24px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.03)}
.av-profile img{width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(96,77,255,.12)}
.av-profile-info{flex:1}
.av-profile-name{font-size:18px;font-weight:700;color:#1a1a1a}
.av-profile-loc{font-size:13px;color:#888;margin-top:2px;display:flex;align-items:center;gap:4px}
.av-profile-bio{font-size:13px;color:#666;line-height:1.5;margin-top:8px}
.av-profile-styles{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.av-profile-tag{padding:3px 10px;border-radius:40px;font-size:11px;font-weight:600;background:rgba(96,77,255,.08);color:#604DFF}

.av-motivation{padding:24px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.03)}
.av-motivation p{font-size:14px;color:#444;line-height:1.7;white-space:pre-wrap}

.av-media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.av-media-item{position:relative;border-radius:14px;overflow:hidden;background:#fff;border:1px solid rgba(0,0,0,.06);cursor:pointer;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.03)}
.av-media-item:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.08)}
.av-media-thumb{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
.av-media-placeholder{width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,#F0EEFF,#E8E6F0);display:flex;align-items:center;justify-content:center;color:#604DFF}
.av-media-info{padding:10px 12px}
.av-media-title{font-size:12px;font-weight:600;color:#1a1a1a}
.av-media-meta{font-size:10px;color:#999;margin-top:2px;display:flex;align-items:center;gap:6px}
.av-media-type-badge{position:absolute;top:8px;left:8px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.02em;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.av-media-type-badge.video{background:rgba(255,71,87,.85);color:#fff}
.av-media-type-badge.photo{background:rgba(29,185,84,.85);color:#fff}
.av-media-type-badge.doc{background:rgba(245,166,35,.85);color:#fff}
.av-media-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.2);opacity:0;transition:opacity .2s}
.av-media-item:hover .av-media-play{opacity:1}
.av-media-play-btn{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center}

.av-experience{display:flex;flex-direction:column;gap:10px}
.av-exp-item{display:flex;align-items:flex-start;gap:14px;padding:16px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.03)}
.av-exp-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.av-exp-icon.exp{background:rgba(96,77,255,.08)}
.av-exp-icon.edu{background:rgba(30,144,255,.08)}
.av-exp-icon.award{background:rgba(245,166,35,.08)}
.av-exp-info{flex:1}
.av-exp-title{font-size:13px;font-weight:600;color:#1a1a1a}
.av-exp-org{font-size:12px;color:#604DFF;margin-top:1px}
.av-exp-period{font-size:11px;color:#999;margin-top:3px}

.av-awards{display:flex;flex-direction:column;gap:10px}
.av-award-item{display:flex;align-items:center;gap:14px;padding:16px;background:linear-gradient(135deg,rgba(245,166,35,.04),rgba(245,166,35,.08));border:1px solid rgba(245,166,35,.12);border-radius:14px}
.av-award-icon{font-size:22px;flex-shrink:0}
.av-award-info{flex:1}
.av-award-title{font-size:13px;font-weight:600;color:#1a1a1a}
.av-award-org{font-size:12px;color:#888;margin-top:1px}

.av-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out}
.av-lightbox img{max-width:90%;max-height:90vh;border-radius:12px;object-fit:contain}
.av-lightbox-close{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.av-lightbox-close:hover{background:rgba(255,255,255,.2)}

.av-footer{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid rgba(0,0,0,.06);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:50}
.av-footer-brand{display:flex;align-items:center;gap:8px}
.av-footer-brand img{height:18px;opacity:.5}
.av-footer-brand span{font-size:11px;color:#999}
.av-footer-cta{display:flex;align-items:center;gap:14px}
.av-footer-cta-text{font-size:12px;color:#888;max-width:340px;line-height:1.4}
.av-footer-cta-btn{padding:9px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s;text-decoration:none}
.av-footer-cta-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 16px rgba(96,77,255,.3)}

@media(max-width:600px){
.app-viewer{padding:24px 16px 110px}
.av-header h1{font-size:22px}
.av-profile{flex-direction:column;text-align:center;gap:14px}
.av-profile-styles{justify-content:center}
.av-profile-loc{justify-content:center}
.av-media-grid{grid-template-columns:repeat(2,1fr);gap:10px}
.av-footer{flex-direction:column;gap:10px;text-align:center;padding:12px 16px}
.av-footer-cta{flex-direction:column;gap:8px}
.av-footer-cta-text{max-width:100%}
}
`;

function ExternalAppViewer() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "royal-ballet-flan-lx5j2n";
  const data = MOCK_DATA[slug] || MOCK_DATA["royal-ballet-flan-lx5j2n"];

  const [authed, setAuthed] = useState(!data.requireEmail && !data.requirePassword);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const handleLogin = () => {
    if (data.requireEmail && !email.includes("@")) { setError("Please enter a valid email"); return; }
    if (data.requirePassword && password !== data.password) { setError("Incorrect password"); return; }
    setAuthed(true);
    document.title = `${data.role} — ${data.artist.name} | Lanced`;
  };

  const mediaItems = data.selectedMedia.map(id => MOCK_MEDIA[id]).filter(Boolean);

  if (!authed) {
    return (
      <>
        <style>{CSS}</style>
        <div className="login-page">
          <div className="login-card">
            <div className="login-logo">
              <img src="/lanced-logo.svg" alt="Lanced" />
              <span>lanced</span>
            </div>
            <div className="login-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Application
            </div>
            <div className="login-title">Application for {data.companyName}</div>
            <div className="login-sub">by {data.artist.name}<br />Enter your details to view this application</div>
            {data.requireEmail && (
              <div className="login-field">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
            )}
            {data.requirePassword && (
              <div className="login-field">
                <label>Password</label>
                <input type="password" placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
            )}
            {error && <div className="login-error">{error}</div>}
            <button className="login-btn" onClick={handleLogin}>View Application</button>
            <div className="login-powered">Shared via <a href="https://lanced.app" target="_blank" rel="noopener">Lanced</a></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app-viewer">
        <div className="av-header">
          <div className="av-header-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Application
          </div>
          <h1>Application for {data.companyName}</h1>
          <h2>{data.role}</h2>
        </div>

        <div className="av-section">
          <div className="av-section-title">Artist</div>
          <div className="av-profile">
            <img src={data.artist.photo} alt={data.artist.name} />
            <div className="av-profile-info">
              <div className="av-profile-name">{data.artist.name}</div>
              <div className="av-profile-loc">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {data.artist.location}
              </div>
              <div className="av-profile-bio">{data.artist.bio}</div>
              <div className="av-profile-styles">
                {data.artist.styles.map(s => <span key={s} className="av-profile-tag">{s}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="av-section">
          <div className="av-section-title">Motivation</div>
          <div className="av-motivation">
            <p>{data.motivation}</p>
          </div>
        </div>

        <div className="av-section">
          <div className="av-section-title">Materials ({mediaItems.length})</div>
          <div className="av-media-grid">
            {mediaItems.map(m => (
              <div key={m.id} className="av-media-item" onClick={() => m.thumb && setLightbox(m)}>
                {m.thumb ? (
                  <img className="av-media-thumb" src={m.thumb} alt={m.title} />
                ) : (
                  <div className="av-media-placeholder" dangerouslySetInnerHTML={{ __html: MEDIA_ICONS[m.type] || MEDIA_ICONS.doc }} />
                )}
                <span className={`av-media-type-badge ${m.type}`}>{m.type}</span>
                {m.type === "video" && m.thumb && (
                  <div className="av-media-play">
                    <div className="av-media-play-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                )}
                <div className="av-media-info">
                  <div className="av-media-title">{m.title}</div>
                  <div className="av-media-meta">
                    <span>{m.format}</span>
                    {m.duration && <span>{m.duration}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="av-section">
          <div className="av-section-title">Experience & Training</div>
          <div className="av-experience">
            {data.artist.experience.map((e, i) => (
              <div key={i} className="av-exp-item">
                <div className={`av-exp-icon ${e.type === "education" ? "edu" : "exp"}`}>
                  {e.type === "education" ? "🎓" : "💼"}
                </div>
                <div className="av-exp-info">
                  <div className="av-exp-title">{e.title}</div>
                  <div className="av-exp-org">{e.org}</div>
                  <div className="av-exp-period">{e.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.artist.awards && data.artist.awards.length > 0 && (
          <div className="av-section">
            <div className="av-section-title">Awards & Recognition</div>
            <div className="av-awards">
              {data.artist.awards.map((a, i) => (
                <div key={i} className="av-award-item">
                  <div className="av-award-icon">🏆</div>
                  <div className="av-award-info">
                    <div className="av-award-title">{a.title}</div>
                    <div className="av-award-org">{a.org} — {a.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="av-lightbox" onClick={() => setLightbox(null)}>
          <button className="av-lightbox-close" onClick={() => setLightbox(null)}>×</button>
          <img src={lightbox.thumb} alt={lightbox.title} onClick={e => e.stopPropagation()} style={{ cursor: "default" }} />
        </div>
      )}

      <div className="av-footer">
        <div className="av-footer-brand">
          <img src="/lanced-logo.svg" alt="Lanced" />
          <span>Powered by Lanced</span>
        </div>
        <div className="av-footer-cta">
          <div className="av-footer-cta-text">Running auditions? Try Lanced — manage applications, showcase talent, and cast faster.</div>
          <a className="av-footer-cta-btn" href="https://lanced.app" target="_blank" rel="noopener">Try Lanced</a>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<ExternalAppViewer />);
