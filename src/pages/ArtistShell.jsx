import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  { id: "app6", company: "Hamburg Ballet", companyLogo: "/demo/artists/2.jpg", opportunity: "Apprentice Dancer — 2026/27", status: "draft", submitted: "", deadline: "2026-05-20", banner: "/demo/banners/gwen-king-m3th3riq9-w-unsplash.jpg", desc: "John Neumeier's Hamburg Ballet seeks apprentice dancers for the upcoming season.", companyDesc: "Hamburg Ballet is one of Germany's premier ballet companies under the legendary direction of John Neumeier.", draftProgress: { profile: true, resume: true, materials: false, motivation: false } },
];

const MOCK_OPPORTUNITIES = [
  {
    id: "opp1", company: "Royal Danish Ballet", title: "Soloist — 2026/27 Season", location: "Copenhagen, DK", type: "Full-time Contract", deadline: "2026-04-30", auditionDate: "2026-05-10", styles: ["Classical", "Neoclassical"], banner: "/demo/banners/jens-thekkeveettil-dbwvuqboou8-unsplash.jpg", saved: false,
    companyLogo: "/demo/artists/1.jpg", companyDesc: "The Royal Danish Ballet is one of the oldest ballet companies in the world, founded in 1748. Renowned for preserving the Bournonville tradition while embracing contemporary works.",
    description: "The Royal Danish Ballet is seeking an exceptional soloist to join the company for the 2026/27 season. This is a rare opportunity to perform with one of Europe's most prestigious ballet companies in a diverse repertoire spanning Bournonville classics to cutting-edge contemporary works. The position involves 8-10 productions per season with international touring.",
    requirements: "We are looking for dancers with exceptional classical technique, strong partnering skills, and the versatility to perform in both classical and contemporary repertoire. Candidates should have at least 3 years of professional company experience at soloist or principal level. Must be physically fit and available for the full season (August 2026 — June 2027).",
    employmentDetails: "Full-time permanent contract. Competitive salary according to Danish performing arts union rates (approx. €48,000-62,000/year). Benefits include health insurance, pension contribution, housing assistance for international dancers, 5 weeks paid vacation. Rehearsal schedule: Mon-Sat, 10:00-18:00.",
    howToApply: "Submit your application through Lanced including your showreel, headshot, full body photo, and updated CV/Stage Record. Shortlisted candidates will be invited for a live audition in Copenhagen on May 10, 2026.",
    profileFieldsRequired: ["nationality", "height", "gender", "dob", "shoeSize"],
    materialsRequired: [
      { id: "mat1", label: "Classical Showreel", type: "video", required: true },
      { id: "mat2", label: "Contemporary Showreel", type: "video", required: false },
      { id: "mat3", label: "Professional Headshot", type: "photo", required: true },
      { id: "mat4", label: "Full Body Photo", type: "photo", required: true },
    ],
    customQuestions: ["Why do you want to join the Royal Danish Ballet?", "Describe your experience with Bournonville technique.", "What is your availability for the 2026/27 season (August-June)?"],
  },
  {
    id: "opp2", company: "Wayne McGregor | Random Dance", title: "Company Dancer", location: "London, UK", type: "Full-time Contract", deadline: "2026-05-15", auditionDate: "2026-05-28", styles: ["Contemporary", "Technology"], banner: "/demo/banners/hulki-okan-tabak-paog427w_as-unsplash-2.jpg", saved: true,
    companyLogo: "/demo/artists/2.jpg", companyDesc: "Wayne McGregor | Random Dance is at the forefront of dance innovation, integrating technology, science, and film into choreographic practice.",
    description: "Wayne McGregor is looking for a versatile company dancer to join the ensemble. The role involves performing in new creations and revivals, collaborating with digital artists and scientists, and touring internationally. You'll work directly with Wayne and the creative team on 3-4 new productions per year.",
    requirements: "Strong contemporary technique with exceptional physical range and stamina. Openness to interdisciplinary collaboration (technology, film, science). Improvisation skills and creative input valued. Experience in site-specific or immersive performance a plus.",
    employmentDetails: "Full-time contract, renewable annually. London-based with international touring (approx. 12 weeks/year). Salary: £38,000-£45,000 plus touring per diem. Studio access at the McGregor Studios in East London.",
    howToApply: "Apply via Lanced with a video showreel showcasing your contemporary range and one improvisation clip. Include headshot and full CV.",
    profileFieldsRequired: ["nationality", "height", "gender", "dob"],
    materialsRequired: [
      { id: "mat1", label: "Contemporary Showreel", type: "video", required: true },
      { id: "mat2", label: "Improvisation Clip", type: "video", required: true },
      { id: "mat3", label: "Professional Headshot", type: "photo", required: true },
    ],
    customQuestions: ["How do you approach interdisciplinary collaboration in your practice?", "What excites you about working with Wayne McGregor?"],
  },
  {
    id: "opp3", company: "Pina Bausch Tanztheater", title: "Guest Performer — Rite of Spring Revival", location: "Wuppertal, DE", type: "Project-based", deadline: "2026-06-01", auditionDate: "2026-06-15", styles: ["Tanztheater", "Contemporary"], banner: "/demo/banners/pexels-joseph-phillips-2044494-3753820.jpg", saved: false,
    companyLogo: "/demo/artists/3.jpg", companyDesc: "Tanztheater Wuppertal Pina Bausch continues the legacy of Pina Bausch, performing her iconic works worldwide.",
    description: "Casting guest performers for the 2027 revival tour of Pina Bausch's iconic 'The Rite of Spring'. This production, performed on a stage covered in earth, is one of the most physically demanding works in the contemporary repertoire. The tour covers 6 cities across Europe and Asia.",
    requirements: "Extraordinary physicality and stamina. The earth-covered stage requires fearless performers. Previous Tanztheater experience preferred but not required. Must be comfortable with intense physical expression and group dynamics. Open to all gender identities.",
    employmentDetails: "Project-based contract: January — April 2027 (rehearsals in Wuppertal) + May — July 2027 (touring). Fee: €4,500/month plus touring per diem and accommodation. Travel costs covered.",
    howToApply: "Submit a showreel demonstrating physical performance work. A short self-introduction video (max 2 min) appreciated. Headshot required.",
    profileFieldsRequired: ["nationality", "height", "gender", "dob"],
    materialsRequired: [
      { id: "mat1", label: "Physical Performance Showreel", type: "video", required: true },
      { id: "mat2", label: "Self-Introduction Video", type: "video", required: false },
      { id: "mat3", label: "Headshot", type: "photo", required: true },
    ],
    customQuestions: ["What does Pina Bausch's work mean to you?", "Describe a physically challenging performance experience you've had."],
  },
];

const MOCK_PORTFOLIOS = [
  {
    id: "pf1", name: "Contemporary Showreel", status: "published", discipline: "Dancer", description: "A curated collection of my contemporary and Afro-fusion work from 2023–2026.",
    styles: ["Contemporary", "Afro-fusion", "Floor Work"], skills: ["Partnering", "Floorwork", "Improvisation"],
    cover: "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg",
    photos: [
      { id: "ph1", src: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg", caption: "Jungle Book — Tour 2024" },
      { id: "ph2", src: "/demo/artists/boris-de-jong/pexels-cottonbro-6221378.jpg", caption: "Studio session" },
      { id: "ph3", src: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg", caption: "Rehearsal — Akram Khan" },
      { id: "ph4", src: "/demo/artists/boris-de-jong/pexels-cottonbro-6221579.jpg", caption: "Contemporary solo" },
      { id: "ph5", src: "/demo/artists/boris-de-jong/pexels-cottonbro-5103506.jpg", caption: "Behind the scenes" },
      { id: "ph6", src: "/demo/artists/nisha-huizing.jpg", caption: "Headshot 2026" },
      { id: "ph7", src: "/demo/artists/jusef-al-haddad/karsten-winegeart-UicC_FIozPc-unsplash (1).jpg", caption: "Performance still" },
    ],
    videos: [
      { id: "v1", title: "Main Showreel 2026", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg", duration: "3:24", pinned: true },
      { id: "v2", title: "NDT II — Performance Excerpt", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg", duration: "2:10" },
      { id: "v3", title: "Ballet BC — Spring Season", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221579.jpg", duration: "4:45" },
    ],
    references: [
      { id: "ref1", name: "Akram Khan", role: "Artistic Director", org: "Akram Khan Company", quote: "Amara brings a rare combination of technical precision and raw emotional power to every piece.", type: "reference" },
      { id: "ref2", source: "De Standaard", date: "March 2025", quote: "Vandermeer's Odette was quietly commanding, with a physicality that held the stage effortlessly.", context: "Swan Lake Review — Royal Ballet of Flanders", type: "review" },
      { id: "ref3", source: "Springback Magazine", date: "Nov 2023", quote: "A standout performer with an instinctive musicality and rare spatial intelligence.", context: "NDT II Season Feature", type: "review" },
    ],
    documents: [
      { id: "d1", title: "Full CV / Resume", format: "PDF", size: "1.1 MB" },
      { id: "d2", title: "Artistic Statement", format: "PDF", size: "240 KB" },
    ],
    resume: [
      { id: "r1", type: "experience", title: "Lead Dancer", org: "Akram Khan Company", period: "2023 – 2026", location: "London, UK" },
      { id: "r2", type: "experience", title: "Corps de Ballet", org: "Royal Ballet", period: "2021 – 2023", location: "London, UK" },
      { id: "r3", type: "education", title: "BA Dance Performance", org: "Royal Ballet School", period: "2018 – 2021", location: "London, UK" },
      { id: "r4", type: "award", title: "Outstanding Young Dancer", org: "Critics' Circle National Dance Awards", period: "2024", location: "" },
    ],
    highlightedVideo: "v1",
    slug: "amara-osei-contemporary",
  },
  {
    id: "pf2", name: "Afro-fusion Collection", status: "draft", discipline: "Dancer", description: "Exploring the intersection of West African movement and contemporary European choreography.",
    styles: ["Afro-fusion", "Traditional West African"], skills: ["Afrobeats", "Body Percussion"],
    cover: "/demo/banners/fabian-centeno-k4s5mtsyuli-unsplash.jpg",
    photos: [
      { id: "ph1", src: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg", caption: "Workshop session" },
      { id: "ph2", src: "/demo/artists/boris-de-jong/pexels-cottonbro-5103506.jpg", caption: "Performance" },
    ],
    videos: [
      { id: "v1", title: "Afro-fusion Solo — Studio", thumb: "/demo/artists/boris-de-jong/pexels-cottonbro-6221579.jpg", duration: "2:40" },
    ],
    references: [],
    documents: [],
    resume: [],
    highlightedVideo: null,
    slug: "amara-osei-afrofusion",
  },
];

const MOCK_PF_TRACKING = [
  { id: "tv1", portfolioId: "pf1", email: "casting@ndt.nl", name: "Sarah de Vries", org: "Nederlands Dans Theater", viewedAt: "2026-03-28T14:22:00", duration: "4m 12s", sections: ["Gallery", "Videos", "Resume"], device: "Desktop" },
  { id: "tv2", portfolioId: "pf1", email: null, name: "Anonymous", org: null, viewedAt: "2026-03-27T09:45:00", duration: "1m 38s", sections: ["Gallery"], device: "Mobile" },
  { id: "tv3", portfolioId: "pf1", email: "hr@sadlerswells.com", name: "James Chen", org: "Sadler's Wells", viewedAt: "2026-03-26T16:10:00", duration: "6m 05s", sections: ["Gallery", "Videos", "Resume", "References"], device: "Desktop" },
  { id: "tv4", portfolioId: "pf1", email: "info@batsheva.co.il", name: "Noa Levy", org: "Batsheva Dance Company", viewedAt: "2026-03-25T11:30:00", duration: "3m 22s", sections: ["Videos", "Resume"], device: "Desktop" },
  { id: "tv5", portfolioId: "pf1", email: null, name: "Anonymous", org: null, viewedAt: "2026-03-24T20:15:00", duration: "0m 45s", sections: ["Gallery"], device: "Mobile" },
];

const DISCIPLINES = ["Dancer", "Choreographer", "Singer", "Actor", "Musical Theatre", "Circus Artist", "Stage Manager", "Other"];

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
const STATUS_COLORS = { submitted: { bg: "#F0F0FF", color: "#604DFF" }, in_review: { bg: "#FFF8E6", color: "#F5A623" }, shortlisted: { bg: "#E6F0FF", color: "#1E90FF" }, invited: { bg: "#E6FFF0", color: "#1DB954" }, not_selected: { bg: "#FFF0F0", color: "#FF4757" }, pending: { bg: "#F5F4FB", color: "#98989F" }, draft: { bg: "rgba(255,171,0,.12)", color: "#F5A623" } };
const STATUS_LABELS = { submitted: "Submitted", in_review: "In Review", shortlisted: "Shortlisted", invited: "Invited", not_selected: "Not Selected", pending: "Pending", draft: "Draft" };
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
.sidebar-acct{padding:16px 20px;border-top:1px solid var(--g1);display:flex;align-items:center;gap:10px;border-radius:10px;margin:0 6px 0;transition:background .15s}
.sidebar-acct:hover{background:var(--g1)}
.sidebar-acct .sa-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7A66FF,#4A35E0);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0;overflow:hidden}
.sidebar-acct .sa-avatar img{width:100%;height:100%;object-fit:cover}
.sidebar-acct .sa-name{font-size:12px;font-weight:600;color:var(--tx)}
.sidebar-acct .sa-email{font-size:10px;color:var(--g4)}

/* Sidebar collapse */
.sb-collapsed .sidebar{width:var(--sb-wc)}
.sb-collapsed .main{margin-left:var(--sb-wc)}
.sidebar-back-top{padding:8px 10px 0;display:flex;align-items:center;justify-content:flex-end;gap:0}
.sb-toggle{width:28px;height:28px;border-radius:8px;background:transparent;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:101;transition:all .15s;color:var(--g4);opacity:0;flex-shrink:0}
.sidebar:hover .sb-toggle,.sb-toggle:focus{opacity:1}
.sb-toggle:hover{color:var(--ac);background:rgba(96,77,255,.06)}
.sb-collapsed .sb-toggle{opacity:1}
.sb-collapsed .sidebar-back-top{padding:4px 6px 0;flex-direction:column;gap:4px}
.sidebar-back-top .sb-toggle{margin-right:4px}
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
.sb-collapsed .sidebar-acct{justify-content:center;padding:12px 0;margin:0;border-top:none;border-radius:0}
.sb-collapsed .sidebar-acct .sa-text{display:none}
.sb-collapsed .sidebar-acct .sa-dots{display:none}
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

/* ━━━ Portfolio Context ━━━ */
.ctx-portfolio{--pf-ac:#0D9488;--pf-ac-light:rgba(13,148,136,.08);background-image:radial-gradient(ellipse at 20% 0%,rgba(13,148,136,.10) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(13,148,136,.06) 0%,transparent 50%);transition:background .4s ease}
.ctx-portfolio::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--pf-ac),transparent 80%);z-index:210;animation:fadeIn .4s}
.ctx-portfolio .main{position:fixed;top:12px;right:12px;bottom:12px;left:calc(var(--sb-w) + 24px);border-radius:20px;background:var(--sf);box-shadow:0 8px 40px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.03);animation:ctxPanelIn .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;margin:0;min-height:0}
.ctx-portfolio .main .breadcrumb-bar{border-radius:20px 20px 0 0;flex-shrink:0;position:sticky;top:0;z-index:10;border-image:linear-gradient(90deg,var(--pf-ac) 0%,transparent 70%) 1}
.ctx-portfolio .main .content{overflow-y:auto;flex:1;min-height:0;padding-top:8px}
.ctx-portfolio .main .content>div>:first-child{margin-top:8px}
.ctx-portfolio .main>*{animation:ctxStagger .3s ease backwards}
.ctx-portfolio .main>*:nth-child(1){animation-delay:0s}
.ctx-portfolio .main>*:nth-child(2){animation-delay:.03s}
.ctx-portfolio .main>*:nth-child(3){animation-delay:.06s}
.ctx-portfolio .topbar{display:none}
.sb-collapsed.ctx-portfolio .main{left:calc(var(--sb-wc) + 24px)}
.ctx-portfolio .sidebar{top:12px;left:12px;bottom:12px;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.04);animation:sbSlideIn .3s cubic-bezier(.4,0,.2,1);overflow:hidden;background:linear-gradient(180deg,rgba(13,148,136,.06) 0%,var(--sf) 60%)}
.ctx-portfolio .sidebar-item.active{background:rgba(13,148,136,.08);color:var(--pf-ac);font-weight:600}
.ctx-portfolio .sidebar-item.active::before{background:var(--pf-ac)}
.dark .ctx-portfolio .main{box-shadow:0 8px 40px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.04)}
.dark .ctx-portfolio .sidebar{box-shadow:0 8px 40px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.06)}
.dark .ctx-portfolio{background-image:radial-gradient(ellipse at 20% 0%,rgba(13,148,136,.14) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(13,148,136,.08) 0%,transparent 50%)}

/* New Portfolio Modal */
.npf-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(4px);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
.npf-modal{background:var(--sf);border-radius:20px;width:480px;max-width:92vw;max-height:85vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.15);animation:slideUp .25s ease}
.npf-modal h2{font-size:20px;font-weight:700;margin:0}
.npf-modal .npf-head{padding:24px 28px 16px;border-bottom:1px solid var(--g1)}
.npf-modal .npf-body{padding:20px 28px 28px;display:flex;flex-direction:column;gap:18px}
.npf-modal label{font-size:12px;font-weight:600;color:var(--g5);display:block;margin-bottom:6px}
.npf-modal input,.npf-modal textarea,.npf-modal select{width:100%;padding:10px 14px;border:1px solid var(--g2);border-radius:10px;font-size:13px;font-family:var(--sans);background:var(--bg);color:var(--tx);transition:border .15s;outline:none;box-sizing:border-box}
.npf-modal input:focus,.npf-modal textarea:focus,.npf-modal select:focus{border-color:#0D9488;box-shadow:0 0 0 3px rgba(13,148,136,.1)}
.npf-modal textarea{resize:vertical;min-height:80px}
.npf-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.npf-chip{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:40px;font-size:11px;font-weight:600;background:rgba(13,148,136,.1);color:#0D9488;border:1px solid rgba(13,148,136,.2)}
.npf-chip button{background:none;border:none;cursor:pointer;color:inherit;font-size:14px;line-height:1;padding:0;margin-left:2px}
.npf-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:8px}
.btn-pf{background:linear-gradient(135deg,#0D9488,#0F766E);color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:all .15s}
.btn-pf:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(13,148,136,.3)}
.btn-pf:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}

/* Portfolio Editor */
.pfe-banner{width:100%;height:180px;border-radius:14px;overflow:hidden;position:relative;margin-bottom:20px;background:linear-gradient(135deg,rgba(13,148,136,.15),rgba(13,148,136,.05))}
.pfe-banner img{width:100%;height:100%;object-fit:cover}
.pfe-banner .pfe-banner-overlay{position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.5));display:flex;align-items:flex-end;padding:20px 24px}
.pfe-banner .pfe-banner-title{color:#fff;font-size:22px;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.3)}
.pfe-link-row{display:flex;align-items:center;gap:10px;justify-content:flex-end;margin-bottom:20px;font-size:12px;color:var(--g4)}
.pfe-link-row code{padding:6px 12px;border-radius:8px;background:var(--g1);font-size:11px;color:#0D9488;font-family:var(--mono,monospace)}
.pfe-link-row button{font-size:11px;font-weight:600;padding:6px 14px;border-radius:8px;border:1px solid var(--g2);background:var(--sf);cursor:pointer;color:var(--tx);font-family:var(--sans);transition:all .15s}
.pfe-link-row button:hover{border-color:#0D9488;color:#0D9488}
.pfe-row{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:16px}
.pfe-section{background:var(--sf);border:1px solid var(--g2);border-radius:16px;padding:20px 24px;margin-bottom:16px}
.pfe-section h3{font-size:16px;font-weight:700;margin:0 0 16px;display:flex;align-items:center;justify-content:space-between}
.pfe-section h3 em{font-style:italic;color:#0D9488}
.pfe-section h3 .pfe-count{font-size:12px;font-weight:500;color:var(--g4);margin-left:8px}
.pfe-row .pfe-section{margin-bottom:0}
.pfe-photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px}
.pfe-photo{border-radius:10px;overflow:hidden;position:relative;aspect-ratio:1;cursor:pointer;background:var(--g1)}
.pfe-photo img{width:100%;height:100%;object-fit:cover}
.pfe-photo:hover .pfe-photo-actions{opacity:1}
.pfe-photo-actions{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;gap:6px;opacity:0;transition:opacity .15s}
.pfe-photo-actions button{padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.3);color:#fff;font-size:10px;cursor:pointer;font-family:var(--sans);transition:all .15s}
.pfe-photo-actions button:hover{background:rgba(255,255,255,.2)}
.pfe-photo-add{border:2px dashed var(--g2);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;color:var(--g4);cursor:pointer;transition:all .15s;gap:4px;border-radius:10px;aspect-ratio:1}
.pfe-photo-add:hover{border-color:#0D9488;color:#0D9488;background:rgba(13,148,136,.03)}
.pfe-video-list{display:flex;flex-direction:column;gap:10px}
.pfe-video{display:flex;align-items:center;gap:14px;padding:10px;border-radius:12px;background:var(--bg);border:1px solid var(--g1);transition:all .15s}
.pfe-video:hover{border-color:var(--g2);box-shadow:0 2px 8px rgba(0,0,0,.04)}
.pfe-video.featured{border:1.5px solid #0D9488;background:rgba(13,148,136,.04)}
.pfe-video.featured .pfe-v-meta .pfe-featured-badge{display:inline-block;padding:1px 8px;border-radius:20px;background:rgba(13,148,136,.1);color:#0D9488;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;margin-left:4px}
.pfe-video img{width:80px;height:54px;border-radius:8px;object-fit:cover;flex-shrink:0}
.pfe-video .pfe-v-info{flex:1;min-width:0}
.pfe-video .pfe-v-title{font-size:13px;font-weight:600;color:var(--tx)}
.pfe-video .pfe-v-meta{font-size:11px;color:var(--g4);margin-top:2px}
.pfe-video .pfe-v-actions{display:flex;gap:6px;flex-shrink:0}
.pfe-video .pfe-v-actions button{padding:4px 10px;border-radius:6px;border:1px solid var(--g2);background:none;font-size:10px;cursor:pointer;color:var(--g5);font-family:var(--sans);transition:all .15s}
.pfe-video .pfe-v-actions button:hover{border-color:#0D9488;color:#0D9488}
.pfe-add-row{display:flex;gap:8px;margin-top:12px}
.pfe-add-btn{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:all .15s;border:none}
.pfe-add-btn.primary{background:#0D9488;color:#fff}.pfe-add-btn.primary:hover{background:#0F766E}
.pfe-add-btn.secondary{background:var(--bg);color:var(--tx);border:1px solid var(--g2)}.pfe-add-btn.secondary:hover{border-color:#0D9488;color:#0D9488}
.pfe-refs{display:flex;flex-direction:column;gap:10px}
.pfe-ref-card{padding:14px 18px;border-radius:12px;border:1px solid var(--g1);background:var(--bg);transition:all .15s}
.pfe-ref-card:hover{border-color:var(--g2);box-shadow:0 2px 8px rgba(0,0,0,.04)}
.pfe-ref-card .pfe-ref-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 8px;border-radius:20px;display:inline-block;margin-bottom:8px}
.pfe-ref-card .pfe-ref-type.reference{background:rgba(13,148,136,.1);color:#0D9488}
.pfe-ref-card .pfe-ref-type.review{background:rgba(96,77,255,.08);color:var(--ac)}
.pfe-ref-card .pfe-ref-quote{font-size:13px;font-style:italic;color:var(--tx);line-height:1.5;margin-bottom:8px}
.pfe-ref-card .pfe-ref-source{font-size:11px;color:var(--g4)}
.pfe-ref-card .pfe-ref-source strong{color:var(--g5);font-weight:600}
.pfe-doc-list{display:flex;flex-direction:column;gap:8px}
.pfe-doc{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;background:var(--bg);border:1px solid var(--g1)}
.pfe-doc .pfe-d-icon{width:36px;height:36px;border-radius:8px;background:rgba(13,148,136,.1);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.pfe-doc .pfe-d-info{flex:1;min-width:0}
.pfe-doc .pfe-d-title{font-size:13px;font-weight:600;color:var(--tx)}
.pfe-doc .pfe-d-meta{font-size:10px;color:var(--g4);margin-top:1px}

/* Highlighted Video */
.pfe-highlight{border-radius:16px;overflow:hidden;position:relative;margin-bottom:16px;cursor:pointer;background:#1a1a2e}
.pfe-highlight img{width:100%;aspect-ratio:16/7;object-fit:cover;opacity:.7;display:block}
.pfe-highlight .pfe-hl-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center}
.pfe-highlight .pfe-hl-play::after{content:'';border-style:solid;border-width:10px 0 10px 18px;border-color:transparent transparent transparent rgba(255,255,255,.9);margin-left:3px}
.pfe-highlight .pfe-hl-info{position:absolute;bottom:0;left:0;right:0;padding:20px 24px;background:linear-gradient(transparent,rgba(0,0,0,.6));color:#fff}
.pfe-highlight .pfe-hl-badge{display:inline-block;padding:3px 10px;border-radius:40px;background:rgba(13,148,136,.8);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.pfe-highlight .pfe-hl-title{font-size:16px;font-weight:700}
.pfe-highlight .pfe-hl-meta{font-size:11px;color:rgba(255,255,255,.6);margin-top:3px}

/* Resume Section */
.pfe-resume-list{display:flex;flex-direction:column;gap:8px}
.pfe-resume-item{display:flex;align-items:flex-start;gap:14px;padding:12px 16px;border-radius:12px;background:var(--bg);border:1px solid var(--g1)}
.pfe-resume-item .pfe-ri-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.pfe-resume-item .pfe-ri-icon.exp{background:rgba(13,148,136,.1);color:#0D9488}
.pfe-resume-item .pfe-ri-icon.edu{background:rgba(13,148,136,.1);color:#0D9488}
.pfe-resume-item .pfe-ri-icon.award{background:rgba(245,166,35,.1);color:#F5A623}
.pfe-resume-item .pfe-ri-info{flex:1;min-width:0}
.pfe-resume-item .pfe-ri-title{font-size:13px;font-weight:600;color:var(--tx)}
.pfe-resume-item .pfe-ri-org{font-size:12px;color:var(--g5);margin-top:1px}
.pfe-resume-item .pfe-ri-meta{font-size:10px;color:var(--g4);margin-top:3px}

/* Portfolio Preview / Public View */
.pfp-hero{width:100%;min-height:280px;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);position:relative;border-radius:16px;overflow:hidden;margin-bottom:24px;padding:40px 36px}
.pfp-hero .pfp-hero-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:8px}
.pfp-hero .pfp-hero-name{font-size:36px;font-weight:700;color:#fff;line-height:1.1;margin-bottom:6px}
.pfp-hero .pfp-hero-name em{font-style:italic;color:var(--ac)}
.pfp-hero .pfp-hero-sub{font-size:13px;color:rgba(255,255,255,.6)}
.pfp-hero .pfp-hero-actions{position:absolute;top:20px;right:24px;display:flex;gap:8px}
.pfp-hero .pfp-hero-actions button{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:all .15s}
.pfp-stats{display:flex;align-items:center;gap:20px;margin-bottom:20px;flex-wrap:wrap}
.pfp-avatar{width:64px;height:64px;border-radius:50%;border:3px solid var(--sf);overflow:hidden;flex-shrink:0;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.pfp-avatar img{width:100%;height:100%;object-fit:cover}
.pfp-stat{text-align:left}
.pfp-stat .pfp-stat-val{font-size:22px;font-weight:700;color:var(--tx);line-height:1}
.pfp-stat .pfp-stat-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--g4);margin-top:2px}
.pfp-tabs{display:flex;gap:0;border-bottom:1px solid var(--g2);margin-bottom:24px}
.pfp-tab{padding:10px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--g4);cursor:pointer;border:none;background:none;font-family:var(--sans);border-bottom:2px solid transparent;transition:all .15s}
.pfp-tab:hover{color:var(--tx)}
.pfp-tab.active{color:var(--ac);border-bottom-color:var(--ac)}
.pfp-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.pfp-gallery-item{border-radius:12px;overflow:hidden;aspect-ratio:4/3;background:var(--g1)}
.pfp-gallery-item img{width:100%;height:100%;object-fit:cover}
.pfp-video-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.pfp-video-card{border-radius:14px;overflow:hidden;background:#1a1a2e;position:relative;cursor:pointer}
.pfp-video-card img{width:100%;aspect-ratio:16/9;object-fit:cover;opacity:.7}
.pfp-video-card .pfp-vc-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center}
.pfp-video-card .pfp-vc-play::after{content:'';border-style:solid;border-width:8px 0 8px 14px;border-color:transparent transparent transparent rgba(255,255,255,.8);margin-left:2px}
.pfp-video-card .pfp-vc-info{padding:12px 16px;color:#fff}
.pfp-video-card .pfp-vc-title{font-size:13px;font-weight:600}
.pfp-video-card .pfp-vc-meta{font-size:11px;color:rgba(255,255,255,.5);margin-top:3px}

/* Share Modal */
.share-overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
.share-modal{background:var(--sf);border-radius:20px;width:440px;max-width:90vw;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:fadeIn .25s}
.share-modal h3{font-size:18px;font-weight:700;margin:0 0 4px}
.share-modal .sm-sub{font-size:12px;color:var(--g4);margin-bottom:20px}
.share-modal .sm-section{margin-bottom:18px}
.share-modal .sm-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--g4);margin-bottom:10px}
.share-modal .sm-link-row{display:flex;gap:8px;margin-bottom:12px}
.share-modal .sm-link-row input{flex:1;padding:9px 14px;border:1px solid var(--g2);border-radius:10px;font-size:12px;font-family:var(--mono,monospace);color:#0D9488;background:var(--bg);outline:none}
.share-modal .sm-link-row button{padding:9px 16px;border-radius:10px;border:none;background:#0D9488;color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans);white-space:nowrap}
.share-modal .sm-email-row{display:flex;gap:8px}
.share-modal .sm-email-row input{flex:1;padding:9px 14px;border:1px solid var(--g2);border-radius:10px;font-size:12px;font-family:var(--sans);color:var(--tx);background:var(--bg);outline:none}
.share-modal .sm-email-row button{padding:9px 16px;border-radius:10px;border:none;background:var(--ac);color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans);white-space:nowrap}
.share-modal .sm-pro{margin-top:20px;padding:16px;border-radius:14px;border:1px solid rgba(96,77,255,.15);background:rgba(96,77,255,.03)}
.share-modal .sm-pro-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ac);margin-bottom:12px;display:flex;align-items:center;gap:6px}
.share-modal .sm-pro-title span{font-size:8px;padding:2px 6px;border-radius:20px;background:var(--ac);color:#fff;letter-spacing:.04em}
.share-modal .sm-toggle{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--g1)}
.share-modal .sm-toggle:last-child{border-bottom:none}
.share-modal .sm-toggle-label{font-size:12px;font-weight:500;color:var(--tx)}
.share-modal .sm-toggle-desc{font-size:10px;color:var(--g4);margin-top:2px}
.sm-switch{width:36px;height:20px;border-radius:20px;background:var(--g2);position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.sm-switch.on{background:var(--ac)}
.sm-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.sm-switch.on::after{transform:translateX(16px)}
.share-modal .sm-pw-input{margin-top:8px;width:100%;padding:8px 12px;border:1px solid var(--g2);border-radius:8px;font-size:12px;font-family:var(--sans);background:var(--bg);color:var(--tx);outline:none;box-sizing:border-box}
.share-modal .sm-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}
.share-modal .sm-actions button{padding:8px 18px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans)}

/* Tracking View */
.pft-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.pft-stat{padding:16px;border-radius:14px;background:var(--bg);border:1px solid var(--g1);text-align:center}
.pft-stat .pft-val{font-size:24px;font-weight:700;color:#0D9488;font-family:var(--mono)}
.pft-stat .pft-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--g4);margin-top:4px}
.pft-list{display:flex;flex-direction:column;gap:8px}
.pft-item{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:12px;background:var(--bg);border:1px solid var(--g1);transition:all .15s}
.pft-item:hover{border-color:var(--g2);box-shadow:0 2px 8px rgba(0,0,0,.04)}
.pft-item .pft-avatar{width:36px;height:36px;border-radius:50%;background:rgba(96,77,255,.08);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--ac);flex-shrink:0}
.pft-item .pft-info{flex:1;min-width:0}
.pft-item .pft-name{font-size:13px;font-weight:600;color:var(--tx)}
.pft-item .pft-org{font-size:11px;color:var(--g4);margin-top:1px}
.pft-item .pft-meta{display:flex;gap:12px;flex-shrink:0;align-items:center}
.pft-item .pft-meta span{font-size:10px;color:var(--g4)}
.pft-item .pft-sections{display:flex;gap:4px;margin-top:4px}
.pft-item .pft-sections span{font-size:9px;padding:1px 6px;border-radius:20px;background:rgba(13,148,136,.08);color:#0D9488;font-weight:500}
.pft-pro-gate{text-align:center;padding:40px 20px;border-radius:16px;border:1px dashed rgba(96,77,255,.2);background:rgba(96,77,255,.02)}
.pft-pro-gate h4{font-size:16px;font-weight:700;color:var(--tx);margin:0 0 6px}
.pft-pro-gate p{font-size:12px;color:var(--g4);margin:0 0 16px}
.pft-pro-gate button{padding:10px 24px;border-radius:10px;border:none;background:var(--ac);color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans)}

/* Live View Overlay */
.pfl-overlay{position:fixed;inset:0;z-index:9999;background:var(--bg);overflow-y:auto;animation:fadeIn .3s ease}
.pfl-topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(var(--bg-rgb,255,255,255),.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--g1)}
.pfl-topbar-title{font-size:13px;font-weight:600;color:var(--tx)}
.pfl-topbar-actions{display:flex;gap:8px;align-items:center}
.pfl-topbar-actions button{padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:all .15s}
.pfl-content{max-width:900px;margin:0 auto;padding:32px 24px 80px}
.pfl-footer{text-align:center;padding:32px 0 24px;border-top:1px solid var(--g1);margin-top:40px;display:flex;align-items:center;justify-content:center;gap:8px}
.pfl-footer img{width:18px;height:18px;border-radius:4px}
.pfl-footer span{font-size:12px;color:var(--g4);font-weight:500}
.pfl-footer a{color:var(--ac);font-weight:600;text-decoration:none;font-size:12px}
.dark .pfl-topbar{background:rgba(18,18,22,.85)}

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

/* ━━━ Opportunity Detail & Apply Flow ━━━ */
.opp-highlight-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;animation:slideInUp .3s ease both}
.opp-highlight-card{background:rgba(96,77,255,.06);border:1px solid rgba(96,77,255,.12);border-radius:14px;padding:20px;text-align:center}
.opp-highlight-card .ohc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--g4);margin-bottom:4px}
.opp-highlight-card .ohc-value{font-size:16px;font-weight:600;color:var(--ac);font-family:var(--mono)}
.dark .opp-highlight-card{background:rgba(122,102,255,.1);border-color:rgba(122,102,255,.15)}

/* Apply Stepper */
.apply-stepper{display:flex;align-items:flex-start;justify-content:center;gap:0;margin-bottom:28px;padding:4px 0;animation:fadeIn .2s}
.apply-step{display:flex;align-items:center;gap:0}
.apply-step-wrap{display:flex;flex-direction:column;align-items:center;gap:4px}
.apply-step-dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:2px solid var(--g3);color:var(--g4);background:var(--sf);transition:all .2s;cursor:pointer;font-family:var(--sans)}
.apply-step-dot:hover{border-color:var(--ac);color:var(--ac)}
.apply-step-dot.active{border-color:var(--ac);color:#fff;background:var(--ac);box-shadow:0 2px 8px rgba(96,77,255,.25)}
.apply-step-dot.completed{border-color:var(--green);color:#fff;background:var(--green)}
.apply-step-label{font-size:10px;color:var(--g4);white-space:nowrap}
.apply-step-label.active{color:var(--ac);font-weight:600}
.apply-step-label.completed{color:var(--green)}
.apply-step-line{width:40px;height:2px;background:var(--g3);margin:0 4px;margin-top:17px}
.apply-step-line.completed{background:var(--green)}

/* Profile Check */
.profile-check-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--g2);border-radius:12px;margin-bottom:6px;transition:all .15s;cursor:pointer}
.profile-check-row:hover{border-color:var(--ac);background:rgba(96,77,255,.02)}
.profile-check-icon{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.profile-check-icon.ok{background:rgba(29,185,84,.12);color:var(--green)}
.profile-check-icon.missing{background:rgba(255,71,87,.12);color:var(--red)}
.profile-check-label{flex:1;font-size:13px;font-weight:500;color:var(--tx);text-transform:capitalize}
.profile-check-value{font-size:12px;color:var(--g5);font-family:var(--mono)}
.dark .profile-check-row{border-color:var(--g2)}

/* Material Row */
.material-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--g2);border-radius:12px;margin-bottom:8px;transition:all .15s}
.material-row .mr-status{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.material-row .mr-status.done{background:rgba(29,185,84,.12);color:var(--green)}
.material-row .mr-status.pending{background:rgba(255,71,87,.12);color:var(--red)}
.material-row .mr-info{flex:1}
.material-row .mr-label{font-size:13px;font-weight:600;color:var(--tx)}
.material-row .mr-req{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:2px 7px;border-radius:20px;margin-left:6px}
.dark .material-row{border-color:var(--g2)}

/* Apply Footer */
.apply-footer{display:flex;align-items:center;justify-content:space-between;padding-top:20px;margin-top:24px;border-top:1px solid var(--g2)}
.apply-footer-left{display:flex;gap:8px}
.apply-footer-right{display:flex;gap:8px}
.dark .apply-footer{border-top-color:var(--g2)}

/* Review Section */
.review-section{border:1px solid var(--g2);border-radius:14px;padding:16px;margin-bottom:12px;animation:slideInUp .2s ease both}
.review-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.review-section-header h4{margin:0;font-size:14px;font-weight:600}
.review-section-header .rs-edit{font-size:11px;color:var(--ac);cursor:pointer;font-weight:600;background:none;border:none;font-family:var(--sans);padding:0}
.review-section-header .rs-edit:hover{text-decoration:underline}
.review-row{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px}
.review-row .rr-label{color:var(--g4);width:100px;flex-shrink:0}
.review-row .rr-value{color:var(--tx);font-weight:500}
.dark .review-section{border-color:var(--g2)}

/* SR Check List (apply step 2) */
.sr-check-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--g2);border-radius:10px;margin-bottom:6px;cursor:pointer;transition:all .15s}
.sr-check-item:hover{border-color:var(--ac);background:rgba(96,77,255,.02)}
.sr-check-item.checked{border-color:var(--ac);background:rgba(96,77,255,.04)}
.sr-check-box{width:20px;height:20px;border-radius:6px;border:2px solid var(--g3);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;transition:all .15s}
.sr-check-item.checked .sr-check-box{background:var(--ac);border-color:var(--ac);color:#fff}
.dark .sr-check-item{border-color:var(--g2)}

/* Network Cards */
.network-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.network-card{background:var(--sf);border:1px solid var(--g2);border-radius:16px;overflow:hidden;transition:all .2s;cursor:pointer;animation:slideInUp .2s ease both}
.network-card:hover{border-color:var(--ac);box-shadow:0 4px 20px rgba(96,77,255,.08);transform:translateY(-2px)}
.nc-header{position:relative;height:80px;background:linear-gradient(135deg,rgba(96,77,255,.15),rgba(96,77,255,.05));display:flex;align-items:flex-end;justify-content:center;padding-bottom:0}
.nc-photo{width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid var(--sf);position:absolute;bottom:-32px;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.nc-body{padding:40px 16px 16px;text-align:center}
.nc-name{font-size:14px;font-weight:600;color:var(--tx);margin-bottom:2px}
.nc-role{font-size:11px;color:var(--g4);margin-bottom:8px}
.nc-location{font-size:10px;color:var(--g5);margin-bottom:10px}
.nc-styles{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-bottom:12px}
.nc-styles span{font-size:9px;padding:2px 8px;border-radius:20px;background:rgba(96,77,255,.06);color:var(--ac);font-weight:500}
.nc-footer{display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--g2);font-size:10px;color:var(--g4)}
.dark .network-card{border-color:var(--g2)}
.dark .nc-header{background:linear-gradient(135deg,rgba(122,102,255,.2),rgba(122,102,255,.05))}
.dark .nc-footer{border-top-color:var(--g2)}

/* Network Map */
.network-map{width:100%;height:500px;border-radius:16px;overflow:hidden;border:1px solid var(--g2)}
.network-map .leaflet-container{width:100%;height:100%;font-family:var(--sans)}
.dark .network-map{border-color:var(--g2)}
.network-map .leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.12);font-family:var(--sans)}
.network-map .leaflet-popup-content{margin:10px 14px;font-size:12px}

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
  .ctx-spotlight .main,.ctx-portfolio .main{position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;border-radius:0!important;box-shadow:none!important;min-height:auto;background:transparent!important}
  .ctx-spotlight .topbar,.ctx-portfolio .topbar{display:none!important}
  .ctx-spotlight::before,.ctx-portfolio::before{display:none}
  .pfe-section h3{font-size:14px}
  .pfp-hero{min-height:200px;padding:24px 20px}
  .pfp-hero .pfp-hero-name{font-size:24px}
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
  .opp-highlight-row{grid-template-columns:1fr}
  .apply-stepper{overflow-x:auto;justify-content:flex-start;padding:4px 0}
  .apply-step-line{width:20px}
  .apply-step-label{font-size:9px}
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

/* ━━━ NETWORK MAP ━━━ */
function NetworkMap({ items, networkTab, darkMode }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [48, 10],
        zoom: 3,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        minZoom: 2,
        maxZoom: 18,
      });
      L.tileLayer(
        darkMode
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png",
        { attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', subdomains: "abcd", maxZoom: 19 }
      ).addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer on dark mode change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) mapInstanceRef.current.removeLayer(layer);
    });
    L.tileLayer(
      darkMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png",
      { attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', subdomains: "abcd", maxZoom: 19 }
    ).addTo(mapInstanceRef.current);
  }, [darkMode]);

  // Update markers when items change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    items.forEach(item => {
      const icon = L.divIcon({
        className: "network-map-pin",
        html: `<div style="display:flex;flex-direction:column;align-items:center">
          <img src="${item.photo || item.logo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:3px solid #604DFF;box-shadow:0 2px 10px rgba(0,0,0,.2)" />
          <div style="width:2px;height:8px;background:#604DFF"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#604DFF"></div>
        </div>`,
        iconSize: [46, 62],
        iconAnchor: [23, 62],
        popupAnchor: [0, -65],
      });

      const marker = L.marker([item.lat, item.lng], { icon }).addTo(mapInstanceRef.current);
      const popupContent = networkTab === "people"
        ? `<div style="text-align:center"><img src="${item.photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;margin-bottom:6px" /><div style="font-weight:600;font-size:13px">${item.name}</div><div style="font-size:11px;color:#888;margin-top:2px">${item.role}${item.company ? ' · ' + item.company : ''}</div><div style="font-size:10px;color:#aaa;margin-top:4px">📍 ${item.location}</div><div style="margin-top:6px;display:flex;gap:4px;justify-content:center;flex-wrap:wrap">${(item.styles || []).map(s => '<span style="font-size:9px;padding:2px 6px;border-radius:10px;background:rgba(96,77,255,.1);color:#604DFF">' + s + '</span>').join('')}</div></div>`
        : `<div style="text-align:center"><img src="${item.logo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;margin-bottom:6px" /><div style="font-weight:600;font-size:13px">${item.name}</div><div style="font-size:11px;color:#888;margin-top:2px">${item.type}</div><div style="font-size:10px;color:#aaa;margin-top:4px">📍 ${item.location}</div>${item.openPositions ? '<div style="font-size:10px;color:#604DFF;margin-top:4px;font-weight:600">' + item.openPositions + ' open positions</div>' : ''}</div>`;
      marker.bindPopup(popupContent, { maxWidth: 220, closeButton: true });
      markersRef.current.push(marker);
    });

    // Fit bounds if items exist
    if (items.length > 0) {
      const bounds = L.latLngBounds(items.map(i => [i.lat, i.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [items, networkTab]);

  return (
    <div className="network-map" style={{ position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(96,77,255,.03)", pointerEvents: "none", zIndex: 400 }} />
    </div>
  );
}

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
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [appFilter, setAppFilter] = useState("all");
  const [appSort, setAppSort] = useState("newest");
  const [viewSpotlight, setViewSpotlight] = useState(null);
  const [spotlightTab, setSpotlightTab] = useState("overview");

  /* Discover */
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [viewOpportunity, setViewOpportunity] = useState(null);
  const [applyStep, setApplyStep] = useState(0);
  const [applyDraft, setApplyDraft] = useState({ profileOverrides: {}, selectedSRIds: [], attachedMaterials: {}, motivation: "", questionAnswers: {}, uploadedResumePDF: false });
  const [pickerTargetMaterial, setPickerTargetMaterial] = useState(null);
  const [networkTab, setNetworkTab] = useState("people");
  const [networkView, setNetworkView] = useState("list");
  const [networkSearch, setNetworkSearch] = useState("");
  const [networkStyleFilter, setNetworkStyleFilter] = useState("all");
  const [networkLocationFilter, setNetworkLocationFilter] = useState("all");

  /* Present / Portfolios */
  const [portfolios, setPortfolios] = useState(MOCK_PORTFOLIOS);
  const [viewPortfolio, setViewPortfolio] = useState(null); // portfolio id
  const [portfolioTab, setPortfolioTab] = useState("overview");
  const [showNewPortfolioModal, setShowNewPortfolioModal] = useState(false);
  const [newPf, setNewPf] = useState({ name: "", description: "", discipline: "", styles: [], skills: [], styleInput: "", skillInput: "" });
  const [portfolioPreview, setPortfolioPreview] = useState(false);
  const [portfolioLive, setPortfolioLive] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSettings, setShareSettings] = useState({ trackLink: false, requireEmail: false, password: "" });

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
  const [settingsTab, setSettingsTab] = useState("account");
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (e) => {
      const acct = document.querySelector(".sidebar-acct");
      if (acct && acct.contains(e.target)) return;
      setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

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

  const PORTFOLIO_TABS = [
    { id: "overview", icon: I.overview, label: "Overview" },
    { id: "gallery", icon: I.media, label: "Gallery" },
    { id: "videos", icon: I.present, label: "Videos" },
    { id: "resume", icon: I.doc, label: "Resume" },
    { id: "references", icon: I.doc, label: "References" },
    { id: "tracking", icon: I.applications, label: "Tracking" },
    { id: "settings", icon: I.settings, label: "Settings" },
  ];

  const currentPortfolio = viewPortfolio ? portfolios.find(p => p.id === viewPortfolio) : null;

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
  const currentOpp = viewOpportunity ? opportunities.find(o => o.id === viewOpportunity) : null;

  const PROFILE_FIELD_LABELS = { nationality: "Nationality", height: "Height", gender: "Gender", dob: "Date of Birth", shoeSize: "Shoe Size", weight: "Weight", eyeColor: "Eye Color", hairColor: "Hair Color" };

  const handleSubmitApplication = () => {
    const newApp = {
      id: "app" + (applications.length + 1),
      company: currentOpp.company, companyLogo: currentOpp.companyLogo || "/demo/artists/1.jpg", artistPhoto: artist.photo,
      opportunity: currentOpp.title, status: "submitted",
      submitted: new Date().toISOString().split("T")[0], deadline: currentOpp.deadline,
      banner: currentOpp.banner, desc: currentOpp.description,
      companyDesc: currentOpp.companyDesc || "",
    };
    setApplications(prev => [...prev, newApp]);
    setViewOpportunity(null);
    setApplyStep(0);
    setPage("applications");
    setViewSpotlight(newApp.id);
    setSpotlightTab("overview");
    showToast("Application submitted successfully!");
  };

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
                  <h4>Your Application</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <img src={artist.photo} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "3px 10px", borderRadius: 40, background: sc.bg, color: sc.color }}>{STATUS_LABELS[spotlightApp.status]}</span>
                      <div style={{ fontSize: 11, color: "var(--g4)", marginTop: 6 }}>Submitted {spotlightApp.submitted}</div>
                    </div>
                  </div>
                  <div className="info-row"><span className="ir-label">Format</span><span className="ir-value">In Person</span></div>
                  <div className="info-row"><span className="ir-label">Deadline</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>{spotlightApp.deadline}</span></div>
                  <div className="info-row"><span className="ir-label">Reference</span><span className="ir-value" style={{ fontFamily: "var(--mono)", fontSize: 10 }}>{spotlightApp.id.toUpperCase()}</span></div>
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

    /* ── Opportunity Detail + Apply Flow ── */
    if (viewOpportunity && currentOpp) {
      const STEP_LABELS = ["Profile", "Resume", "Materials", "Questions", "Review"];

      if (applyStep === 0) {
        /* Detail view */
        return (
          <div>
            <div className="spotlight-hero" style={{ marginTop: 16 }}>
              <img src={currentOpp.banner} alt="" />
              <div className="sh-overlay">
                <div>
                  <div className="sh-title">{currentOpp.title}</div>
                  <div className="sh-company">{currentOpp.company} · {currentOpp.location}</div>
                </div>
              </div>
            </div>

            <div className="opp-highlight-row">
              <div className="opp-highlight-card">
                <div className="ohc-label">Audition Date</div>
                <div className="ohc-value">{currentOpp.auditionDate}</div>
              </div>
              <div className="opp-highlight-card">
                <div className="ohc-label">Application Deadline</div>
                <div className="ohc-value">{currentOpp.deadline}</div>
              </div>
            </div>

            <div className="spotlight-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="info-card">
                <h4>About the Opportunity</h4>
                <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.7 }}>{currentOpp.description}</p>
              </div>
              <div className="info-card">
                <h4>What They're Looking For</h4>
                <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.7 }}>{currentOpp.requirements}</p>
              </div>
            </div>
            <div className="spotlight-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="info-card">
                <h4>Employment Details</h4>
                <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.7 }}>{currentOpp.employmentDetails}</p>
              </div>
              <div className="info-card">
                <h4>How to Apply</h4>
                <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.7, marginBottom: 12 }}>{currentOpp.howToApply}</p>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--tx)", marginBottom: 8 }}>Required Materials:</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {currentOpp.materialsRequired.map(m => (
                    <span key={m.id} className="chip" style={{ cursor: "default" }}>
                      {m.type === "video" ? "🎬" : "📷"} {m.label} {m.required ? "" : "(optional)"}
                    </span>
                  ))}
                </div>
                {currentOpp.customQuestions.length > 0 && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--tx)", marginBottom: 8 }}>Additional Questions:</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {currentOpp.customQuestions.map((q, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(96,77,255,.05)", border: "1px solid rgba(96,77,255,.1)", borderRadius: 10, fontSize: 11, color: "var(--g5)" }}>
                          <span style={{ color: "var(--ac)", fontWeight: 700 }}>Q{i + 1}</span> {q}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="info-card" style={{ marginBottom: 16 }}>
              <h4>About {currentOpp.company}</h4>
              <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.7 }}>{currentOpp.companyDesc}</p>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <button className="btn btn-p btn-lg" onClick={() => {
                setApplyStep(1);
                setApplyDraft({ profileOverrides: {}, selectedSRIds: stageRecords.filter(sr => sr.usedIn.includes("Resume")).map(sr => sr.id), attachedMaterials: currentOpp.id === "opp1" ? { mat1: "m5" } : currentOpp.id === "opp2" ? { mat1: "m6" } : {}, motivation: "", questionAnswers: {}, uploadedResumePDF: false });
              }}>Apply Now →</button>
              <button className="btn btn-s btn-lg" onClick={() => {
                setOpportunities(prev => prev.map(o => o.id === currentOpp.id ? { ...o, saved: !o.saved } : o));
                showToast(currentOpp.saved ? "Removed from saved" : "Saved!");
              }}>{currentOpp.saved ? "★ Saved" : "☆ Save"}</button>
            </div>
          </div>
        );
      }

      /* Apply wizard steps 1-5 */
      return (
        <div>
          {/* Stepper */}
          <div className="apply-stepper">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="apply-step">
                {i > 0 && <div className={`apply-step-line${i + 1 <= applyStep ? "" : ""}${i < applyStep ? " completed" : ""}`} />}
                <div className="apply-step-wrap">
                  <div className={`apply-step-dot${applyStep === i + 1 ? " active" : ""}${i + 1 < applyStep ? " completed" : ""}`} onClick={() => setApplyStep(i + 1)}>
                    {i + 1 < applyStep ? "✓" : i + 1}
                  </div>
                  <div className={`apply-step-label${applyStep === i + 1 ? " active" : ""}${i + 1 < applyStep ? " completed" : ""}`}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, marginTop: -20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "var(--sf)", border: "1px solid var(--g2)", borderRadius: 12 }}>
              <div style={{ position: "relative", width: 36, height: 36 }}>
                <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--g2)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke={(() => { const profileDone = currentOpp.profileFieldsRequired.every(f => artist[f] || applyDraft.profileOverrides[f]); const resumeDone = applyDraft.selectedSRIds.length > 0; const materialsDone = currentOpp.materialsRequired.filter(m => m.required).every(m => applyDraft.attachedMaterials[m.id]); const motivationDone = applyDraft.motivation.length > 0; const total = [profileDone, resumeDone, materialsDone, motivationDone].filter(Boolean).length; return total === 4 ? "var(--green)" : "var(--ac)"; })()} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(() => { const profileDone = currentOpp.profileFieldsRequired.every(f => artist[f] || applyDraft.profileOverrides[f]); const resumeDone = applyDraft.selectedSRIds.length > 0; const materialsDone = currentOpp.materialsRequired.filter(m => m.required).every(m => applyDraft.attachedMaterials[m.id]); const motivationDone = applyDraft.motivation.length > 0; return [profileDone, resumeDone, materialsDone, motivationDone].filter(Boolean).length / 4 * 94.2; })()} 94.2`} />
                </svg>
                <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 9, fontWeight: 700, color: "var(--tx)" }}>{(() => { const profileDone = currentOpp.profileFieldsRequired.every(f => artist[f] || applyDraft.profileOverrides[f]); const resumeDone = applyDraft.selectedSRIds.length > 0; const materialsDone = currentOpp.materialsRequired.filter(m => m.required).every(m => applyDraft.attachedMaterials[m.id]); const motivationDone = applyDraft.motivation.length > 0; return Math.round([profileDone, resumeDone, materialsDone, motivationDone].filter(Boolean).length / 4 * 100); })()}%</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--tx)" }}>Progress</div>
                <div style={{ fontSize: 10, color: "var(--g4)" }}>{(() => { const profileDone = currentOpp.profileFieldsRequired.every(f => artist[f] || applyDraft.profileOverrides[f]); const resumeDone = applyDraft.selectedSRIds.length > 0; const materialsDone = currentOpp.materialsRequired.filter(m => m.required).every(m => applyDraft.attachedMaterials[m.id]); const motivationDone = applyDraft.motivation.length > 0; return [profileDone, resumeDone, materialsDone, motivationDone].filter(Boolean).length; })()} of 4 sections done</div>
              </div>
            </div>
          </div>

          {/* Step 1: Profile Check */}
          {applyStep === 1 && (
            <div className="info-card" style={{ animation: "slideInUp .3s ease" }}>
              <h4>Profile Information Check</h4>
              <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 16 }}>{currentOpp.company} requires the following profile information. Fill in any missing fields before continuing.</p>
              {currentOpp.profileFieldsRequired.map(field => {
                const val = applyDraft.profileOverrides[field] || artist[field];
                const filled = !!val;
                return (
                  <div key={field} className="profile-check-row" onClick={() => {
                    if (!filled) {
                      const input = prompt(`Enter your ${PROFILE_FIELD_LABELS[field] || field}:`);
                      if (input) {
                        setApplyDraft(prev => ({ ...prev, profileOverrides: { ...prev.profileOverrides, [field]: input } }));
                        setArtist(prev => ({ ...prev, [field]: input }));
                      }
                    }
                  }}>
                    <div className={`profile-check-icon ${filled ? "ok" : "missing"}`}>{filled ? "✓" : "✗"}</div>
                    <span className="profile-check-label">{PROFILE_FIELD_LABELS[field] || field}</span>
                    <span className="profile-check-value">{val || "Not provided"}</span>
                    {!filled && <span style={{ fontSize: 10, color: "var(--ac)", fontWeight: 600 }}>+ Add</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 2: Resume / Stage Record */}
          {applyStep === 2 && (
            <div style={{ animation: "slideInUp .3s ease" }}>
              <div className="info-card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h4 style={{ margin: 0 }}>Select Stage Record Entries</h4>
                  <button className="btn btn-p btn-sm" onClick={() => { setShowNewEntry(true); setNewEntryType(null); setEditEntry(null); setEntryForm({ title: "", org: "", start: "", end: "", location: "", desc: "", tags: "" }); }}>+ Add New</button>
                </div>
                <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 12 }}>Choose which entries from your Stage Record to include in this application.</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                  {Object.entries(SR_LABELS).map(([key, label]) => {
                    const count = stageRecords.filter(s => s.type === key).length;
                    return <button key={key} className={`chip${srFilter === key ? " on" : ""}`} onClick={() => setSrFilter(srFilter === key ? "all" : key)}>{label} <span style={{ opacity: .7 }}>{count}</span></button>;
                  })}
                </div>
                {stageRecords.filter(sr => srFilter === "all" || sr.type === srFilter).map(sr => {
                  const checked = applyDraft.selectedSRIds.includes(sr.id);
                  return (
                    <div key={sr.id} className={`sr-check-item${checked ? " checked" : ""}`} onClick={() => {
                      setApplyDraft(prev => ({ ...prev, selectedSRIds: checked ? prev.selectedSRIds.filter(x => x !== sr.id) : [...prev.selectedSRIds, sr.id] }));
                    }}>
                      <div className="sr-check-box">{checked ? "✓" : ""}</div>
                      <span style={{ fontSize: 18 }}>{sr.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>{sr.title}</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>{sr.org}{sr.start ? ` · ${sr.start}` : ""}{sr.end ? ` — ${sr.end}` : ""}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${SR_COLORS[sr.type]}15`, color: SR_COLORS[sr.type], textTransform: "capitalize" }}>{sr.type}</span>
                    </div>
                  );
                })}
              </div>
              <div className="info-card">
                <h4>Upload Own Resume (Optional)</h4>
                <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 12 }}>Optionally upload a PDF resume alongside your Lanced Stage Record.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button className={`btn ${applyDraft.uploadedResumePDF ? "btn-success" : "btn-s"} btn-sm`} onClick={() => setApplyDraft(prev => ({ ...prev, uploadedResumePDF: !prev.uploadedResumePDF }))}>
                    {applyDraft.uploadedResumePDF ? "✓ PDF Attached" : "Upload PDF"}
                  </button>
                  {applyDraft.uploadedResumePDF && <span style={{ fontSize: 11, color: "var(--green)" }}>Resume_2026.pdf</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Materials */}
          {applyStep === 3 && (
            <div className="info-card" style={{ animation: "slideInUp .3s ease" }}>
              <h4>Required Materials</h4>
              <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 16 }}>{currentOpp.company} requests the following materials. Add them from your Media Library or upload new files.</p>
              {currentOpp.materialsRequired.map(mat => {
                const attached = !!applyDraft.attachedMaterials[mat.id];
                const attachedMedia = attached ? mediaItems.find(m => m.id === applyDraft.attachedMaterials[mat.id]) : null;
                return (
                  <div key={mat.id} className="material-row" style={{ flexDirection: attached ? "column" : "row", alignItems: attached ? "stretch" : "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className={`mr-status ${attached ? "done" : "pending"}`}>{attached ? "✓" : "✗"}</div>
                      <div className="mr-info" style={{ flex: 1 }}>
                        <span className="mr-label">{mat.label}</span>
                        <span className="mr-req" style={{ background: mat.required ? "rgba(255,71,87,.1)" : "var(--g1)", color: mat.required ? "var(--red)" : "var(--g4)" }}>{mat.required ? "Required" : "Optional"}</span>
                      </div>
                      <button className="btn btn-s btn-sm" onClick={() => {
                        setPickerTargetMaterial(mat.id);
                        setPickerSelected([]);
                        setShowMediaPicker(mat.type);
                      }}>{attached ? "Change" : "+ Add from Library"}</button>
                    </div>
                    {attachedMedia && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, padding: "10px 12px", background: "rgba(29,185,84,.04)", border: "1px solid rgba(29,185,84,.15)", borderRadius: 10 }}>
                        {attachedMedia.thumb ? (
                          <div style={{ position: "relative", width: 80, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                            <img src={attachedMedia.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            {attachedMedia.type === "video" && (
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.3)" }}>
                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid var(--ac)", marginLeft: 2 }} />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ width: 80, height: 56, borderRadius: 8, background: "var(--g1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📄</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--tx)" }}>{attachedMedia.title}</div>
                          <div style={{ fontSize: 10, color: "var(--g4)", marginTop: 2 }}>{attachedMedia.format} · {attachedMedia.size}{attachedMedia.duration ? ` · ${attachedMedia.duration}` : ""}</div>
                        </div>
                        <button className="btn btn-sm" style={{ background: "rgba(255,71,87,.08)", color: "var(--red)", border: "1px solid rgba(255,71,87,.12)", fontSize: 10, padding: "4px 10px" }} onClick={() => {
                          setApplyDraft(prev => {
                            const next = { ...prev, attachedMaterials: { ...prev.attachedMaterials } };
                            delete next.attachedMaterials[mat.id];
                            return next;
                          });
                        }}>Remove</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4: Motivation & Questions */}
          {applyStep === 4 && (
            <div style={{ animation: "slideInUp .3s ease" }}>
              <div className="info-card" style={{ marginBottom: 16 }}>
                <h4>Cover Letter / Motivation</h4>
                <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 12 }}>Tell {currentOpp.company} why you're the right fit for this opportunity.</p>
                <textarea className="msg-input" style={{ width: "100%", minHeight: 120 }} placeholder="Write your motivation here..." value={applyDraft.motivation} onChange={e => setApplyDraft(prev => ({ ...prev, motivation: e.target.value }))} />
              </div>
              {currentOpp.customQuestions.length > 0 && (
                <div className="info-card">
                  <h4>Additional Questions</h4>
                  <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 16 }}>{currentOpp.company} has a few extra questions.</p>
                  {currentOpp.customQuestions.map((q, i) => (
                    <div key={i} className="field">
                      <label>{q}</label>
                      <textarea value={applyDraft.questionAnswers[i] || ""} onChange={e => setApplyDraft(prev => ({ ...prev, questionAnswers: { ...prev.questionAnswers, [i]: e.target.value } }))} placeholder="Your answer..." />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review & Send */}
          {applyStep === 5 && (
            <div style={{ animation: "slideInUp .3s ease" }}>
              <div className="review-section">
                <div className="review-section-header">
                  <h4>Profile Information</h4>
                  <button className="rs-edit" onClick={() => setApplyStep(1)}>Edit</button>
                </div>
                {currentOpp.profileFieldsRequired.map(f => {
                  const val = applyDraft.profileOverrides[f] || artist[f];
                  return (
                    <div key={f} className="review-row">
                      <span className="rr-label">{PROFILE_FIELD_LABELS[f] || f}</span>
                      <span className="rr-value" style={{ color: val ? "var(--tx)" : "var(--red)" }}>{val || "Missing"}</span>
                    </div>
                  );
                })}
              </div>

              <div className="review-section">
                <div className="review-section-header">
                  <h4>Stage Record</h4>
                  <button className="rs-edit" onClick={() => setApplyStep(2)}>Edit</button>
                </div>
                <div style={{ fontSize: 13, color: "var(--g5)", marginBottom: 8 }}>{applyDraft.selectedSRIds.length} entries selected</div>
                {stageRecords.filter(sr => applyDraft.selectedSRIds.includes(sr.id)).slice(0, 3).map(sr => (
                  <div key={sr.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 12 }}>
                    <span>{sr.emoji}</span>
                    <span style={{ fontWeight: 600, color: "var(--tx)" }}>{sr.title}</span>
                    <span style={{ color: "var(--g4)" }}>· {sr.org}</span>
                  </div>
                ))}
                {applyDraft.selectedSRIds.length > 3 && <div style={{ fontSize: 11, color: "var(--g4)" }}>+ {applyDraft.selectedSRIds.length - 3} more</div>}
                {applyDraft.uploadedResumePDF && <div style={{ fontSize: 11, color: "var(--green)", marginTop: 6 }}>✓ PDF Resume attached</div>}
              </div>

              <div className="review-section">
                <div className="review-section-header">
                  <h4>Materials</h4>
                  <button className="rs-edit" onClick={() => setApplyStep(3)}>Edit</button>
                </div>
                {currentOpp.materialsRequired.map(mat => {
                  const attached = !!applyDraft.attachedMaterials[mat.id];
                  const media = attached ? mediaItems.find(m => m.id === applyDraft.attachedMaterials[mat.id]) : null;
                  return (
                    <div key={mat.id} className="review-row">
                      <span className="rr-label">{mat.label}</span>
                      <span className="rr-value" style={{ color: attached ? "var(--green)" : "var(--red)" }}>{attached ? `✓ ${media?.title || "Attached"}` : "Not attached"}</span>
                    </div>
                  );
                })}
              </div>

              <div className="review-section">
                <div className="review-section-header">
                  <h4>Motivation & Questions</h4>
                  <button className="rs-edit" onClick={() => setApplyStep(4)}>Edit</button>
                </div>
                <div style={{ fontSize: 12, color: "var(--g5)", lineHeight: 1.6, marginBottom: 8 }}>
                  {applyDraft.motivation ? (applyDraft.motivation.length > 200 ? applyDraft.motivation.slice(0, 200) + "..." : applyDraft.motivation) : <span style={{ color: "var(--g4)", fontStyle: "italic" }}>No motivation provided</span>}
                </div>
                {currentOpp.customQuestions.map((q, i) => (
                  <div key={i} style={{ fontSize: 11, color: "var(--g4)", marginTop: 4 }}>
                    <strong>{q}</strong>: {applyDraft.questionAnswers[i] ? <span style={{ color: "var(--green)" }}>Answered</span> : <span style={{ color: "var(--red)" }}>Not answered</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply footer navigation */}
          <div className="apply-footer">
            <div className="apply-footer-left">
              <button className="btn btn-s" onClick={() => showToast("Draft saved!")}>Save Draft</button>
            </div>
            <div className="apply-footer-right">
              {applyStep > 1 && <button className="btn btn-s" onClick={() => setApplyStep(applyStep - 1)}>← Back</button>}
              {applyStep < 5 ? (
                <button className="btn btn-p" onClick={() => setApplyStep(applyStep + 1)}>Continue →</button>
              ) : (
                <button className="btn btn-p" onClick={handleSubmitApplication}>Submit Application</button>
              )}
            </div>
          </div>
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
            {applications.filter(a => a.status === "draft").length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--g4)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 12 }}>📝 Drafts</h3>
                <div className="app-list">
                  {applications.filter(a => a.status === "draft").map(app => {
                    const progress = Math.round(((app.draftProgress?.profile ? 1 : 0) + (app.draftProgress?.resume ? 1 : 0) + (app.draftProgress?.materials ? 1 : 0) + (app.draftProgress?.motivation ? 1 : 0)) / 4 * 100);
                    return (
                      <div key={app.id} className="app-card" onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }} style={{ position: "relative" }}>
                        <img className="ac-logo" src={app.companyLogo} alt="" />
                        <div className="ac-info">
                          <div className="ac-title">{app.opportunity}</div>
                          <div className="ac-company">{app.company}</div>
                          <div className="ac-meta"><span>Deadline: {app.deadline}</span></div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span className="ac-status" style={{ background: "rgba(255,171,0,.12)", color: "var(--amber)" }}>DRAFT</span>
                          <div style={{ width: 60, height: 5, borderRadius: 3, background: "var(--g2)", overflow: "hidden" }}>
                            <div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: progress === 100 ? "var(--green)" : "var(--ac)" }} />
                          </div>
                          <span style={{ fontSize: 9, color: "var(--g4)" }}>{progress}% complete</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
            {opportunities.filter(o => o.saved).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--g4)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 12 }}>★ Saved Opportunities</h3>
                <div className="opp-grid">
                  {opportunities.filter(o => o.saved).map(opp => (
                    <div key={opp.id} className="opp-card" onClick={() => { setViewOpportunity(opp.id); setApplyStep(0); }} style={{ border: "2px solid rgba(96,77,255,.15)" }}>
                      <img className="oc-banner" src={opp.banner} alt="" />
                      <div className="oc-body">
                        <div className="oc-title">{opp.title}</div>
                        <div className="oc-company">{opp.company}</div>
                        <div className="oc-meta"><span>{opp.location}</span><span>{opp.type}</span></div>
                        <div className="oc-footer">
                          <span>Deadline: {opp.deadline}</span>
                          <button className="oc-save saved" onClick={(e) => { e.stopPropagation(); setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, saved: !o.saved } : o)); }}>★</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--g4)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 12 }}>All Opportunities</h3>
            <div className="opp-grid">
              {opportunities.map(opp => (
                <div key={opp.id} className="opp-card" onClick={() => { setViewOpportunity(opp.id); setApplyStep(0); }}>
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
      case "network": {
        const MOCK_NETWORK_PEOPLE = [
          { id: "p1", name: "Elise Vandenberg", role: "Contemporary Dancer", company: "NDT", location: "The Hague, NL", lat: 52.07, lng: 4.30, photo: "/demo/artists/1.jpg", styles: ["Contemporary", "Floor Work"], mutual: 5 },
          { id: "p2", name: "Marcus Chen", role: "Choreographer", company: "Freelance", location: "Berlin, DE", lat: 52.52, lng: 13.40, photo: "/demo/artists/2.jpg", styles: ["Contemporary", "Hip-Hop"], mutual: 3 },
          { id: "p3", name: "Sofia Rossi", role: "Ballet Dancer", company: "La Scala", location: "Milan, IT", lat: 45.46, lng: 9.19, photo: "/demo/artists/3.jpg", styles: ["Classical", "Neoclassical"], mutual: 8 },
          { id: "p4", name: "Jamal Williams", role: "Dance Teacher", company: "Pineapple Studios", location: "London, UK", lat: 51.51, lng: -0.13, photo: "/demo/artists/4.jpg", styles: ["Jazz", "Commercial"], mutual: 12 },
          { id: "p5", name: "Yuki Tanaka", role: "Butoh Artist", company: "Independent", location: "Tokyo, JP", lat: 35.68, lng: 139.69, photo: "/demo/artists/5.jpg", styles: ["Butoh", "Contemporary"], mutual: 1 },
          { id: "p6", name: "Aisha Diallo", role: "Afro-Contemporary Dancer", company: "Compagnie Käfig", location: "Paris, FR", lat: 48.86, lng: 2.35, photo: "/demo/artists/nisha-huizing.jpg", styles: ["Afro-fusion", "Contemporary"], mutual: 7 },
        ];
        const MOCK_NETWORK_COMPANIES = [
          { id: "c1", name: "Nederlands Dans Theater", type: "Company", location: "The Hague, NL", lat: 52.07, lng: 4.30, logo: "/demo/artists/1.jpg", styles: ["Contemporary"], openPositions: 2 },
          { id: "c2", name: "Royal Ballet", type: "Company", location: "London, UK", lat: 51.51, lng: -0.13, logo: "/demo/artists/2.jpg", styles: ["Classical", "Contemporary"], openPositions: 3 },
          { id: "c3", name: "Batsheva Dance Company", type: "Company", location: "Tel Aviv, IL", lat: 32.07, lng: 34.77, logo: "/demo/artists/3.jpg", styles: ["Contemporary", "Gaga"], openPositions: 1 },
          { id: "c4", name: "Hamburg Ballet", type: "Company", location: "Hamburg, DE", lat: 53.55, lng: 10.00, logo: "/demo/artists/4.jpg", styles: ["Classical", "Neoclassical"], openPositions: 0 },
          { id: "c5", name: "Pina Bausch Tanztheater", type: "Company", location: "Wuppertal, DE", lat: 51.26, lng: 7.17, logo: "/demo/artists/5.jpg", styles: ["Tanztheater"], openPositions: 1 },
          { id: "c6", name: "Sadler's Wells", type: "Venue / Producer", location: "London, UK", lat: 51.53, lng: -0.11, logo: "/demo/artists/nisha-huizing.jpg", styles: ["All Genres"], openPositions: 2 },
        ];
        const networkItems = networkTab === "people" ? MOCK_NETWORK_PEOPLE : MOCK_NETWORK_COMPANIES;
        const filteredNetworkItems = networkItems.filter(item => {
          const matchesSearch = !networkSearch || item.name.toLowerCase().includes(networkSearch.toLowerCase()) || item.location.toLowerCase().includes(networkSearch.toLowerCase());
          const matchesStyle = networkStyleFilter === "all" || (item.styles && item.styles.includes(networkStyleFilter));
          const matchesLocation = networkLocationFilter === "all" || item.location.includes(networkLocationFilter);
          return matchesSearch && matchesStyle && matchesLocation;
        });
        const allStyles = [...new Set(networkItems.flatMap(i => i.styles || []))];
        const allLocations = [...new Set(networkItems.map(i => i.location))];

        return (
          <div>
            <div className="pg-header">
              <h1><em>Network</em></h1>
              <p className="pg-sub">Connect with people and companies in the performing arts</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div className="tab-bar" style={{ flex: 1, marginBottom: 0 }}>
                <button className={`tab-btn${networkTab === "people" ? " on" : ""}`} onClick={() => setNetworkTab("people")}>People</button>
                <button className={`tab-btn${networkTab === "companies" ? " on" : ""}`} onClick={() => setNetworkTab("companies")}>Companies</button>
              </div>
              <div style={{ display: "flex", gap: 4, background: "var(--g1)", borderRadius: 10, padding: 3 }}>
                <button className={`btn btn-sm ${networkView === "list" ? "btn-p" : "btn-s"}`} onClick={() => setNetworkView("list")} style={{ padding: "4px 10px", fontSize: 11, border: networkView === "list" ? undefined : "none", background: networkView === "list" ? undefined : "transparent" }}>☰ List</button>
                <button className={`btn btn-sm ${networkView === "cards" ? "btn-p" : "btn-s"}`} onClick={() => setNetworkView("cards")} style={{ padding: "4px 10px", fontSize: 11, border: networkView === "cards" ? undefined : "none", background: networkView === "cards" ? undefined : "transparent" }}>▦ Cards</button>
                <button className={`btn btn-sm ${networkView === "map" ? "btn-p" : "btn-s"}`} onClick={() => setNetworkView("map")} style={{ padding: "4px 10px", fontSize: 11, border: networkView === "map" ? undefined : "none", background: networkView === "map" ? undefined : "transparent", display: "flex", alignItems: "center", gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> Map</button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div className="list-search" style={{ flex: 1, minWidth: 200 }}>
                {I.search}
                <input placeholder={`Search ${networkTab}...`} value={networkSearch} onChange={e => setNetworkSearch(e.target.value)} />
              </div>
              <select className="sort-filter" value={networkStyleFilter} onChange={e => setNetworkStyleFilter(e.target.value)}>
                <option value="all">All Styles</option>
                {allStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="sort-filter" value={networkLocationFilter} onChange={e => setNetworkLocationFilter(e.target.value)}>
                <option value="all">All Locations</option>
                {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {networkView === "list" && (
              <div className="app-list">
                {filteredNetworkItems.map(item => (
                  <div key={item.id} className="app-card" onClick={() => showToast(`${item.name} — Profile coming soon`)} style={{ cursor: "pointer" }}>
                    <img className="ac-logo" src={item.photo || item.logo} alt="" />
                    <div className="ac-info">
                      <div className="ac-title">{item.name}</div>
                      <div className="ac-company">{networkTab === "people" ? `${item.role}${item.company ? ` · ${item.company}` : ""}` : item.type}</div>
                      <div className="ac-meta">
                        <span>📍 {item.location}</span>
                        {item.styles && <span>{item.styles.join(", ")}</span>}
                        {item.mutual && <span>{item.mutual} mutual connections</span>}
                        {item.openPositions !== undefined && <span>{item.openPositions} open positions</span>}
                      </div>
                    </div>
                    <button className="btn btn-s btn-sm" onClick={(e) => { e.stopPropagation(); showToast(`Connection request sent to ${item.name}`); }}>{networkTab === "people" ? "Connect" : "Follow"}</button>
                  </div>
                ))}
                {filteredNetworkItems.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--g4)" }}>No results found. Try adjusting your filters.</div>}
              </div>
            )}

            {networkView === "cards" && (
              <div className="network-cards">
                {filteredNetworkItems.map(item => (
                  <div key={item.id} className="network-card" onClick={() => showToast(`${item.name} — Profile coming soon`)}>
                    <div className="nc-header">
                      <img className="nc-photo" src={item.photo || item.logo} alt="" />
                    </div>
                    <div className="nc-body">
                      <div className="nc-name">{item.name}</div>
                      <div className="nc-role">{networkTab === "people" ? `${item.role}${item.company ? ` · ${item.company}` : ""}` : item.type}</div>
                      <div className="nc-location">📍 {item.location}</div>
                      <div className="nc-styles">
                        {(item.styles || []).map(s => <span key={s}>{s}</span>)}
                      </div>
                      <div className="nc-footer">
                        <span>{item.mutual ? `${item.mutual} mutual` : item.openPositions !== undefined ? `${item.openPositions} open roles` : ""}</span>
                        <button className="btn btn-p btn-sm" style={{ fontSize: 10, padding: "4px 12px" }} onClick={(e) => { e.stopPropagation(); showToast(`Connection request sent to ${item.name}`); }}>{networkTab === "people" ? "Connect" : "Follow"}</button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredNetworkItems.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--g4)", gridColumn: "1/-1" }}>No results found. Try adjusting your filters.</div>}
              </div>
            )}

            {networkView === "map" && (
              <NetworkMap items={filteredNetworkItems} networkTab={networkTab} darkMode={darkMode} />
            )}
          </div>
        );
      }

      /* ── Present ── */
      case "present":
        if (viewPortfolio && currentPortfolio) {
          const pf = currentPortfolio;
          const highlightedVid = pf.highlightedVideo ? pf.videos.find(v => v.id === pf.highlightedVideo) : null;
          const otherVideos = pf.videos.filter(v => v.id !== pf.highlightedVideo);
          const RESUME_ICONS = { experience: "exp", education: "edu", award: "award" };
          const RESUME_EMOJI = { experience: "💼", education: "🎓", award: "🏆" };

          if (portfolioPreview) {
            /* ── Portfolio Public Preview ── */
            return (
              <div style={{ padding: "0 8px" }}>
                <div className="pfp-hero">
                  <div className="pfp-hero-label">ARTIST PORTFOLIO</div>
                  <div className="pfp-hero-name">{artist.name.split(" ")[0]} <em>{artist.name.split(" ").slice(1).join(" ")}</em></div>
                  <div className="pfp-hero-sub">{pf.discipline} · {artist.location}</div>
                  <div className="pfp-hero-actions">
                    <button style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>↓ Download CV</button>
                    <button style={{ background: "var(--ac)", border: "none", color: "#fff" }}>Contact →</button>
                  </div>
                </div>
                <div className="pfp-stats">
                  <div className="pfp-avatar"><img src={artist.photo} alt="" /></div>
                  <div className="pfp-stat"><div className="pfp-stat-val">7</div><div className="pfp-stat-label">YRS EXP</div></div>
                  <div className="pfp-stat"><div className="pfp-stat-val">12</div><div className="pfp-stat-label">COMPANIES</div></div>
                  <div className="pfp-stat"><div className="pfp-stat-val">3</div><div className="pfp-stat-label">COUNTRIES</div></div>
                  <div className="pfp-stat"><div className="pfp-stat-val">24</div><div className="pfp-stat-label">PRODUCTIONS</div></div>
                </div>
                <div className="pfp-tabs">
                  {["gallery", "videos", "resume", "references", "documents"].map(t => (
                    <button key={t} className={`pfp-tab${portfolioTab === t ? " active" : ""}`} onClick={() => { setPortfolioTab(t); const el = document.getElementById("pfp-" + t); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                  ))}
                </div>

                {/* Highlighted Video */}
                {highlightedVid && (
                  <div className="pfe-highlight" style={{ marginBottom: 24 }}>
                    <img src={highlightedVid.thumb} alt="" />
                    <div className="pfe-hl-play" />
                    <div className="pfe-hl-info">
                      <div className="pfe-hl-badge">Featured Showreel</div>
                      <div className="pfe-hl-title">{highlightedVid.title}</div>
                      <div className="pfe-hl-meta">{highlightedVid.duration}</div>
                    </div>
                  </div>
                )}

                {/* All sections stacked */}
                <div id="pfp-gallery" style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 16px" }}>Photo <em style={{ color: "var(--ac)", fontStyle: "italic" }}>Gallery</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{pf.photos.length} photos</span></h3>
                  <div className="pfp-gallery">
                    {pf.photos.map(ph => <div key={ph.id} className="pfp-gallery-item"><img src={ph.src} alt={ph.caption} /></div>)}
                  </div>
                </div>

                <div id="pfp-videos" style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 16px" }}>Video <em style={{ color: "var(--ac)", fontStyle: "italic" }}>& Showreel</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{pf.videos.length} videos</span></h3>
                  <div className="pfp-video-grid">
                    {otherVideos.map(v => (
                      <div key={v.id} className="pfp-video-card">
                        <img src={v.thumb} alt="" />
                        <div className="pfp-vc-play" />
                        <div className="pfp-vc-info"><div className="pfp-vc-title">{v.title}</div><div className="pfp-vc-meta">{v.duration}</div></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="pfp-resume" style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 16px" }}><em style={{ color: "var(--ac)", fontStyle: "italic" }}>Experience</em> & Education</h3>
                  <div className="pfe-resume-list">
                    {(pf.resume || []).map(r => (
                      <div key={r.id} className="pfe-resume-item" style={{ background: "#fff", border: "1px solid var(--g2)" }}>
                        <div className={`pfe-ri-icon ${RESUME_ICONS[r.type] || "exp"}`}>{RESUME_EMOJI[r.type] || "💼"}</div>
                        <div className="pfe-ri-info">
                          <div className="pfe-ri-title">{r.title}</div>
                          <div className="pfe-ri-org">{r.org}</div>
                          <div className="pfe-ri-meta">{r.period}{r.location ? ` · ${r.location}` : ""}</div>
                        </div>
                      </div>
                    ))}
                    {(!pf.resume || pf.resume.length === 0) && <p style={{ color: "var(--g4)", fontSize: 13 }}>No resume entries yet.</p>}
                  </div>
                </div>

                <div id="pfp-references" style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 16px" }}><em style={{ color: "var(--ac)", fontStyle: "italic" }}>References</em> & Reviews <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{(pf.references || []).length}</span></h3>
                  <div className="pfe-refs">
                    {(pf.references || []).map(ref => (
                      <div key={ref.id} className="pfe-ref-card" style={{ background: "#fff", border: "1px solid var(--g2)" }}>
                        <span className={`pfe-ref-type ${ref.type}`}>{ref.type === "reference" ? "Reference" : "Review"}</span>
                        <div className="pfe-ref-quote">"{ref.quote}"</div>
                        <div className="pfe-ref-source">
                          {ref.type === "reference"
                            ? <><strong>{ref.name}</strong> · {ref.role}, {ref.org}</>
                            : <><strong>{ref.source}</strong> · {ref.date}{ref.context ? ` — ${ref.context}` : ""}</>
                          }
                        </div>
                      </div>
                    ))}
                    {(!pf.references || pf.references.length === 0) && <p style={{ color: "var(--g4)", fontSize: 13 }}>No references yet.</p>}
                  </div>
                </div>

                <div id="pfp-documents" style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 16px" }}>Documents</h3>
                  <div className="pfe-doc-list">
                    {pf.documents.map(d => (
                      <div key={d.id} className="pfe-doc" style={{ background: "#fff", border: "1px solid var(--g2)" }}><div className="pfe-d-icon">📄</div><div className="pfe-d-info"><div className="pfe-d-title">{d.title}</div><div className="pfe-d-meta">{d.format} · {d.size}</div></div></div>
                    ))}
                    {pf.documents.length === 0 && <p style={{ color: "var(--g4)", fontSize: 13 }}>No documents yet.</p>}
                  </div>
                </div>
              </div>
            );
          }

          /* ── Portfolio Tracking View ── */
          if (portfolioTab === "tracking") {
            const views = MOCK_PF_TRACKING.filter(t => t.portfolioId === viewPortfolio);
            const isPro = artist.plan === "Pro" || artist.plan === "Studio";
            return (
              <div style={{ padding: "0 8px", animation: "fadeIn .3s ease" }}>
                <div className="pfe-section">
                  <h3><em style={{ color: "#0D9488" }}>Tracking</em> & Analytics</h3>
                  {isPro ? (
                    <>
                      <div className="pft-stats">
                        <div className="pft-stat"><div className="pft-val">{views.length}</div><div className="pft-label">Total Views</div></div>
                        <div className="pft-stat"><div className="pft-val">{views.filter(v => v.email).length}</div><div className="pft-label">Identified</div></div>
                        <div className="pft-stat"><div className="pft-val">{views.filter(v => v.sections.length >= 3).length}</div><div className="pft-label">Deep Views</div></div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--g4)", marginBottom: 10 }}>Recent Viewers</div>
                      <div className="pft-list">
                        {views.map(v => (
                          <div key={v.id} className="pft-item">
                            <div className="pft-avatar">{v.name === "Anonymous" ? "?" : v.name.split(" ").map(w => w[0]).join("")}</div>
                            <div className="pft-info">
                              <div className="pft-name">{v.name}</div>
                              <div className="pft-org">{v.org || "Unknown"}{v.email ? ` · ${v.email}` : ""}</div>
                              <div className="pft-sections">{v.sections.map(s => <span key={s}>{s}</span>)}</div>
                            </div>
                            <div className="pft-meta">
                              <span>{v.duration}</span>
                              <span>{new Date(v.viewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                              <span>{v.device}</span>
                            </div>
                          </div>
                        ))}
                        {views.length === 0 && <p style={{ color: "var(--g4)", fontSize: 13, textAlign: "center", padding: 20 }}>No views yet. Share your portfolio to start tracking.</p>}
                      </div>
                    </>
                  ) : (
                    <div className="pft-pro-gate">
                      <h4>Upgrade to Pro</h4>
                      <p>Track who views your portfolio, see which sections they explore, and get notified when someone opens your link.</p>
                      <button onClick={() => showToast("Upgrade to Pro")}>Upgrade to Pro</button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          /* ── Portfolio Editor — Single vertical scroll ── */
          if (portfolioTab === "settings") {
            return (
              <div style={{ padding: "0 8px", animation: "fadeIn .3s ease" }}>
                <div className="pfe-section">
                  <h3>Portfolio <em>Settings</em></h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--g5)", display: "block", marginBottom: 6 }}>Portfolio Name</label>
                      <input style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10, fontSize: 13, fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--tx)", outline: "none", boxSizing: "border-box" }} value={pf.name} onChange={e => setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, name: e.target.value } : p))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--g5)", display: "block", marginBottom: 6 }}>Description</label>
                      <textarea style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10, fontSize: 13, fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--tx)", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} value={pf.description} onChange={e => setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, description: e.target.value } : p))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--g5)", display: "block", marginBottom: 6 }}>Discipline</label>
                      <select style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10, fontSize: 13, fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--tx)", outline: "none" }} value={pf.discipline} onChange={e => setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, discipline: e.target.value } : p))}>
                        <option value="">Select...</option>
                        {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--g5)", display: "block", marginBottom: 6 }}>Styles & Genres</label>
                      <div className="npf-chips" style={{ marginTop: 0, marginBottom: 8 }}>
                        {pf.styles.map((s, i) => (
                          <span key={i} className="npf-chip">{s}<button onClick={() => setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, styles: p.styles.filter((_, j) => j !== i) } : p))}>×</button></span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--g5)", display: "block", marginBottom: 6 }}>Banner Image</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {pf.cover ? (
                          <div style={{ width: 200, height: 80, borderRadius: 10, overflow: "hidden", border: "1px solid var(--g2)", position: "relative" }}>
                            <img src={pf.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, cover: "" } : p))}>×</button>
                          </div>
                        ) : null}
                        <button className="pfe-add-btn secondary" onClick={() => showToast("Upload banner image")}>{pf.cover ? "Replace Banner" : "Upload Banner Image"}</button>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid var(--g1)", paddingTop: 16 }}>
                      <button className="btn" style={{ background: "rgba(255,71,87,.08)", color: "var(--red)", border: "1px solid rgba(255,71,87,.15)" }} onClick={() => {
                        setPortfolios(prev => prev.filter(p => p.id !== viewPortfolio));
                        setViewPortfolio(null); setPage("present");
                        showToast("Portfolio deleted");
                      }}>Delete Portfolio</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ── Main editor: all sections vertical ── */
          return (
            <div style={{ padding: "0 8px", animation: "fadeIn .3s ease" }}>
              {/* Banner */}
              <div className="pfe-banner">
                {pf.cover ? <img src={pf.cover} alt="" /> : null}
                <div className="pfe-banner-overlay">
                  <div className="pfe-banner-title">{pf.name}</div>
                </div>
              </div>

              {/* Gallery + Videos — side by side */}
              <div className="pfe-row">
                <div id="pfe-gallery" className="pfe-section">
                  <h3>Photo <em style={{ color: "#0D9488" }}>Gallery</em> <span className="pfe-count">{pf.photos.length}</span></h3>
                  <div className="pfe-photo-grid">
                    {pf.photos.map(ph => (
                      <div key={ph.id} className="pfe-photo">
                        <img src={ph.src} alt={ph.caption} />
                        <div className="pfe-photo-actions">
                          <button onClick={() => showToast("Replace photo")}>Replace</button>
                          <button onClick={() => { setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, photos: p.photos.filter(x => x.id !== ph.id) } : p)); showToast("Photo removed"); }}>×</button>
                        </div>
                      </div>
                    ))}
                    <div className="pfe-photo-add" onClick={() => showToast("Add photos from Media Library")}>
                      <span style={{ fontSize: 18 }}>+</span>
                      Add Photos
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--g4)", marginTop: 12 }}>Drag to reorder</p>
                  <div className="pfe-add-row">
                    <button className="pfe-add-btn primary" onClick={() => showToast("Opening Media Library picker...")}>Add From Library</button>
                  </div>
                </div>

                <div id="pfe-videos" className="pfe-section">
                  <h3>Videos <em style={{ color: "#0D9488" }}>& Showreel</em></h3>
                  <div className="pfe-video-list">
                    {pf.videos.map(v => (
                      <div key={v.id} className={`pfe-video${v.id === pf.highlightedVideo ? " featured" : ""}`}>
                        <img src={v.thumb} alt="" />
                        <div className="pfe-v-info">
                          <div className="pfe-v-title">{v.title}</div>
                          <div className="pfe-v-meta">{v.duration}{v.id === pf.highlightedVideo ? <span className="pfe-featured-badge">★ Featured</span> : ""}</div>
                        </div>
                        <div className="pfe-v-actions">
                          {v.id !== pf.highlightedVideo && <button onClick={() => { setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, highlightedVideo: v.id } : p)); showToast("Set as featured"); }}>★ Feature</button>}
                          <button onClick={() => showToast("Edit video details")}>Edit</button>
                          <button onClick={() => { setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, videos: p.videos.filter(x => x.id !== v.id), highlightedVideo: p.highlightedVideo === v.id ? null : p.highlightedVideo } : p)); showToast("Video removed"); }}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pfe-add-row">
                    <button className="pfe-add-btn primary" onClick={() => showToast("Opening Media Library picker...")}>Add From Library</button>
                    <button className="pfe-add-btn secondary" onClick={() => showToast("Paste YouTube/Vimeo URL")}>Add YouTube/Vimeo</button>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div id="pfe-resume" className="pfe-section">
                <h3><em style={{ color: "#0D9488" }}>Resume</em> & Experience</h3>
                <div className="pfe-resume-list">
                  {(pf.resume || []).map(r => (
                    <div key={r.id} className="pfe-resume-item">
                      <div className={`pfe-ri-icon ${RESUME_ICONS[r.type] || "exp"}`}>{RESUME_EMOJI[r.type] || "💼"}</div>
                      <div className="pfe-ri-info">
                        <div className="pfe-ri-title">{r.title}</div>
                        <div className="pfe-ri-org">{r.org}</div>
                        <div className="pfe-ri-meta">{r.period}{r.location ? ` · ${r.location}` : ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pfe-add-row">
                  <button className="pfe-add-btn primary" onClick={() => showToast("Add from Stage Record")}>Add From Stage Record</button>
                  <button className="pfe-add-btn secondary" onClick={() => showToast("Add entry manually")}>+ Add Manually</button>
                </div>
              </div>

              {/* References & Reviews Section */}
              <div id="pfe-references" className="pfe-section">
                <h3><em style={{ color: "#0D9488" }}>References</em> & Reviews</h3>
                <div className="pfe-refs">
                  {(pf.references || []).map(ref => (
                    <div key={ref.id} className="pfe-ref-card">
                      <span className={`pfe-ref-type ${ref.type}`}>{ref.type === "reference" ? "Reference" : "Review"}</span>
                      <div className="pfe-ref-quote">"{ref.quote}"</div>
                      <div className="pfe-ref-source">
                        {ref.type === "reference"
                          ? <><strong>{ref.name}</strong> · {ref.role}, {ref.org}</>
                          : <><strong>{ref.source}</strong> · {ref.date}{ref.context ? ` — ${ref.context}` : ""}</>
                        }
                      </div>
                    </div>
                  ))}
                  {(!pf.references || pf.references.length === 0) && <p style={{ color: "var(--g4)", fontSize: 13 }}>No references or reviews added yet.</p>}
                </div>
                <div className="pfe-add-row">
                  <button className="pfe-add-btn primary" onClick={() => showToast("Add reference")}>+ Add Reference</button>
                  <button className="pfe-add-btn secondary" onClick={() => showToast("Add review")}>+ Add Review</button>
                </div>
              </div>

              {/* Documents Section */}
              <div className="pfe-section">
                <h3>Documents</h3>
                <div className="pfe-doc-list">
                  {pf.documents.map(d => (
                    <div key={d.id} className="pfe-doc">
                      <div className="pfe-d-icon">📄</div>
                      <div className="pfe-d-info"><div className="pfe-d-title">{d.title}</div><div className="pfe-d-meta">{d.format} · {d.size}</div></div>
                    </div>
                  ))}
                  {pf.documents.length === 0 && <p style={{ color: "var(--g4)", fontSize: 13 }}>No documents added yet.</p>}
                </div>
                <div className="pfe-add-row">
                  <button className="pfe-add-btn primary" onClick={() => showToast("Add document from Media Library")}>+ Add Document</button>
                </div>
              </div>
            </div>
          );
        }

        /* ── Present — Portfolio List ── */
        return (
          <div>
            <div className="pg-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1><em>Present</em></h1>
                <p className="pg-sub">Curate and share your portfolios</p>
              </div>
              <button className="btn btn-p" onClick={() => setShowNewPortfolioModal(true)}>+ New Portfolio</button>
            </div>
            <div className="pf-grid">
              {portfolios.map(pf => (
                <div key={pf.id} className="pf-card" onClick={() => { setViewPortfolio(pf.id); setPortfolioTab("overview"); }}>
                  {pf.cover ? <img className="pfc-cover" src={pf.cover} alt="" /> : <div className="pfc-cover" style={{ height: 140, background: "linear-gradient(135deg,rgba(96,77,255,.1),rgba(96,77,255,.03))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--g4)", fontSize: 24 }}>📁</div>}
                  <div className="pfc-body">
                    <div className="pfc-title">{pf.name}</div>
                    <div className="pfc-meta">
                      <span className="pfc-status" style={{ background: pf.status === "published" ? "#E6FFF0" : "var(--g1)", color: pf.status === "published" ? "var(--green)" : "var(--g4)" }}>
                        {pf.status}
                      </span>
                      <span>{pf.photos.length + pf.videos.length} items</span>
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

      /* ── Settings ── */
      case "settings":
        return (
          <div>
            <div className="pg-header">
              <h1><em>Account Settings</em></h1>
              <p className="pg-sub">Manage your account, plan, and preferences</p>
            </div>
            <div className="tab-bar">
              {["account", "plan", "visibility", "notifications"].map(t => (
                <button key={t} className={`tab-btn${settingsTab === t ? " on" : ""}`} onClick={() => setSettingsTab(t)}>
                  {t === "account" ? "Account" : t === "plan" ? "Plan & Billing" : t === "visibility" ? "Visibility" : "Notifications"}
                </button>
              ))}
            </div>

            {settingsTab === "account" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4>Profile</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <img src={artist.photo} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--tx)" }}>{artist.name}</div>
                      <div style={{ fontSize: 12, color: "var(--g4)" }}>{artist.email}</div>
                    </div>
                    <button className="btn btn-s btn-sm" style={{ marginLeft: "auto" }}>Edit</button>
                  </div>
                  <div className="info-row"><span className="ir-label">Email</span><span className="ir-value">{artist.email}</span></div>
                  <div className="info-row"><span className="ir-label">Location</span><span className="ir-value">{artist.location}</span></div>
                  <div className="info-row"><span className="ir-label">Member Since</span><span className="ir-value">January 2025</span></div>
                </div>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4>Security</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Password</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Last changed 3 months ago</div>
                      </div>
                      <button className="btn btn-s btn-sm">Change</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Add an extra layer of security</div>
                      </div>
                      <button className="btn btn-s btn-sm">Enable</button>
                    </div>
                  </div>
                </div>
                <div className="info-card">
                  <h4>Danger Zone</h4>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn btn-sm" style={{ background: "rgba(255,71,87,.08)", color: "var(--red)", border: "1px solid rgba(255,71,87,.15)" }}>Deactivate Account</button>
                    <button className="btn btn-sm" style={{ background: "rgba(255,71,87,.08)", color: "var(--red)", border: "1px solid rgba(255,71,87,.15)" }}>Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === "plan" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h4 style={{ margin: 0 }}>Current Plan</h4>
                    <span style={{ padding: "4px 14px", borderRadius: 20, background: "rgba(96,77,255,.1)", color: "var(--ac)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{artist.plan}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.6, marginBottom: 16 }}>Your Core plan includes unlimited applications, full Stage Record, media library, and portfolio builder.</p>
                  <div className="info-row"><span className="ir-label">Billing Period</span><span className="ir-value">Monthly</span></div>
                  <div className="info-row"><span className="ir-label">Next Billing</span><span className="ir-value">April 30, 2026</span></div>
                  <div className="info-row"><span className="ir-label">Amount</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>€9.99/month</span></div>
                  <button className="btn btn-p btn-sm" style={{ marginTop: 14 }}>Upgrade Plan</button>
                </div>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4>Available Plans</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
                    {[
                      { name: "Free", price: "€0", features: ["5 applications/month", "Basic Stage Record", "1 Portfolio"] },
                      { name: "Core", price: "€9.99", features: ["Unlimited applications", "Full Stage Record", "Media Library", "3 Portfolios"], current: true },
                      { name: "Pro", price: "€19.99", features: ["Everything in Core", "Priority visibility", "Analytics", "Unlimited Portfolios", "Custom domain"] },
                    ].map(plan => (
                      <div key={plan.name} style={{ padding: 16, border: plan.current ? "2px solid var(--ac)" : "1px solid var(--g2)", borderRadius: 14, textAlign: "center", position: "relative" }}>
                        {plan.current && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "2px 10px", borderRadius: 20, background: "var(--ac)", color: "#fff" }}>Current</div>}
                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--tx)", marginBottom: 4, marginTop: plan.current ? 4 : 0 }}>{plan.name}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ac)", fontFamily: "var(--mono)", marginBottom: 12 }}>{plan.price}<span style={{ fontSize: 11, color: "var(--g4)", fontWeight: 400 }}>/mo</span></div>
                        {plan.features.map((f, i) => <div key={i} style={{ fontSize: 11, color: "var(--g5)", padding: "3px 0" }}>{"\u2713"} {f}</div>)}
                        <button className={`btn btn-sm ${plan.current ? "btn-s" : "btn-p"}`} style={{ marginTop: 12, width: "100%" }}>{plan.current ? "Current Plan" : "Upgrade"}</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="info-card">
                  <h4>Billing History</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    {[
                      { date: "Mar 1, 2026", amount: "€9.99", status: "Paid" },
                      { date: "Feb 1, 2026", amount: "€9.99", status: "Paid" },
                      { date: "Jan 1, 2026", amount: "€9.99", status: "Paid" },
                    ].map((inv, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", border: "1px solid var(--g2)", borderRadius: 8, fontSize: 12 }}>
                        <span style={{ color: "var(--tx)" }}>{inv.date}</span>
                        <span style={{ fontFamily: "var(--mono)", color: "var(--tx)" }}>{inv.amount}</span>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(29,185,84,.1)", color: "var(--green)", fontWeight: 600 }}>{inv.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settingsTab === "visibility" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4>Visibility & Privacy</h4>
                  <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 16 }}>Control how you appear in the Lanced community.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Show on Map</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Display your location pin on the Network map</div>
                      </div>
                      <button className={`btn btn-sm ${artist.showOnMap !== false ? "btn-p" : "btn-s"}`} onClick={() => setArtist(prev => ({ ...prev, showOnMap: prev.showOnMap === false ? true : false }))} style={{ minWidth: 60 }}>{artist.showOnMap !== false ? "On" : "Off"}</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Show in Network</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Let others find you in the People directory</div>
                      </div>
                      <button className={`btn btn-sm ${artist.showInNetwork !== false ? "btn-p" : "btn-s"}`} onClick={() => setArtist(prev => ({ ...prev, showInNetwork: prev.showInNetwork === false ? true : false }))} style={{ minWidth: 60 }}>{artist.showInNetwork !== false ? "On" : "Off"}</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Show Email</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Allow companies to see your email address</div>
                      </div>
                      <button className={`btn btn-sm ${artist.showEmail !== false ? "btn-p" : "btn-s"}`} onClick={() => setArtist(prev => ({ ...prev, showEmail: prev.showEmail === false ? true : false }))} style={{ minWidth: 60 }}>{artist.showEmail !== false ? "On" : "Off"}</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Profile Visibility</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Who can view your full profile</div>
                      </div>
                      <select className="sort-filter" style={{ width: "auto" }}>
                        <option>Everyone</option>
                        <option>Connections Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === "notifications" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4>Notification Preferences</h4>
                  <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 16 }}>Choose what you want to be notified about.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { icon: "\uD83D\uDD14", title: "Application Updates", desc: "Status changes, invitations, and decisions", key: "appUpdates" },
                      { icon: "\uD83D\uDCBC", title: "New Opportunities", desc: "Matching auditions, jobs, and open calls", key: "newOpps" },
                      { icon: "\uD83D\uDCAC", title: "Messages", desc: "New messages from companies and connections", key: "messages" },
                      { icon: "\uD83D\uDC65", title: "Network Activity", desc: "Connection requests and follows", key: "network" },
                      { icon: "\uD83D\uDCF0", title: "Newsletter", desc: "Weekly digest of industry news and tips", key: "newsletter" },
                      { icon: "\uD83C\uDFAF", title: "Deadline Reminders", desc: "Reminders before application deadlines", key: "deadlines" },
                    ].map(n => (
                      <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>{n.icon} {n.title}</div>
                          <div style={{ fontSize: 11, color: "var(--g4)" }}>{n.desc}</div>
                        </div>
                        <button className="btn btn-sm btn-p" style={{ minWidth: 60 }} onClick={(e) => { const btn = e.currentTarget; if(btn.textContent === "On"){btn.textContent = "Off"; btn.className = "btn btn-sm btn-s"} else {btn.textContent = "On"; btn.className = "btn btn-sm btn-p"} }}>On</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="info-card">
                  <h4>Email Preferences</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Email Notifications</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Receive notifications via email</div>
                      </div>
                      <button className="btn btn-sm btn-p" style={{ minWidth: 60 }}>On</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--g2)", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>Push Notifications</div>
                        <div style={{ fontSize: 11, color: "var(--g4)" }}>Browser push notifications</div>
                      </div>
                      <button className="btn btn-sm btn-s" style={{ minWidth: 60 }}>Off</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  /* ━━━ MAIN RENDER ━━━ */
  const shellClass = `shell${darkMode ? " dark" : ""}${sidebarCollapsed ? " sb-collapsed" : ""}${(viewSpotlight || viewOpportunity) ? " ctx-spotlight" : ""}${viewPortfolio ? " ctx-portfolio" : ""}`;

  return (
    <>
      <style>{CSS}</style>
      <div className={shellClass}>
        {/* ── Mobile Top Bar ── */}
        <div className="mobile-topbar">
          {viewOpportunity ? (
            <button className="mt-back" onClick={() => { if (applyStep > 0) setApplyStep(0); else { setViewOpportunity(null); setPage("discover"); } }}>{I.back}</button>
          ) : viewSpotlight ? (
            <button className="mt-back" onClick={() => { setViewSpotlight(null); setPage("applications"); }}>{I.back}</button>
          ) : mobileChatOpen ? (
            <button className="mt-back" onClick={() => setMobileChatOpen(null)}>{I.back}</button>
          ) : (
            <div className="mt-logo"><img src="/lanced-logo.svg" alt="L" /></div>
          )}
          <span className="mt-title">
            {viewOpportunity && currentOpp ? (applyStep > 0 ? `Apply — Step ${applyStep}` : currentOpp.title) : viewSpotlight && spotlightApp ? spotlightApp.opportunity : mobileChatOpen ? (messages.find(m => m.id === mobileChatOpen)?.from || "Chat") : NAV_ITEMS.find(n => n.id === page)?.label || "Dashboard"}
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
          {viewOpportunity ? (
            <>
              <button onClick={() => { if (applyStep > 0) setApplyStep(0); else { setViewOpportunity(null); setPage("discover"); } }}>{I.back}<span>Back</span></button>
              {applyStep > 0 ? (
                <>
                  {applyStep > 1 && <button onClick={() => setApplyStep(applyStep - 1)}>{I.back}<span>Prev</span></button>}
                  <button className="active">{I.doc}<span>Step {applyStep}/5</span></button>
                  {applyStep < 5 && <button onClick={() => setApplyStep(applyStep + 1)}>{I.applications}<span>Next</span></button>}
                </>
              ) : (
                <button className="active" onClick={() => setApplyStep(1)}>{I.applications}<span>Apply</span></button>
              )}
            </>
          ) : viewSpotlight ? (
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
          <div className="sidebar-back-top" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0 }}>
            <button className="sb-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ position: "static", opacity: 1, flexShrink: 0 }} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {I.panelL}
            </button>
          </div>
          <div className="sidebar-header">
            <div className="sidebar-logo" style={{ cursor: "pointer" }} onClick={() => sidebarCollapsed && setSidebarCollapsed(false)}>
              <div className="sb-mark">
                <img src="/lanced-logo.svg" alt="Lanced" />
              </div>
              <div>
                <div className="sb-name">Lanced</div>
                <div className="sb-email">Artist App</div>
              </div>
            </div>
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
            ) : viewPortfolio && currentPortfolio ? (
              <>
                <button className="sb-back-toggle" onClick={() => { setViewPortfolio(null); setPortfolioTab("overview"); setPortfolioPreview(false); setPortfolioLive(false); setPage("present"); }}>
                  {I.back}
                  <span className="sb-label">Back to Portfolios</span>
                </button>
                <div style={{ padding: "8px 14px", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }} className="sb-label">{currentPortfolio.name}</div>
                  <div style={{ fontSize: 11, color: "var(--g4)", marginTop: 2 }} className="sb-label">{currentPortfolio.discipline}</div>
                </div>
                {PORTFOLIO_TABS.map(t => (
                  <button key={t.id} className={`sidebar-item${portfolioTab === t.id ? " active" : ""}`} onClick={() => {
                    if (t.id === "settings" || t.id === "tracking") { setPortfolioTab(t.id); setPortfolioPreview(false); }
                    else {
                      setPortfolioTab(t.id); setPortfolioPreview(false);
                      const el = document.getElementById("pfe-" + t.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}>
                    {t.icon}
                    <span className="sb-label">{t.label}</span>
                    <span className="sb-tip">{t.label}</span>
                  </button>
                ))}
              </>
            ) : viewOpportunity && currentOpp ? (
              <>
                <button className="sb-back-toggle" onClick={() => { setViewOpportunity(null); setApplyStep(0); setPage("discover"); }}>
                  {I.back}
                  <span className="sb-label">Back to Discover</span>
                </button>
                <div style={{ padding: "8px 14px", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }} className="sb-label">{currentOpp.title}</div>
                  <div style={{ fontSize: 11, color: "var(--g4)", marginTop: 2 }} className="sb-label">{currentOpp.company}</div>
                </div>
                {applyStep > 0 && (
                  <div style={{ padding: "4px 14px", marginBottom: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ac)", textTransform: "uppercase", letterSpacing: ".05em" }} className="sb-label">Apply — Step {applyStep} of 5</div>
                  </div>
                )}
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

          <div className="sidebar-acct" style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="sa-avatar">
              <img src={artist.photo} alt="" />
            </div>
            <div className="sa-text" style={{ flex: 1, minWidth: 0 }}>
              <div className="sa-name">{artist.name}</div>
              <div className="sa-email">{artist.email}</div>
            </div>
            <span className="sa-dots" style={{ color: "var(--g4)", fontSize: 16, flexShrink: 0, marginLeft: "auto" }}>{"\u22EF"}</span>
            {showUserMenu && (
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, minWidth: 220, background: "var(--sf)", border: "1px solid var(--g2)", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,.12)", zIndex: 200, overflow: "hidden", animation: "slideInUp .15s ease" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--g2)", display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={artist.photo} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>{artist.name}</div>
                    <div style={{ fontSize: 10, color: "var(--g4)" }}>Lanced</div>
                  </div>
                </div>
                <div style={{ padding: "6px 8px" }}>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "none", background: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--tx)", textAlign: "left", fontFamily: "var(--sans)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--g1)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"} onClick={() => { setPage("settings"); setSettingsTab("account"); setShowUserMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    Account Settings
                  </button>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "none", background: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--tx)", textAlign: "left", fontFamily: "var(--sans)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--g1)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"} onClick={() => { setPage("settings"); setSettingsTab("visibility"); setShowUserMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Visibility
                  </button>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "none", background: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--tx)", textAlign: "left", fontFamily: "var(--sans)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--g1)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"} onClick={() => { setPage("settings"); setSettingsTab("notifications"); setShowUserMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    Notification Preferences
                  </button>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "none", background: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--tx)", textAlign: "left", fontFamily: "var(--sans)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--g1)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"} onClick={() => { setPage("settings"); setSettingsTab("plan"); setShowUserMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    Plan & Billing
                  </button>
                </div>
                <div style={{ borderTop: "1px solid var(--g2)", padding: "6px 8px" }}>
                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "none", background: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--red)", textAlign: "left", fontFamily: "var(--sans)" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,71,87,.05)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"} onClick={() => { setAuth("login"); setShowUserMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Log out
                  </button>
                </div>
              </div>
            )}
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
          {viewPortfolio && currentPortfolio && !portfolioPreview && (
            <div className="breadcrumb-bar">
              <div>
                <span className="bc-link" style={{ cursor: "pointer", color: "var(--g4)", fontSize: 12 }} onClick={() => { setViewPortfolio(null); setPortfolioTab("overview"); setPage("present"); }}>Portfolios</span>
                <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: 12 }}>{currentPortfolio.name}</span>
              </div>
              <div className="bc-actions">
                <span style={{ background: currentPortfolio.status === "published" ? "#E6FFF0" : "var(--g1)", color: currentPortfolio.status === "published" ? "var(--green)" : "var(--g4)", padding: "3px 10px", borderRadius: 40, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{currentPortfolio.status}</span>
                <button className="btn btn-s btn-sm" onClick={() => setShowShareModal(true)} style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>Share</button>
                <button className="btn btn-s btn-sm" onClick={() => { setPortfolioPreview(true); setPortfolioTab("gallery"); }}>Preview</button>
                {currentPortfolio.status === "draft" ? (
                  <button className="btn btn-sm" style={{ background: "#0D9488", color: "#fff", border: "none" }} onClick={() => { setPortfolios(prev => prev.map(p => p.id === viewPortfolio ? { ...p, status: "published" } : p)); showToast("Portfolio published!"); }}>Publish</button>
                ) : (
                  <button className="btn btn-sm" style={{ background: "#0D9488", color: "#fff", border: "none" }} onClick={() => showToast("Changes published!")}>Publish Changes</button>
                )}
              </div>
            </div>
          )}
          {viewPortfolio && currentPortfolio && portfolioPreview && (
            <div className="breadcrumb-bar">
              <div>
                <span className="bc-link" style={{ cursor: "pointer", color: "var(--g4)", fontSize: 12 }} onClick={() => setPortfolioPreview(false)}>Editor</span>
                <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                <span style={{ fontWeight: 600, color: "#0D9488", fontSize: 12 }}>Preview — {currentPortfolio.name}</span>
              </div>
              <div className="bc-actions">
                <button className="btn btn-s btn-sm" onClick={() => { setPortfolioPreview(false); setPortfolioTab("overview"); }}>Back to Editor</button>
                <button className="btn btn-sm" style={{ background: "var(--ac)", color: "#fff", border: "none" }} onClick={() => setPortfolioLive(true)}>View Live</button>
                <button className="btn btn-sm" style={{ background: "#0D9488", color: "#fff", border: "none" }} onClick={() => { navigator.clipboard?.writeText(`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/${currentPortfolio.slug}`); showToast("Link copied!"); }}>Copy Link</button>
              </div>
            </div>
          )}
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
          {viewOpportunity && currentOpp && (
            <div className="breadcrumb-bar">
              <div>
                <span className="bc-link" style={{ cursor: "pointer", color: "var(--g4)", fontSize: 12 }} onClick={() => { setViewOpportunity(null); setApplyStep(0); setPage("discover"); }}>Discover</span>
                <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: 12 }}>{currentOpp.title}</span>
                {applyStep > 0 && <>
                  <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                  <span style={{ fontWeight: 600, color: "var(--ac)", fontSize: 12 }}>Apply — Step {applyStep}</span>
                </>}
              </div>
              <div className="bc-actions">
                {applyStep > 0 && <button className="btn btn-s btn-sm" onClick={() => showToast("Draft saved!")}>Save Draft</button>}
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
                  <button className="btn btn-p btn-sm" onClick={() => {
                    if (pickerTargetMaterial && pickerSelected.length > 0) {
                      setApplyDraft(prev => ({ ...prev, attachedMaterials: { ...prev.attachedMaterials, [pickerTargetMaterial]: pickerSelected[0] } }));
                      setPickerTargetMaterial(null);
                    }
                    showToast(`${pickerSelected.length} item${pickerSelected.length !== 1 ? "s" : ""} added to application`);
                    setShowMediaPicker(null); setPickerFilter("all"); setPickerSearch("");
                  }}>Add to Application</button>
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

      {/* ── New Portfolio Modal ── */}
      {showNewPortfolioModal && (
        <div className="npf-overlay" onClick={() => setShowNewPortfolioModal(false)}>
          <div className="npf-modal" onClick={e => e.stopPropagation()}>
            <div className="npf-head">
              <h2>New Portfolio</h2>
              <p style={{ fontSize: 12, color: "var(--g4)", margin: "4px 0 0" }}>Create a curated collection to share with the industry.</p>
            </div>
            <div className="npf-body">
              <div>
                <label>1. Portfolio Name</label>
                <input placeholder="e.g. Contemporary Showreel 2026" value={newPf.name} onChange={e => setNewPf(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label>2. Discipline / Job Type</label>
                <select value={newPf.discipline} onChange={e => setNewPf(p => ({ ...p, discipline: e.target.value }))}>
                  <option value="">Select discipline...</option>
                  {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label>3. Styles & Genres</label>
                <input placeholder="Type & press Enter to add" value={newPf.styleInput} onChange={e => setNewPf(p => ({ ...p, styleInput: e.target.value }))} onKeyDown={e => {
                  if (e.key === "Enter" && newPf.styleInput.trim()) {
                    e.preventDefault();
                    setNewPf(p => ({ ...p, styles: [...p.styles, p.styleInput.trim()], styleInput: "" }));
                  }
                }} />
                {newPf.styles.length > 0 && (
                  <div className="npf-chips">
                    {newPf.styles.map((s, i) => (
                      <span key={i} className="npf-chip">{s}<button onClick={() => setNewPf(p => ({ ...p, styles: p.styles.filter((_, j) => j !== i) }))}>×</button></span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label>4. Skills</label>
                <input placeholder="Type & press Enter to add" value={newPf.skillInput} onChange={e => setNewPf(p => ({ ...p, skillInput: e.target.value }))} onKeyDown={e => {
                  if (e.key === "Enter" && newPf.skillInput.trim()) {
                    e.preventDefault();
                    setNewPf(p => ({ ...p, skills: [...p.skills, p.skillInput.trim()], skillInput: "" }));
                  }
                }} />
                {newPf.skills.length > 0 && (
                  <div className="npf-chips">
                    {newPf.skills.map((s, i) => (
                      <span key={i} className="npf-chip">{s}<button onClick={() => setNewPf(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))}>×</button></span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label>5. Description</label>
                <textarea placeholder="Briefly describe this portfolio..." value={newPf.description} onChange={e => setNewPf(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="npf-actions">
                <button className="btn btn-g" onClick={() => setShowNewPortfolioModal(false)}>Cancel</button>
                <button className="btn-pf" disabled={!newPf.name.trim() || !newPf.discipline} onClick={() => {
                  const id = "pf" + Date.now();
                  const slug = newPf.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                  setPortfolios(prev => [...prev, {
                    id, name: newPf.name.trim(), description: newPf.description, discipline: newPf.discipline,
                    styles: newPf.styles, skills: newPf.skills, status: "draft",
                    cover: "", photos: [], videos: [], references: [], documents: [], slug,
                  }]);
                  setShowNewPortfolioModal(false);
                  setNewPf({ name: "", description: "", discipline: "", styles: [], skills: [], styleInput: "", skillInput: "" });
                  setViewPortfolio(id);
                  setPortfolioTab("overview");
                  showToast("Portfolio created!");
                }}>Create Portfolio</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Modal ── */}
      {showShareModal && currentPortfolio && (
        <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShowShareModal(false); }}>
          <div className="share-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <h3>Share Portfolio</h3>
                <div className="sm-sub">{currentPortfolio.name}</div>
              </div>
              <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--g4)", padding: 4 }} onClick={() => setShowShareModal(false)}>×</button>
            </div>

            <div className="sm-section">
              <div className="sm-section-title">Share via Link</div>
              <div className="sm-link-row">
                <input readOnly value={`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/${currentPortfolio.slug}`} />
                <button onClick={() => { navigator.clipboard?.writeText(`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/${currentPortfolio.slug}`); showToast("Link copied!"); }}>Copy Link</button>
              </div>
            </div>

            <div className="sm-section">
              <div className="sm-section-title">Share via Email</div>
              <div className="sm-email-row">
                <input placeholder="recipient@company.com" value={shareEmail} onChange={e => setShareEmail(e.target.value)} />
                <button onClick={() => { if (shareEmail.trim()) { showToast(`Portfolio shared with ${shareEmail}`); setShareEmail(""); } }}>Send</button>
              </div>
            </div>

            <div className="sm-pro">
              <div className="sm-pro-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Pro Features <span>PRO</span></div>
              <div className="sm-toggle">
                <div>
                  <div className="sm-toggle-label">Track link views</div>
                  <div className="sm-toggle-desc">See who viewed your portfolio and when</div>
                </div>
                <div className={`sm-switch${shareSettings.trackLink ? " on" : ""}`} onClick={() => {
                  if (artist.plan === "Core") { showToast("Upgrade to Pro to use this feature"); return; }
                  setShareSettings(s => ({ ...s, trackLink: !s.trackLink }));
                }} />
              </div>
              <div className="sm-toggle">
                <div>
                  <div className="sm-toggle-label">Require email to view</div>
                  <div className="sm-toggle-desc">Viewers must enter their email before accessing</div>
                </div>
                <div className={`sm-switch${shareSettings.requireEmail ? " on" : ""}`} onClick={() => {
                  if (artist.plan === "Core") { showToast("Upgrade to Pro to use this feature"); return; }
                  setShareSettings(s => ({ ...s, requireEmail: !s.requireEmail }));
                }} />
              </div>
              <div className="sm-toggle" style={{ borderBottom: "none" }}>
                <div>
                  <div className="sm-toggle-label">Password protect</div>
                  <div className="sm-toggle-desc">Require a password to access your portfolio</div>
                </div>
                <div className={`sm-switch${shareSettings.password ? " on" : ""}`} onClick={() => {
                  if (artist.plan === "Core") { showToast("Upgrade to Pro to use this feature"); return; }
                  setShareSettings(s => ({ ...s, password: s.password ? "" : "demo123" }));
                }} />
              </div>
              {shareSettings.password && (
                <input className="sm-pw-input" type="text" placeholder="Enter password..." value={shareSettings.password} onChange={e => setShareSettings(s => ({ ...s, password: e.target.value }))} />
              )}
            </div>

            <div className="sm-actions">
              <button style={{ background: "none", border: "1px solid var(--g2)", color: "var(--tx)" }} onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Portfolio Live View ── */}
      {portfolioLive && currentPortfolio && (() => {
        const pf = currentPortfolio;
        const highlightedVid = pf.highlightedVideo ? pf.videos.find(v => v.id === pf.highlightedVideo) : null;
        const otherVideos = pf.videos.filter(v => v.id !== pf.highlightedVideo);
        const RESUME_ICONS = { experience: "exp", education: "edu", award: "award" };
        const RESUME_EMOJI = { experience: "💼", education: "🎓", award: "🏆" };
        return (
          <div className="pfl-overlay">
            <div className="pfl-topbar">
              <div className="pfl-topbar-title">{pf.name} — Live Preview</div>
              <div className="pfl-topbar-actions">
                <button style={{ background: "none", border: "1px solid var(--g2)", color: "var(--tx)" }} onClick={() => { navigator.clipboard?.writeText(`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/${pf.slug}`); showToast("Link copied!"); }}>Copy Link</button>
                <button style={{ background: "var(--ac)", border: "none", color: "#fff" }} onClick={() => setPortfolioLive(false)}>Close</button>
              </div>
            </div>
            <div className="pfl-content">
              <div className="pfp-hero">
                <div className="pfp-hero-label">ARTIST PORTFOLIO</div>
                <div className="pfp-hero-name">{artist.name.split(" ")[0]} <em>{artist.name.split(" ").slice(1).join(" ")}</em></div>
                <div className="pfp-hero-sub">{pf.discipline} · {artist.location}</div>
                <div className="pfp-hero-actions">
                  <button style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>↓ Download CV</button>
                  <button style={{ background: "var(--ac)", border: "none", color: "#fff" }}>Contact →</button>
                </div>
              </div>
              <div className="pfp-stats">
                <div className="pfp-avatar"><img src={artist.photo} alt="" /></div>
                <div className="pfp-stat"><div className="pfp-stat-val">7</div><div className="pfp-stat-label">YRS EXP</div></div>
                <div className="pfp-stat"><div className="pfp-stat-val">12</div><div className="pfp-stat-label">COMPANIES</div></div>
                <div className="pfp-stat"><div className="pfp-stat-val">3</div><div className="pfp-stat-label">COUNTRIES</div></div>
                <div className="pfp-stat"><div className="pfp-stat-val">24</div><div className="pfp-stat-label">PRODUCTIONS</div></div>
              </div>
              <div className="pfp-tabs">
                {["gallery", "videos", "resume", "references", "documents"].map(t => (
                  <button key={t} className={`pfp-tab${portfolioTab === t ? " active" : ""}`} onClick={() => { setPortfolioTab(t); const el = document.getElementById("pfl-" + t); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>

              {highlightedVid && (
                <div className="pfe-highlight" style={{ marginBottom: 24 }}>
                  <img src={highlightedVid.thumb} alt="" />
                  <div className="pfe-hl-play" />
                  <div className="pfe-hl-info">
                    <div className="pfe-hl-badge" style={{ background: "rgba(96,77,255,.8)" }}>Featured Showreel</div>
                    <div className="pfe-hl-title">{highlightedVid.title}</div>
                    <div className="pfe-hl-meta">{highlightedVid.duration}</div>
                  </div>
                </div>
              )}

              <div id="pfl-gallery" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}>Photo <em style={{ color: "var(--ac)", fontStyle: "italic" }}>Gallery</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{pf.photos.length} photos</span></h3>
                <div className="pfp-gallery">
                  {pf.photos.map(ph => <div key={ph.id} className="pfp-gallery-item"><img src={ph.src} alt={ph.caption} /></div>)}
                </div>
              </div>

              <div id="pfl-videos" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}>Video <em style={{ color: "var(--ac)", fontStyle: "italic" }}>& Showreel</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{pf.videos.length} videos</span></h3>
                <div className="pfp-video-grid">
                  {otherVideos.map(v => (
                    <div key={v.id} className="pfp-video-card">
                      <img src={v.thumb} alt="" />
                      <div className="pfp-vc-play" />
                      <div className="pfp-vc-info"><div className="pfp-vc-title">{v.title}</div><div className="pfp-vc-meta">{v.duration}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="pfl-resume" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}><em style={{ color: "var(--ac)", fontStyle: "italic" }}>Experience</em> & Education</h3>
                <div className="pfe-resume-list">
                  {(pf.resume || []).map(r => (
                    <div key={r.id} className="pfe-resume-item" style={{ background: "#fff", border: "1px solid var(--g2)" }}>
                      <div className={`pfe-ri-icon ${RESUME_ICONS[r.type] || "exp"}`}>{RESUME_EMOJI[r.type] || "💼"}</div>
                      <div className="pfe-ri-info">
                        <div className="pfe-ri-title">{r.title}</div>
                        <div className="pfe-ri-org">{r.org}</div>
                        <div className="pfe-ri-meta">{r.period}{r.location ? ` · ${r.location}` : ""}</div>
                      </div>
                    </div>
                  ))}
                  {(!pf.resume || pf.resume.length === 0) && <p style={{ color: "var(--g4)", fontSize: 13 }}>No resume entries yet.</p>}
                </div>
              </div>

              <div id="pfl-references" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}><em style={{ color: "var(--ac)", fontStyle: "italic" }}>References</em> & Reviews <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{(pf.references || []).length}</span></h3>
                <div className="pfe-refs">
                  {(pf.references || []).map(ref => (
                    <div key={ref.id} className="pfe-ref-card" style={{ background: "#fff", border: "1px solid var(--g2)" }}>
                      <span className={`pfe-ref-type ${ref.type}`}>{ref.type === "reference" ? "Reference" : "Review"}</span>
                      <div className="pfe-ref-quote">"{ref.quote}"</div>
                      <div className="pfe-ref-source">
                        {ref.type === "reference"
                          ? <><strong>{ref.name}</strong> · {ref.role}, {ref.org}</>
                          : <><strong>{ref.source}</strong> · {ref.date}{ref.context ? ` — ${ref.context}` : ""}</>
                        }
                      </div>
                    </div>
                  ))}
                  {(!pf.references || pf.references.length === 0) && <p style={{ color: "var(--g4)", fontSize: 13 }}>No references yet.</p>}
                </div>
              </div>

              <div id="pfl-documents" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}>Documents</h3>
                <div className="pfe-doc-list">
                  {pf.documents.map(d => (
                    <div key={d.id} className="pfe-doc" style={{ background: "#fff", border: "1px solid var(--g2)" }}>
                      <div className="pfe-d-icon">📄</div>
                      <div className="pfe-d-info"><div className="pfe-d-title">{d.title}</div><div className="pfe-d-meta">{d.format} · {d.size}</div></div>
                    </div>
                  ))}
                  {pf.documents.length === 0 && <p style={{ color: "var(--g4)", fontSize: 13 }}>No documents yet.</p>}
                </div>
              </div>

              <div className="pfl-footer">
                <img src="/favicon.svg" alt="Lanced" onError={e => { e.target.style.display = "none"; }} />
                <span>Made with</span>
                <a href="#">Lanced</a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
