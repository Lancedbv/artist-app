import { useState, useRef, useEffect } from "react";

/* ━━━ MOCK DATA ━━━ */
const DEMO_ARTIST = {
  name: "Amara Osei", email: "amara@lanced.io", plan: "Core",
  photo: "/demo/artists/nisha-huizing.jpg",
  dob: "1999-08-14", gender: "Female", height: "5'8\"", nationality: "British-Ghanaian",
  bio: "Contemporary and Afro-fusion dancer trained at the Royal Ballet School. Three seasons with Akram Khan Company. Passionate about bridging traditional West African movement with contemporary European choreography.",
  links: { resume: "#", instagram: "@amaraosei", website: "amaraosei.com" },
  styles: ["Contemporary", "Afro-fusion", "Floor Work"],
  location: "London, UK"
};

const STAGE_RECORD = [
  { id: "sr1", type: "experience", emoji: "💼", title: "Lead Dancer", org: "Akram Khan Company", start: "2023-09", end: "2026-01", location: "London, UK", desc: "Three seasons as lead dancer in touring productions. Featured in Jungle Book reimagined.", tags: ["Contemporary", "Touring"], usedIn: ["Resume", "Portfolio"] },
  { id: "sr2", type: "experience", emoji: "💼", title: "Corps de Ballet", org: "Royal Ballet", start: "2021-09", end: "2023-06", location: "London, UK", desc: "Two years with the Royal Ballet in classical and contemporary repertoire.", tags: ["Ballet", "Classical"], usedIn: ["Resume"] },
  { id: "sr3", type: "education", emoji: "🎓", title: "BA Dance Performance", org: "Royal Ballet School", start: "2018-09", end: "2021-06", location: "London, UK", desc: "Full scholarship. Graduated with distinction. Focus on classical ballet and contemporary technique.", tags: ["Classical", "Contemporary"], usedIn: ["Resume", "Portfolio"] },
  { id: "sr4", type: "education", emoji: "🎓", title: "Summer Intensive", org: "Batsheva Dance Company", start: "2022-07", end: "2022-08", location: "Tel Aviv, IL", desc: "Four-week intensive in Gaga technique with Ohad Naharin.", tags: ["Gaga", "Contemporary"], usedIn: [] },
  { id: "sr5", type: "award", emoji: "🏆", title: "Outstanding Young Dancer", org: "Critics' Circle National Dance Awards", start: "2024", end: "", location: "London, UK", desc: "Winner of the 2024 Outstanding Young Dancer award for performances in Jungle Book reimagined.", tags: ["Contemporary"], usedIn: ["Resume"] },
  { id: "sr6", type: "skills", emoji: "⚡", title: "Technical Profile", org: "", start: "", end: "", location: "", desc: "Primary: Contemporary, Afro-fusion, Floor Work. Secondary: Classical Ballet, Partnering, Contact Improvisation. Proficient in Gaga technique.", tags: ["Contemporary", "Afro-fusion", "Ballet", "Gaga"], usedIn: [] },
  { id: "sr7", type: "press", emoji: "📰", title: "\"A Force of Nature on Stage\"", org: "The Guardian", start: "2024-11", end: "", location: "", desc: "Five-star review of Jungle Book reimagined highlighting \"Osei's magnetic stage presence and fearless physicality.\"", tags: ["Review", "Contemporary"], usedIn: ["Portfolio"] },
  { id: "sr8", type: "repertoire", emoji: "🎭", title: "Mowgli — Jungle Book Reimagined", org: "Akram Khan Company", start: "2024-03", end: "2025-12", location: "International Tour", desc: "Lead role. 87 performances across 14 countries. Choreography by Akram Khan.", tags: ["Contemporary", "Lead Role", "Touring"], usedIn: ["Resume", "Portfolio"] },
];

const MOCK_APPLICATIONS = [
  { id: "app1", company: "Nederlands Dans Theater", companyLogo: "/demo/artists/1.jpg", opportunity: "NDT 2 — Open Audition 2026/27 Season", status: "shortlisted", submitted: "2026-03-10", deadline: "2026-04-15", banner: "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg", desc: "NDT is looking for versatile contemporary dancers for the upcoming season. We seek artists who bring unique movement quality and strong technical foundation.", companyDesc: "Nederlands Dans Theater is one of the world's leading contemporary dance companies, based in The Hague." },
  { id: "app2", company: "Sadler's Wells", companyLogo: "/demo/artists/2.jpg", opportunity: "Associate Artist Programme 2026", status: "in_review", submitted: "2026-03-05", deadline: "2026-05-01", banner: "/demo/banners/gwen-king-m3th3riq9-w-unsplash.jpg", desc: "Seeking emerging choreographers and dancers for our Associate Artist programme. Two-year residency with studio access and production support.", companyDesc: "Sadler's Wells is a world-leading dance house dedicated to bringing the very best international and UK dance to London audiences." },
  { id: "app3", company: "Batsheva Dance Company", companyLogo: "/demo/artists/3.jpg", opportunity: "Ensemble Dancer — 2026 Season", status: "invited", submitted: "2026-02-20", deadline: "2026-03-30", banner: "/demo/banners/fabian-centeno-k4s5mtsyuli-unsplash.jpg", desc: "Join Batsheva's renowned ensemble. We're looking for dancers with strong Gaga technique background and improvisational skills.", companyDesc: "Batsheva Dance Company, founded in 1964, is Israel's world-renowned modern dance company." },
  { id: "app4", company: "Crystal Pite / Kidd Pivot", companyLogo: "/demo/artists/4.jpg", opportunity: "Revival Cast — Body and Soul", status: "submitted", submitted: "2026-03-22", deadline: "2026-06-01", banner: "/demo/banners/shutterstock_1234830199.jpg", desc: "Casting for the revival of Body and Soul. Looking for highly physical performers with strong theatrical sensibility.", companyDesc: "Kidd Pivot is Crystal Pite's company blending movement and theatre into visceral productions." },
  { id: "app5", company: "English National Ballet", companyLogo: "/demo/artists/5.jpg", opportunity: "Guest Artist — Modern Masters", status: "not_selected", submitted: "2026-01-15", deadline: "2026-02-28", banner: "/demo/banners/shutterstock_1505137721.jpg", desc: "Guest artist opportunity for our Modern Masters triple bill featuring works by Forsythe, Pite, and Khan.", companyDesc: "English National Ballet is one of the UK's leading ballet companies." },
];

const MOCK_OPPORTUNITIES = [
  { id: "opp1", company: "Royal Danish Ballet", title: "Soloist — 2026/27 Season", location: "Copenhagen, DK", type: "Full-time Contract", deadline: "2026-04-30", styles: ["Classical", "Neoclassical"], banner: "/demo/banners/jens-thekkeveettil-dbwvuqboou8-unsplash.jpg", saved: false },
  { id: "opp2", company: "Wayne McGregor | Random Dance", title: "Company Dancer", location: "London, UK", type: "Full-time Contract", deadline: "2026-05-15", styles: ["Contemporary", "Technology"], banner: "/demo/banners/hulki-okan-tabak-paog427w_as-unsplash-2.jpg", saved: true },
  { id: "opp3", company: "Pina Bausch Tanztheater", title: "Guest Performer — Rite of Spring Revival", location: "Wuppertal, DE", type: "Project-based", deadline: "2026-06-01", styles: ["Tanztheater", "Contemporary"], banner: "/demo/banners/pexels-joseph-phillips-2044494-3753820.jpg", saved: false },
];

const MOCK_PORTFOLIOS = [
  { id: "pf1", name: "Contemporary Showreel", status: "published", items: 7, cover: "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg" },
  { id: "pf2", name: "Afro-fusion Collection", status: "draft", items: 4, cover: "/demo/banners/fabian-centeno-k4s5mtsyuli-unsplash.jpg" },
];

const MOCK_MEDIA = [
  { id: "m1", title: "Showreel 2026", type: "video", format: "MOV", size: "248 MB", duration: "3:24", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg" },
  { id: "m2", title: "Headshot — Studio", type: "photo", format: "JPG", size: "4.2 MB", thumb: "/demo/artists/nisha-huizing.jpg" },
  { id: "m3", title: "Full Body — Movement", type: "photo", format: "JPG", size: "3.8 MB", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221378.jpg" },
  { id: "m4", title: "Resume 2026", type: "doc", format: "PDF", size: "1.1 MB", thumb: null },
  { id: "m5", title: "Ballet Variation", type: "video", format: "MP4", size: "156 MB", duration: "2:15", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg" },
  { id: "m6", title: "Contemporary Solo", type: "video", format: "MP4", size: "198 MB", duration: "3:40", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221579.jpg" },
  { id: "m7", title: "Rehearsal Snap", type: "photo", format: "JPG", size: "2.9 MB", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-5103506.jpg" },
  { id: "m8", title: "Press Kit Audio", type: "audio", format: "MP3", size: "8.4 MB", thumb: null },
  { id: "m9", title: "Behind the Scenes", type: "photo", format: "JPG", size: "5.1 MB", thumb: "/demo/artists/jusef-al-haddad/karsten-winegeart-UicC_FIozPc-unsplash (1).jpg" },
  { id: "m10", title: "YouTube — Jungle Book Excerpt", type: "link", format: "URL", size: "", thumb: "/demo/banners/pexels-mart-production-7319706.jpg" },
];

const MOCK_MESSAGES = [
  { id: "msg1", from: "NDT Casting", preview: "Thank you for your audition video. We'd like to invite you to...", time: "2h ago", unread: true, avatar: "/demo/artists/1.jpg",
    thread: [
      { sender: "them", text: "Hi Amara, thank you for your audition video. We've reviewed your materials and are very impressed with your technique.", time: "Mar 10, 10:30" },
      { sender: "them", text: "We'd like to invite you to the next round of auditions on April 5th in The Hague.", time: "Mar 10, 10:31" },
      { sender: "me", text: "Thank you so much! I'm honoured. I'll confirm my attendance shortly.", time: "Mar 10, 14:22" },
      { sender: "them", text: "Great! Please bring pointe shoes and a contemporary solo (max 1 min). Details will follow by email.", time: "Mar 10, 15:00" },
    ]},
  { id: "msg2", from: "Sadler's Wells", preview: "Your application has been received and is currently under review.", time: "1d ago", unread: false, avatar: "/demo/artists/2.jpg",
    thread: [
      { sender: "them", text: "Dear Amara, thank you for applying to our Associate Artist Programme 2026. Your application has been received and is currently under review.", time: "Mar 6, 09:15" },
      { sender: "me", text: "Thank you for confirming! Looking forward to hearing from you.", time: "Mar 6, 11:40" },
    ]},
  { id: "msg3", from: "Batsheva Dance Company", preview: "Congratulations! We are pleased to invite you to the final round.", time: "3d ago", unread: false, avatar: "/demo/artists/3.jpg",
    thread: [
      { sender: "them", text: "Dear Amara, we are pleased to inform you that you have been shortlisted for the Ensemble Dancer position.", time: "Mar 1, 08:00" },
      { sender: "me", text: "This is wonderful news! Thank you so much.", time: "Mar 1, 09:30" },
      { sender: "them", text: "Congratulations! We are pleased to invite you to the final round. Please confirm your attendance by March 25.", time: "Mar 5, 14:00" },
      { sender: "me", text: "I'm absolutely thrilled! I confirm my attendance. Is there anything specific I should prepare?", time: "Mar 5, 16:15" },
      { sender: "them", text: "Please prepare a 2-minute solo of your choice. We look forward to seeing you!", time: "Mar 5, 17:00" },
    ]},
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "application", title: "Application Update", body: "Your application for NDT 2 — Open Audition has been shortlisted!", time: "2h ago", unread: true, color: "#1E90FF", icon: "📋" },
  { id: "n2", type: "broadcast", title: "Crystal Pite / Kidd Pivot", body: "Reminder: Please submit any additional materials before the deadline on June 1st.", time: "5h ago", unread: true, color: "#604DFF", icon: "📢" },
  { id: "n3", type: "invitation", title: "Invitation Received", body: "Batsheva Dance Company has invited you to the final audition round.", time: "1d ago", unread: false, color: "#1DB954", icon: "🎉" },
  { id: "n4", type: "broadcast", title: "Nederlands Dans Theater", body: "The audition schedule has been finalized. All applicants will receive individual time slots by email.", time: "2d ago", unread: false, color: "#604DFF", icon: "📢" },
  { id: "n5", type: "profile", title: "Profile Views", body: "Your profile was viewed 48 times this week — up 23% from last week.", time: "3d ago", unread: false, color: "#F5A623", icon: "👁" },
  { id: "n6", type: "opportunity", title: "New Opportunity", body: "A new opportunity matching your profile: Soloist — 2026/27 Season at Royal Danish Ballet.", time: "4d ago", unread: false, color: "#FF69B4", icon: "✨" },
  { id: "n7", type: "broadcast", title: "Sadler's Wells", body: "Thank you to all applicants. We will be sending out decisions by the end of this week.", time: "5d ago", unread: false, color: "#604DFF", icon: "📢" },
];

/* ━━━ HELPERS ━━━ */
const STATUS_COLORS = { submitted: { bg: "#F0F0FF", color: "#604DFF" }, in_review: { bg: "#FFF8E6", color: "#F5A623" }, shortlisted: { bg: "#E6F0FF", color: "#1E90FF" }, invited: { bg: "#E6FFF0", color: "#1DB954" }, not_selected: { bg: "#FFF0F0", color: "#FF4757" }, pending: { bg: "#F5F4FB", color: "#98989F" } };
const STATUS_LABELS = { submitted: "Submitted", in_review: "In Review", shortlisted: "Shortlisted", invited: "Invited", not_selected: "Not Selected", pending: "Pending" };
const SR_COLORS = { experience: "#604DFF", education: "#1E90FF", award: "#F5A623", skills: "#1DB954", press: "#FF4757", repertoire: "#FF69B4" };
const SR_LABELS = { experience: "Experience", education: "Education", award: "Award", skills: "Skills", press: "Press", repertoire: "Repertoire" };
const MEDIA_COLORS = { video: "#FF4757", photo: "#1DB954", doc: "#F5A623", audio: "#1E90FF", link: "#604DFF" };

const ac = "#604DFF";

/* ━━━ CSS ━━━ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap');

:root{--ac:${ac};--bg:#F8F7FF;--sf:#FFF;--tx:#0A0A0B;--g1:#F5F4FB;--g2:#E8E6F0;--g3:#D1D0D9;--g4:#98989F;--g5:#6E6E76;--g6:#48484D;--red:#FF4757;--green:#1DB954;--amber:#F5A623;--sans:'DM Sans',system-ui,sans-serif;--serif:'Playfair Display',Georgia,serif;--mono:'JetBrains Mono',monospace;--sb-w:240px;--sb-wc:64px}

/* ━━━ Dark mode ━━━ */
.dark{--bg:#0D0D12;--sf:#17171C;--tx:#E4E3EA;--g1:#1C1C24;--g2:#28283A;--g3:#3A3A4C;--g4:#7A7A8C;--g5:#A0A0B0;--g6:#D0D0DA;--ac:#7A66FF;--red:#FF6B7A;--green:#2ECC71;--amber:#FFB84D}
.dark body,.shell.dark{background:var(--bg);background-image:radial-gradient(ellipse at 20% 0%,rgba(122,102,255,.1) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(122,102,255,.06) 0%,transparent 50%);color:var(--tx)}
.dark .sidebar{box-shadow:1px 0 0 0 rgba(122,102,255,.08)}
.dark .btn-p{background:linear-gradient(135deg,#8B7AFF,#604DFF)}
.dark .btn-s{border-color:var(--g3);color:var(--tx)}
.dark .btn-danger{background:rgba(255,107,122,.12);color:var(--red);border-color:rgba(255,107,122,.2)}
.dark .btn-success{background:rgba(46,204,113,.12);color:var(--green);border-color:rgba(46,204,113,.2)}
.dark .field input,.dark .field textarea,.dark .field select{background:var(--g1);border-color:var(--g3);color:var(--tx)}
.dark .field input:focus,.dark .field textarea:focus,.dark .field select:focus{background:var(--sf);border-color:var(--ac)}
.dark .field input::placeholder,.dark .field textarea::placeholder{color:var(--g4)}
.dark .app-card{background:var(--sf);border-color:var(--g2)}
.dark .sc-card{background:var(--sf);border-color:var(--g2)}
.dark .dash-section{background:var(--sf);border-color:var(--g2)}
.dark .dash-banner{background:linear-gradient(135deg,#1a1040 0%,#2d1b69 25%,#4a2a8a 50%,#604DFF 75%,#2d1b69 100%);background-size:200% 200%;animation:bannerShift 8s ease infinite;border:1px solid var(--g2)}
.dark .overlay>div{background:var(--sf);border-color:var(--g2)}
.dark .sr-card{background:var(--sf);border-color:var(--g2)}
.dark .opp-card{background:var(--sf);border-color:var(--g2)}
.dark .media-item{background:var(--sf);border-color:var(--g2)}
.dark .pf-card{background:var(--sf);border-color:var(--g2)}
.dark .msg-item{border-bottom-color:var(--g2)}
.dark .tab-bar .tab-btn{color:var(--g5)}
.dark .tab-bar .tab-btn.on{color:var(--tx);border-bottom-color:var(--ac)}
.dark .spotlight-hero{border-color:var(--g2)}
.dark .info-card{background:var(--sf);border-color:var(--g2)}
.dark .stat-card{background:var(--sf);border-color:var(--g2)}
.dark .list-search{background:var(--sf);border-color:var(--g3)}
.dark .list-search input{color:var(--tx)}
.dark .chip.on{background:linear-gradient(135deg,#8B7AFF,#604DFF)}

/* Dark mode toggle */
.dark-toggle{display:flex;align-items:center;gap:8px;padding:8px 14px;cursor:pointer;border:none;background:none;font-family:var(--sans);font-size:12px;font-weight:500;color:var(--g5);border-radius:8px;transition:all .15s;width:100%}
.dark-toggle:hover{background:var(--g1);color:var(--tx)}
.sb-collapsed .dark-toggle .dt-label{display:none}

/* ━━━ Keyframes ━━━ */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
@keyframes slideInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes bannerShift{0%,100%{background-position:0% 0%}50%{background-position:100% 100%}}
@keyframes blobMove1{0%{transform:translate(0,0) scale(1)}25%{transform:translate(80px,-60px) scale(1.1)}50%{transform:translate(-40px,-100px) scale(.95)}75%{transform:translate(-80px,40px) scale(1.05)}100%{transform:translate(0,0) scale(1)}}
@keyframes blobMove2{0%{transform:translate(0,0) scale(1)}25%{transform:translate(-100px,50px) scale(1.08)}50%{transform:translate(60px,80px) scale(.92)}75%{transform:translate(90px,-70px) scale(1.06)}100%{transform:translate(0,0) scale(1)}}
@keyframes blobMove3{0%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,90px) scale(1.12)}66%{transform:translate(-90px,-50px) scale(.9)}100%{transform:translate(0,0) scale(1)}}

/* ━━━ Auth ━━━ */
.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8f6ff;position:relative;overflow:hidden}
.auth-blob{position:absolute;border-radius:50%;filter:blur(100px);opacity:.6;pointer-events:none;will-change:transform}
.auth-blob-1{width:600px;height:600px;background:radial-gradient(circle,rgba(96,77,255,.55),rgba(96,77,255,.08));top:-10%;left:-5%;animation:blobMove1 20s ease-in-out infinite}
.auth-blob-2{width:500px;height:500px;background:radial-gradient(circle,rgba(120,100,220,.5),rgba(150,130,240,.08));bottom:-10%;right:-5%;animation:blobMove2 25s ease-in-out infinite}
.auth-blob-3{width:450px;height:450px;background:radial-gradient(circle,rgba(96,77,255,.4),rgba(130,110,230,.06));top:40%;left:50%;animation:blobMove3 18s ease-in-out infinite}
.auth-blob-4{width:350px;height:350px;background:radial-gradient(circle,rgba(140,120,240,.45),rgba(96,77,255,.06));top:10%;right:20%;animation:blobMove1 22s ease-in-out infinite reverse}
.auth-card{width:420px;background:rgba(255,255,255,.72);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,.7);border-radius:24px;padding:44px 36px;text-align:center;animation:scaleIn .3s ease;position:relative;z-index:1;box-shadow:0 8px 32px rgba(122,102,255,.08),0 2px 8px rgba(0,0,0,.04)}
.auth-card .logo-big{margin-bottom:24px;display:flex;justify-content:center}
.auth-card .logo-big a{display:inline-block;border-radius:18px;overflow:hidden;transition:transform .2s}
.auth-card .logo-big a:hover{transform:scale(1.05)}
.auth-card .logo-big img{height:80px;width:auto;display:block;border-radius:18px}
.auth-card h1{font-family:var(--serif);font-size:28px;font-weight:400;color:#1a1a2e;margin-bottom:6px}
.auth-card .auth-sub{font-size:13px;color:rgba(0,0,0,.4);margin-bottom:28px;line-height:1.5}
.auth-card input{width:100%;padding:12px 16px;border-radius:10px;border:1px solid rgba(0,0,0,.08);background:rgba(255,255,255,.6);color:#1a1a2e;font-family:var(--sans);font-size:14px;margin-bottom:10px;outline:none;transition:border .2s}
.auth-card input::placeholder{color:rgba(0,0,0,.25)}
.auth-card input:focus{border-color:var(--ac)}
.auth-btn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;margin-top:6px;transition:all .2s;box-shadow:0 4px 16px rgba(96,77,255,.25)}
.auth-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
.auth-demo-btn{width:100%;padding:13px;border-radius:10px;border:1px solid rgba(96,77,255,.2);background:rgba(96,77,255,.06);color:var(--ac);font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;margin-top:8px;transition:all .2s}
.auth-demo-btn:hover{background:rgba(96,77,255,.12);transform:translateY(-1px)}
.auth-switch{margin-top:20px;font-size:12px;color:rgba(0,0,0,.3)}
.auth-switch a{color:var(--ac);cursor:pointer;text-decoration:none;font-weight:600}
.auth-switch a:hover{text-decoration:underline}
.auth-divider{display:flex;align-items:center;gap:12px;margin:16px 0 8px;font-size:11px;color:rgba(0,0,0,.2)}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:rgba(0,0,0,.08)}

/* ━━━ Shell ━━━ */
.shell{display:flex;min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse at 20% 0%,rgba(96,77,255,.06) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(96,77,255,.04) 0%,transparent 50%);transition:background .3s}
.sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--sb-w);background:var(--bg);border-right:none;box-shadow:1px 0 0 0 rgba(96,77,255,.06);display:flex;flex-direction:column;z-index:100;transition:width .25s cubic-bezier(.4,0,.2,1)}
.sidebar-header{padding:20px 20px 16px;border-bottom:1px solid var(--g1)}
.sidebar-logo{display:flex;align-items:center;gap:10px;margin-bottom:0}
.sidebar-logo .sb-mark{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;flex-shrink:0;box-shadow:0 2px 8px rgba(96,77,255,.25);overflow:hidden;background:linear-gradient(135deg,#7A66FF,#4A35E0)}
.sidebar-logo .sb-mark img{width:100%;height:100%;object-fit:cover}
.sidebar-logo .sb-name{font-size:13px;font-weight:600;color:var(--tx);line-height:1.3}
.sidebar-logo .sb-email{font-size:10px;color:var(--g4);margin-top:1px}
.sidebar-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
.sidebar-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:500;color:var(--g5);cursor:pointer;transition:all .15s,transform .1s;position:relative;border:none;background:none;font-family:var(--sans);width:100%;text-align:left}.sidebar-item:active{transform:scale(.97)}
.sidebar-item:hover{background:var(--g1);color:var(--g6)}
.sidebar-item.active{background:rgba(96,77,255,.08);color:var(--ac);font-weight:600}
.sidebar-item.active::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:2px;background:var(--ac)}
.sidebar-badge{min-width:18px;height:18px;border-radius:9px;background:var(--red);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 5px;margin-left:auto}
.sidebar-footer{padding:12px 10px;border-top:1px solid var(--g1)}
.sidebar-footer .sidebar-item{color:var(--g4)}
.sidebar-footer .sidebar-item:hover{color:var(--ac)}
.sidebar-acct{padding:16px 20px;border-top:1px solid var(--g1);display:flex;align-items:center;gap:10px}
.sidebar-acct .sa-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7A66FF,#4A35E0);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0;overflow:hidden}
.sidebar-acct .sa-avatar img{width:100%;height:100%;object-fit:cover}
.sidebar-acct .sa-name{font-size:12px;font-weight:600;color:var(--tx)}
.sidebar-acct .sa-email{font-size:10px;color:var(--g4)}

/* Sidebar collapse */
.sb-collapsed .sidebar{width:var(--sb-wc)}
.sb-collapsed .main{margin-left:var(--sb-wc)}
.sb-toggle{position:absolute;top:20px;right:-12px;width:28px;height:28px;border-radius:8px;background:transparent;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:101;transition:all .15s;color:var(--g4);opacity:0}
.sidebar:hover .sb-toggle,.sb-toggle:focus{opacity:1}
.sb-toggle:hover{color:var(--ac);background:rgba(96,77,255,.06)}
.sb-back-toggle{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;color:var(--g4);font-size:12px;font-weight:500;font-family:var(--sans);background:none;border:none;border-radius:10px;transition:all .15s;width:100%;text-align:left}
.sb-back-toggle:hover{color:var(--ac);background:var(--g1)}
.sb-collapsed .sb-back-toggle{justify-content:center;padding:10px}
.sb-collapsed .sb-back-toggle .sb-label{display:none}
.sb-collapsed .sidebar-header{padding:12px 0 8px;display:flex;flex-direction:column;align-items:center;gap:6px}
.sb-collapsed .sidebar-logo{justify-content:center}
.sb-collapsed .sidebar-logo .sb-name,.sb-collapsed .sidebar-logo .sb-email{display:none}
.sb-collapsed .sidebar-nav{padding:8px 6px;overflow:visible}
.sb-collapsed .sidebar-item{justify-content:center;padding:10px;gap:0}
.sb-label{white-space:nowrap;overflow:hidden;transition:opacity .15s}
.sb-collapsed .sb-label{display:none}
.sb-collapsed .sidebar-badge{position:absolute;top:2px;right:2px;min-width:14px;height:14px;font-size:8px;padding:0 3px}
.sb-collapsed .sidebar-acct{justify-content:center;padding:12px 0}
.sb-collapsed .sidebar-acct > div:last-child{display:none}
.sb-collapsed .sidebar-footer{padding:8px 6px}
.sb-collapsed .sidebar-item.active::before{left:2px}
.sb-tip{position:absolute;left:calc(100% + 12px);top:50%;transform:translateY(-50%);background:var(--tx);color:#fff;font-size:11px;font-weight:500;padding:4px 10px;border-radius:6px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;z-index:200}
.sb-tip::before{content:'';position:absolute;right:100%;top:50%;transform:translateY(-50%);border:4px solid transparent;border-right-color:var(--tx)}
.sb-collapsed .sidebar-item:hover .sb-tip{opacity:1}

/* ━━━ Main ━━━ */
.main{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin-left .25s cubic-bezier(.4,0,.2,1)}
.topbar{display:flex;align-items:center;justify-content:flex-end;padding:10px 36px;gap:12px;flex-shrink:0;height:52px}
.topbar-studio{font-family:var(--sans);font-size:11px;font-weight:600;padding:0 14px;height:36px;border-radius:40px;background:linear-gradient(135deg,rgba(96,77,255,.08),rgba(96,77,255,.15));color:var(--ac);border:1px solid rgba(96,77,255,.12);cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px}
.topbar-studio:hover{background:linear-gradient(135deg,rgba(96,77,255,.15),rgba(96,77,255,.25));transform:translateY(-1px)}
.notif-bell{position:relative;width:36px;height:36px;border-radius:50%;background:var(--sf);box-shadow:0 1px 4px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.03);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:all .15s;font-size:16px;color:var(--g5)}
.notif-bell:hover{background:var(--g1);color:var(--tx)}
.notif-bell .notif-dot{position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:var(--red);border:2px solid var(--sf)}
.notif-bell .notif-count{position:absolute;top:-2px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:var(--red);color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid var(--sf)}
.dark .notif-bell{background:var(--g1);box-shadow:0 1px 4px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.04)}
.dark .notif-bell .notif-dot,.dark .notif-bell .notif-count{border-color:var(--g1)}
.topbar-avatar{display:flex;align-items:center;gap:8px;cursor:pointer;padding:0 12px 0 4px;height:36px;border-radius:40px;border:1px solid var(--g2);transition:all .15s;background:var(--sf)}
.topbar-avatar:hover{border-color:var(--ac)}
.topbar-avatar img{width:28px;height:28px;border-radius:50%;object-fit:cover}
.topbar-avatar .ta-name{font-size:12px;font-weight:600;color:var(--tx)}
.topbar-avatar .ta-plan{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ac);background:rgba(96,77,255,.08);padding:1px 6px;border-radius:40px}
.content{padding:16px 36px 32px;max-width:1200px;margin:0 auto;width:100%}

/* ━━━ Page headers ━━━ */
.pg-header{margin-bottom:20px}
.pg-header h1{font-family:var(--serif);font-size:32px;font-weight:400;margin-bottom:4px}
.pg-header h1 em{font-style:italic;color:var(--ac)}
.pg-header .pg-sub{font-size:14px;color:var(--g5);line-height:1.5}

/* ━━━ Buttons ━━━ */
.btn{font-family:var(--sans);font-size:13px;font-weight:600;padding:9px 20px;border-radius:40px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap}
.btn-p{background:linear-gradient(135deg,#7A66FF,#4A35E0);color:#fff;box-shadow:0 2px 8px rgba(96,77,255,.2)}.btn-p:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 14px rgba(96,77,255,.3)}.btn-p:active{transform:scale(.96)}
.btn-s{background:var(--g1);color:var(--g6)}.btn-s:hover{background:var(--g2)}.btn-s:active{transform:scale(.97)}
.btn-g{background:transparent;color:var(--g5)}.btn-g:hover{color:var(--tx)}
.btn-sm{padding:6px 14px;font-size:11px}
.btn-lg{padding:12px 28px;font-size:14px}
.btn-danger{background:#FFF0F0;color:var(--red)}.btn-danger:hover{background:#FFE0E0}
.btn-success{background:#E6FFF0;color:var(--green)}.btn-success:hover{background:#D0FFE0}
.chip{font-family:var(--sans);font-size:11px;font-weight:500;padding:5px 12px;border:1px solid var(--g2);border-radius:40px;background:var(--sf);cursor:pointer;transition:all .15s;color:var(--g5)}.chip:active{transform:scale(.95)}
.chip:hover{border-color:var(--ac);color:var(--ac)}
.chip.on{background:linear-gradient(135deg,#7A66FF,#4A35E0);border-color:transparent;color:#fff;box-shadow:0 2px 6px rgba(96,77,255,.2)}

/* ━━━ Dashboard ━━━ */
.dash-banner{background:linear-gradient(135deg,#1a1040 0%,#2d1b69 25%,#4a2a8a 50%,#604DFF 75%,#2d1b69 100%);background-size:200% 200%;animation:bannerShift 8s ease infinite;border-radius:14px;padding:32px;color:#fff;margin-bottom:24px;animation:bannerShift 8s ease infinite,slideInUp .4s ease both}
.dash-banner .db-welcome{font-size:12px;color:rgba(255,255,255,.6);margin-bottom:6px;font-weight:500;text-transform:uppercase;letter-spacing:.05em}
.dash-banner .db-title{font-family:var(--serif);font-size:28px;font-weight:400}
.dash-banner .db-sub{font-size:13px;color:rgba(255,255,255,.5);margin-top:8px}
.dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.stat-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;padding:20px;animation:slideInUp .3s ease both}
.stat-card:nth-child(1){animation-delay:.05s}.stat-card:nth-child(2){animation-delay:.1s}.stat-card:nth-child(3){animation-delay:.15s}.stat-card:nth-child(4){animation-delay:.2s}
.stat-card .sc-val{font-family:var(--mono);font-size:28px;font-weight:700;color:var(--ac);margin-bottom:2px}
.stat-card .sc-label{font-size:11px;color:var(--g4);text-transform:uppercase;letter-spacing:.05em}
.dash-section{background:var(--sf);border:1px solid var(--g2);border-radius:16px;padding:20px;margin-bottom:16px;animation:slideInUp .3s ease both}
.dash-section h3{font-size:14px;font-weight:600;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.dash-section h3 .ds-count{font-size:10px;font-weight:700;padding:2px 7px;border-radius:40px;background:var(--g1);color:var(--g4)}
.dash-app-row{display:flex;align-items:center;gap:14px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .15s}
.dash-app-row:hover{background:var(--g1)}
.dash-app-row .dar-logo{width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0}
.dash-app-row .dar-info{flex:1;min-width:0}
.dash-app-row .dar-title{font-size:13px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dash-app-row .dar-company{font-size:11px;color:var(--g4)}
.dash-app-row .dar-status{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:3px 10px;border-radius:40px}
.dash-opp-card{background:var(--g1);border-radius:12px;overflow:hidden;cursor:pointer;transition:all .2s}
.dash-opp-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.dash-opp-card .doc-banner{width:100%;height:100px;object-fit:cover}
.dash-opp-card .doc-body{padding:12px 14px}
.dash-opp-card .doc-title{font-size:13px;font-weight:600;margin-bottom:2px}
.dash-opp-card .doc-company{font-size:11px;color:var(--g4);margin-bottom:6px}
.dash-opp-card .doc-meta{display:flex;gap:8px;font-size:10px;color:var(--g5)}
.dash-opp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}

/* Checklist */
.checklist{display:flex;flex-direction:column;gap:2px}
.checklist-item{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--g5);padding:6px 8px;border-radius:8px;cursor:pointer;transition:background .1s;user-select:none}
.checklist-item:hover{background:var(--g1)}
.ci-dot{width:20px;height:20px;border-radius:6px;border:2px solid var(--g3);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;font-size:11px}
.ci-dot.done{background:var(--green);border-color:var(--green);color:#fff;transform:scale(1.05)}
.ci-label.done{text-decoration:line-through;color:var(--g4)}

/* ━━━ Overlay / Modal ━━━ */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:300;animation:fadeIn .15s ease}
.overlay>div{background:var(--sf);border-radius:24px;padding:36px;max-width:560px;width:90%;max-height:90vh;overflow-y:auto;animation:scaleIn .2s ease;box-shadow:0 24px 64px rgba(0,0,0,.12)}
.overlay>div::-webkit-scrollbar{width:0}
.overlay h2{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:4px}
.overlay .modal-sub{font-size:13px;color:var(--g4);margin-bottom:24px}
.overlay .modal-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;border:none;background:var(--g1);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--g5);transition:all .15s}
.overlay .modal-close:hover{background:var(--g2);color:var(--tx)}

/* Welcome modal */
.welcome-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
.welcome-card{display:flex;align-items:flex-start;gap:12px;padding:14px;border:1px solid var(--g2);border-radius:14px;transition:all .15s}
.welcome-card:hover{border-color:var(--ac);background:rgba(96,77,255,.02)}
.welcome-card .wc-icon{font-size:24px;flex-shrink:0;width:40px;height:40px;border-radius:10px;background:var(--g1);display:flex;align-items:center;justify-content:center}
.welcome-card .wc-title{font-size:13px;font-weight:600;color:var(--tx);margin-bottom:2px}
.welcome-card .wc-desc{font-size:11px;color:var(--g4);line-height:1.4}

/* ━━━ Fields ━━━ */
.field{margin-bottom:16px}
.field label{display:block;font-size:12px;font-weight:600;margin-bottom:6px;color:var(--g6)}
.field input,.field textarea,.field select{width:100%;padding:11px 14px;border:1px solid var(--g2);border-radius:10px;font-family:var(--sans);font-size:13px;background:var(--g1);transition:border .2s;outline:none;color:var(--tx)}
.field input:focus,.field textarea:focus,.field select:focus{border-color:var(--ac);background:#fff}
.field input::placeholder,.field textarea::placeholder{color:var(--g4)}
.field textarea{height:80px;resize:none}

/* ━━━ Tab bar ━━━ */
.tab-bar{display:flex;gap:0;border-bottom:1px solid var(--g2);margin-bottom:24px}
.tab-btn{font-family:var(--sans);font-size:13px;font-weight:500;color:var(--g4);padding:10px 18px;cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap}
.tab-btn:hover{color:var(--g6)}
.tab-btn.on{color:var(--tx);font-weight:600;border-bottom-color:var(--ac)}

/* ━━━ Profile ━━━ */
.profile-header{display:flex;gap:24px;align-items:flex-start;margin-bottom:32px;animation:slideInUp .3s ease}
.profile-photo{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--g2);flex-shrink:0}
.profile-info{flex:1}
.profile-info h2{font-family:var(--serif);font-size:24px;font-weight:400;margin-bottom:4px}
.profile-info .pi-location{font-size:13px;color:var(--g4);margin-bottom:8px;display:flex;align-items:center;gap:4px}
.profile-info .pi-styles{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px}
.profile-info .pi-styles span{font-size:10px;padding:3px 10px;border-radius:40px;background:var(--g1);color:var(--g5)}
.profile-info .pi-links{display:flex;gap:8px}
.profile-info .pi-links a{font-size:11px;font-weight:600;color:var(--ac);text-decoration:none;padding:4px 12px;border:1px solid rgba(96,77,255,.2);border-radius:40px;transition:all .15s}
.profile-info .pi-links a:hover{background:rgba(96,77,255,.06)}
.info-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;padding:20px;margin-bottom:16px;animation:slideInUp .3s ease both}
.info-card h4{font-size:13px;font-weight:600;margin-bottom:12px;color:var(--tx)}
.info-row{display:flex;align-items:center;padding:6px 0;font-size:13px}
.info-row .ir-label{width:120px;color:var(--g4);flex-shrink:0}
.info-row .ir-value{color:var(--tx);font-weight:500}
.bio-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;padding:20px;margin-bottom:16px;animation:slideInUp .3s ease both}
.bio-card h4{font-size:13px;font-weight:600;margin-bottom:8px}
.bio-card p{font-size:13px;color:var(--g5);line-height:1.6}

/* ━━━ Stage Record ━━━ */
.sr-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.sr-count{font-size:10px;font-weight:700;padding:3px 10px;border-radius:40px;background:var(--g1);color:var(--g4);text-transform:uppercase;letter-spacing:.05em}
.sr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px;animation:fadeIn .3s ease}
.sr-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;padding:18px;transition:all .2s;cursor:pointer;position:relative;animation:popIn .25s ease both}
.sr-card:nth-child(1){animation-delay:.03s}.sr-card:nth-child(2){animation-delay:.06s}.sr-card:nth-child(3){animation-delay:.09s}.sr-card:nth-child(4){animation-delay:.12s}
.sr-card:hover{border-color:rgba(96,77,255,.18);transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.sr-card .sr-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:40px;display:inline-flex;align-items:center;gap:4px;margin-bottom:8px}
.sr-card .sr-title{font-size:15px;font-weight:600;color:var(--tx);margin-bottom:2px}
.sr-card .sr-org{font-size:12px;color:var(--ac);margin-bottom:4px}
.sr-card .sr-date{font-size:11px;color:var(--g4);margin-bottom:6px;display:flex;align-items:center;gap:4px}
.sr-card .sr-desc{font-size:12px;color:var(--g5);line-height:1.5;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sr-card .sr-tags{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px}
.sr-card .sr-tags span{font-size:9px;padding:2px 7px;border-radius:40px;background:var(--g1);color:var(--g5)}
.sr-card .sr-usage{font-size:10px;font-weight:600;display:flex;align-items:center;gap:4px}
.sr-card .sr-usage.used{color:var(--green)}
.sr-card .sr-usage.unused{color:var(--amber)}
.sr-list{display:flex;flex-direction:column;gap:6px;animation:fadeIn .3s ease}
.sr-list-item{display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--sf);border:1px solid var(--g2);border-radius:12px;border-left:3px solid var(--ac);cursor:pointer;transition:all .15s}
.sr-list-item:hover{border-color:var(--ac);box-shadow:0 2px 8px rgba(96,77,255,.06)}
.sr-list-item .sli-info{flex:1;min-width:0}
.sr-list-item .sli-title{font-size:13px;font-weight:600;color:var(--tx)}
.sr-list-item .sli-sub{font-size:11px;color:var(--g4)}
.sr-list-item .sli-period{font-size:11px;color:var(--g5);white-space:nowrap}
.sr-list-item .sli-usage{font-size:10px;font-weight:600;white-space:nowrap}

/* New Entry Modal */
.entry-type-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.entry-type-card{display:flex;align-items:center;gap:12px;padding:16px;border:1px solid var(--g2);border-radius:14px;cursor:pointer;transition:all .15s;background:var(--sf)}
.entry-type-card:hover{border-color:var(--ac);background:rgba(96,77,255,.02)}
.entry-type-card.selected{border-color:var(--ac);background:rgba(96,77,255,.06);box-shadow:0 0 0 1px var(--ac)}
.entry-type-card .etc-emoji{font-size:24px}
.entry-type-card .etc-title{font-size:13px;font-weight:600;color:var(--tx)}
.entry-type-card .etc-sub{font-size:10px;color:var(--g4)}

/* ━━━ Applications ━━━ */
.app-list{display:flex;flex-direction:column;gap:8px;animation:fadeIn .3s ease}
.app-card{display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--sf);border:1px solid var(--g2);border-radius:14px;cursor:pointer;transition:all .2s;animation:slideInUp .3s ease both}
.app-card:nth-child(1){animation-delay:.03s}.app-card:nth-child(2){animation-delay:.06s}.app-card:nth-child(3){animation-delay:.09s}.app-card:nth-child(4){animation-delay:.12s}
.app-card:hover{border-color:rgba(96,77,255,.18);transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.app-card .ac-logo{width:44px;height:44px;border-radius:12px;object-fit:cover;flex-shrink:0}
.app-card .ac-info{flex:1;min-width:0}
.app-card .ac-title{font-size:14px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app-card .ac-company{font-size:12px;color:var(--g4)}
.app-card .ac-meta{display:flex;gap:16px;font-size:11px;color:var(--g5);margin-top:4px}
.app-card .ac-status{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:4px 12px;border-radius:40px;flex-shrink:0}

/* ━━━ Spotlight (Room pattern) ━━━ */
.spotlight-hero{width:100%;height:200px;border-radius:16px;overflow:hidden;position:relative;margin-bottom:24px;animation:slideInUp .3s ease both}
.spotlight-hero img{width:100%;height:100%;object-fit:cover}
.spotlight-hero .sh-overlay{position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.7));display:flex;align-items:flex-end;padding:24px}
.spotlight-hero .sh-title{font-family:var(--serif);font-size:24px;font-weight:400;color:#fff}
.spotlight-hero .sh-company{font-size:13px;color:rgba(255,255,255,.7);margin-top:4px}
.spotlight-hero .sh-status{position:absolute;top:16px;right:16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:5px 14px;border-radius:40px}
.breadcrumb{font-size:12px;color:var(--g4);margin-bottom:16px;display:flex;align-items:center;gap:6px}
.breadcrumb a{color:var(--g5);text-decoration:none;cursor:pointer;transition:color .15s}
.breadcrumb a:hover{color:var(--ac)}
.spotlight-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;animation:slideInUp .3s ease both;animation-delay:.1s}
.spotlight-grid.single{grid-template-columns:1fr}
.invitation-bar{background:#FFF8E6;border:1px solid rgba(245,166,35,.2);border-radius:12px;padding:16px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px;animation:slideInUp .3s ease both}
.invitation-bar .ib-icon{font-size:24px}
.invitation-bar .ib-text{flex:1;font-size:13px;color:var(--g6)}
.invitation-bar .ib-text strong{color:var(--tx)}

/* Chat bubbles */
.chat-area{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.chat-msg{max-width:80%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;animation:popIn .2s ease}
.chat-msg.them{background:var(--g1);color:var(--tx);align-self:flex-start;border-bottom-left-radius:4px}
.chat-msg.me{background:rgba(96,77,255,.1);color:var(--ac);align-self:flex-end;border-bottom-right-radius:4px}
.chat-msg .cm-time{font-size:10px;color:var(--g4);margin-top:4px}

/* ━━━ Discover ━━━ */
.opp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;animation:fadeIn .3s ease}
.opp-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;overflow:hidden;transition:all .2s;cursor:pointer;animation:popIn .25s ease both}
.opp-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.opp-card .oc-banner{width:100%;height:120px;object-fit:cover}
.opp-card .oc-body{padding:14px 16px}
.opp-card .oc-title{font-size:14px;font-weight:600;color:var(--tx);margin-bottom:2px}
.opp-card .oc-company{font-size:12px;color:var(--g4);margin-bottom:6px}
.opp-card .oc-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.opp-card .oc-meta span{font-size:10px;padding:3px 8px;border-radius:40px;background:var(--g1);color:var(--g5)}
.opp-card .oc-footer{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--g4)}
.opp-card .oc-save{width:28px;height:28px;border-radius:50%;border:1px solid var(--g2);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .15s}
.opp-card .oc-save:hover{border-color:var(--ac);color:var(--ac)}
.opp-card .oc-save.saved{background:rgba(96,77,255,.08);border-color:var(--ac);color:var(--ac)}

/* ━━━ Present / Portfolios ━━━ */
.pf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;animation:fadeIn .3s ease}
.pf-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;overflow:hidden;transition:all .2s;cursor:pointer}
.pf-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.pf-card .pfc-cover{width:100%;height:140px;object-fit:cover}
.pf-card .pfc-body{padding:14px 16px}
.pf-card .pfc-title{font-size:14px;font-weight:600;margin-bottom:4px}
.pf-card .pfc-meta{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--g4)}
.pf-card .pfc-status{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 8px;border-radius:40px}

/* ━━━ Media Library ━━━ */
.media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;animation:fadeIn .3s ease}
.media-item{background:var(--sf);border:1px solid var(--g2);border-radius:12px;overflow:hidden;transition:all .2s;cursor:pointer;position:relative}
.media-item:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(96,77,255,.08)}
.media-item .mi-thumb{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:var(--g1)}
.media-item .mi-placeholder{width:100%;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;background:var(--g1);font-size:28px}
.media-item .mi-body{padding:10px 12px}
.media-item .mi-title{font-size:12px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.media-item .mi-meta{font-size:10px;color:var(--g4);margin-top:2px}
.media-item .mi-badge{position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;text-transform:uppercase;padding:2px 7px;border-radius:40px;color:#fff}
.media-item .mi-check{position:absolute;top:8px;left:8px;width:22px;height:22px;border-radius:6px;border:2px solid rgba(255,255,255,.7);background:rgba(0,0,0,.2);display:none;align-items:center;justify-content:center;color:#fff;font-size:12px;cursor:pointer;transition:all .15s}
.media-item:hover .mi-check{display:flex}
.media-item .mi-check.checked{display:flex;background:var(--ac);border-color:var(--ac)}
.media-action-bar{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--tx);color:#fff;padding:12px 20px;border-radius:14px;display:flex;align-items:center;gap:16px;font-size:13px;z-index:200;animation:slideUp .2s ease;box-shadow:0 8px 32px rgba(0,0,0,.2)}

/* ━━━ Network (stubs) ━━━ */
.stub-section{text-align:center;padding:60px 20px;color:var(--g4);animation:fadeIn .3s ease}
.stub-section .stub-icon{font-size:48px;margin-bottom:12px}
.stub-section p{font-size:14px;margin-top:8px}
.stub-section .stub-title{font-size:16px;font-weight:600;color:var(--g5)}

/* ━━━ Messages ━━━ */
.msg-list{display:flex;flex-direction:column;animation:fadeIn .3s ease}
.msg-item{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--g2);cursor:pointer;transition:all .15s}
.msg-item:hover{background:var(--g1)}
.msg-item.unread{background:rgba(96,77,255,.02)}
.msg-item .mi-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0}
.msg-item .mi-info{flex:1;min-width:0}
.msg-item .mi-from{font-size:13px;font-weight:600;color:var(--tx)}
.msg-item .mi-preview{font-size:12px;color:var(--g4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.msg-item .mi-time{font-size:10px;color:var(--g4);flex-shrink:0}
.msg-item .mi-unread-dot{width:8px;height:8px;border-radius:50%;background:var(--ac);flex-shrink:0}

/* ━━━ Notification Panel ━━━ */
@keyframes npSlideIn{from{transform:translateX(100%);opacity:.8}to{transform:translateX(0);opacity:1}}
@keyframes npSlideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:.8}}
.notif-panel-overlay{position:fixed;inset:0;z-index:190;background:rgba(0,0,0,.15);animation:fadeIn .2s}
.notif-panel{position:fixed;top:12px;right:12px;bottom:12px;width:400px;max-width:calc(100vw - 24px);z-index:200;background:var(--sf);box-shadow:0 8px 40px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04);border-radius:20px;display:flex;flex-direction:column;animation:npSlideIn .3s cubic-bezier(.4,0,.2,1);overflow:hidden}
.np-header{padding:20px 20px 0;flex-shrink:0}
.np-header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.np-header-top h2{font-family:var(--serif);font-size:22px;font-weight:400;margin:0}
.np-close{width:32px;height:32px;border-radius:50%;border:none;background:var(--g1);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--g5);font-size:14px;transition:all .15s}
.np-close:hover{background:var(--g2);color:var(--tx)}
.np-mark-read{font-size:11px;font-weight:500;color:var(--ac);background:none;border:none;cursor:pointer;padding:0;font-family:var(--sans)}
.np-mark-read:hover{text-decoration:underline}
.np-cats{display:flex;gap:4px;overflow-x:auto;padding-bottom:12px;border-bottom:1px solid var(--g2);scrollbar-width:none;-ms-overflow-style:none}
.np-cats::-webkit-scrollbar{display:none}
.np-cat{padding:5px 12px;border-radius:40px;border:1px solid var(--g2);background:var(--sf);font-family:var(--sans);font-size:11px;font-weight:500;color:var(--g5);cursor:pointer;white-space:nowrap;transition:all .15s}
.np-cat:hover{border-color:var(--g3);color:var(--tx)}
.np-cat.active{background:var(--tx);color:var(--bg);border-color:var(--tx)}
.np-list{flex:1;overflow-y:auto;padding:8px 0}
.np-item{display:flex;gap:12px;padding:14px 20px;cursor:pointer;transition:background .15s;position:relative}
.np-item:hover{background:var(--g1)}
.np-item.unread{background:rgba(96,77,255,.03)}
.np-item.unread::before{content:'';position:absolute;left:8px;top:50%;transform:translateY(-50%);width:5px;height:5px;border-radius:50%;background:var(--ac)}
.np-item-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
.np-item-body{flex:1;min-width:0}
.np-item-title{font-size:13px;font-weight:600;color:var(--tx);margin-bottom:2px;display:flex;align-items:center;gap:6px}
.np-item-time{font-size:10px;font-weight:400;color:var(--g4);margin-left:auto;white-space:nowrap}
.np-item-text{font-size:12px;color:var(--g5);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dark .notif-panel{background:var(--sf);box-shadow:0 8px 40px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.06)}
.dark .np-item.unread{background:rgba(96,77,255,.06)}

/* ━━━ Messenger (WhatsApp-style) ━━━ */
.messenger{display:grid;grid-template-columns:320px 1fr;height:calc(100vh - 160px);border-radius:20px;overflow:hidden;border:1px solid var(--g1);background:var(--sf);animation:fadeIn .3s}
.ms-sidebar{border-right:1px solid var(--g1);display:flex;flex-direction:column;overflow:hidden}
.ms-sidebar-header{padding:16px;border-bottom:1px solid var(--g1);flex-shrink:0}
.ms-sidebar-header h3{font-family:var(--serif);font-size:18px;font-weight:400;margin-bottom:10px}
.ms-search{width:100%;padding:8px 12px;border:1px solid var(--g2);border-radius:10px;font-size:12px;font-family:var(--sans);outline:none;background:var(--bg);color:var(--tx)}
.ms-search::placeholder{color:var(--g4)}
.ms-search:focus{border-color:var(--ac)}
.ms-contacts{flex:1;overflow-y:auto}
.ms-contact{display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;transition:background .15s;border-left:3px solid transparent}
.ms-contact:hover{background:var(--g1)}
.ms-contact.active{background:rgba(96,77,255,.05);border-left-color:var(--ac)}
.ms-contact .ms-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0}
.ms-contact .ms-name{font-size:13px;font-weight:600;color:var(--tx)}
.ms-contact .ms-preview{font-size:11px;color:var(--g4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ms-contact .ms-time{font-size:9px;color:var(--g4);flex-shrink:0;margin-left:auto}
.ms-contact .ms-unread{width:8px;height:8px;border-radius:50%;background:var(--ac);flex-shrink:0}
.ms-thread{display:flex;flex-direction:column;height:100%}
.ms-thread-header{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--g1);flex-shrink:0}
.ms-thread-header img{width:36px;height:36px;border-radius:50%;object-fit:cover}
.ms-thread-header .ms-th-name{font-size:14px;font-weight:600;color:var(--tx)}
.ms-thread-header .ms-th-status{font-size:11px;color:var(--g4)}
.ms-thread-body{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:8px}
.ms-bubble{max-width:75%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.5;animation:fadeIn .15s}
.ms-bubble.them{background:var(--g1);color:var(--tx);border-bottom-left-radius:4px;align-self:flex-start}
.ms-bubble.me{background:var(--ac);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
.ms-bubble .ms-btime{font-size:9px;margin-top:4px;opacity:.6}
.ms-thread-input{display:flex;gap:8px;padding:12px 20px;border-top:1px solid var(--g1);flex-shrink:0}
.ms-thread-input textarea{flex:1;padding:10px 14px;border:1px solid var(--g2);border-radius:12px;background:var(--bg);font-family:var(--sans);font-size:13px;color:var(--tx);outline:none;resize:none;min-height:40px;max-height:100px}
.ms-thread-input textarea::placeholder{color:var(--g4)}
.ms-thread-input textarea:focus{border-color:var(--ac)}
.ms-empty{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--g4);font-size:13px}
.ms-empty-icon{font-size:40px;opacity:.4}
.dark .messenger{border-color:var(--g2);background:var(--sf)}
.dark .ms-sidebar{border-right-color:var(--g2)}
.dark .ms-sidebar-header{border-bottom-color:var(--g2)}
.dark .ms-contact.active{background:rgba(96,77,255,.1)}
.dark .ms-thread-header{border-bottom-color:var(--g2)}
.dark .ms-thread-input{border-top-color:var(--g2)}
.dark .ms-bubble.them{background:var(--g2)}

/* ━━━ Toast ━━━ */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--tx);color:#fff;padding:12px 24px;border-radius:10px;font-size:13px;font-weight:500;z-index:500;animation:slideUp .2s ease;box-shadow:0 8px 24px rgba(0,0,0,.15)}

/* ━━━ List toolbar (shared) ━━━ */
.list-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.list-search{display:flex;align-items:center;gap:8px;padding:0 14px;border:1px solid var(--g2);border-radius:40px;background:var(--sf);flex:1;max-width:280px;height:36px}
.list-search input{border:none;outline:none;font-family:var(--sans);font-size:12px;flex:1;background:none;color:var(--tx)}
.list-search input::placeholder{color:var(--g4)}
.sort-filter{height:36px;padding:0 12px;border:1px solid var(--g2);border-radius:12px;background:var(--sf);font-family:var(--sans);font-size:11px;color:var(--g5);cursor:pointer;outline:none}
.dark .sort-filter{background:var(--g1);border-color:var(--g3);color:var(--tx)}
.view-toggle{display:flex;border:1px solid var(--g2);border-radius:8px;overflow:hidden;height:36px}
.view-toggle button{padding:0 10px;background:none;border:none;cursor:pointer;color:var(--g4);transition:all .15s;height:100%;display:flex;align-items:center}
.view-toggle button.active{background:var(--ac);color:#fff}

/* ━━━ Spotlight context (room pattern) ━━━ */
@keyframes ctxPanelIn{from{opacity:.85;transform:scale(.995)}to{opacity:1;transform:scale(1)}}
@keyframes ctxStagger{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes sbSlideIn{from{transform:translateX(-100%);opacity:.8}to{transform:translateX(0);opacity:1}}

.ctx-spotlight{background-image:radial-gradient(ellipse at 20% 0%,rgba(96,77,255,.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(96,77,255,.05) 0%,transparent 50%);transition:background .4s ease}
.ctx-spotlight::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--ac),transparent 80%);z-index:210;animation:fadeIn .4s}
.ctx-spotlight .main{position:fixed;top:12px;right:12px;bottom:12px;left:calc(var(--sb-w) + 24px);border-radius:20px;background:var(--sf);box-shadow:0 8px 40px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.03);animation:ctxPanelIn .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;margin:0;min-height:0}
.ctx-spotlight .main .breadcrumb-bar{border-radius:20px 20px 0 0;flex-shrink:0;position:sticky;top:0;z-index:10;border-image:linear-gradient(90deg,var(--ac) 0%,transparent 70%) 1}
.ctx-spotlight .main .content{overflow-y:auto;flex:1;min-height:0;padding-top:8px}
.ctx-spotlight .main .content>div>:first-child:not(.spotlight-hero){margin-top:8px}
.ctx-spotlight .main>*{animation:ctxStagger .3s ease backwards}
.ctx-spotlight .main>*:nth-child(1){animation-delay:0s}
.ctx-spotlight .main>*:nth-child(2){animation-delay:.03s}
.ctx-spotlight .main>*:nth-child(3){animation-delay:.06s}
.sb-collapsed.ctx-spotlight .main{left:calc(var(--sb-wc) + 24px)}
.ctx-spotlight .sidebar{top:12px;left:12px;bottom:12px;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.04);animation:sbSlideIn .3s cubic-bezier(.4,0,.2,1);overflow:hidden;background:linear-gradient(180deg,rgba(96,77,255,.05) 0%,var(--sf) 60%)}
.ctx-spotlight .topbar{display:none}
.dark .ctx-spotlight .main{box-shadow:0 8px 40px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.04)}
.dark .ctx-spotlight .sidebar{box-shadow:0 8px 40px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.06)}
.dark .ctx-spotlight{background-image:radial-gradient(ellipse at 20% 0%,rgba(122,102,255,.14) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(122,102,255,.08) 0%,transparent 50%)}

.breadcrumb-bar{padding:12px 20px;display:flex;align-items:center;gap:8px;font-size:12px;animation:fadeIn .2s;border-bottom:2px solid var(--g1);min-width:0}
.breadcrumb-bar>div:first-child{min-width:0;overflow:hidden;white-space:nowrap;flex:1}
.breadcrumb-bar .bc-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.breadcrumb-bar .bc-actions .btn{padding:6px 12px;font-size:11px}
.bc-link{color:var(--g4);cursor:pointer;transition:color .15s;font-weight:500}
.bc-link:hover{color:var(--ac)}
.dark .breadcrumb-bar{border-bottom-color:var(--g2)}
.dark .breadcrumb-bar .bc-link{color:var(--g5)}

/* Spotlight card rows */
.spotlight-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;animation:slideInUp .3s ease both}
.spotlight-row.two-col{grid-template-columns:1fr 1fr}
.spotlight-row .info-card{margin-bottom:0}
/* Message input */
.msg-input-wrap{display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--g1)}
.msg-input{flex:1;padding:10px 14px;border:1px solid var(--g2);border-radius:12px;background:var(--bg);font-family:var(--sans);font-size:13px;color:var(--tx);outline:none;resize:none;min-height:40px}
.msg-input:focus{border-color:var(--ac);box-shadow:0 0 0 3px rgba(96,77,255,.1)}
.msg-input::placeholder{color:var(--g4)}
.dark .msg-input{background:var(--g1);border-color:var(--g3)}
.dark .msg-input-wrap{border-top-color:var(--g2)}
/* Application two-col layout */
.app-submission{display:grid;grid-template-columns:280px 1fr;gap:20px;animation:slideInUp .3s ease both}
.app-left .info-card{margin-bottom:16px}
.app-right .info-card{margin-bottom:16px}
/* FAQ / Community / Plan stubs with content */
.faq-list{display:flex;flex-direction:column;gap:12px}
.faq-item{border:1px solid var(--g1);border-radius:14px;overflow:hidden;transition:all .15s}
.faq-item-q{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;font-size:13px;font-weight:600;color:var(--tx);background:transparent;border:none;width:100%;text-align:left;font-family:var(--sans)}
.faq-item-q:hover{background:rgba(96,77,255,.04)}
.faq-item-a{padding:0 16px 14px;font-size:13px;color:var(--g5);line-height:1.6}
.dark .faq-item{border-color:var(--g2)}
.community-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.community-card{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--g1);border-radius:14px;cursor:pointer;transition:all .15s}
.community-card:hover{border-color:var(--ac);background:rgba(96,77,255,.03)}
.community-card .cc-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover}
.community-card .cc-name{font-size:13px;font-weight:600;color:var(--tx)}
.community-card .cc-role{font-size:11px;color:var(--g4)}
.dark .community-card{border-color:var(--g2)}
.plan-checklist{display:flex;flex-direction:column;gap:10px}
.plan-item{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid var(--g1);border-radius:12px}
.plan-check{width:20px;height:20px;border-radius:6px;border:2px solid var(--g3);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:all .15s}
.plan-check.done{background:var(--green);border-color:var(--green);color:#fff}
.plan-item-content{flex:1}
.plan-item-title{font-size:13px;font-weight:600;color:var(--tx)}
.plan-item-desc{font-size:12px;color:var(--g4);margin-top:2px}
.dark .plan-item{border-color:var(--g2)}
/* Picker modal */
.picker-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:400;animation:fadeIn .15s ease}
.picker-modal{background:var(--sf);border-radius:24px;padding:0;max-width:820px;width:94%;max-height:85vh;display:flex;flex-direction:column;animation:scaleIn .2s ease;box-shadow:0 24px 64px rgba(0,0,0,.15);overflow:hidden}
.picker-modal::-webkit-scrollbar{width:0}
.picker-header{padding:24px 28px 0;flex-shrink:0}
.picker-header h3{font-family:var(--serif);font-size:22px;font-weight:400;margin-bottom:16px}
.picker-toolbar{display:flex;align-items:center;gap:8px;padding:0 28px 16px;flex-shrink:0;flex-wrap:wrap}
.picker-toolbar .pt-tabs{display:flex;gap:4px;flex:1;flex-wrap:wrap}
.picker-toolbar .pt-tab{padding:6px 14px;border-radius:20px;border:1px solid var(--g2);background:none;font-size:11px;font-weight:500;color:var(--g5);cursor:pointer;transition:all .15s;font-family:var(--sans)}
.picker-toolbar .pt-tab:hover{border-color:var(--ac);color:var(--ac)}
.picker-toolbar .pt-tab.active{background:var(--ac);color:#fff;border-color:var(--ac)}
.picker-toolbar .pt-search{padding:7px 12px;border:1px solid var(--g2);border-radius:10px;font-size:11px;font-family:var(--sans);color:var(--tx);background:var(--bg);outline:none;width:140px}
.picker-toolbar .pt-search::placeholder{color:var(--g4)}
.picker-toolbar .pt-search:focus{border-color:var(--ac);box-shadow:0 0 0 2px rgba(96,77,255,.1)}
.picker-body{flex:1;overflow-y:auto;padding:0 28px 16px}
.picker-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}
.picker-item{position:relative;border-radius:12px;overflow:hidden;border:2px solid var(--g1);cursor:pointer;transition:all .15s;background:var(--sf)}
.picker-item:hover{border-color:var(--ac)}
.picker-item.selected{border-color:var(--ac);box-shadow:0 0 0 2px rgba(96,77,255,.15)}
.picker-item .pi-check{position:absolute;top:8px;left:8px;width:22px;height:22px;border-radius:50%;background:var(--ac);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;opacity:0;transition:opacity .15s;z-index:2}
.picker-item.selected .pi-check{opacity:1}
.picker-item .pi-thumb{width:100%;height:110px;object-fit:cover;display:block;background:var(--g1)}
.picker-item .pi-placeholder{width:100%;height:110px;display:flex;align-items:center;justify-content:center;background:var(--g1);font-size:28px;color:var(--g3)}
.picker-item .pi-info{padding:8px 10px;display:flex;align-items:flex-start;justify-content:space-between;gap:4px}
.picker-item .pi-info-left{min-width:0;flex:1}
.picker-item .pi-title{font-size:11px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.picker-item .pi-date{font-size:9px;color:var(--g4);margin-top:2px}
.picker-item .pi-badge{font-size:8px;font-weight:700;padding:2px 6px;border-radius:6px;text-transform:uppercase;flex-shrink:0;margin-top:1px}
.picker-item .pi-dots{position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--g5);cursor:pointer;opacity:0;transition:opacity .15s}
.picker-item:hover .pi-dots{opacity:1}
.picker-footer{display:flex;align-items:center;justify-content:center;gap:12px;padding:14px 28px;border-top:1px solid var(--g1);flex-shrink:0;background:var(--sf)}
.picker-footer .pf-count{font-size:12px;color:var(--g5)}
.dark .picker-modal{background:var(--sf);border:1px solid var(--g2)}
.dark .picker-footer{border-top-color:var(--g2)}
.dark .picker-item{border-color:var(--g2)}
.dark .picker-toolbar .pt-tab{border-color:var(--g3);color:var(--g5)}
.dark .picker-toolbar .pt-search{background:var(--g1);border-color:var(--g3)}
/* SR picker */
.sr-picker-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border:2px solid var(--g1);border-radius:12px;cursor:pointer;transition:all .15s}
.sr-picker-item:hover{border-color:var(--ac);background:rgba(96,77,255,.03)}
.sr-picker-item.selected{border-color:var(--ac);background:rgba(96,77,255,.06)}
.sr-picker-item .spi-emoji{font-size:20px}
.sr-picker-item .spi-title{font-size:13px;font-weight:600;color:var(--tx)}
.sr-picker-item .spi-org{font-size:11px;color:var(--g4)}
.sr-picker-item .spi-type{font-size:10px;padding:2px 8px;border-radius:20px;text-transform:capitalize}
.sr-picker-item .spi-check{width:20px;height:20px;border-radius:50%;border:2px solid var(--g3);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.sr-picker-item.selected .spi-check{background:var(--ac);border-color:var(--ac);color:#fff}
.dark .sr-picker-item{border-color:var(--g2)}

/* ━━━ Mobile Top Bar ━━━ */
.mobile-topbar{display:none;position:fixed;top:0;left:0;right:0;height:56px;z-index:130;background:linear-gradient(to bottom,rgba(248,247,255,.55) 0%,rgba(248,247,255,.2) 60%,rgba(248,247,255,0) 100%);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);align-items:center;padding:0 16px;gap:10px;box-sizing:border-box}
.shell.dark .mobile-topbar{background:linear-gradient(to bottom,rgba(13,13,18,.55) 0%,rgba(13,13,18,.2) 60%,rgba(13,13,18,0) 100%)}
.mobile-topbar .mt-back{width:34px;height:34px;border-radius:50%;border:none;background:rgba(255,255,255,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--tx);flex-shrink:0;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.shell.dark .mobile-topbar .mt-back{background:rgba(255,255,255,.1)}
.mobile-topbar .mt-back:active{background:rgba(255,255,255,.8);transform:scale(.95)}
.mobile-topbar .mt-logo{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#7A66FF,#4A35E0);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0;box-shadow:0 2px 8px rgba(96,77,255,.25);overflow:hidden}
.mobile-topbar .mt-logo img{width:100%;height:100%;object-fit:cover}
.mobile-topbar .mt-title{font-family:var(--sans);font-size:15px;font-weight:600;color:var(--tx);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.mobile-topbar .mt-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.mobile-topbar .mt-bell{width:34px;height:34px;border-radius:50%;border:none;background:rgba(255,255,255,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--g5);position:relative;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.shell.dark .mobile-topbar .mt-bell{background:rgba(255,255,255,.1)}
.mobile-topbar .mt-bell:active{background:rgba(255,255,255,.8);transform:scale(.95)}
.mobile-topbar .mt-badge{position:absolute;top:0;right:0;min-width:16px;height:16px;border-radius:8px;background:var(--red);color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px}
.mobile-topbar .mt-hamburger{width:34px;height:34px;border-radius:50%;border:none;background:rgba(255,255,255,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;color:var(--tx);transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.shell.dark .mobile-topbar .mt-hamburger{background:rgba(255,255,255,.1)}

/* ━━━ Mobile Bottom Nav ━━━ */
.mobile-nav{display:none;position:fixed;bottom:12px;left:16px;right:16px;height:56px;background:rgba(255,255,255,.75);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.5);z-index:150;align-items:center;justify-content:space-around;padding:0 8px;border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04)}
.dark .mobile-nav{background:rgba(30,30,40,.75);border-color:rgba(255,255,255,.08);box-shadow:0 4px 24px rgba(0,0,0,.2)}
.mobile-nav button{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:9px;font-weight:500;color:var(--g4);padding:6px 12px;border-radius:12px;transition:all .15s}
.mobile-nav button.active{color:var(--ac);background:rgba(96,77,255,.1)}
.mobile-nav button.active svg{color:var(--ac)}
.mobile-nav button svg{width:18px;height:18px}

/* Mobile actions dropdown */
.mobile-actions-dropdown{position:fixed;top:0;left:0;right:0;bottom:0;z-index:200;display:flex;align-items:flex-start;justify-content:flex-end;padding:60px 12px 0;background:rgba(0,0,0,.3);animation:fadeIn .15s}
.mobile-actions-menu{background:var(--sf);border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.15);padding:6px;min-width:180px;animation:slideInUp .15s}
.mobile-actions-menu button{display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border:none;background:none;font-family:var(--sans);font-size:13px;font-weight:500;color:var(--tx);border-radius:10px;cursor:pointer;transition:background .1s}
.mobile-actions-menu button:hover{background:var(--g1)}

/* Mobile message page (full chat view) */
.mobile-chat-page{display:flex;flex-direction:column;height:calc(100vh - 136px);animation:fadeIn .2s}
.mobile-chat-page .mcp-header{display:flex;align-items:center;gap:12px;padding:0 0 16px;flex-shrink:0}
.mobile-chat-page .mcp-header img{width:40px;height:40px;border-radius:50%;object-fit:cover}
.mobile-chat-page .mcp-header .mcp-name{font-size:16px;font-weight:600;color:var(--tx)}
.mobile-chat-page .mcp-header .mcp-status{font-size:11px;color:var(--g4)}
.mobile-chat-page .mcp-body{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:8px 0}
.mobile-chat-page .mcp-input{display:flex;gap:8px;padding-top:12px;border-top:1px solid var(--g1);flex-shrink:0}

/* ━━━ Responsive ━━━ */
@media(max-width:768px){
  .sidebar{display:none!important}
  .main{margin-left:0!important;overflow-x:hidden;max-width:100vw;margin:0!important;border-radius:0!important}
  .topbar{display:none!important}
  .mobile-topbar{display:flex}
  .mobile-nav{display:flex}
  .shell{padding-top:56px;padding-bottom:80px}
  .content{padding:20px 16px}
  .pg-header{margin-bottom:16px}
  .pg-header h1{font-size:26px}
  .dash-stats{grid-template-columns:1fr 1fr}
  .dash-banner{padding:24px;border-radius:12px}
  .dash-banner .db-title{font-size:22px}
  .spotlight-grid{grid-template-columns:1fr}
  .spotlight-row{grid-template-columns:1fr!important}
  .welcome-grid{grid-template-columns:1fr}
  .messenger{grid-template-columns:1fr;height:auto;min-height:auto;border:none;background:transparent;border-radius:0}
  .ms-thread{display:none}
  .ms-empty{display:none}
  .ms-sidebar{border-right:none}
  .ms-sidebar-header{padding:0 0 12px}
  .ms-contact{border-radius:12px;margin-bottom:2px}
  .ctx-spotlight .main{position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;border-radius:0!important;box-shadow:none!important;min-height:auto;background:transparent!important}
  .ctx-spotlight .topbar{display:none!important}
  .ctx-spotlight::before{display:none}
  .breadcrumb-bar{display:none!important}
  .stat-card{padding:14px}
  .stat-card .sc-val{font-size:22px}
  .opp-grid{grid-template-columns:1fr}
  .media-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}
  .sr-grid{grid-template-columns:1fr}
  .sr-toolbar{gap:6px}
  .list-search{max-width:100%}
  .app-card{flex-direction:column;align-items:flex-start;gap:10px;padding:14px}
  .app-card .ac-status{align-self:flex-start}
  .app-submission{grid-template-columns:1fr}
  .community-grid{grid-template-columns:1fr}
  .info-card{padding:16px}
  .overlay>div{padding:24px 20px;border-radius:20px}
  .picker-modal{width:100%;max-width:100%;border-radius:20px 20px 0 0;max-height:90vh}
  .picker-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}
  .picker-toolbar{flex-direction:column;padding:0 16px 12px;gap:10px}
  .picker-toolbar .pt-tabs{width:100%;overflow-x:auto;flex-wrap:nowrap;scrollbar-width:none;-ms-overflow-style:none}
  .picker-toolbar .pt-tabs::-webkit-scrollbar{display:none}
  .picker-toolbar .pt-search{width:100%}
  .notif-panel{top:0;right:0;bottom:0;left:0;width:100%;max-width:100%;border-radius:0}
  .faq-list{gap:8px}
  .plan-checklist{gap:8px}
  .media-action-bar{bottom:80px;left:16px;right:16px;transform:none;border-radius:12px;padding:10px 16px;font-size:12px}
  .tab-bar{overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex-wrap:nowrap;gap:0;padding-bottom:0}
  .tab-bar::-webkit-scrollbar{display:none}
  .tab-btn{padding:10px 14px;font-size:12px;flex-shrink:0}
}
@media(max-width:480px){
  .dash-stats{grid-template-columns:1fr 1fr}
  .stat-card .sc-val{font-size:20px}
  .pg-header h1{font-size:22px}
  .content{padding:16px 12px}
  .spotlight-hero{height:160px;border-radius:12px}
}
`;

/* ━━━ SVG ICONS (inline) ━━━ */
const I = {
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  discover: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  network: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  present: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
  media: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  applications: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 18v-1"/><path d="M14 18v-3"/></svg>,
  academy: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  messages: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  back: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  panelL: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2.5"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="4.5" y1="8" x2="7" y2="8"/><line x1="4.5" y1="11" x2="7" y2="11"/><line x1="4.5" y1="14" x2="7" y2="14"/></svg>,
  sun: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  moon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  bell: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  grid: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>,
  list: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
  overview: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/></svg>,
  doc: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
  updates: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  faq: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  community: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  plan: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.855z"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  menu: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  inbox: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
};

/* ━━━ COMPONENT ━━━ */
export default function ArtistShell() {
  /* Auth */
  const [auth, setAuth] = useState("login"); // "login" | "signup" | "app"
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");

  /* Navigation */
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("lanced-artist-dark") === "true");

  /* Welcome */
  const [showWelcome, setShowWelcome] = useState(false);

  /* Profile */
  const [profileTab, setProfileTab] = useState("general");
  const [artist, setArtist] = useState(DEMO_ARTIST);

  /* Stage Record */
  const [stageRecords, setStageRecords] = useState(STAGE_RECORD);
  const [srView, setSrView] = useState("grid");
  const [srFilter, setSrFilter] = useState("all");
  const [srSearch, setSrSearch] = useState("");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryType, setNewEntryType] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [entryForm, setEntryForm] = useState({ title: "", org: "", start: "", end: "", location: "", desc: "", tags: "" });

  /* Applications */
  const [applications] = useState(MOCK_APPLICATIONS);
  const [appFilter, setAppFilter] = useState("all");
  const [appSort, setAppSort] = useState("newest");
  const [viewSpotlight, setViewSpotlight] = useState(null);
  const [spotlightTab, setSpotlightTab] = useState("overview");

  /* Discover */
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);

  /* Present */
  const [portfolios] = useState(MOCK_PORTFOLIOS);

  /* Media */
  const [mediaItems] = useState(MOCK_MEDIA);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [mediaSelected, setMediaSelected] = useState([]);

  /* Picker modals */
  const [showMediaPicker, setShowMediaPicker] = useState(null); // null | "video" | "photo"
  const [showSRPicker, setShowSRPicker] = useState(false);
  const [pickerSelected, setPickerSelected] = useState([]);
  const [pickerFilter, setPickerFilter] = useState("all");
  const [pickerSearch, setPickerSearch] = useState("");

  /* Messages */
  const [messages] = useState(MOCK_MESSAGES);
  const [activeChat, setActiveChat] = useState(null); // msg id

  /* Notifications */
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifFilter, setNotifFilter] = useState("all");

  /* Mobile */
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(null); // msg id for mobile full-page chat
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  /* Toast */
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  /* Checklist */
  const [checklist, setChecklist] = useState([
    { label: "Complete your profile", done: true },
    { label: "Upload a headshot", done: true },
    { label: "Add Stage Record entries", done: false },
    { label: "Create your first portfolio", done: false },
    { label: "Browse opportunities", done: false },
  ]);

  /* Dark mode effect */
  useEffect(() => {
    localStorage.setItem("lanced-artist-dark", darkMode);
  }, [darkMode]);

  /* ━━━ AUTH SCREEN ━━━ */
  if (auth !== "app") {
    return (
      <>
        <style>{CSS}</style>
        <div className="auth-page">
          <div className="auth-blob auth-blob-1" />
          <div className="auth-blob auth-blob-2" />
          <div className="auth-blob auth-blob-3" />
          <div className="auth-blob auth-blob-4" />
          <div className="auth-card">
            <div className="logo-big">
              <a href="https://lanced.eu" target="_blank" rel="noreferrer">
                <img src="/lanced-logo.svg" alt="Lanced" style={{ height: 80 }} />
              </a>
            </div>
            {auth === "login" ? (
              <>
                <h1>Welcome back</h1>
                <p className="auth-sub">Sign in to your artist dashboard</p>
                <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={authPass} onChange={e => setAuthPass(e.target.value)} />
                <button className="auth-btn" onClick={() => { setAuth("app"); setShowWelcome(true); }}>Sign In</button>
                <div className="auth-divider">or</div>
                <button className="auth-demo-btn" onClick={() => { setAuth("app"); setShowWelcome(true); }}>
                  Enter Demo Mode
                </button>
                <p className="auth-switch">
                  Don't have an account?{" "}
                  <a onClick={() => setAuth("signup")}>Create one</a>
                </p>
              </>
            ) : (
              <>
                <h1>Create your account</h1>
                <p className="auth-sub">Join the performing arts network</p>
                <input type="text" placeholder="Full name" value={authName} onChange={e => setAuthName(e.target.value)} />
                <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={authPass} onChange={e => setAuthPass(e.target.value)} />
                <button className="auth-btn" onClick={() => { setAuth("app"); setShowWelcome(true); }}>Create Account</button>
                <div className="auth-divider">or</div>
                <button className="auth-demo-btn" onClick={() => { setAuth("app"); setShowWelcome(true); }}>
                  Enter Demo Mode
                </button>
                <p className="auth-switch">
                  Already have an account?{" "}
                  <a onClick={() => setAuth("login")}>Sign in</a>
                </p>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ━━━ SIDEBAR NAV ITEMS ━━━ */
  const NAV_ITEMS = [
    { id: "dashboard", icon: I.dashboard, label: "Dashboard" },
    { id: "profile", icon: I.profile, label: "Profile" },
    { id: "discover", icon: I.discover, label: "Discover" },
    { id: "network", icon: I.network, label: "Network" },
    { id: "present", icon: I.present, label: "Present" },
    { id: "media", icon: I.media, label: "Media Library" },
    { id: "applications", icon: I.applications, label: "Applications", badge: applications.filter(a => a.status === "invited").length || null },
    { id: "academy", icon: I.academy, label: "Academy" },
    { id: "messages", icon: I.messages, label: "Messages", badge: messages.filter(m => m.unread).length || null },
  ];

  const SPOTLIGHT_TABS = [
    { id: "overview", icon: I.overview, label: "Overview" },
    { id: "application", icon: I.doc, label: "Application" },
    { id: "updates", icon: I.updates, label: "Updates" },
    { id: "faq", icon: I.faq, label: "FAQ" },
    { id: "community", icon: I.community, label: "Community" },
    { id: "plan", icon: I.plan, label: "Plan" },
  ];

  /* ━━━ FILTERED DATA ━━━ */
  const filteredApps = (appFilter === "all" ? applications : applications.filter(a => a.status === appFilter)).slice().sort((a, b) => {
    if (appSort === "newest") return b.submitted.localeCompare(a.submitted);
    if (appSort === "oldest") return a.submitted.localeCompare(b.submitted);
    if (appSort === "a-z") return a.opportunity.localeCompare(b.opportunity);
    if (appSort === "z-a") return b.opportunity.localeCompare(a.opportunity);
    if (appSort === "deadline") return a.deadline.localeCompare(b.deadline);
    return 0;
  });
  const filteredSR = stageRecords.filter(sr => {
    if (srFilter !== "all" && sr.type !== srFilter) return false;
    if (srSearch && !sr.title.toLowerCase().includes(srSearch.toLowerCase()) && !sr.org.toLowerCase().includes(srSearch.toLowerCase())) return false;
    return true;
  });
  const filteredMedia = mediaFilter === "all" ? mediaItems : mediaItems.filter(m => m.type === mediaFilter);
  const srCounts = { all: stageRecords.length, experience: stageRecords.filter(s => s.type === "experience").length, education: stageRecords.filter(s => s.type === "education").length, award: stageRecords.filter(s => s.type === "award").length, skills: stageRecords.filter(s => s.type === "skills").length, press: stageRecords.filter(s => s.type === "press").length, repertoire: stageRecords.filter(s => s.type === "repertoire").length };

  /* ━━━ HELPERS ━━━ */
  const calcAge = (dob) => {
    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  const handleSaveEntry = () => {
    const newEntry = {
      id: "sr" + (stageRecords.length + 1),
      type: newEntryType,
      emoji: { experience: "💼", education: "🎓", award: "🏆", skills: "⚡", press: "📰", repertoire: "🎭" }[newEntryType],
      title: entryForm.title,
      org: entryForm.org,
      start: entryForm.start,
      end: entryForm.end,
      location: entryForm.location,
      desc: entryForm.desc,
      tags: entryForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      usedIn: [],
    };
    if (editEntry) {
      setStageRecords(prev => prev.map(sr => sr.id === editEntry.id ? { ...sr, ...newEntry, id: sr.id } : sr));
    } else {
      setStageRecords(prev => [...prev, newEntry]);
    }
    setShowNewEntry(false);
    setNewEntryType(null);
    setEditEntry(null);
    setEntryForm({ title: "", org: "", start: "", end: "", location: "", desc: "", tags: "" });
    showToast(editEntry ? "Entry updated" : "Entry added to Stage Record");
  };

  const openEditEntry = (entry) => {
    setEditEntry(entry);
    setNewEntryType(entry.type);
    setEntryForm({ title: entry.title, org: entry.org, start: entry.start, end: entry.end, location: entry.location, desc: entry.desc, tags: entry.tags.join(", ") });
    setShowNewEntry(true);
  };

  const spotlightApp = viewSpotlight ? applications.find(a => a.id === viewSpotlight) : null;

  /* ━━━ RENDER PAGE CONTENT ━━━ */
  const renderPage = () => {
    /* ── Spotlight Mode ── */
    if (viewSpotlight && spotlightApp) {
      const sc = STATUS_COLORS[spotlightApp.status];
      return (
        <div>
          {spotlightTab === "overview" && (
            <div>
              <div className="spotlight-hero" style={{ marginTop: 16 }}>
                <img src={spotlightApp.banner} alt="" />
                <div className="sh-overlay">
                  <div>
                    <div className="sh-status" style={{ background: sc.bg, color: sc.color, marginBottom: 8 }}>{STATUS_LABELS[spotlightApp.status]}</div>
                    <div className="sh-title">{spotlightApp.opportunity}</div>
                    <div className="sh-company">{spotlightApp.company}</div>
                  </div>
                </div>
              </div>

              <div className="spotlight-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 0 }}>
                {[
                  { label: "DEADLINE", value: spotlightApp.deadline },
                  { label: "SUBMITTED", value: spotlightApp.submitted },
                  { label: "FORMAT", value: "In Person" },
                  { label: "STATUS", value: STATUS_LABELS[spotlightApp.status] },
                ].map((d, i) => (
                  <div key={i} className="info-card" style={{ textAlign: "center", padding: 16, marginBottom: 0 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--g4)", marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>{d.value}</div>
                  </div>
                ))}
              </div>

              {spotlightApp.status === "invited" && (
                <div className="invitation-bar">
                  <span className="ib-icon">🎉</span>
                  <div className="ib-text"><strong>Congratulations!</strong> You've been invited. Please confirm your attendance before the deadline.</div>
                  <button className="btn btn-success" onClick={() => showToast("Attendance confirmed!")}>Confirm Attendance</button>
                </div>
              )}
              <div className="spotlight-row">
                <div className="info-card">
                  <h4>Selection Status</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "3px 10px", borderRadius: 40, background: sc.bg, color: sc.color }}>{STATUS_LABELS[spotlightApp.status]}</span>
                  </div>
                  <div className="info-row"><span className="ir-label">Applicants</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>247</span></div>
                  <div className="info-row"><span className="ir-label">Shortlisted</span><span className="ir-value" style={{ fontFamily: "var(--mono)", color: "var(--ac)" }}>18</span></div>
                  <div className="info-row"><span className="ir-label">Invited</span><span className="ir-value" style={{ fontFamily: "var(--mono)", color: "var(--green)" }}>8</span></div>
                </div>
                <div className="info-card">
                  <h4>About This Opportunity</h4>
                  <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.6 }}>{spotlightApp.desc}</p>
                  <button className="btn btn-s btn-sm" style={{ marginTop: 12 }}>Full Post →</button>
                </div>
                <div className="info-card">
                  <h4>About {spotlightApp.company}</h4>
                  <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.6 }}>{spotlightApp.companyDesc}</p>
                </div>
              </div>
            </div>
          )}

          {spotlightTab === "application" && (
            <div className="app-submission">
              <div className="app-left">
                <div className="info-card">
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <img src={artist.photo} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{artist.name}</div>
                    <div style={{ fontSize: 12, color: "var(--g4)", marginTop: 2 }}>{artist.location}</div>
                  </div>
                  <div className="info-row"><span className="ir-label">Age</span><span className="ir-value">{calcAge(artist.dob)}</span></div>
                  <div className="info-row"><span className="ir-label">Gender</span><span className="ir-value">{artist.gender}</span></div>
                  <div className="info-row"><span className="ir-label">Height</span><span className="ir-value">{artist.height}</span></div>
                  <div className="info-row"><span className="ir-label">Nationality</span><span className="ir-value">{artist.nationality}</span></div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    <button className="btn btn-s btn-sm" style={{ flex: 1 }}>Resume</button>
                    <button className="btn btn-s btn-sm" style={{ flex: 1 }}>Instagram</button>
                  </div>
                  <button className="btn btn-s btn-sm" style={{ width: "100%", marginTop: 8 }}>Website</button>
                </div>
              </div>
              <div className="app-right">
                <div className="info-card">
                  <h4>Cover Letter / Motivation</h4>
                  <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.7 }}>{artist.bio}</p>
                </div>
                <div className="info-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h4 style={{ margin: 0 }}>Videos & Showreel</h4>
                    <button className="btn btn-s btn-sm" onClick={() => { setPickerSelected([]); setShowMediaPicker("video"); }}>+ Add from Library</button>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[{ title: "Showreel 2026", dur: "3:24" }, { title: "Studio Footage", dur: "2:10" }, { title: "Ballet Variation", dur: "1:45" }].map((v, i) => (
                      <div key={i} style={{ width: 160, borderRadius: 12, overflow: "hidden", border: "1px solid var(--g1)", cursor: "pointer" }}>
                        <div style={{ height: 90, background: "linear-gradient(135deg, var(--g1), var(--g2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>▶</div>
                        <div style={{ padding: "8px 10px" }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{v.title}</div>
                          <div style={{ fontSize: 10, color: "var(--g4)" }}>{v.dur}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="info-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h4 style={{ margin: 0 }}>Photos</h4>
                    <button className="btn btn-s btn-sm" onClick={() => { setPickerSelected([]); setShowMediaPicker("photo"); }}>+ Add from Library</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ height: 80, borderRadius: 10, background: "linear-gradient(135deg, var(--g1), var(--g2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "var(--g4)" }}>📷</div>
                    ))}
                  </div>
                </div>
                <div className="info-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h4 style={{ margin: 0 }}>Stage Record <span style={{ fontSize: 11, color: "var(--g4)", fontWeight: 400 }}>({stageRecords.filter(sr => sr.usedIn.includes("Resume")).length} entries)</span></h4>
                    <button className="btn btn-s btn-sm" onClick={() => { setPickerSelected([]); setShowSRPicker(true); }}>+ Add more</button>
                  </div>
                  {stageRecords.filter(sr => sr.usedIn.includes("Resume")).slice(0, 5).map(sr => (
                    <div key={sr.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--g1)" }}>
                      <span style={{ fontSize: 18 }}>{sr.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{sr.title}</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>{sr.org} · {sr.date}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "var(--g1)", color: "var(--g5)", textTransform: "capitalize" }}>{sr.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {spotlightTab === "updates" && (
            <div>
              <div className="spotlight-row two-col">
                <div className="info-card">
                  <h4>Direct Message</h4>
                  <div className="chat-area">
                    <div className="chat-msg them">
                      <div>Thank you for your application. We've reviewed your materials and are very impressed.</div>
                      <div className="cm-time">Mar 12, 2026</div>
                    </div>
                    <div className="chat-msg me">
                      <div>Thank you so much! I'm very excited about this opportunity. Please let me know if you need any additional materials.</div>
                      <div className="cm-time">Mar 13, 2026</div>
                    </div>
                    {spotlightApp.status === "invited" && (
                      <div className="chat-msg them">
                        <div>We're pleased to invite you to the final round! Details will follow shortly.</div>
                        <div className="cm-time">Mar 20, 2026</div>
                      </div>
                    )}
                  </div>
                  <div className="msg-input-wrap">
                    <textarea className="msg-input" placeholder="Type a message..." rows={1} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); showToast("Message sent!"); e.target.value = ""; }}} />
                    <button className="btn btn-p btn-sm" onClick={() => showToast("Message sent!")}>Send</button>
                  </div>
                </div>
                <div className="info-card">
                  <h4>Broadcast Channel</h4>
                  <div className="chat-area">
                    <div className="chat-msg them">
                      <div>Update: The audition schedule has been finalized. All applicants will receive individual time slots by email this week.</div>
                      <div className="cm-time">{spotlightApp.company} · Mar 8, 2026</div>
                    </div>
                    <div className="chat-msg them">
                      <div>Reminder: Please ensure your Stage Record is up to date before the audition. The panel will review your profile in advance.</div>
                      <div className="cm-time">{spotlightApp.company} · Mar 15, 2026</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 0 0", fontSize: 11, color: "var(--g4)", textAlign: "center" }}>Only {spotlightApp.company} can post in this channel</div>
                </div>
              </div>
            </div>
          )}

          {spotlightTab === "faq" && (
            <div>
              <div className="info-card">
                <h4>Frequently Asked Questions</h4>
                <div className="faq-list">
                  {[
                    { q: "What should I bring to the audition?", a: "Please bring a valid photo ID, your dance shoes (pointe and flat), and a printed copy of your CV. Water and a light snack are recommended." },
                    { q: "What is the audition format?", a: "The audition consists of a classical ballet class (1 hour), followed by a contemporary phrase (30 min). Shortlisted candidates will be asked to prepare a 1-minute solo." },
                    { q: "Can I submit additional materials after applying?", a: "Yes, you can update your media and stage record up until the application deadline. Any changes will be reflected in your submission." },
                    { q: "When will I hear back about my application?", a: "All applicants will be notified of their status within 2 weeks of the deadline. Shortlisted candidates will receive an email with audition details." },
                    { q: "Is housing provided for the contract period?", a: "The company offers a housing allowance and assistance in finding accommodation. Details will be shared with selected candidates." },
                  ].map((faq, i) => (
                    <div key={i} className="faq-item">
                      <button className="faq-item-q" onClick={e => { const a = e.currentTarget.nextElementSibling; a.style.display = a.style.display === "none" ? "block" : "none"; }}>
                        {faq.q}
                        <span style={{ color: "var(--g4)", fontSize: 16 }}>›</span>
                      </button>
                      <div className="faq-item-a" style={{ display: "none" }}>{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {spotlightTab === "community" && (
            <div>
              <div className="info-card" style={{ marginBottom: 16 }}>
                <h4>Applicant Community</h4>
                <p style={{ fontSize: 13, color: "var(--g4)", marginBottom: 16 }}>Connect with other applicants for this opportunity. {spotlightApp.company} may share updates and resources here.</p>
                <div className="community-grid">
                  {[
                    { name: "Léa Martin", role: "Contemporary Dancer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
                    { name: "James Okafor", role: "Ballet & Contemporary", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
                    { name: "Sofia Reyes", role: "Classical Ballet", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" },
                    { name: "Taro Yamamoto", role: "Physical Theatre", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
                  ].map((p, i) => (
                    <div key={i} className="community-card" onClick={() => showToast(`Viewing ${p.name}'s profile`)}>
                      <img className="cc-avatar" src={p.img} alt="" />
                      <div>
                        <div className="cc-name">{p.name}</div>
                        <div className="cc-role">{p.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="info-card">
                <h4>Discussion</h4>
                <div className="chat-area">
                  <div className="chat-msg them">
                    <div><strong>Léa Martin:</strong> Anyone else preparing a contemporary solo for the callback? Would love to share rehearsal space!</div>
                    <div className="cm-time">Mar 18, 2026</div>
                  </div>
                  <div className="chat-msg me">
                    <div>I'm also preparing one! I'm in Amsterdam — happy to meet at a studio.</div>
                    <div className="cm-time">Mar 19, 2026</div>
                  </div>
                </div>
                <div className="msg-input-wrap">
                  <textarea className="msg-input" placeholder="Join the conversation..." rows={1} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); showToast("Message sent!"); e.target.value = ""; }}} />
                  <button className="btn btn-p btn-sm" onClick={() => showToast("Message sent!")}>Send</button>
                </div>
              </div>
            </div>
          )}

          {spotlightTab === "plan" && (
            <div>
              <div className="info-card" style={{ marginBottom: 16 }}>
                <h4>Preparation Plan</h4>
                <p style={{ fontSize: 13, color: "var(--g4)", marginBottom: 16 }}>Track your preparation for this opportunity. Check items off as you complete them.</p>
                <div className="plan-checklist">
                  {[
                    { title: "Update Stage Record", desc: "Ensure all recent experience is added", done: true },
                    { title: "Upload new headshot", desc: "Professional photo, taken within last 6 months", done: true },
                    { title: "Record showreel", desc: "2-3 minutes showcasing your range", done: false },
                    { title: "Prepare classical variation", desc: "Select and rehearse a 1-minute solo", done: false },
                    { title: "Prepare contemporary solo", desc: "Original or repertoire piece, 1 minute", done: false },
                    { title: "Review company repertoire", desc: "Watch recent performances on their channel", done: false },
                    { title: "Confirm travel & accommodation", desc: "Book transport and lodging for audition dates", done: false },
                  ].map((item, i) => (
                    <div key={i} className="plan-item">
                      <div className={`plan-check${item.done ? " done" : ""}`} onClick={e => { e.currentTarget.classList.toggle("done"); }}>{item.done ? "✓" : ""}</div>
                      <div className="plan-item-content">
                        <div className="plan-item-title" style={item.done ? { textDecoration: "line-through", opacity: .6 } : {}}>{item.title}</div>
                        <div className="plan-item-desc">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="spotlight-row two-col">
                <div className="info-card">
                  <h4>Notes</h4>
                  <textarea className="msg-input" style={{ width: "100%", minHeight: 120 }} placeholder="Add personal notes for this audition..." />
                </div>
                <div className="info-card">
                  <h4>Important Dates</h4>
                  <div className="info-row"><span className="ir-label">Application Deadline</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>{spotlightApp.deadline}</span></div>
                  <div className="info-row"><span className="ir-label">Submitted</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>{spotlightApp.submitted}</span></div>
                  <div className="info-row"><span className="ir-label">Audition Period</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>TBD</span></div>
                  <div className="info-row"><span className="ir-label">Results Expected</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>TBD</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    switch (page) {
      /* ── Dashboard ── */
      case "dashboard":
        return (
          <div>
            <div className="dash-banner">
              <div className="db-welcome">Welcome back</div>
              <div className="db-title">{artist.name}</div>
              <div className="db-sub">Your performing arts career, all in one place.</div>
            </div>
            <div className="dash-stats">
              <div className="stat-card"><div className="sc-val">{applications.length}</div><div className="sc-label">Applications</div></div>
              <div className="stat-card"><div className="sc-val">{applications.filter(a => a.status === "shortlisted").length}</div><div className="sc-label">Shortlisted</div></div>
              <div className="stat-card"><div className="sc-val">{applications.filter(a => a.status === "invited").length}</div><div className="sc-label">Invitations</div></div>
              <div className="stat-card"><div className="sc-val">1.2k</div><div className="sc-label">Profile Views</div></div>
            </div>
            <div className="dash-section">
              <h3>Recent Applications <span className="ds-count">{applications.length}</span></h3>
              {applications.slice(0, 3).map(app => {
                const sc = STATUS_COLORS[app.status];
                return (
                  <div key={app.id} className="dash-app-row" onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }}>
                    <img className="dar-logo" src={app.companyLogo} alt="" />
                    <div className="dar-info">
                      <div className="dar-title">{app.opportunity}</div>
                      <div className="dar-company">{app.company}</div>
                    </div>
                    <span className="dar-status" style={{ background: sc.bg, color: sc.color }}>{STATUS_LABELS[app.status]}</span>
                  </div>
                );
              })}
              <button className="btn btn-g btn-sm" style={{ marginTop: 8 }} onClick={() => setPage("applications")}>View all applications →</button>
            </div>
            <div className="dash-section">
              <h3>Recommended Opportunities</h3>
              <div className="dash-opp-grid">
                {opportunities.slice(0, 3).map(opp => (
                  <div key={opp.id} className="dash-opp-card" onClick={() => setPage("discover")}>
                    <img className="doc-banner" src={opp.banner} alt="" />
                    <div className="doc-body">
                      <div className="doc-title">{opp.title}</div>
                      <div className="doc-company">{opp.company}</div>
                      <div className="doc-meta">
                        <span>{opp.location}</span>
                        <span>Deadline: {opp.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-section">
              <h3>Getting Started</h3>
              <div className="checklist">
                {checklist.map((item, i) => (
                  <div key={i} className="checklist-item" onClick={() => setChecklist(prev => prev.map((c, j) => j === i ? { ...c, done: !c.done } : c))}>
                    <div className={`ci-dot${item.done ? " done" : ""}`}>{item.done ? "✓" : ""}</div>
                    <span className={`ci-label${item.done ? " done" : ""}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      /* ── Profile ── */
      case "profile":
        return (
          <div>
            <div className="pg-header">
              <h1><em>Profile</em></h1>
              <p className="pg-sub">Your professional identity on Lanced</p>
            </div>
            <div className="tab-bar">
              {["general", "stage-record", "comp-card"].map(t => (
                <button key={t} className={`tab-btn${profileTab === t ? " on" : ""}`} onClick={() => setProfileTab(t)}>
                  {t === "general" ? "General Info" : t === "stage-record" ? "Stage Record" : "Comp Card"}
                </button>
              ))}
            </div>

            {profileTab === "general" && (
              <div>
                <div className="profile-header">
                  <img className="profile-photo" src={artist.photo} alt="" />
                  <div className="profile-info">
                    <h2>{artist.name}</h2>
                    <div className="pi-location">📍 {artist.location}</div>
                    <div className="pi-styles">
                      {artist.styles.map(s => <span key={s}>{s}</span>)}
                    </div>
                    <div className="pi-links">
                      <a href="#">Resume</a>
                      <a href="#">{artist.links.instagram}</a>
                      <a href="#">{artist.links.website}</a>
                    </div>
                  </div>
                  <button className="btn btn-s btn-sm">Edit Profile</button>
                </div>
                <div className="bio-card">
                  <h4>Bio / Cover Letter</h4>
                  <p>{artist.bio}</p>
                </div>
                <div className="info-card">
                  <h4>General Info</h4>
                  <div className="info-row"><span className="ir-label">Date of Birth</span><span className="ir-value">{artist.dob}</span></div>
                  <div className="info-row"><span className="ir-label">Age</span><span className="ir-value">{calcAge(artist.dob)}</span></div>
                  <div className="info-row"><span className="ir-label">Gender</span><span className="ir-value">{artist.gender}</span></div>
                  <div className="info-row"><span className="ir-label">Height</span><span className="ir-value">{artist.height}</span></div>
                  <div className="info-row"><span className="ir-label">Nationality</span><span className="ir-value">{artist.nationality}</span></div>
                </div>
              </div>
            )}

            {profileTab === "stage-record" && (
              <div>
                <div className="sr-toolbar">
                  <span className="sr-count">{stageRecords.length} entries</span>
                  <div className="list-search">
                    {I.search}
                    <input placeholder="Search entries..." value={srSearch} onChange={e => setSrSearch(e.target.value)} />
                  </div>
                  <div className="view-toggle">
                    <button className={srView === "grid" ? "active" : ""} onClick={() => setSrView("grid")}>{I.grid}</button>
                    <button className={srView === "list" ? "active" : ""} onClick={() => setSrView("list")}>{I.list}</button>
                  </div>
                  <button className="btn btn-p btn-sm" style={{ marginLeft: "auto" }} onClick={() => { setShowNewEntry(true); setNewEntryType(null); setEditEntry(null); setEntryForm({ title: "", org: "", start: "", end: "", location: "", desc: "", tags: "" }); }}>+ New Entry</button>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  {Object.entries(SR_LABELS).map(([key, label]) => (
                    <button key={key} className={`chip${srFilter === key ? " on" : ""}`} onClick={() => setSrFilter(srFilter === key ? "all" : key)}>
                      {label} <span style={{ opacity: .7 }}>{srCounts[key]}</span>
                    </button>
                  ))}
                </div>

                {srView === "grid" ? (
                  <div className="sr-grid">
                    {filteredSR.map(sr => (
                      <div key={sr.id} className="sr-card" onClick={() => openEditEntry(sr)}>
                        <div className="sr-type" style={{ background: `${SR_COLORS[sr.type]}15`, color: SR_COLORS[sr.type] }}>
                          {sr.emoji} {SR_LABELS[sr.type]}
                        </div>
                        <div className="sr-title">{sr.title}</div>
                        {sr.org && <div className="sr-org">{sr.org}</div>}
                        {sr.start && <div className="sr-date">📅 {sr.start}{sr.end ? ` — ${sr.end}` : " — Present"}{sr.location ? ` · ${sr.location}` : ""}</div>}
                        <div className="sr-desc">{sr.desc}</div>
                        <div className="sr-tags">{sr.tags.map(t => <span key={t}>{t}</span>)}</div>
                        <div className={`sr-usage ${sr.usedIn.length ? "used" : "unused"}`}>
                          {sr.usedIn.length ? `● Used in ${sr.usedIn.join(" · ")}` : "○ Not used yet"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="sr-list">
                    {filteredSR.map(sr => (
                      <div key={sr.id} className="sr-list-item" style={{ borderLeftColor: SR_COLORS[sr.type] }} onClick={() => openEditEntry(sr)}>
                        <span style={{ fontSize: 20 }}>{sr.emoji}</span>
                        <div className="sli-info">
                          <div className="sli-title">{sr.title}{sr.org ? ` · ${sr.org}` : ""}{sr.location ? ` · ${sr.location}` : ""}</div>
                          <div className="sli-sub">{sr.desc}</div>
                        </div>
                        <div className="sli-period">{sr.start}{sr.end ? ` — ${sr.end}` : ""}</div>
                        <div className="sli-usage" style={{ color: sr.usedIn.length ? "var(--green)" : "var(--amber)" }}>
                          {sr.usedIn.length ? sr.usedIn.join(" · ") : "Not used"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {profileTab === "comp-card" && (
              <div className="stub-section">
                <div className="stub-icon">🃏</div>
                <div className="stub-title">Comp Card</div>
                <p>Your visual snapshot combining best media with key stats. Coming soon.</p>
              </div>
            )}
          </div>
        );

      /* ── Applications ── */
      case "applications":
        return (
          <div>
            <div className="pg-header">
              <h1><em>Applications</em></h1>
              <p className="pg-sub">Track and manage everything you've applied to</p>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              {[["all", "All"], ...Object.entries(STATUS_LABELS)].map(([key, label]) => (
                <button key={key} className={`chip${appFilter === key ? " on" : ""}`} onClick={() => setAppFilter(key)}>{label}</button>
              ))}
              <select className="sort-filter" value={appSort} onChange={e => setAppSort(e.target.value)} style={{ marginLeft: "auto" }}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A → Z</option>
                <option value="z-a">Z → A</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
            <div className="app-list">
              {filteredApps.map(app => {
                const sc = STATUS_COLORS[app.status];
                return (
                  <div key={app.id} className="app-card" onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }}>
                    <img className="ac-logo" src={app.companyLogo} alt="" />
                    <div className="ac-info">
                      <div className="ac-title">{app.opportunity}</div>
                      <div className="ac-company">{app.company}</div>
                      <div className="ac-meta">
                        <span>Submitted: {app.submitted}</span>
                        <span>Deadline: {app.deadline}</span>
                      </div>
                    </div>
                    <span className="ac-status" style={{ background: sc.bg, color: sc.color }}>{STATUS_LABELS[app.status]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      /* ── Discover ── */
      case "discover":
        return (
          <div>
            <div className="pg-header">
              <h1><em>Discover</em></h1>
              <p className="pg-sub">Find auditions, jobs, and open calls</p>
            </div>
            <div className="tab-bar">
              <button className="tab-btn on">Opportunities</button>
              <button className="tab-btn" onClick={() => showToast("Open Board — coming soon")}>Open Board</button>
              <button className="tab-btn" onClick={() => showToast("Events — coming soon")}>Events</button>
            </div>
            <div className="opp-grid">
              {opportunities.map(opp => (
                <div key={opp.id} className="opp-card">
                  <img className="oc-banner" src={opp.banner} alt="" />
                  <div className="oc-body">
                    <div className="oc-title">{opp.title}</div>
                    <div className="oc-company">{opp.company}</div>
                    <div className="oc-meta">
                      <span>{opp.location}</span>
                      <span>{opp.type}</span>
                      {opp.styles.map(s => <span key={s}>{s}</span>)}
                    </div>
                    <div className="oc-footer">
                      <span>Deadline: {opp.deadline}</span>
                      <button className={`oc-save${opp.saved ? " saved" : ""}`} onClick={(e) => {
                        e.stopPropagation();
                        setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, saved: !o.saved } : o));
                      }}>
                        {opp.saved ? "★" : "☆"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      /* ── Network ── */
      case "network":
        return (
          <div>
            <div className="pg-header">
              <h1><em>Network</em></h1>
              <p className="pg-sub">Connect with people and companies in the performing arts</p>
            </div>
            <div className="tab-bar">
              <button className="tab-btn on">People</button>
              <button className="tab-btn">Companies</button>
            </div>
            <div className="stub-section">
              <div className="stub-icon">🌐</div>
              <div className="stub-title">People & Company Directory</div>
              <p>Discover, follow, and connect with artists, directors, and companies. Coming soon.</p>
            </div>
          </div>
        );

      /* ── Present ── */
      case "present":
        return (
          <div>
            <div className="pg-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1><em>Present</em></h1>
                <p className="pg-sub">Curate and share your portfolios</p>
              </div>
              <button className="btn btn-p" onClick={() => showToast("Portfolio builder coming in next step")}>+ New Portfolio</button>
            </div>
            <div className="pf-grid">
              {portfolios.map(pf => (
                <div key={pf.id} className="pf-card" onClick={() => showToast("Portfolio builder — opening soon")}>
                  <img className="pfc-cover" src={pf.cover} alt="" />
                  <div className="pfc-body">
                    <div className="pfc-title">{pf.name}</div>
                    <div className="pfc-meta">
                      <span className="pfc-status" style={{ background: pf.status === "published" ? "#E6FFF0" : "var(--g1)", color: pf.status === "published" ? "var(--green)" : "var(--g4)" }}>
                        {pf.status}
                      </span>
                      <span>{pf.items} items</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      /* ── Media Library ── */
      case "media":
        return (
          <div>
            <div className="pg-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1><em>Media Library</em></h1>
                <p className="pg-sub">All your media assets in one place</p>
              </div>
              <button className="btn btn-p" onClick={() => showToast("Upload coming soon")}>Upload</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {[["all", "All Media"], ["video", "Videos"], ["photo", "Photos"], ["doc", "Docs"], ["audio", "Audio"], ["link", "Links"]].map(([key, label]) => (
                <button key={key} className={`chip${mediaFilter === key ? " on" : ""}`} onClick={() => setMediaFilter(key)}>{label}</button>
              ))}
            </div>
            <div className="media-grid">
              {filteredMedia.map(m => (
                <div key={m.id} className="media-item" onClick={() => {
                  setMediaSelected(prev => prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]);
                }}>
                  {m.thumb ? (
                    <img className="mi-thumb" src={m.thumb} alt="" />
                  ) : (
                    <div className="mi-placeholder">{m.type === "doc" ? "📄" : m.type === "audio" ? "🎵" : "🔗"}</div>
                  )}
                  <div className="mi-badge" style={{ background: MEDIA_COLORS[m.type] }}>{m.format}</div>
                  <div className={`mi-check${mediaSelected.includes(m.id) ? " checked" : ""}`}>
                    {mediaSelected.includes(m.id) ? "✓" : ""}
                  </div>
                  <div className="mi-body">
                    <div className="mi-title">{m.title}</div>
                    <div className="mi-meta">{m.size}{m.duration ? ` · ${m.duration}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
            {mediaSelected.length > 0 && (
              <div className="media-action-bar">
                <span>{mediaSelected.length} item{mediaSelected.length > 1 ? "s" : ""} selected</span>
                <button className="btn btn-p btn-sm" onClick={() => showToast("Added to portfolio")}>Add to Portfolio</button>
                <button className="btn btn-danger btn-sm" onClick={() => { setMediaSelected([]); showToast("Selection cleared"); }}>Clear</button>
              </div>
            )}
          </div>
        );

      /* ── Academy ── */
      case "academy":
        return (
          <div>
            <div className="pg-header">
              <h1><em>Academy</em></h1>
              <p className="pg-sub">Learn and grow your performing arts career</p>
            </div>
            <div className="stub-section">
              <div className="stub-icon">🎓</div>
              <div className="stub-title">Course Library</div>
              <p>Courses, workshops, industry guides, and video tutorials. Coming soon.</p>
            </div>
          </div>
        );

      /* ── Messages ── */
      case "messages": {
        const activeMsgObj = activeChat ? messages.find(m => m.id === activeChat) : null;
        const mobileChatObj = mobileChatOpen ? messages.find(m => m.id === mobileChatOpen) : null;

        // Mobile: full-page chat view
        if (mobileChatObj) {
          return (
            <div className="mobile-chat-page">
              <div className="mcp-header">
                <button className="btn btn-s btn-sm" onClick={() => setMobileChatOpen(null)} style={{ padding: "6px 10px" }}>{I.back}</button>
                <img src={mobileChatObj.avatar} alt="" />
                <div>
                  <div className="mcp-name">{mobileChatObj.from}</div>
                  <div className="mcp-status">Online</div>
                </div>
              </div>
              <div className="mcp-body">
                {mobileChatObj.thread.map((m, i) => (
                  <div key={i} className={`ms-bubble ${m.sender === "me" ? "me" : "them"}`}>
                    {m.text}
                    <div className="ms-btime">{m.time}</div>
                  </div>
                ))}
              </div>
              <div className="mcp-input">
                <textarea style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 12, background: "var(--bg)", fontFamily: "var(--sans)", fontSize: 13, color: "var(--tx)", outline: "none", resize: "none", minHeight: 40 }} placeholder="Type a message..." rows={1} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); showToast("Message sent!"); e.target.value = ""; }}} />
                <button className="btn btn-p btn-sm" onClick={() => showToast("Message sent!")}>Send</button>
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="pg-header">
              <h1><em>Messages</em></h1>
              <p className="pg-sub">Your conversations</p>
            </div>
            <div className="messenger">
              <div className="ms-sidebar">
                <div className="ms-sidebar-header">
                  <h3>Chats</h3>
                  <input className="ms-search" placeholder="Search conversations..." />
                </div>
                <div className="ms-contacts">
                  {messages.map(msg => (
                    <div key={msg.id} className={`ms-contact${activeChat === msg.id ? " active" : ""}`} onClick={() => {
                      // On mobile: open full-page chat. On desktop: use sidebar pattern.
                      if (window.innerWidth <= 768) {
                        setMobileChatOpen(msg.id);
                      } else {
                        setActiveChat(msg.id);
                      }
                    }}>
                      <img className="ms-avatar" src={msg.avatar} alt="" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="ms-name">{msg.from}</span>
                          <span className="ms-time">{msg.time}</span>
                        </div>
                        <div className="ms-preview">{msg.preview}</div>
                      </div>
                      {msg.unread && <div className="ms-unread" />}
                    </div>
                  ))}
                </div>
              </div>
              {activeMsgObj ? (
                <div className="ms-thread">
                  <div className="ms-thread-header">
                    <img src={activeMsgObj.avatar} alt="" />
                    <div>
                      <div className="ms-th-name">{activeMsgObj.from}</div>
                      <div className="ms-th-status">Online</div>
                    </div>
                  </div>
                  <div className="ms-thread-body">
                    {activeMsgObj.thread.map((m, i) => (
                      <div key={i} className={`ms-bubble ${m.sender === "me" ? "me" : "them"}`}>
                        {m.text}
                        <div className="ms-btime">{m.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="ms-thread-input">
                    <textarea placeholder="Type a message..." rows={1} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); showToast("Message sent!"); e.target.value = ""; }}} />
                    <button className="btn btn-p btn-sm" onClick={() => showToast("Message sent!")}>Send</button>
                  </div>
                </div>
              ) : (
                <div className="ms-empty">
                  <div className="ms-empty-icon">💬</div>
                  <div>Select a conversation to start messaging</div>
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  /* ━━━ MAIN RENDER ━━━ */
  const shellClass = `shell${darkMode ? " dark" : ""}${sidebarCollapsed ? " sb-collapsed" : ""}${viewSpotlight ? " ctx-spotlight" : ""}`;

  return (
    <>
      <style>{CSS}</style>
      <div className={shellClass}>
        {/* ── Mobile Top Bar ── */}
        <div className="mobile-topbar">
          {viewSpotlight ? (
            <button className="mt-back" onClick={() => { setViewSpotlight(null); setPage("applications"); }}>{I.back}</button>
          ) : mobileChatOpen ? (
            <button className="mt-back" onClick={() => setMobileChatOpen(null)}>{I.back}</button>
          ) : (
            <div className="mt-logo"><img src="/lanced-logo.svg" alt="L" /></div>
          )}
          <span className="mt-title">
            {viewSpotlight && spotlightApp ? spotlightApp.opportunity : mobileChatOpen ? (messages.find(m => m.id === mobileChatOpen)?.from || "Chat") : NAV_ITEMS.find(n => n.id === page)?.label || "Dashboard"}
          </span>
          <div className="mt-actions">
            <button className="mt-bell" onClick={() => setShowNotifPanel(true)}>
              {I.bell}
              {notifications.filter(n => n.unread).length > 0 && <span className="mt-badge">{notifications.filter(n => n.unread).length}</span>}
            </button>
            {viewSpotlight && (
              <button className="mt-hamburger" onClick={() => setShowMobileActions(v => !v)}>
                {showMobileActions ? I.x : I.menu}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Actions Dropdown (spotlight context) */}
        {showMobileActions && viewSpotlight && (
          <div className="mobile-actions-dropdown" onClick={() => setShowMobileActions(false)}>
            <div className="mobile-actions-menu" onClick={e => e.stopPropagation()}>
              {SPOTLIGHT_TABS.map(t => (
                <button key={t.id} onClick={() => { setSpotlightTab(t.id); setShowMobileActions(false); }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Mobile Bottom Nav ── */}
        <nav className="mobile-nav">
          {viewSpotlight ? (
            <>
              <button onClick={() => { setViewSpotlight(null); setPage("applications"); }}>{I.back}<span>Back</span></button>
              {SPOTLIGHT_TABS.slice(0, 4).map(t => (
                <button key={t.id} className={spotlightTab === t.id ? "active" : ""} onClick={() => setSpotlightTab(t.id)}>{t.icon}<span>{t.label}</span></button>
              ))}
            </>
          ) : (
            <>
              <button className={page === "dashboard" ? "active" : ""} onClick={() => { setPage("dashboard"); setViewSpotlight(null); }}>{I.home}<span>Home</span></button>
              <button className={page === "discover" ? "active" : ""} onClick={() => { setPage("discover"); setViewSpotlight(null); }}>{I.discover}<span>Discover</span></button>
              <button className={page === "applications" ? "active" : ""} onClick={() => { setPage("applications"); setViewSpotlight(null); }}>{I.applications}<span>Apply</span></button>
              <button className={page === "messages" ? "active" : ""} onClick={() => { setPage("messages"); setViewSpotlight(null); }}>{I.messages}<span>Messages</span></button>
              <button className={page === "profile" ? "active" : ""} onClick={() => { setPage("profile"); setViewSpotlight(null); }}>{I.profile}<span>Profile</span></button>
            </>
          )}
        </nav>

        {/* ── Sidebar ── */}
        <nav className="sidebar">
          <div className="sidebar-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="sidebar-logo">
              <div className="sb-mark">
                <img src="/lanced-logo.svg" alt="Lanced" />
              </div>
              <div>
                <div className="sb-name">Lanced</div>
                <div className="sb-email">Artist App</div>
              </div>
            </div>
            <button className="sb-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? "Expand" : "Collapse"}>
              {I.panelL}
            </button>
          </div>

          <div className="sidebar-nav">
            {viewSpotlight && spotlightApp ? (
              <>
                <button className="sb-back-toggle" onClick={() => { setViewSpotlight(null); setPage("applications"); }}>
                  {I.back}
                  <span className="sb-label">Back to Applications</span>
                </button>
                <div style={{ padding: "8px 14px", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }} className="sb-label">{spotlightApp.opportunity}</div>
                  <div style={{ fontSize: 11, color: "var(--g4)", marginTop: 2 }} className="sb-label">{spotlightApp.company}</div>
                </div>
                {SPOTLIGHT_TABS.map(t => (
                  <button key={t.id} className={`sidebar-item${spotlightTab === t.id ? " active" : ""}`} onClick={() => setSpotlightTab(t.id)}>
                    {t.icon}
                    <span className="sb-label">{t.label}</span>
                    <span className="sb-tip">{t.label}</span>
                  </button>
                ))}
              </>
            ) : (
              NAV_ITEMS.map(item => (
                <button key={item.id} className={`sidebar-item${page === item.id ? " active" : ""}`} onClick={() => { setPage(item.id); setViewSpotlight(null); }}>
                  {item.icon}
                  <span className="sb-label">{item.label}</span>
                  {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                  <span className="sb-tip">{item.label}</span>
                </button>
              ))
            )}
          </div>

          <div className="sidebar-footer">
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? I.sun : I.moon}
              <span className="dt-label">{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>

          <div className="sidebar-acct">
            <div className="sa-avatar">
              <img src={artist.photo} alt="" />
            </div>
            <div>
              <div className="sa-name">{artist.name}</div>
              <div className="sa-email">{artist.email}</div>
            </div>
          </div>
        </nav>

        {/* ── Main ── */}
        <div className="main">
          <div className="topbar">
            <button className="topbar-studio" onClick={() => showToast("Studio — premium tools coming soon")}>
              ✨ <span>Try Studio</span>
            </button>
            <button className="notif-bell" onClick={() => setShowNotifPanel(!showNotifPanel)}>
              {I.bell}
              {notifications.filter(n => n.unread).length > 0 && <span className="notif-count">{notifications.filter(n => n.unread).length}</span>}
            </button>
            <div className="topbar-avatar">
              <img src={artist.photo} alt="" />
              <span className="ta-name">{artist.name.split(" ")[0]}</span>
              <span className="ta-plan">{artist.plan}</span>
            </div>
          </div>
          {viewSpotlight && spotlightApp && (
            <div className="breadcrumb-bar">
              <div>
                <span className="bc-link" style={{ cursor: "pointer", color: "var(--g4)", fontSize: 12 }} onClick={() => { setViewSpotlight(null); setPage("applications"); }}>My Applications</span>
                <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: 12 }}>{spotlightApp.opportunity}</span>
              </div>
              <div className="bc-actions">
                <span className="sh-status" style={{ background: STATUS_COLORS[spotlightApp.status].bg, color: STATUS_COLORS[spotlightApp.status].color, padding: "3px 10px", borderRadius: 40, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{STATUS_LABELS[spotlightApp.status]}</span>
              </div>
            </div>
          )}
          <div className="content">
            {renderPage()}
          </div>
        </div>
      </div>

      {/* ── Notification Panel ── */}
      {showNotifPanel && (
        <>
          <div className="notif-panel-overlay" onClick={() => setShowNotifPanel(false)} />
          <div className="notif-panel">
            <div className="np-header">
              <div className="np-header-top">
                <h2>Notifications</h2>
                <button className="np-close" onClick={() => setShowNotifPanel(false)}>✕</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <button className="np-mark-read" onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, unread: false }))); showToast("All marked as read"); }}>Mark all as read</button>
              </div>
              <div className="np-cats">
                {[
                  { id: "all", label: "All" },
                  { id: "application", label: "Applications" },
                  { id: "broadcast", label: "Broadcasts" },
                  { id: "invitation", label: "Invitations" },
                  { id: "opportunity", label: "Opportunities" },
                ].map(c => (
                  <button key={c.id} className={`np-cat${notifFilter === c.id ? " active" : ""}`} onClick={() => setNotifFilter(c.id)}>{c.label}</button>
                ))}
              </div>
            </div>
            <div className="np-list">
              {notifications.filter(n => notifFilter === "all" || n.type === notifFilter).map(n => (
                <div key={n.id} className={`np-item${n.unread ? " unread" : ""}`} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                  <div className="np-item-icon" style={{ background: `${n.color}15`, color: n.color }}>{n.icon}</div>
                  <div className="np-item-body">
                    <div className="np-item-title">{n.title}<span className="np-item-time">{n.time}</span></div>
                    <div className="np-item-text">{n.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Welcome Modal ── */}
      {showWelcome && (
        <div className="overlay" onClick={() => setShowWelcome(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: 520 }}>
            <button className="modal-close" onClick={() => setShowWelcome(false)}>✕</button>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎭</div>
              <h2>Welcome to Lanced</h2>
              <p className="modal-sub">Your performing arts career starts here. Explore what's inside.</p>
            </div>
            <div className="welcome-grid">
              {[
                { icon: "👤", title: "Profile & Stage Record", desc: "Build your professional identity with a modular career library" },
                { icon: "🔍", title: "Discover", desc: "Find auditions, jobs, and open calls from top companies" },
                { icon: "📋", title: "Applications", desc: "Track submissions and manage your entire audition pipeline" },
                { icon: "🎨", title: "Present", desc: "Create stunning portfolios to share with the industry" },
                { icon: "📁", title: "Media Library", desc: "Upload and organize your videos, photos, and documents" },
                { icon: "🎓", title: "Academy", desc: "Learn from industry professionals and grow your career" },
              ].map((item, i) => (
                <div key={i} className="welcome-card">
                  <div className="wc-icon">{item.icon}</div>
                  <div>
                    <div className="wc-title">{item.title}</div>
                    <div className="wc-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="btn btn-p btn-lg" onClick={() => setShowWelcome(false)}>Get Started</button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Entry Modal ── */}
      {showNewEntry && (
        <div className="overlay" onClick={() => setShowNewEntry(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: 560 }}>
            <button className="modal-close" onClick={() => setShowNewEntry(false)}>✕</button>
            <h2>{editEntry ? "Edit Entry" : "New Entry"}</h2>
            <p className="modal-sub">{editEntry ? "Update your stage record entry" : "Add to your Stage Record"}</p>

            {!newEntryType ? (
              <div className="entry-type-grid">
                {[
                  { type: "experience", emoji: "💼", title: "Experience", sub: "Jobs, contracts, residencies" },
                  { type: "education", emoji: "🎓", title: "Education", sub: "Degrees, schools, intensives" },
                  { type: "award", emoji: "🏆", title: "Award", sub: "Prizes, nominations, finals" },
                  { type: "skills", emoji: "⚡", title: "Skills", sub: "Techniques, disciplines" },
                  { type: "press", emoji: "📰", title: "Press", sub: "Reviews, features, mentions" },
                  { type: "repertoire", emoji: "🎭", title: "Repertoire", sub: "Roles, productions, tours" },
                ].map(et => (
                  <div key={et.type} className="entry-type-card" onClick={() => setNewEntryType(et.type)}>
                    <span className="etc-emoji">{et.emoji}</span>
                    <div>
                      <div className="etc-title">{et.title}</div>
                      <div className="etc-sub">{et.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="field"><label>Title *</label><input value={entryForm.title} onChange={e => setEntryForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Lead Dancer" /></div>
                <div className="field"><label>Organisation</label><input value={entryForm.org} onChange={e => setEntryForm(f => ({ ...f, org: e.target.value }))} placeholder="e.g. Royal Ballet" /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field"><label>Start Date</label><input type="month" value={entryForm.start} onChange={e => setEntryForm(f => ({ ...f, start: e.target.value }))} /></div>
                  <div className="field"><label>End Date</label><input type="month" value={entryForm.end} onChange={e => setEntryForm(f => ({ ...f, end: e.target.value }))} placeholder="Leave blank if current" /></div>
                </div>
                <div className="field"><label>Location</label><input value={entryForm.location} onChange={e => setEntryForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. London, UK" /></div>
                <div className="field"><label>Description</label><textarea value={entryForm.desc} onChange={e => setEntryForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe this experience..." /></div>
                <div className="field"><label>Tags (comma-separated)</label><input value={entryForm.tags} onChange={e => setEntryForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. Contemporary, Touring" /></div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                  <button className="btn btn-s" onClick={() => { if (editEntry) { setShowNewEntry(false); } else { setNewEntryType(null); } }}>
                    {editEntry ? "Cancel" : "← Back"}
                  </button>
                  <button className="btn btn-p" onClick={handleSaveEntry} disabled={!entryForm.title}>
                    {editEntry ? "Save Changes" : "Add Entry"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Media Library Picker ── */}
      {showMediaPicker && (() => {
        const PICKER_TABS = [
          { id: "all", label: "All Media" },
          { id: "video", label: "Videos" },
          { id: "photo", label: "Photos" },
          { id: "doc", label: "Docs" },
          { id: "audio", label: "Audio" },
          { id: "link", label: "Links" },
        ];
        const filtered = mediaItems
          .filter(m => pickerFilter === "all" || m.type === pickerFilter)
          .filter(m => !pickerSearch || m.title.toLowerCase().includes(pickerSearch.toLowerCase()));
        return (
          <div className="picker-overlay" onClick={() => { setShowMediaPicker(null); setPickerFilter("all"); setPickerSearch(""); }}>
            <div className="picker-modal" onClick={e => e.stopPropagation()}>
              <div className="picker-header">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3>Select Media</h3>
                  <button className="modal-close" style={{ position: "static" }} onClick={() => { setShowMediaPicker(null); setPickerFilter("all"); setPickerSearch(""); }}>✕</button>
                </div>
              </div>
              <div className="picker-toolbar">
                <div className="pt-tabs">
                  {PICKER_TABS.map(t => (
                    <button key={t.id} className={`pt-tab${pickerFilter === t.id ? " active" : ""}`} onClick={() => setPickerFilter(t.id)}>{t.label}</button>
                  ))}
                </div>
                <input className="pt-search" placeholder="Search..." value={pickerSearch} onChange={e => setPickerSearch(e.target.value)} />
                <button className="btn btn-p btn-sm" onClick={() => showToast("Upload coming soon")}>Upload</button>
              </div>
              <div className="picker-body">
                <div className="picker-grid">
                  {filtered.map(m => {
                    const sel = pickerSelected.includes(m.id);
                    const mc = MEDIA_COLORS[m.type];
                    return (
                      <div key={m.id} className={`picker-item${sel ? " selected" : ""}`} onClick={() => setPickerSelected(prev => sel ? prev.filter(x => x !== m.id) : [...prev, m.id])}>
                        <div className="pi-check">✓</div>
                        <div className="pi-dots" onClick={e => { e.stopPropagation(); showToast("Options menu"); }}>⋮</div>
                        {m.thumb ? <img className="pi-thumb" src={m.thumb} alt="" /> : <div className="pi-placeholder">{m.type === "video" ? "▶" : m.type === "audio" ? "♪" : m.type === "doc" ? "📄" : "🔗"}</div>}
                        <div className="pi-info">
                          <div className="pi-info-left">
                            <div className="pi-title">{m.title}</div>
                            <div className="pi-date">{m.size ? `${m.format} · ${m.size}` : m.format}</div>
                          </div>
                          <span className="pi-badge" style={{ background: `${mc}18`, color: mc }}>{m.type}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {pickerSelected.length > 0 && (
                <div className="picker-footer">
                  <span className="pf-count">{pickerSelected.length} {pickerSelected.length === 1 ? "item" : "items"} selected</span>
                  <button className="btn btn-p btn-sm" onClick={() => { showToast(`${pickerSelected.length} item${pickerSelected.length !== 1 ? "s" : ""} added to application`); setShowMediaPicker(null); setPickerFilter("all"); setPickerSearch(""); }}>Add to Application</button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Stage Record Picker ── */}
      {showSRPicker && (
        <div className="picker-overlay" onClick={() => setShowSRPicker(false)}>
          <div className="picker-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h3>Add Stage Record Entries</h3>
              <button className="modal-close" style={{ position: "static" }} onClick={() => setShowSRPicker(false)}>✕</button>
            </div>
            <div className="pm-sub">Select entries to attach to this application</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {stageRecords.map(sr => {
                const sel = pickerSelected.includes(sr.id);
                return (
                  <div key={sr.id} className={`sr-picker-item${sel ? " selected" : ""}`} onClick={() => setPickerSelected(prev => sel ? prev.filter(x => x !== sr.id) : [...prev, sr.id])}>
                    <div className="spi-check">{sel ? "✓" : ""}</div>
                    <span className="spi-emoji">{sr.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div className="spi-title">{sr.title}</div>
                      <div className="spi-org">{sr.org} · {sr.date}</div>
                    </div>
                    <span className="spi-type" style={{ background: `${SR_COLORS[sr.type]}15`, color: SR_COLORS[sr.type] }}>{sr.type}</span>
                  </div>
                );
              })}
            </div>
            <div className="picker-footer">
              <span className="pf-count">{pickerSelected.length} selected</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-g btn-sm" onClick={() => setShowSRPicker(false)}>Cancel</button>
                <button className="btn btn-p btn-sm" onClick={() => { showToast(`${pickerSelected.length} entr${pickerSelected.length !== 1 ? "ies" : "y"} added`); setShowSRPicker(false); }}>Add Selected</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
