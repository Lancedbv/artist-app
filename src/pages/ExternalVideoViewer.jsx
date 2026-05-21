import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const MOCK_DATA = {
  "showreel-2026-lx4k8m": {
    title: "Showreel 2026",
    description: "My contemporary and Afro-fusion showreel featuring work from Akram Khan Company and personal projects. This reel showcases my range across multiple styles including contemporary, Afro-fusion, floor work, and partnering.",
    tags: ["Contemporary", "Afro-fusion", "Showreel"],
    thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg",
    duration: "3:24",
    requireEmail: true,
    requirePassword: false,
    password: "",
    artist: { name: "Amara Osei-Bonsu", photo: "/demo/artists/nisha-huizing.jpg", location: "London, UK", bio: "Contemporary & Afro-fusion dancer. Royal Ballet School graduate. Currently freelancing across Europe." },
  },
  "ballet-variation-lx5r2a": {
    title: "Ballet Variation — Don Quixote",
    description: "Classical ballet variation from Don Quixote Act III, performed at the Royal Ballet School annual showcase. Kitri variation with fouettés and grand allegro.",
    tags: ["Classical", "Ballet", "Variation"],
    thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg",
    duration: "2:15",
    requireEmail: true,
    requirePassword: true,
    password: "ballet2026",
    artist: { name: "Amara Osei-Bonsu", photo: "/demo/artists/nisha-huizing.jpg", location: "London, UK", bio: "Contemporary & Afro-fusion dancer. Royal Ballet School graduate. Currently freelancing across Europe." },
  },
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

.viewer{max-width:960px;margin:0 auto;padding:48px 24px 100px}
.viewer-player{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:16px;overflow:hidden;margin-bottom:28px;cursor:pointer;box-shadow:0 4px 24px rgba(0,0,0,.12)}
.viewer-player img{width:100%;height:100%;object-fit:cover}
.viewer-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.3);transition:background .2s}
.viewer-player:hover .viewer-play{background:rgba(0,0,0,.15)}
.viewer-play-btn{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:transform .15s}
.viewer-player:hover .viewer-play-btn{transform:scale(1.06)}
.viewer-artist{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.viewer-artist img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid rgba(96,77,255,.12)}
.viewer-artist-name{font-size:14px;font-weight:600;color:#1a1a1a}
.viewer-artist-loc{font-size:12px;color:#888;display:flex;align-items:center;gap:4px}
.viewer-title{font-size:26px;font-weight:700;color:#1a1a1a;margin-bottom:8px;letter-spacing:-.02em}
.viewer-duration{font-size:13px;color:#999;margin-bottom:16px}
.viewer-desc{font-size:14px;color:#555;line-height:1.7;margin-bottom:20px}
.viewer-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.viewer-tag{padding:4px 12px;border-radius:40px;font-size:11px;font-weight:600;background:rgba(96,77,255,.08);color:#604DFF}
.viewer-divider{height:1px;background:rgba(0,0,0,.06);margin:24px 0}

.viewer-footer{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid rgba(0,0,0,.06);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:50}
.footer-brand{display:flex;align-items:center;gap:8px}
.footer-brand img{height:18px;opacity:.5}
.footer-brand span{font-size:11px;color:#999}
.footer-cta{display:flex;align-items:center;gap:14px}
.footer-cta-text{font-size:12px;color:#888;max-width:340px;line-height:1.4}
.footer-cta-btn{padding:9px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s;text-decoration:none}
.footer-cta-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 16px rgba(96,77,255,.3)}

@media(max-width:600px){
.viewer{padding:24px 16px 110px}
.viewer-title{font-size:22px}
.viewer-footer{flex-direction:column;gap:10px;text-align:center;padding:12px 16px}
.footer-cta{flex-direction:column;gap:8px}
.footer-cta-text{max-width:100%}
}
`;

function ExternalVideoViewer() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "showreel-2026-lx4k8m";
  const data = MOCK_DATA[slug] || MOCK_DATA["showreel-2026-lx4k8m"];

  const [authed, setAuthed] = useState(!data.requireEmail && !data.requirePassword);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);

  const handleLogin = () => {
    if (data.requireEmail && !email.includes("@")) { setError("Please enter a valid email"); return; }
    if (data.requirePassword && password !== data.password) { setError("Incorrect password"); return; }
    setAuthed(true);
    document.title = `${data.title} — ${data.artist.name} | Lanced`;
  };

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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Video
            </div>
            <div className="login-title">{data.title}</div>
            <div className="login-sub">by {data.artist.name}<br />Enter your details to view this video</div>
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
            <button className="login-btn" onClick={handleLogin}>View Video</button>
            <div className="login-powered">Shared via <a href="https://lanced.app" target="_blank" rel="noopener">Lanced</a></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="viewer">
        <div className="viewer-player" onClick={() => setPlaying(!playing)}>
          <img src={data.thumb} alt={data.title} />
          {!playing && (
            <div className="viewer-play">
              <div className="viewer-play-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a1a1a"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
          )}
          {playing && (
            <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <div style={{ fontSize: 12, color: "#555", marginTop: 8 }}>Video playback — prototype</div>
              </div>
            </div>
          )}
        </div>

        <div className="viewer-artist">
          <img src={data.artist.photo} alt={data.artist.name} />
          <div>
            <div className="viewer-artist-name">{data.artist.name}</div>
            <div className="viewer-artist-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {data.artist.location}
            </div>
          </div>
        </div>

        <h1 className="viewer-title">{data.title}</h1>
        <div className="viewer-duration">{data.duration}</div>
        <div className="viewer-tags">
          {data.tags.map(t => <span key={t} className="viewer-tag">{t}</span>)}
        </div>

        <div className="viewer-divider" />
        <div className="viewer-desc">{data.description}</div>

        <div className="viewer-divider" />
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
          <strong style={{ color: "#1a1a1a" }}>{data.artist.name}</strong><br />
          {data.artist.bio}
        </div>
      </div>

      <div className="viewer-footer">
        <div className="footer-brand">
          <img src="/lanced-logo.svg" alt="Lanced" />
          <span>Powered by Lanced</span>
        </div>
        <div className="footer-cta">
          <div className="footer-cta-text">Like what you're seeing? Make your audition process easier with Lanced.</div>
          <a className="footer-cta-btn" href="https://lanced.app" target="_blank" rel="noopener">Try Lanced</a>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<ExternalVideoViewer />);
