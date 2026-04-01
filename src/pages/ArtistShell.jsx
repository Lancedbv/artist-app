import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ━━━ MOCK DATA ━━━ */
const DEMO_ARTIST = {
  firstName: "Amara", lastName: "Osei", name: "Amara Osei", handle: "amaraosei", email: "amara@lanced.io", plan: "Core",
  photo: "/demo/artists/nisha-huizing.jpg",
  dob: "1999-08-14", gender: "Female", pronouns: "She/Her/Hers", height: "5'8\"",
  nationality: ["British-Ghanaian"], ethnicity: ["Black or African American"], heightUnit: "ft",
  country: "United Kingdom", city: "London",
  languages: ["English", "Twi"],
  bio: "Contemporary and Afro-fusion dancer trained at the Royal Ballet School. Three seasons with Akram Khan Company. Passionate about bridging traditional West African movement with contemporary European choreography.",
  profileBio: "Contemporary & Afro-fusion dancer. Three seasons with Akram Khan Company.",
  biography: "Amara was born into a family of musicians and dancers in South London. From the age of five she trained in West African dance forms passed down through her Ghanaian heritage, and at nine she earned a scholarship to the Royal Ballet School's junior programme.\n\nAfter graduating with distinction in BA Dance Performance, Amara joined the Royal Ballet as Corps de Ballet before transitioning to contemporary work with Akram Khan Company, where she spent three seasons as Lead Dancer touring internationally in Jungle Book Reimagined.\n\nHer unique movement vocabulary blends classical European technique with traditional West African dance, creating a distinctive style that has been praised by critics as \"a bridge between two worlds.\" She has performed across 14 countries and continues to push the boundaries of contemporary dance.",
  links: { resume: "#", instagram: "@amaraosei", website: "amaraosei.com" },
  eyeColor: "Brown", hairColor: "Black", weight: "58", weightUnit: "kg",
  shoeSize: "39", shoeSizeUnit: "EU", clothingSize: "S",
  chest: "", waist: "", hips: "", measurementUnit: "cm",
  unionStatus: ["Equity"],
  agency: "", agencyContact: "",
  specialSkills: ["Acrobatics", "Stage Combat", "Aerial Silks"],
  socials: { instagram: "amaraosei", tiktok: "", youtube: "", vimeo: "", linkedin: "" },
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
  { id: "app1", company: "Ballett Zürich", companyLogo: "/demo/artists/1.jpg", opportunity: "Corps de Ballet — 2026/27 Season", status: "shortlisted", submitted: "2026-03-10", deadline: "2026-04-15", banner: "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg", desc: "Ballett Zürich is seeking versatile classical and contemporary dancers for the upcoming season under the direction of Christian Spuck.", companyDesc: "Ballett Zürich is one of Europe's leading ballet companies, resident at the Opernhaus Zürich." },
  { id: "app2", company: "Theater Regensburg", companyLogo: "/demo/artists/2.jpg", opportunity: "Ensemble Dancer — 2026/27 Season", status: "submitted", submitted: "2026-03-05", deadline: "2026-05-01", banner: "/demo/banners/gwen-king-m3th3riq9-w-unsplash.jpg", desc: "Theater Regensburg's dance company is looking for versatile dancers with strong contemporary and classical technique for the upcoming repertoire season.", companyDesc: "Theater Regensburg is a multi-genre theatre in Bavaria, Germany, with a renowned dance ensemble." },
  { id: "app3", company: "The Movers", companyLogo: "/demo/artists/3.jpg", opportunity: "Open Casting — New Production 2026", status: "invited", submitted: "2026-02-20", deadline: "2026-03-30", banner: "/demo/banners/fabian-centeno-k4s5mtsyuli-unsplash.jpg", desc: "Casting call for a new contemporary dance production. Seeking performers with strong physical theatre and improvisation skills.", companyDesc: "The Movers is a casting agency specialising in dance and physical theatre across Europe." },
  { id: "app4", company: "Tanz Luzern", companyLogo: "/demo/artists/4.jpg", opportunity: "Guest Dancer — Spring Programme 2026", status: "submitted", submitted: "2026-03-22", deadline: "2026-06-01", banner: "/demo/banners/shutterstock_1234830199.jpg", desc: "Tanz Luzern invites guest dancers for our spring contemporary programme. We value unique movement voices and collaborative artists.", companyDesc: "Tanz Luzern is a contemporary dance platform at the Luzerner Theater in Switzerland." },
  { id: "app5", company: "Ballett Zürich", companyLogo: "/demo/artists/1.jpg", opportunity: "Guest Artist — Giselle Revival", status: "not_selected", submitted: "2026-01-15", deadline: "2026-02-28", banner: "/demo/banners/shutterstock_1505137721.jpg", desc: "Guest artist opportunity for the revival of Giselle in the 2025/26 repertoire.", companyDesc: "Ballett Zürich is one of Europe's leading ballet companies, resident at the Opernhaus Zürich." },
  { id: "app6", company: "Theater Regensburg", companyLogo: "/demo/artists/2.jpg", opportunity: "Apprentice Dancer — 2026/27", status: "draft", submitted: "", deadline: "2026-05-20", banner: "/demo/banners/gwen-king-m3th3riq9-w-unsplash.jpg", desc: "Theater Regensburg seeks apprentice dancers for the upcoming season to join its growing dance ensemble.", companyDesc: "Theater Regensburg is a multi-genre theatre in Bavaria, Germany, with a renowned dance ensemble.", draftProgress: { profile: true, resume: true, materials: false, motivation: false } },
  { id: "app7", company: "Tanz Luzern", companyLogo: "/demo/artists/4.jpg", opportunity: "Company Dancer — 2026/27 Season", status: "waitlisted", submitted: "2026-02-28", deadline: "2026-04-01", banner: "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg", desc: "Seeking contemporary dancers for the upcoming full season. Strong improvisation and partnering skills required.", companyDesc: "Tanz Luzern is a contemporary dance platform at the Luzerner Theater in Switzerland." },
];

const MOCK_OPPORTUNITIES = [
  {
    id: "opp1", company: "Royal Danish Ballet", title: "Soloist — 2026/27 Season", location: "Copenhagen, DK", type: "Full-time Contract", deadline: "2026-04-30", auditionDate: "2026-05-10", styles: ["Classical", "Neoclassical"], banner: "/demo/banners/jens-thekkeveettil-dbwvuqboou8-unsplash.jpg", saved: false,
    companyLogo: "/demo/artists/1.jpg", companyDesc: "The Royal Danish Ballet is one of the oldest ballet companies in the world, founded in 1748. Renowned for preserving the Bournonville tradition while embracing contemporary works.",
    description: "The Royal Danish Ballet is seeking an exceptional soloist to join the company for the 2026/27 season. This is a rare opportunity to perform with one of Europe's most prestigious ballet companies in a diverse repertoire spanning Bournonville classics to cutting-edge contemporary works. The position involves 8-10 productions per season with international touring.",
    requirements: "We are looking for dancers with exceptional classical technique, strong partnering skills, and the versatility to perform in both classical and contemporary repertoire. Candidates should have at least 3 years of professional company experience at soloist or principal level. Must be physically fit and available for the full season (August 2026 — June 2027).",
    employmentDetails: "Full-time permanent contract. Competitive salary according to Danish performing arts union rates (approx. €48,000-62,000/year). Benefits include health insurance, pension contribution, housing assistance for international dancers, 5 weeks paid vacation. Rehearsal schedule: Mon-Sat, 10:00-18:00.",
    howToApply: "Submit your application through Lanced including your showreel, headshot, full body photo, and updated CV/Resume. Shortlisted candidates will be invited for a live audition in Copenhagen on May 10, 2026.",
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
  { id: "tv1", portfolioId: "pf1", email: "casting@ballett-zurich.ch", name: "Sarah Müller", org: "Ballett Zürich", viewedAt: "2026-03-28T14:22:00", duration: "4m 12s", sections: ["Gallery", "Videos", "Resume"], device: "Desktop" },
  { id: "tv2", portfolioId: "pf1", email: null, name: "Anonymous", org: null, viewedAt: "2026-03-27T09:45:00", duration: "1m 38s", sections: ["Gallery"], device: "Mobile" },
  { id: "tv3", portfolioId: "pf1", email: "hr@theater-regensburg.de", name: "Thomas Weber", org: "Theater Regensburg", viewedAt: "2026-03-26T16:10:00", duration: "6m 05s", sections: ["Gallery", "Videos", "Resume", "References"], device: "Desktop" },
  { id: "tv4", portfolioId: "pf1", email: "casting@themovers.eu", name: "Noa Levy", org: "The Movers", viewedAt: "2026-03-25T11:30:00", duration: "3m 22s", sections: ["Videos", "Resume"], device: "Desktop" },
  { id: "tv5", portfolioId: "pf1", email: null, name: "Anonymous", org: null, viewedAt: "2026-03-24T20:15:00", duration: "0m 45s", sections: ["Gallery"], device: "Mobile" },
];

const DISCIPLINES = ["Dancer", "Choreographer", "Singer", "Actor", "Musical Theatre", "Circus Artist", "Stage Manager", "Other"];

const WORK_ROLES = ["Choreographer", "Director", "Producer", "Dancer", "Performer", "Maker", "Composer", "Dramaturg", "Company", "Other"];
const TOURING_STATUSES = [
  { id: "available", label: "Available for Touring" },
  { id: "in_creation", label: "In Creation" },
  { id: "touring", label: "Currently Touring" },
  { id: "on_hold", label: "On Hold" },
  { id: "archived", label: "Archived" },
];

const MOCK_WORKS = [
  {
    id: "wk1", name: "Echoes in Glass", status: "published", tagline: "A solo about memory and fracture",
    shortPitch: "A mesmerizing solo exploring the fragility of memory through glass-like movement and shattered reflections. Created by Amara Osei after a residency at ICK Amsterdam.",
    fullDescription: "Echoes in Glass is a 55-minute solo performance that traces the contours of memory — how it bends, fractures, and reforms. Drawing on contemporary dance, installation, and live sound design, the work transforms the stage into a landscape of remembering and forgetting. The piece was developed over two years through residencies at ICK Amsterdam and Dansmakers, and premiered at Holland Dance Festival 2024.",
    conceptNote: "The work began with a simple question: what does it feel like when a memory breaks? Through improvisation with light and reflective materials, I discovered a physical vocabulary that mirrors the way memories distort over time.",
    genre: "Contemporary Dance", duration: "55 min", premiereYear: "2024", country: "Netherlands", city: "Amsterdam",
    language: "Non-verbal", ageGuidance: "12+", touringStatus: "available", role: "Choreographer & Performer",
    cover: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg", trailerUrl: "",
    credits: [
      { id: "cr1", name: "Amara Osei", role: "Choreographer & Performer", profileUrl: "" },
      { id: "cr2", name: "Lena Vogel", role: "Light Design", profileUrl: "" },
      { id: "cr3", name: "Kees van Dijk", role: "Sound Design", profileUrl: "" },
      { id: "cr4", name: "Studio Noord", role: "Set Design", profileUrl: "" },
    ],
    gallery: [
      { id: "wg1", src: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg", caption: "Echoes in Glass — opening scene" },
      { id: "wg2", src: "/demo/artists/boris-de-jong/pexels-cottonbro-6221378.jpg", caption: "Glass floor installation" },
      { id: "wg3", src: "/demo/artists/boris-de-jong/pexels-cottonbro-6221374.jpg", caption: "Final tableau" },
    ],
    reviews: [
      { id: "rv1", quote: "A breathtaking meditation on loss — Osei's physicality is unmatched.", source: "The Guardian", rating: 5, type: "press" },
      { id: "rv2", quote: "One of the most compelling solos I've seen this decade.", source: "Theaterkrant", rating: 4, type: "press" },
      { id: "rv3", quote: "I was moved to tears. The way she uses space and silence is extraordinary.", source: "Audience member, Holland Dance Festival", rating: 5, type: "audience" },
    ],
    awards: [
      { id: "aw1", title: "Best Solo Performance", festival: "Holland Dance Festival", year: "2024", type: "win" },
      { id: "aw2", title: "Jury Prize", festival: "Aerowaves Spring Forward", year: "2025", type: "nomination" },
    ],
    upcomingPerformances: [
      { id: "up1", date: "2026-05-15", venue: "Stadsschouwburg", city: "Amsterdam", ticketUrl: "" },
      { id: "up2", date: "2026-06-08", venue: "Sadler's Wells", city: "London", ticketUrl: "" },
      { id: "up3", date: "2026-09-20", venue: "Théâtre de la Ville", city: "Paris", ticketUrl: "" },
    ],
    pastPerformances: [
      { id: "pp1", date: "2024-06-12", venue: "Korzo Theater", city: "The Hague" },
      { id: "pp2", date: "2024-11-03", venue: "DeSingel", city: "Antwerp" },
      { id: "pp3", date: "2025-02-18", venue: "Tanzhaus NRW", city: "Düsseldorf" },
    ],
    partners: [
      { id: "pt1", name: "Holland Dance Festival", type: "co-producer" },
      { id: "pt2", name: "ICK Amsterdam", type: "residency" },
      { id: "pt3", name: "Performing Arts Fund NL", type: "funder" },
    ],
    techRequirements: { stageMinWidth: "10m", stageMinDepth: "8m", performers: "1", setupTime: "4 hours" },
    accessibility: { captions: false, relaxedPerformance: true, audioDescription: false, sensoryNotes: "Occasional strobe effects, low ambient sound" },
    downloads: [
      { id: "dl1", label: "Press Kit", format: "PDF", size: "8.2 MB" },
      { id: "dl2", label: "Technical Rider", format: "PDF", size: "1.4 MB" },
    ],
    bookingEmail: "booking@amaraosei.com",
    bookingCtas: [
      { label: "Book This Work", url: "", intent: "book" },
      { label: "Request Press Kit", url: "", intent: "presskit" },
    ],
    slug: "echoes-in-glass",
    date: "Mar 10, 2026",
  },
  {
    id: "wk2", name: "PULSE", status: "draft", tagline: "Group piece exploring collective rhythm",
    shortPitch: "An explosive group work investigating what happens when eight bodies share a single heartbeat. PULSE blurs the line between concert, club, and ceremony.",
    fullDescription: "PULSE is a 70-minute group performance for eight dancers that explores collective rhythm, synchronicity, and the edge where control meets chaos. Rooted in hip-hop, house, and West African movement traditions, the work builds from stillness to a kinetic storm.",
    conceptNote: "",
    genre: "Urban / Hip-hop", duration: "70 min", premiereYear: "2025", country: "UK", city: "London",
    language: "English", ageGuidance: "All ages", touringStatus: "in_creation", role: "Director",
    cover: "/demo/artists/boris-de-jong/pexels-cottonbro-5102571.jpg", trailerUrl: "",
    credits: [
      { id: "cr5", name: "Amara Osei", role: "Director", profileUrl: "" },
      { id: "cr6", name: "Marcus Johnson", role: "Rehearsal Director", profileUrl: "" },
    ],
    gallery: [],
    reviews: [],
    awards: [],
    upcomingPerformances: [],
    pastPerformances: [],
    partners: [{ id: "pt4", name: "The Place", type: "residency" }],
    techRequirements: { stageMinWidth: "12m", stageMinDepth: "10m", performers: "8", setupTime: "6 hours" },
    accessibility: { captions: false, relaxedPerformance: false, audioDescription: false, sensoryNotes: "" },
    downloads: [],
    bookingEmail: "",
    bookingCtas: [],
    slug: "pulse",
    date: "Mar 15, 2026",
  },
];

const MOCK_WORK_TRACKING = [
  { id: "wt1", workId: "wk1", email: "programming@sadlerswells.com", name: "Rachel Howard", org: "Sadler's Wells", viewedAt: "2026-03-29T10:15:00", duration: "5m 30s", sections: ["About", "Credits", "Performances", "Reviews"], device: "Desktop" },
  { id: "wt2", workId: "wk1", email: "festivals@theatredelaville.fr", name: "Pierre Dumont", org: "Théâtre de la Ville", viewedAt: "2026-03-28T15:42:00", duration: "3m 48s", sections: ["About", "Trailer", "Reviews"], device: "Desktop" },
  { id: "wt3", workId: "wk1", email: null, name: "Anonymous", org: null, viewedAt: "2026-03-27T08:20:00", duration: "1m 12s", sections: ["About"], device: "Mobile" },
];

const STUDIO_THEMES = [
  {
    id: "noir", name: "Noir", desc: "Bold editorial. Cinematic. Motion-heavy.", tier: "free",
    preview: "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg",
    colors: { bg: "#0a0a0a", text: "#ffffff", accent: "#ffffff", muted: "rgba(255,255,255,.5)" },
    fonts: { heading: "'Inter',system-ui,sans-serif", body: "'Inter',system-ui,sans-serif" },
  },
  {
    id: "aurora", name: "Aurora", desc: "Ethereal gradients. Soft. Dreamlike.", tier: "pro", locked: true,
    preview: "/demo/banners/aleksandr-popov-htv8aapzioq-unsplash.jpg",
    colors: { bg: "#0f0a1a", text: "#f0e6ff", accent: "#a78bfa", muted: "rgba(240,230,255,.5)" },
    fonts: { heading: "'Georgia',serif", body: "'Inter',system-ui,sans-serif" },
  },
  {
    id: "editorial", name: "Editorial", desc: "Clean magazine layout. Refined typography.", tier: "pro", locked: true,
    preview: "/demo/banners/hulki-okan-tabak-paog427w_as-unsplash-2.jpg",
    colors: { bg: "#faf9f6", text: "#1a1a1a", accent: "#1a1a1a", muted: "rgba(26,26,26,.5)" },
    fonts: { heading: "'Georgia',serif", body: "'Inter',system-ui,sans-serif" },
  },
  {
    id: "vivid", name: "Vivid", desc: "Colorful. Energetic. Playful.", tier: "pro", locked: true,
    preview: "/demo/banners/pexels-joseph-phillips-2044494-3753820.jpg",
    colors: { bg: "#fffbeb", text: "#1a1a1a", accent: "#f59e0b", muted: "rgba(26,26,26,.5)" },
    fonts: { heading: "'Inter',system-ui,sans-serif", body: "'Inter',system-ui,sans-serif" },
  },
  {
    id: "minimal", name: "Minimal", desc: "Whitespace. Quiet elegance. Less is more.", tier: "pro", locked: true,
    preview: "/demo/banners/rachel-coyne-u7hlzmo4siy-unsplash.jpg",
    colors: { bg: "#ffffff", text: "#111111", accent: "#111111", muted: "rgba(17,17,17,.4)" },
    fonts: { heading: "'Inter',system-ui,sans-serif", body: "'Inter',system-ui,sans-serif" },
  },
  {
    id: "brutalist", name: "Brutalist", desc: "Raw. Oversized type. Unapologetic.", tier: "pro", locked: true,
    preview: "/demo/banners/shutterstock_1505137721.jpg",
    colors: { bg: "#f5f5f0", text: "#000000", accent: "#ff3300", muted: "rgba(0,0,0,.4)" },
    fonts: { heading: "'Inter',system-ui,sans-serif", body: "'Inter',system-ui,sans-serif" },
  },
  {
    id: "atrium", name: "Atrium", desc: "Refined. Rounded. Numbered sections.", tier: "free",
    preview: "/demo/banners/rachel-coyne-u7hlzmo4siy-unsplash.jpg",
    colors: { bg: "#F7F7F5", text: "#111111", accent: "#111111", muted: "rgba(17,17,17,.45)" },
    fonts: { heading: "'Plus Jakarta Sans',system-ui,sans-serif", body: "'Plus Jakarta Sans',system-ui,sans-serif" },
  },
];

const STUDIO_DEFAULT_SECTIONS = [
  { id: "hero", label: "Hero", enabled: true, order: 0 },
  { id: "about", label: "About", enabled: true, order: 1 },
  { id: "gallery", label: "Gallery", enabled: true, order: 2 },
  { id: "portfolios", label: "Portfolios", enabled: true, order: 3 },
  { id: "featuredWork", label: "Featured Work", enabled: true, order: 4 },
  { id: "experience", label: "Experience", enabled: true, order: 5 },
  { id: "works", label: "Works", enabled: true, order: 6 },
  { id: "exploreGallery", label: "Explore Gallery", enabled: true, order: 7 },
  { id: "testimonials", label: "Testimonials", enabled: true, order: 8 },
  { id: "contact", label: "Contact", enabled: true, order: 9 },
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
  { id: "msg1", from: "Ballett Zürich", preview: "Thank you for your audition video. We'd like to invite you to...", time: "2h ago", unread: true, avatar: "/demo/artists/1.jpg",
    thread: [
      { sender: "them", text: "Hi Amara, thank you for your audition video. We've reviewed your materials and are very impressed with your technique.", time: "Mar 10, 10:30" },
      { sender: "them", text: "We'd like to invite you to the next round of auditions on April 5th in Zürich.", time: "Mar 10, 10:31" },
      { sender: "me", text: "Thank you so much! I'm honoured. I'll confirm my attendance shortly.", time: "Mar 10, 14:22" },
      { sender: "them", text: "Great! Please bring pointe shoes and a contemporary solo (max 1 min). Details will follow by email.", time: "Mar 10, 15:00" },
    ]},
  { id: "msg2", from: "Theater Regensburg", preview: "Your application has been received and is currently under review.", time: "1d ago", unread: false, avatar: "/demo/artists/2.jpg",
    thread: [
      { sender: "them", text: "Dear Amara, thank you for applying to our Ensemble Dancer position for 2026/27. Your application has been received and is currently under review.", time: "Mar 6, 09:15" },
      { sender: "me", text: "Thank you for confirming! Looking forward to hearing from you.", time: "Mar 6, 11:40" },
    ]},
  { id: "msg3", from: "The Movers", preview: "Congratulations! We are pleased to invite you to the final round.", time: "3d ago", unread: false, avatar: "/demo/artists/3.jpg",
    thread: [
      { sender: "them", text: "Dear Amara, we are pleased to inform you that you have been shortlisted for the Open Casting.", time: "Mar 1, 08:00" },
      { sender: "me", text: "This is wonderful news! Thank you so much.", time: "Mar 1, 09:30" },
      { sender: "them", text: "Congratulations! We are pleased to invite you to the final round. Please confirm your attendance by March 25.", time: "Mar 5, 14:00" },
      { sender: "me", text: "I'm absolutely thrilled! I confirm my attendance. Is there anything specific I should prepare?", time: "Mar 5, 16:15" },
      { sender: "them", text: "Please prepare a 2-minute solo of your choice. We look forward to seeing you!", time: "Mar 5, 17:00" },
    ]},
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "application", title: "Application Update", body: "Your application for Corps de Ballet at Ballett Zürich has been shortlisted!", time: "2h ago", unread: true, color: "#1E90FF", icon: "📋" },
  { id: "n2", type: "broadcast", title: "Tanz Luzern", body: "Reminder: Please submit any additional materials before the deadline on June 1st.", time: "5h ago", unread: true, color: "#604DFF", icon: "📢" },
  { id: "n3", type: "invitation", title: "Invitation Received", body: "The Movers has invited you to the final casting round.", time: "1d ago", unread: false, color: "#1DB954", icon: "🎉" },
  { id: "n4", type: "broadcast", title: "Ballett Zürich", body: "The audition schedule has been finalized. All applicants will receive individual time slots by email.", time: "2d ago", unread: false, color: "#604DFF", icon: "📢" },
  { id: "n5", type: "profile", title: "Profile Views", body: "Your profile was viewed 48 times this week — up 23% from last week.", time: "3d ago", unread: false, color: "#F5A623", icon: "👁" },
  { id: "n6", type: "opportunity", title: "New Opportunity", body: "A new opportunity matching your profile: Soloist — 2026/27 Season at Royal Danish Ballet.", time: "4d ago", unread: false, color: "#FF69B4", icon: "✨" },
  { id: "n7", type: "broadcast", title: "Theater Regensburg", body: "Thank you to all applicants. We will be sending out decisions by the end of this week.", time: "5d ago", unread: false, color: "#604DFF", icon: "📢" },
];

/* ━━━ HELPERS ━━━ */
const STATUS_COLORS = { submitted: { bg: "#F0F0FF", color: "#604DFF" }, shortlisted: { bg: "#E6F0FF", color: "#1E90FF" }, invited: { bg: "#E6FFF0", color: "#1DB954" }, waitlisted: { bg: "#FFF5E6", color: "#E67E22" }, not_selected: { bg: "#FFF0F0", color: "#FF4757" }, archived: { bg: "#F0F0F0", color: "#98989F" }, draft: { bg: "rgba(255,171,0,.12)", color: "#F5A623" } };
const STATUS_LABELS = { submitted: "Submitted", shortlisted: "Shortlisted", invited: "Invited", waitlisted: "Waitlisted", not_selected: "Not Selected", archived: "Archived", draft: "Draft" };
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
.dark .app-toolbar.stuck{background:rgba(13,13,18,.75)}
.dark .app-toolbar .at-search-btn{background:var(--sf);border-color:var(--g3)}
.dark .app-toolbar .at-search-expanded{background:var(--sf);border-color:var(--ac)}
.dark .app-toolbar .at-filter-btn{background:var(--sf);border-color:var(--g3)}
.dark .app-card{background:var(--sf);border-color:var(--g2)}
.dark .app-tile{background:var(--sf);border-color:var(--g2)}
.dark .ak-column{background:var(--sf);border-color:var(--g2)}
.dark .ak-card{background:var(--bg);border-color:var(--g2)}
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
.sb-collapsed .sidebar-back-top{padding:4px 6px 0;flex-direction:column;gap:4px;align-items:center;justify-content:center}
.sidebar-back-top .sb-toggle{margin-right:4px}
.sb-back-toggle{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;color:var(--g4);font-size:12px;font-weight:500;font-family:var(--sans);background:none;border:none;border-radius:10px;transition:all .15s;width:100%;text-align:left}
.sb-back-toggle:hover{color:var(--ac);background:var(--g1)}
.sb-collapsed .sb-back-toggle{justify-content:center;padding:10px}
.sb-collapsed .sb-back-toggle .sb-label{display:none}
.sb-collapsed .sidebar-header{padding:12px 0 8px;display:flex;flex-direction:column;align-items:center;gap:6px}
.sb-collapsed .sidebar-logo{justify-content:center;width:100%}
.sb-collapsed .sidebar-logo>div:not(.sb-mark){display:none}
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
.topbar-studio{font-family:var(--sans);font-size:11px;font-weight:600;padding:0 14px;height:34px;border-radius:40px;background:linear-gradient(135deg,rgba(96,77,255,.08),rgba(96,77,255,.15));color:var(--ac);border:none;box-shadow:inset 0 0 0 1px rgba(96,77,255,.12);cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px}
.topbar-studio:hover{background:linear-gradient(135deg,rgba(96,77,255,.15),rgba(96,77,255,.25));transform:translateY(-1px)}
.notif-bell{position:relative;width:34px;height:34px;border-radius:50%;background:var(--sf);box-shadow:0 1px 4px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.03);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:all .15s;font-size:16px;color:var(--g5)}
.notif-bell:hover{background:var(--g1);color:var(--tx)}
.notif-bell .notif-dot{position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:var(--red);border:2px solid var(--sf)}
.notif-bell .notif-count{position:absolute;top:-2px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:var(--red);color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid var(--sf)}
.dark .notif-bell{background:var(--g1);box-shadow:0 1px 4px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.04)}
.dark .notif-bell .notif-dot,.dark .notif-bell .notif-count{border-color:var(--g1)}
.topbar-avatar{display:flex;align-items:center;gap:8px;cursor:pointer;padding:0 12px 0 3px;height:34px;border-radius:40px;border:none;box-shadow:inset 0 0 0 1px var(--g2);transition:all .15s;background:var(--sf)}
.topbar-avatar:hover{box-shadow:inset 0 0 0 1px var(--ac)}
.topbar-avatar img{width:26px;height:26px;border-radius:50%;object-fit:cover}
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
.info-card h4{font-size:20px;font-weight:700;margin-bottom:16px;color:var(--tx)}
.pf-field{display:flex;flex-direction:column;gap:4px}
.pf-label{font-size:12px;font-weight:600;color:var(--tx)}
.pf-input{padding:10px 14px;border:1px solid var(--g2);border-radius:10px;font-size:13px;font-family:var(--sans);color:var(--tx);background:var(--bg);outline:none;transition:border-color .15s;width:100%;box-sizing:border-box}
.pf-input:focus{border-color:var(--ac)}
select.pf-input{appearance:auto;cursor:pointer}
textarea.pf-input{line-height:1.6}
.pf-multiselect{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;border:1px solid var(--g2);border-radius:10px;background:var(--bg);min-height:42px;align-items:center;box-sizing:border-box;transition:border-color .15s}
.pf-multiselect:focus-within{border-color:var(--ac)}
.pf-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;border:1px solid rgba(96,77,255,.2);color:var(--ac);font-size:12px;font-weight:500;white-space:nowrap}
.pf-chip-x{cursor:pointer;font-size:13px;opacity:.7;transition:opacity .15s}
.pf-chip-x:hover{opacity:1}
.pf-add-select{border:none;outline:none;background:transparent;font-size:12px;color:var(--g4);font-family:var(--sans);cursor:pointer;padding:2px 0;min-width:60px}
.pf-add-input{border:none;outline:none;background:transparent;font-size:12px;color:var(--tx);font-family:var(--sans);flex:1;min-width:80px;padding:2px 0}
.info-row{display:flex;align-items:center;padding:6px 0;font-size:13px}
.info-row .ir-label{width:120px;color:var(--g4);flex-shrink:0}
.info-row .ir-value{color:var(--tx);font-weight:500}
.bio-card{background:var(--sf);border:1px solid var(--g2);border-radius:14px;padding:20px;margin-bottom:16px;animation:slideInUp .3s ease both}
.bio-card h4{font-size:13px;font-weight:600;margin-bottom:8px}
.bio-card p{font-size:13px;color:var(--g5);line-height:1.6}

/* ━━━ Resume ━━━ */
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
.app-toolbar{display:flex;align-items:center;gap:8px;padding:10px 0;margin-bottom:20px;position:sticky;top:0;z-index:50;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;margin-left:-32px;margin-right:-32px;padding-left:32px;padding-right:32px;border-bottom:1px solid var(--g2);transition:all .2s}
.app-toolbar.stuck{background:rgba(var(--bg-rgb,248,247,252),.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom-color:var(--g2)}
.app-toolbar .at-filters{display:flex;align-items:center;gap:5px;flex-shrink:0}
.app-toolbar .at-filters .chip{font-size:12px;padding:6px 12px}
.app-toolbar .at-filters .chip .at-chip-count{font-size:10px;opacity:.6;margin-left:3px;font-weight:500}
.app-toolbar .at-right{display:flex;align-items:center;gap:6px;margin-left:auto;flex-shrink:0}
.app-toolbar .at-search-btn{width:38px;height:38px;border-radius:50%;border:1px solid var(--g2);background:var(--sf);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--g5);transition:all .2s;flex-shrink:0}
.app-toolbar .at-search-btn:hover{border-color:var(--ac);color:var(--ac)}
.app-toolbar .at-search-expanded{display:flex;align-items:center;gap:8px;padding:0 14px;border:1px solid var(--ac);border-radius:40px;background:var(--sf);height:38px;animation:expandSearch .25s ease;overflow:hidden;min-width:200px}
.app-toolbar .at-search-expanded input{border:none;outline:none;font-family:var(--sans);font-size:12px;flex:1;background:none;color:var(--tx);min-width:100px}
.app-toolbar .at-search-expanded input::placeholder{color:var(--g4)}
.app-toolbar .at-search-close{background:none;border:none;cursor:pointer;color:var(--g4);padding:2px;display:flex;align-items:center;transition:color .15s}
.app-toolbar .at-search-close:hover{color:var(--tx)}
@keyframes expandSearch{from{min-width:38px;opacity:.5}to{min-width:200px;opacity:1}}
.app-toolbar .at-filter-btn{height:38px;padding:0 14px;border-radius:10px;border:1px solid var(--g2);background:var(--sf);display:flex;align-items:center;gap:6px;cursor:pointer;color:var(--g5);font-size:12px;font-weight:500;transition:all .15s}
.app-toolbar .at-filter-btn:hover{border-color:var(--ac);color:var(--ac)}
.app-toolbar .at-filter-btn.active{background:var(--ac);color:#fff;border-color:var(--ac)}
.app-toolbar .at-filter-btn svg{width:14px;height:14px}
.app-list{display:flex;flex-direction:column;gap:8px;animation:fadeIn .3s ease}
.app-card{display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--sf);border:1px solid var(--g2);border-radius:14px;cursor:pointer;transition:all .2s;animation:slideInUp .3s ease both;position:relative}
.app-card:nth-child(1){animation-delay:.03s}.app-card:nth-child(2){animation-delay:.06s}.app-card:nth-child(3){animation-delay:.09s}.app-card:nth-child(4){animation-delay:.12s}
.app-card:hover{border-color:rgba(96,77,255,.18);transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.app-card .ac-logo{width:44px;height:44px;border-radius:12px;object-fit:cover;flex-shrink:0}
.app-card .ac-info{flex:1;min-width:0}
.app-card .ac-title{font-size:14px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app-card .ac-company{font-size:12px;color:var(--g4)}
.app-card .ac-meta{display:flex;gap:16px;font-size:11px;color:var(--g5);margin-top:4px}
.app-card .ac-status{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:4px 12px;border-radius:40px;flex-shrink:0}
.app-card .ac-archive{position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;color:var(--g3);padding:4px;border-radius:6px;opacity:0;transition:all .15s;display:flex;align-items:center}
.app-card:hover .ac-archive{opacity:1}
.app-card .ac-archive:hover{color:var(--g5);background:var(--g1)}
/* tile/card view */
.app-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;animation:fadeIn .3s ease}
.app-tile{background:var(--sf);border:1px solid var(--g2);border-radius:16px;cursor:pointer;transition:all .2s;animation:popIn .25s ease both;overflow:hidden;position:relative}
.app-tile:nth-child(1){animation-delay:.03s}.app-tile:nth-child(2){animation-delay:.06s}.app-tile:nth-child(3){animation-delay:.09s}.app-tile:nth-child(4){animation-delay:.12s}
.app-tile:hover{border-color:rgba(96,77,255,.18);transform:translateY(-3px);box-shadow:0 8px 24px rgba(96,77,255,.1)}
.app-tile .at-banner{height:100px;overflow:hidden;position:relative}
.app-tile .at-banner img{width:100%;height:100%;object-fit:cover}
.app-tile .at-banner .at-status{position:absolute;top:10px;right:10px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:4px 10px;border-radius:40px}
.app-tile .at-body{padding:16px}
.app-tile .at-head{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.app-tile .at-head img{width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0;border:2px solid var(--sf);margin-top:-28px;position:relative;z-index:1}
.app-tile .at-head .at-company{font-size:11px;color:var(--g4);font-weight:500}
.app-tile .at-title{font-size:14px;font-weight:600;color:var(--tx);margin-bottom:6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.app-tile .at-meta{display:flex;gap:12px;font-size:10px;color:var(--g5)}
.app-tile .at-meta span{display:flex;align-items:center;gap:3px}
.app-tile .at-archive{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);border:none;cursor:pointer;color:rgba(255,255,255,.7);padding:5px;border-radius:6px;opacity:0;transition:all .15s;display:flex;align-items:center}
.app-tile:hover .at-archive{opacity:1}
.app-tile .at-archive:hover{color:#fff;background:rgba(0,0,0,.6)}
/* kanban board */
.app-kanban{display:flex;gap:12px;overflow-x:auto;padding-bottom:16px;min-height:400px}
.ak-column{min-width:240px;flex:1;background:var(--bg);border-radius:14px;border:1px solid var(--g2);display:flex;flex-direction:column;max-height:600px}
.ak-col-header{display:flex;align-items:center;gap:8px;padding:14px 16px 10px;border-bottom:1px solid var(--g2)}
.ak-col-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ak-col-title{font-size:12px;font-weight:600;color:var(--tx)}
.ak-col-count{font-size:10px;color:var(--g4);background:var(--g1);padding:1px 7px;border-radius:40px;margin-left:auto}
.ak-col-body{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px}
.ak-card{display:flex;gap:10px;padding:12px;background:var(--sf);border:1px solid var(--g2);border-radius:10px;cursor:pointer;transition:all .2s}
.ak-card:hover{border-color:rgba(96,77,255,.18);box-shadow:0 2px 8px rgba(96,77,255,.06);transform:translateY(-1px)}
.ak-logo{width:32px;height:32px;border-radius:8px;object-fit:cover;flex-shrink:0}
.ak-info{flex:1;min-width:0}
.ak-title{font-size:12px;font-weight:600;color:var(--tx);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ak-company{font-size:11px;color:var(--g4);margin-top:2px}
.ak-deadline{font-size:10px;color:var(--g5);margin-top:4px}
.ak-empty{text-align:center;padding:24px 8px;font-size:11px;color:var(--g3)}

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

/* ━━━ Works Context ━━━ */
.ctx-works{--wk-ac:#D97706;--wk-ac-light:rgba(217,119,6,.08);background-image:radial-gradient(ellipse at 20% 0%,rgba(217,119,6,.10) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(217,119,6,.06) 0%,transparent 50%);transition:background .4s ease}
.ctx-works::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--wk-ac),transparent 80%);z-index:210;animation:fadeIn .4s}
.ctx-works .main{position:fixed;top:12px;right:12px;bottom:12px;left:calc(var(--sb-w) + 24px);border-radius:20px;background:var(--sf);box-shadow:0 8px 40px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.03);animation:ctxPanelIn .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;margin:0;min-height:0}
.ctx-works .main .breadcrumb-bar{border-radius:20px 20px 0 0;flex-shrink:0;position:sticky;top:0;z-index:10;border-image:linear-gradient(90deg,var(--wk-ac) 0%,transparent 70%) 1}
.ctx-works .main .content{overflow-y:auto;flex:1;min-height:0;padding-top:8px}
.ctx-works .main .content>div>:first-child{margin-top:8px}
.ctx-works .main>*{animation:ctxStagger .3s ease backwards}
.ctx-works .main>*:nth-child(1){animation-delay:0s}
.ctx-works .main>*:nth-child(2){animation-delay:.03s}
.ctx-works .main>*:nth-child(3){animation-delay:.06s}
.ctx-works .topbar{display:none}
.sb-collapsed.ctx-works .main{left:calc(var(--sb-wc) + 24px)}
.ctx-works .sidebar{top:12px;left:12px;bottom:12px;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.04);animation:sbSlideIn .3s cubic-bezier(.4,0,.2,1);overflow:hidden;background:linear-gradient(180deg,rgba(217,119,6,.06) 0%,var(--sf) 60%)}
.ctx-works .sidebar-item.active{background:rgba(217,119,6,.08);color:var(--wk-ac);font-weight:600}
.ctx-works .sidebar-item.active::before{background:var(--wk-ac)}
.dark .ctx-works .main{box-shadow:0 8px 40px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.04)}
.dark .ctx-works .sidebar{box-shadow:0 8px 40px rgba(0,0,0,.2),0 0 0 1px rgba(255,255,255,.06)}
.dark .ctx-works{background-image:radial-gradient(ellipse at 20% 0%,rgba(217,119,6,.14) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(217,119,6,.08) 0%,transparent 50%)}

/* Works Editor */
.wke-section{background:var(--sf);border:1px solid var(--g2);border-radius:16px;padding:24px;margin-bottom:16px}
.wke-section h3{font-size:16px;font-weight:700;margin:0 0 16px}
.wke-section h3 em{color:#D97706;font-style:italic}
.wke-banner{position:relative;height:200px;border-radius:16px;overflow:hidden;margin-bottom:16px;background:linear-gradient(135deg,rgba(217,119,6,.15),rgba(217,119,6,.03))}
.wke-banner img{width:100%;height:100%;object-fit:cover}
.wke-banner-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.6));display:flex;flex-direction:column;justify-content:flex-end;padding:24px}
.wke-banner-title{font-size:22px;font-weight:700;color:#fff}
.wke-banner-tagline{font-size:13px;color:rgba(255,255,255,.7);margin-top:4px}
.wke-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.wke-add-row{display:flex;gap:8px;margin-top:12px}
.wke-add-btn{padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:all .15s}
.wke-add-btn.primary{background:rgba(217,119,6,.08);color:#D97706;border:1px solid rgba(217,119,6,.15)}
.wke-add-btn.primary:hover{background:rgba(217,119,6,.15)}
.wke-add-btn.secondary{background:var(--bg);color:var(--g5);border:1px solid var(--g2)}
.wke-add-btn.secondary:hover{border-color:var(--g3)}
.wke-count{font-size:11px;font-weight:500;color:var(--g4);margin-left:6px}
.wke-pill-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.wke-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;background:rgba(217,119,6,.06);color:#D97706;border:1px solid rgba(217,119,6,.12)}
.wke-credit{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--g2);border-radius:12px;margin-bottom:8px}
.wke-credit-avatar{width:36px;height:36px;border-radius:10px;background:rgba(217,119,6,.08);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#D97706;flex-shrink:0}
.wke-credit-info{flex:1;min-width:0}
.wke-credit-name{font-size:13px;font-weight:600}
.wke-credit-role{font-size:11px;color:var(--g4)}
.wke-credit-actions{display:flex;gap:4px}
.wke-credit-actions button{background:none;border:none;font-size:11px;color:var(--g4);cursor:pointer;padding:4px}
.wke-credit-actions button:hover{color:var(--red)}
.wke-review-card{padding:16px;border:1px solid var(--g2);border-radius:12px;margin-bottom:8px}
.wke-review-quote{font-size:13px;font-style:italic;color:var(--tx);margin-bottom:8px;line-height:1.5}
.wke-review-source{font-size:11px;color:var(--g4)}
.wke-review-type{display:inline-block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 8px;border-radius:20px;margin-bottom:8px}
.wke-review-type.press{background:rgba(96,77,255,.08);color:var(--ac)}
.wke-review-type.audience{background:rgba(217,119,6,.08);color:#D97706}
.wke-award-card{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--g2);border-radius:12px;margin-bottom:8px}
.wke-award-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.wke-award-icon.win{background:rgba(245,166,35,.12)}
.wke-award-icon.nomination{background:rgba(96,77,255,.08)}
.wke-award-icon.selection{background:rgba(13,148,136,.08)}
.wke-award-info{flex:1}
.wke-award-title{font-size:13px;font-weight:600}
.wke-award-meta{font-size:11px;color:var(--g4)}
.wke-perf-item{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--g2);border-radius:12px;margin-bottom:8px}
.wke-perf-date{width:56px;text-align:center;flex-shrink:0}
.wke-perf-date-d{font-size:18px;font-weight:700;color:#D97706}
.wke-perf-date-m{font-size:10px;font-weight:600;text-transform:uppercase;color:var(--g4)}
.wke-perf-info{flex:1}
.wke-perf-venue{font-size:13px;font-weight:600}
.wke-perf-city{font-size:11px;color:var(--g4)}
.wke-perf-ticket{font-size:11px;color:#D97706;font-weight:600;cursor:pointer;text-decoration:none;background:none;border:none;font-family:var(--sans)}
.wke-perf-ticket:hover{text-decoration:underline}
.wke-partner{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--g2);border-radius:10px;margin-bottom:6px}
.wke-partner-name{font-size:13px;font-weight:600}
.wke-partner-type{font-size:10px;color:var(--g4);text-transform:uppercase;letter-spacing:.04em}
.wke-tech-table{width:100%;border-collapse:separate;border-spacing:0}
.wke-tech-table td{padding:8px 12px;font-size:13px;border-bottom:1px solid var(--g1)}
.wke-tech-table td:first-child{font-weight:600;color:var(--g5);width:40%}
.wke-access-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--g1)}
.wke-access-row:last-child{border-bottom:none}
.wke-access-label{font-size:13px;font-weight:500}
.wke-access-badge{font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.wke-access-badge.yes{background:rgba(29,185,84,.1);color:var(--green)}
.wke-access-badge.no{background:var(--g1);color:var(--g4)}
.wke-dl-item{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--g2);border-radius:10px;margin-bottom:6px}
.wke-dl-icon{font-size:16px}
.wke-dl-info{flex:1}
.wke-dl-title{font-size:13px;font-weight:600}
.wke-dl-meta{font-size:11px;color:var(--g4)}
.wke-cta-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.wke-cta-btn{padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans);transition:all .15s}
.wke-cta-btn.book{background:linear-gradient(135deg,#D97706,#B45309);color:#fff;border:none}
.wke-cta-btn.tickets{background:#D97706;color:#fff;border:none}
.wke-cta-btn.presskit{background:rgba(217,119,6,.08);color:#D97706;border:1px solid rgba(217,119,6,.15)}
.wke-cta-btn.contact{background:var(--bg);color:var(--tx);border:1px solid var(--g2)}
.wke-input-label{font-size:12px;font-weight:600;color:var(--g5);display:block;margin-bottom:6px}
.wke-input{width:100%;padding:10px 14px;border:1px solid var(--g2);border-radius:10px;font-size:13px;font-family:var(--sans);background:var(--bg);color:var(--tx);outline:none;box-sizing:border-box}
.wke-input:focus{border-color:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.1)}
.wke-textarea{width:100%;padding:10px 14px;border:1px solid var(--g2);border-radius:10px;font-size:13px;font-family:var(--sans);background:var(--bg);color:var(--tx);outline:none;resize:vertical;min-height:80px;box-sizing:border-box}
.wke-textarea:focus{border-color:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.1)}
.wke-select{width:100%;padding:10px 14px;border:1px solid var(--g2);border-radius:10px;font-size:13px;font-family:var(--sans);background:var(--bg);color:var(--tx);outline:none}
.wke-select:focus{border-color:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.1)}

/* Works Preview */
.wkp-hero{position:relative;border-radius:16px;overflow:hidden;min-height:320px;background:linear-gradient(135deg,#1a1200,#2d1b00);display:flex;flex-direction:column;justify-content:flex-end;padding:40px;margin-bottom:24px}
.wkp-hero.has-cover{background-size:cover;background-position:center}
.wkp-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.7));pointer-events:none}
.wkp-hero>*{position:relative;z-index:1}
.wkp-hero-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:rgba(255,255,255,.6);margin-bottom:8px}
.wkp-hero-title{font-size:36px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:6px;font-family:var(--serif)}
.wkp-hero-tagline{font-size:15px;color:rgba(255,255,255,.7);margin-bottom:4px}
.wkp-hero-role{display:inline-block;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;background:rgba(217,119,6,.2);color:#FBBF24;margin-bottom:16px}
.wkp-hero-actions{display:flex;gap:8px}
.wkp-hero-actions button{padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans)}
.wkp-keyinfo{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.wkp-keyinfo-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;font-size:12px;font-weight:500;background:var(--sf);border:1px solid var(--g2)}
.wkp-keyinfo-pill strong{font-weight:700;color:var(--tx)}
.wkp-keyinfo-pill span{color:var(--g5)}
.wkp-about{margin-bottom:24px}
.wkp-about-pitch{font-size:18px;line-height:1.6;color:var(--tx);font-weight:500;margin-bottom:16px;font-family:var(--serif)}
.wkp-about-desc{font-size:14px;line-height:1.7;color:var(--g5);margin-bottom:16px}
.wkp-about-note{font-size:13px;line-height:1.6;color:var(--g4);padding:16px;border-left:3px solid #D97706;background:rgba(217,119,6,.03);border-radius:0 10px 10px 0}
.wkp-section-title{font-size:18px;font-weight:700;margin:0 0 16px}
.wkp-section-title em{color:#D97706;font-style:italic}
.wkp-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:24px}
.wkp-gallery-item{aspect-ratio:4/3;border-radius:10px;overflow:hidden;cursor:pointer}
.wkp-gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
.wkp-gallery-item:hover img{transform:scale(1.03)}
.wkp-credits-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:24px}
.wkp-credit-card{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--g2);border-radius:12px;background:var(--sf)}
.wkp-credit-avatar{width:36px;height:36px;border-radius:10px;background:rgba(217,119,6,.08);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#D97706;flex-shrink:0}
.wkp-credit-name{font-size:13px;font-weight:600}
.wkp-credit-role{font-size:11px;color:var(--g4)}
.wkp-trailer{position:relative;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#000;margin-bottom:24px;display:flex;align-items:center;justify-content:center}
.wkp-trailer img{width:100%;height:100%;object-fit:cover;opacity:.6}
.wkp-trailer-play{position:absolute;width:64px;height:64px;border-radius:50%;background:rgba(217,119,6,.9);display:flex;align-items:center;justify-content:center;cursor:pointer}
.wkp-trailer-play::after{content:'';border-left:20px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:4px}
.wkp-avail{padding:20px;border:1px solid var(--g2);border-radius:16px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between}
.wkp-avail-status{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600}
.wkp-avail-dot{width:8px;height:8px;border-radius:50%}
.wkp-avail-dot.available{background:#1DB954}
.wkp-avail-dot.touring{background:#D97706}
.wkp-avail-dot.in_creation{background:#F5A623}
.wkp-avail-dot.on_hold{background:var(--g4)}
.wkp-avail-dot.archived{background:var(--g3)}

/* Works Tracking */
.wkt-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.wkt-stat{background:var(--bg);border-radius:12px;padding:16px;text-align:center}
.wkt-val{font-size:24px;font-weight:800;color:#D97706}
.wkt-label{font-size:11px;color:var(--g4);text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.wkt-list{display:flex;flex-direction:column;gap:8px}
.wkt-item{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--g2);border-radius:12px}
.wkt-avatar{width:36px;height:36px;border-radius:10px;background:rgba(217,119,6,.08);color:#D97706;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.wkt-info{flex:1;min-width:0}
.wkt-name{font-size:13px;font-weight:600}
.wkt-org{font-size:11px;color:var(--g4)}
.wkt-sections{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.wkt-sections span{font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(217,119,6,.06);color:#D97706}
.wkt-meta{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:11px;color:var(--g4);flex-shrink:0}
.wkt-pro-gate{text-align:center;padding:40px 20px}
.wkt-pro-gate h4{font-size:16px;margin:0 0 8px;color:#D97706}
.wkt-pro-gate p{font-size:13px;color:var(--g4);margin:0 0 16px;max-width:360px;margin-inline:auto}
.wkt-pro-gate button{padding:10px 24px;border-radius:10px;background:linear-gradient(135deg,#D97706,#B45309);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans)}

/* Works Cards on Present page */
.wk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:16px}
.wk-card{border:1px solid var(--g2);border-radius:16px;overflow:hidden;cursor:pointer;transition:all .2s;background:var(--sf)}
.wk-card:hover{border-color:rgba(217,119,6,.3);box-shadow:0 4px 20px rgba(217,119,6,.08)}
.wkc-cover{height:140px;object-fit:cover;width:100%}
.wkc-body{padding:16px}
.wkc-title{font-size:15px;font-weight:700;margin-bottom:4px}
.wkc-tagline{font-size:12px;color:var(--g5);margin-bottom:8px}
.wkc-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.wkc-status{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:2px 8px;border-radius:20px}
.wkc-genre{font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(217,119,6,.06);color:#D97706;font-weight:600}
.wkc-touring{font-size:9px;padding:2px 8px;border-radius:20px;background:rgba(29,185,84,.08);color:var(--green);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.wkc-role{font-size:11px;color:var(--g4);margin-top:8px}

/* Works Live View */
.wkl-overlay{position:fixed;inset:0;background:var(--bg);z-index:300;display:flex;flex-direction:column;animation:fadeIn .2s}
.wkl-topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:var(--sf);border-bottom:1px solid var(--g2)}
.wkl-topbar-title{font-size:14px;font-weight:600}
.wkl-topbar-actions{display:flex;gap:8px}
.wkl-topbar-actions button{padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans)}
.wkl-content{flex:1;overflow-y:auto;padding:24px;max-width:800px;margin:0 auto;width:100%}
.wkl-anim{animation:slideUp .3s ease backwards}

/* New Work Modal */
.nwk-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(4px);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
.nwk-modal{background:var(--sf);border-radius:20px;width:480px;max-width:92vw;max-height:85vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.15);animation:slideUp .25s ease}
.nwk-modal h2{font-size:20px;font-weight:700;margin:0}

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

/* Comp Card Preview */
.cc-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:flex-start;justify-content:center;animation:fadeIn .2s;overflow:auto;padding:80px 20px 40px}
.cc-toolbar{position:fixed;top:0;left:0;right:0;z-index:10000;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(0,0,0,.8);backdrop-filter:blur(12px)}
.cc-toolbar span{color:#fff;font-size:14px;font-weight:600}
.cc-toolbar .cc-actions{display:flex;gap:8px;align-items:center}
.cc-toolbar .cc-actions button{padding:7px 16px;border-radius:8px;border:none;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);display:flex;align-items:center;gap:5px}
.cc-zoom{display:flex;align-items:center;gap:6px;margin-right:12px}
.cc-zoom button{width:28px;height:28px;border-radius:6px;border:none;background:rgba(255,255,255,.15);color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.cc-zoom span{color:#fff;font-size:11px;font-weight:600;min-width:36px;text-align:center}
.cc-page{width:794px;height:1123px;background:#fff;border-radius:4px;box-shadow:0 20px 80px rgba(0,0,0,.3);padding:36px 40px;box-sizing:border-box;color:#1a1a2e;font-family:var(--sans);position:relative;transform-origin:top center;transition:transform .2s ease;overflow:hidden;display:flex;flex-direction:column}
.cc-page *{color:#1a1a2e}
.cc-header{display:flex;gap:24px;margin-bottom:20px;align-items:flex-start}
.cc-photo{width:170px;height:220px;border-radius:12px;object-fit:cover;flex-shrink:0;border:2px solid #ddd}
.cc-info{flex:1;display:flex;flex-direction:column;gap:4px}
.cc-info h1{font-size:26px;font-weight:800;margin:0;letter-spacing:-.02em}
.cc-info h1 span{color:#604DFF}
.cc-info .cc-discipline{font-size:14px;color:#666;font-weight:500;margin-bottom:8px}
.cc-info .cc-bio{font-size:12px;color:#444;line-height:1.6;margin-top:8px}
.cc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
.cc-stat{padding:8px;border-radius:8px;background:#f8f8f8;text-align:center}
.cc-stat .cc-stat-val{font-size:14px;font-weight:700;color:#1a1a2e}
.cc-stat .cc-stat-label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#888;margin-top:2px}
.cc-section{margin-bottom:14px}
.cc-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#604DFF;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #eee}
.cc-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px}
.cc-grid-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f5f5f5;font-size:11px}
.cc-grid-item .cc-gi-label{color:#888;font-weight:500}
.cc-grid-item .cc-gi-value{font-weight:600;text-align:right}
.cc-chips{display:flex;flex-wrap:wrap;gap:5px}
.cc-chips span{padding:3px 10px;border-radius:20px;background:#f5f5f5;font-size:10px;font-weight:500;color:#1a1a2e}
.cc-photos{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px}
.cc-photos img{width:100%;height:100px;object-fit:cover;border-radius:6px}
.cc-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:16px;border-top:1px solid #eee}
.cc-footer .cc-qr{display:flex;align-items:center;gap:12px}
.cc-footer .cc-qr img{width:64px;height:64px;border-radius:4px}
.cc-footer .cc-qr-text{font-size:10px;color:#888;line-height:1.5}
.cc-footer .cc-qr-text strong{color:#1a1a2e;font-size:11px;display:block}
.cc-footer .cc-logo{height:20px;opacity:.6}
.cc-contact{display:flex;gap:20px;font-size:11px;color:#666;margin-top:8px}
.cc-contact span{display:flex;align-items:center;gap:4px}

@media print{
  body>*{display:none!important}
  .cc-overlay{display:block!important;position:static!important;background:none!important;padding:0!important}
  .cc-overlay *{display:revert}
  .cc-toolbar{display:none!important}
  .cc-page{box-shadow:none!important;margin:0!important;border-radius:0!important;width:210mm!important;height:297mm!important;transform:none!important;padding:12mm!important;overflow:hidden!important}
  .cr-overlay{display:block!important;position:static!important;background:none!important;padding:0!important}
  .cr-overlay *{display:revert}
  .cr-toolbar{display:none!important}
  .cr-page{box-shadow:none!important;margin:0!important;border-radius:0!important;width:210mm!important;min-height:297mm!important;transform:none!important;padding:12mm!important;overflow:visible!important;page-break-after:always}
  @page{size:A4;margin:0}
}

/* Comp Resume Preview */
.cr-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:flex-start;justify-content:center;animation:fadeIn .2s;overflow:auto;padding:80px 20px 40px}
.cr-toolbar{position:fixed;top:0;left:0;right:0;z-index:10000;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(0,0,0,.8);backdrop-filter:blur(12px)}
.cr-toolbar span{color:#fff;font-size:14px;font-weight:600}
.cr-toolbar .cr-actions{display:flex;gap:8px;align-items:center}
.cr-toolbar .cr-actions button{padding:7px 16px;border-radius:8px;border:none;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);display:flex;align-items:center;gap:5px}
.cr-zoom{display:flex;align-items:center;gap:6px;margin-right:12px}
.cr-zoom button{width:28px;height:28px;border-radius:6px;border:none;background:rgba(255,255,255,.15);color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.cr-zoom span{color:#fff;font-size:11px;font-weight:600;min-width:36px;text-align:center}
.cr-page{width:794px;min-height:1123px;background:#fff;border-radius:4px;box-shadow:0 20px 80px rgba(0,0,0,.3);padding:36px 40px;box-sizing:border-box;color:#1a1a2e;font-family:var(--sans);position:relative;transform-origin:top center;transition:transform .2s ease;display:flex;flex-direction:column}
.cr-page *{color:#1a1a2e}
.cr-header{display:flex;gap:24px;margin-bottom:16px;align-items:flex-start;padding-bottom:16px;border-bottom:2px solid #604DFF}
.cr-photo{width:120px;height:150px;border-radius:8px;object-fit:cover;flex-shrink:0;border:2px solid #eee}
.cr-info{flex:1;display:flex;flex-direction:column;gap:2px}
.cr-info h1{font-size:24px;font-weight:800;margin:0;letter-spacing:-.02em}
.cr-info h1 span{color:#604DFF}
.cr-info .cr-discipline{font-size:13px;color:#666;font-weight:500}
.cr-info .cr-pronouns{font-size:11px;color:#888;font-weight:500}
.cr-info .cr-contact{display:flex;flex-wrap:wrap;gap:12px;font-size:11px;color:#666;margin-top:6px}
.cr-info .cr-contact span{display:flex;align-items:center;gap:4px}
.cr-info .cr-bio{font-size:11px;color:#444;line-height:1.6;margin-top:8px}
.cr-qr-block{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px}
.cr-qr-block img{width:72px;height:72px;border-radius:4px}
.cr-qr-block .cr-qr-url{font-size:9px;color:#888;text-align:center}
.cr-section{margin-bottom:12px}
.cr-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#604DFF;margin-bottom:6px;padding-bottom:3px;border-bottom:1px solid #eee}
.cr-entry{margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f8f8f8}
.cr-entry:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.cr-entry-header{display:flex;justify-content:space-between;align-items:baseline}
.cr-entry-title{font-size:12px;font-weight:700;color:#1a1a2e}
.cr-entry-dates{font-size:10px;color:#888;font-weight:500;white-space:nowrap}
.cr-entry-org{font-size:11px;color:#604DFF;font-weight:600}
.cr-entry-location{font-size:10px;color:#888;margin-top:1px}
.cr-entry-desc{font-size:10px;color:#444;line-height:1.5;margin-top:3px}
.cr-entry-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.cr-entry-tags span{padding:2px 8px;border-radius:20px;background:#f5f5f5;font-size:9px;font-weight:500;color:#666}
.cr-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid #eee}
.cr-footer .cr-footer-text{font-size:9px;color:#888}
.cr-footer img{height:20px;opacity:.6}

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
.pfl-content{max-width:900px;margin:0 auto;padding:32px 24px 48px}
.pfl-footer{position:fixed;bottom:0;left:0;right:0;z-index:8;padding:8px 0;display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(var(--bg-rgb,255,255,255),.45);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(0,0,0,.03)}
.pfl-footer img{height:36px;opacity:.85}
.pfl-footer a{color:var(--g5);font-weight:600;text-decoration:none;font-size:11px;letter-spacing:.01em}
.dark .pfl-topbar{background:rgba(18,18,22,.85)}
.dark .pfl-footer{background:rgba(18,18,22,.4)}

/* ━━━ Public Profile ━━━ */
.pp-overlay{position:fixed;inset:0;z-index:500;background:var(--bg);overflow-y:auto;animation:fadeIn .3s ease}
.pp-topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(var(--bg-rgb,255,255,255),.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.pp-topbar-left{display:flex;align-items:center;gap:10px}
.pp-topbar-left img{height:20px}
.pp-topbar-left span{font-size:12px;color:var(--g4);font-weight:500}
.pp-topbar-actions{display:flex;align-items:center;gap:8px}
.pp-topbar-actions button{padding:6px 16px;border-radius:40px;font-size:12px;font-weight:600;font-family:var(--sans);cursor:pointer;transition:all .15s}
.dark .pp-topbar{background:rgba(18,18,22,.7)}
.pp-hero{position:relative;width:100%;height:340px;overflow:hidden}
.pp-hero-banner{width:100%;height:100%;object-fit:cover}
.pp-hero-gradient{position:absolute;inset:0;background:linear-gradient(transparent 30%,rgba(0,0,0,.6))}
.pp-hero-content{position:absolute;bottom:0;left:0;right:0;padding:40px;display:flex;align-items:flex-end;gap:24px}
.pp-avatar{width:110px;height:110px;border-radius:50%;border:4px solid #fff;box-shadow:0 4px 20px rgba(0,0,0,.2);overflow:hidden;flex-shrink:0}
.pp-avatar img{width:100%;height:100%;object-fit:cover}
.pp-hero-info{flex:1;min-width:0;color:#fff;padding-bottom:4px}
.pp-hero-name{font-family:var(--serif);font-size:36px;font-weight:400;line-height:1.1;margin-bottom:4px}
.pp-hero-name em{font-style:italic;color:rgba(255,255,255,.85)}
.pp-hero-handle{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:8px}
.pp-hero-bio{font-size:14px;color:rgba(255,255,255,.85);line-height:1.5;max-width:520px}
.pp-hero-tags{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.pp-hero-tags span{padding:4px 12px;border-radius:40px;font-size:11px;font-weight:600;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);color:#fff}
.pp-hero-socials{display:flex;gap:8px;margin-top:12px}
.pp-hero-socials a{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;transition:all .2s;text-decoration:none;font-size:14px}
.pp-hero-socials a:hover{background:rgba(255,255,255,.3);transform:scale(1.1)}
.pp-body{max-width:900px;margin:0 auto;padding:32px 24px 80px}
.pp-section{margin-bottom:40px;animation:slideInUp .4s ease both}
.pp-section-title{font-family:var(--serif);font-size:22px;font-weight:400;color:var(--tx);margin-bottom:16px;display:flex;align-items:center;gap:10px}
.pp-section-title em{color:var(--ac);font-style:italic}
.pp-featured-video{position:relative;width:100%;border-radius:20px;overflow:hidden;cursor:pointer;aspect-ratio:16/7;background:#000}
.pp-featured-video img{width:100%;height:100%;object-fit:cover;opacity:.85;transition:opacity .3s}
.pp-featured-video:hover img{opacity:.7}
.pp-featured-video .pp-fv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;transition:all .3s}
.pp-featured-video .pp-fv-play::after{content:'';border-left:22px solid #fff;border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:4px}
.pp-featured-video:hover .pp-fv-play{background:rgba(96,77,255,.8);transform:translate(-50%,-50%) scale(1.1)}
.pp-featured-video .pp-fv-info{position:absolute;bottom:20px;left:20px;color:#fff}
.pp-featured-video .pp-fv-badge{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:4px 10px;border-radius:40px;background:rgba(96,77,255,.8);margin-bottom:6px;display:inline-block}
.pp-featured-video .pp-fv-title{font-size:18px;font-weight:600}
.pp-featured-video .pp-fv-dur{font-size:12px;opacity:.7;margin-top:2px}
.pp-portfolio-card{position:relative;border-radius:20px;overflow:hidden;cursor:pointer;aspect-ratio:16/8;background:#000;transition:all .3s}
.pp-portfolio-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(96,77,255,.15)}
.pp-portfolio-card img{width:100%;height:100%;object-fit:cover;opacity:.75;transition:opacity .3s}
.pp-portfolio-card:hover img{opacity:.6}
.pp-portfolio-card .pp-pc-overlay{position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.7));display:flex;flex-direction:column;justify-content:flex-end;padding:28px}
.pp-portfolio-card .pp-pc-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.6);margin-bottom:6px}
.pp-portfolio-card .pp-pc-name{font-family:var(--serif);font-size:26px;color:#fff;font-weight:400;line-height:1.2}
.pp-portfolio-card .pp-pc-name em{font-style:italic;color:rgba(255,255,255,.8)}
.pp-portfolio-card .pp-pc-meta{font-size:12px;color:rgba(255,255,255,.6);margin-top:6px;display:flex;gap:12px}
.pp-portfolio-card .pp-pc-arrow{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;opacity:0;transition:all .3s;font-size:16px}
.pp-portfolio-card:hover .pp-pc-arrow{opacity:1}
.pp-portfolio-card.expanded{border-radius:20px 20px 0 0}
.pp-pf-expanded{background:var(--sf);border:1px solid var(--g2);border-top:none;border-radius:0 0 20px 20px;padding:28px;animation:slideInUp .3s ease both}
.pp-pf-expanded h4{font-family:var(--serif);font-size:18px;font-weight:400;color:var(--tx);margin:0 0 14px}
.pp-pf-expanded h4 em{color:var(--ac);font-style:italic}
.pp-pf-section{margin-bottom:28px}
.pp-pf-section:last-child{margin-bottom:0}
.pp-pf-photos{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pp-pf-photos .pp-pfp-item{border-radius:12px;overflow:hidden;aspect-ratio:1;cursor:pointer;transition:all .2s}
.pp-pf-photos .pp-pfp-item:hover{transform:scale(1.03)}
.pp-pf-photos .pp-pfp-item img{width:100%;height:100%;object-fit:cover}
.pp-pf-videos{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.pp-pf-vid{border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid var(--g2);transition:all .2s}
.pp-pf-vid:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(96,77,255,.08)}
.pp-pf-vid .pp-pfv-thumb{aspect-ratio:16/9;overflow:hidden;position:relative;background:#000}
.pp-pf-vid .pp-pfv-thumb img{width:100%;height:100%;object-fit:cover;opacity:.85}
.pp-pf-vid .pp-pfv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center}
.pp-pf-vid .pp-pfv-play::after{content:'';border-left:12px solid #fff;border-top:7px solid transparent;border-bottom:7px solid transparent;margin-left:2px}
.pp-pf-vid .pp-pfv-info{padding:10px 12px}
.pp-pf-vid .pp-pfv-title{font-size:13px;font-weight:600;color:var(--tx)}
.pp-pf-vid .pp-pfv-dur{font-size:11px;color:var(--g4);margin-top:2px}
.pp-pf-refs{display:flex;flex-direction:column;gap:12px}
.pp-pf-ref{padding:16px;border:1px solid var(--g2);border-radius:14px;background:var(--bg)}
.pp-pf-ref-quote{font-size:13px;color:var(--g5);line-height:1.6;font-style:italic;margin-bottom:8px}
.pp-pf-ref-source{font-size:11px;font-weight:600;color:var(--tx)}
.pp-pf-ref-context{font-size:10px;color:var(--g4);margin-top:2px}
@media(max-width:768px){
  .pp-pf-photos{grid-template-columns:repeat(3,1fr)}
  .pp-pf-videos{grid-template-columns:1fr 1fr}
}
.pp-gallery-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.pp-gallery-strip .pp-gal-item{border-radius:14px;overflow:hidden;aspect-ratio:1;cursor:pointer;transition:all .3s}
.pp-gallery-strip .pp-gal-item:hover{transform:scale(1.02);box-shadow:0 4px 20px rgba(0,0,0,.1)}
.pp-gallery-strip .pp-gal-item img{width:100%;height:100%;object-fit:cover}
.pp-about{display:grid;grid-template-columns:1.5fr 1fr;gap:24px}
.pp-about-bio{font-size:14px;color:var(--g5);line-height:1.8}
.pp-about-stats{display:flex;flex-direction:column;gap:10px}
.pp-about-stat{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--g1)}
.pp-about-stat .pp-as-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--g4)}
.pp-about-stat .pp-as-value{font-size:13px;font-weight:500;color:var(--tx)}
.pp-resume-highlights{display:flex;flex-direction:column;gap:12px}
.pp-resume-item{display:flex;align-items:flex-start;gap:14px;padding:14px;border:1px solid var(--g2);border-radius:14px;background:var(--sf)}
.pp-resume-item .pp-ri-emoji{font-size:20px;flex-shrink:0;margin-top:2px}
.pp-resume-item .pp-ri-title{font-size:14px;font-weight:600;color:var(--tx)}
.pp-resume-item .pp-ri-org{font-size:12px;color:var(--ac);margin-top:1px}
.pp-resume-item .pp-ri-meta{font-size:11px;color:var(--g4);margin-top:3px}
@media(max-width:768px){
  .pp-hero{height:280px}
  .pp-hero-content{padding:20px;gap:16px;flex-direction:column;align-items:flex-start}
  .pp-avatar{width:80px;height:80px;margin-top:-40px}
  .pp-hero-name{font-size:26px}
  .pp-body{padding:20px 16px 80px}
  .pp-about{grid-template-columns:1fr}
  .pp-gallery-strip{grid-template-columns:repeat(2,1fr)}
  .pp-portfolio-card{aspect-ratio:16/10}
  .pp-portfolio-card .pp-pc-name{font-size:20px}
  .pp-featured-video{aspect-ratio:16/9}
}

/* Lightbox */
.pfl-lightbox{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s;cursor:zoom-out}
.pfl-lightbox img,.pfl-lightbox video{max-width:90vw;max-height:85vh;border-radius:8px;object-fit:contain;animation:pflSlideUp .3s ease}
.pfl-lightbox .pfl-lb-close{position:absolute;top:16px;right:20px;background:rgba(255,255,255,.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.pfl-lightbox .pfl-lb-close:hover{background:rgba(255,255,255,.2)}
.pfl-lightbox .pfl-lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:none;color:#fff;width:40px;height:40px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.pfl-lightbox .pfl-lb-nav:hover{background:rgba(255,255,255,.2)}
.pfl-lightbox .pfl-lb-nav.prev{left:16px}
.pfl-lightbox .pfl-lb-nav.next{right:16px}
.pfl-lightbox .pfl-lb-caption{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.7);font-size:12px;font-weight:500}

/* Hero with banner image */
.pfp-hero.has-cover{background-size:cover;background-position:center}
.pfp-hero.has-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,10,30,.88),rgba(22,33,62,.75),rgba(15,52,96,.65));border-radius:inherit}
.pfp-hero.has-cover>*{position:relative;z-index:1}
.pfl-content .pfp-hero{min-height:320px}

/* Live view scroll animations */
@keyframes pflSlideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.pfl-anim{opacity:0;transform:translateY(24px)}
.pfl-anim.visible{animation:pflSlideUp .6s ease both}

/* Live view overrides — all Lanced purple, no emerald */
.pfl-content .pfe-resume-item .pfe-ri-icon.exp,.pfl-content .pfe-resume-item .pfe-ri-icon.edu{background:rgba(96,77,255,.1);color:var(--ac)}
.pfl-content .pfe-ref-card .pfe-ref-type.reference{background:rgba(96,77,255,.1);color:var(--ac)}
.pfl-content .pfp-tab.active{color:var(--ac);border-color:var(--ac)}

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
.feedback-tab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:999;writing-mode:vertical-rl;text-orientation:mixed}
.feedback-tab a{display:flex;align-items:center;gap:8px;background:#604DFF;color:#fff;padding:14px 10px;border-radius:12px 0 0 12px;font-size:13px;font-weight:700;letter-spacing:.5px;text-decoration:none;box-shadow:-4px 0 20px rgba(96,77,255,.35);transition:all .2s ease;cursor:pointer}
.feedback-tab a:hover{padding-right:14px;background:#5040e0;box-shadow:-6px 0 28px rgba(96,77,255,.5)}
.feedback-tab a svg{width:16px;height:16px;flex-shrink:0}
@media(max-width:768px){.feedback-tab a{font-size:11px;padding:10px 8px}.feedback-tab a svg{width:14px;height:14px}}

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
.plan-section{display:grid;grid-template-columns:1.2fr 1fr;gap:16px;margin-bottom:16px;animation:slideInUp .3s ease both;animation-delay:.15s}
.plan-section-left{min-width:0}
.plan-section-right{display:flex;flex-direction:column;min-width:0}
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
.mobile-nav button{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:9px;font-weight:500;color:var(--g4);padding:6px 8px;border-radius:12px;transition:all .15s}
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

/* Mobile Side Panel */
.mob-panel-overlay{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.35);animation:fadeIn .15s;display:none}
.mob-panel-overlay.open{display:block}
.mob-panel{position:fixed;top:0;right:-280px;bottom:0;width:280px;background:var(--sf);z-index:301;transition:right .25s cubic-bezier(.4,0,.2,1);box-shadow:-4px 0 24px rgba(0,0,0,.12);display:flex;flex-direction:column;padding:0}
.mob-panel.open{right:0}
.dark .mob-panel{background:var(--bg);box-shadow:-4px 0 24px rgba(0,0,0,.3)}
.mob-panel-header{display:flex;align-items:center;gap:12px;padding:20px 20px 16px;border-bottom:1px solid var(--g1)}
.mob-panel-header img{width:44px;height:44px;border-radius:50%;object-fit:cover}
.mob-panel-header .mp-name{font-size:15px;font-weight:600;color:var(--tx)}
.mob-panel-header .mp-plan{font-size:11px;color:var(--g4);margin-top:1px}
.mob-panel-close{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--g4);cursor:pointer;padding:4px;border-radius:8px}
.mob-panel-close:hover{background:var(--g1)}
.mob-panel-nav{flex:1;overflow-y:auto;padding:12px 10px}
.mob-panel-nav button{display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border:none;background:none;font-family:var(--sans);font-size:13px;font-weight:500;color:var(--tx);border-radius:12px;cursor:pointer;transition:all .12s}
.mob-panel-nav button:hover{background:var(--g1)}
.mob-panel-nav button.active{color:var(--ac);background:rgba(96,77,255,.08)}
.mob-panel-nav button svg{width:18px;height:18px;flex-shrink:0}
.mob-panel-nav .mp-badge{background:var(--er);color:#fff;font-size:9px;font-weight:700;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-left:auto;padding:0 5px}
.mob-panel-nav .mp-divider{height:1px;background:var(--g1);margin:8px 14px}
.mob-panel-footer{padding:16px 20px;border-top:1px solid var(--g1);display:flex;align-items:center;gap:8px}
.mob-panel-footer button{display:flex;align-items:center;gap:8px;background:none;border:none;font-family:var(--sans);font-size:12px;color:var(--g4);cursor:pointer;padding:6px 10px;border-radius:8px;transition:all .12s}
.mob-panel-footer button:hover{background:var(--g1);color:var(--tx)}

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
  .plan-section{grid-template-columns:1fr}
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
  .app-toolbar{margin:0 -16px;padding-left:16px;padding-right:16px;overflow-x:auto;gap:6px;flex-wrap:nowrap}
  .app-toolbar .at-filters{overflow-x:auto;flex-shrink:1;min-width:0;gap:4px}
  .app-toolbar .at-filters .chip{font-size:11px;padding:5px 10px;white-space:nowrap}
  .app-toolbar .at-search-expanded{min-width:140px}
  .app-tiles{grid-template-columns:1fr}
  .app-card{flex-direction:column;align-items:flex-start;gap:10px;padding:14px}
  .app-card .ac-status{align-self:flex-start}
  .app-card .ac-archive{opacity:1}
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
  .network-cards{grid-template-columns:1fr}
  .network-map{height:300px}
  .pf-details-grid{grid-template-columns:1fr!important}
  .pf-name-row{grid-template-columns:1fr 1fr!important}
  .pf-general-grid{grid-template-columns:1fr!important}
}
@media(max-width:480px){
  .dash-stats{grid-template-columns:1fr 1fr}
  .stat-card .sc-val{font-size:20px}
  .pg-header h1{font-size:22px}
  .content{padding:16px 12px}
  .spotlight-hero{height:160px;border-radius:12px}
}

/* ━━━ STUDIO ━━━ */
.studio-live-banner{display:flex;align-items:center;padding:12px 16px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:12px;margin-bottom:20px;font-size:13px;color:var(--tx)}
.studio-gallery-header{margin-bottom:16px}
.studio-gallery-header h3{font-size:18px;font-weight:700;margin:0}
.studio-theme-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.studio-gallery-card{border:1px solid var(--g2);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .2s}
.studio-gallery-card:hover{border-color:var(--g3);box-shadow:0 4px 20px rgba(0,0,0,.06)}
.studio-gallery-card.active{border-color:var(--ac);box-shadow:0 0 0 2px var(--ac)}
.studio-gallery-card.locked{opacity:.7}
.studio-gallery-preview{height:180px;background-size:cover;background-position:center;position:relative;display:flex;align-items:flex-end;justify-content:center;padding:16px}
.studio-gallery-overlay{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s}
.studio-gallery-card:hover .studio-gallery-overlay{opacity:1}
.studio-gallery-active{position:absolute;top:10px;left:10px;background:var(--ac);color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px}
.studio-gallery-info{padding:12px 14px}
.studio-gallery-name{display:block;font-size:14px;font-weight:700;color:var(--tx)}
.studio-gallery-desc{display:block;font-size:12px;color:var(--g4);margin-top:2px}

/* Studio Builder */
.studio-builder{position:fixed;inset:0;z-index:500;background:var(--bg);display:flex;flex-direction:column}
.studio-builder-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--g2);background:var(--sf);gap:12px;flex-shrink:0}
.studio-builder-topbar-left,.studio-builder-topbar-right{display:flex;align-items:center;gap:8px}
.studio-builder-theme-name{font-size:13px;font-weight:600;color:var(--tx)}
.studio-builder-devices{display:flex;align-items:center;gap:2px;background:var(--g1);border-radius:8px;padding:2px}
.studio-device-btn{padding:6px 10px;border:none;background:transparent;color:var(--g4);cursor:pointer;border-radius:6px;display:flex;align-items:center;transition:all .15s}
.studio-device-btn.active{background:var(--sf);color:var(--tx);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.studio-builder-body{display:grid;grid-template-columns:320px 1fr;flex:1;min-height:0;overflow:hidden}
.studio-panel{display:flex;flex-direction:column;border-right:1px solid var(--g2);background:var(--sf);overflow:hidden}
.studio-panel-tabs{display:flex;border-bottom:1px solid var(--g2);flex-shrink:0}
.studio-panel-tab{flex:1;padding:10px 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--g4);background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .15s}
.studio-panel-tab.active{color:var(--ac);border-bottom-color:var(--ac)}
.studio-panel-content{flex:1;overflow-y:auto;padding:16px}

/* Theme selector in panel */
.studio-theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.studio-theme-card{border:1px solid var(--g2);border-radius:10px;overflow:hidden;cursor:pointer;transition:all .2s}
.studio-theme-card.active{border-color:var(--ac);box-shadow:0 0 0 2px var(--ac)}
.studio-theme-card.locked{opacity:.6;cursor:not-allowed}
.studio-theme-preview{height:80px;background-size:cover;background-position:center;position:relative}
.studio-theme-lock{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.6);color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px}
.studio-theme-active{position:absolute;top:6px;left:6px;background:var(--ac);color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px}
.studio-theme-info{padding:8px 10px}
.studio-theme-name{display:block;font-size:12px;font-weight:700;color:var(--tx)}
.studio-theme-desc{display:block;font-size:10px;color:var(--g4);margin-top:1px}

/* Content sub-tab */
.studio-content-section h4{font-size:14px;font-weight:700;margin:0 0 4px;color:var(--tx)}
.studio-content-hint{font-size:12px;color:var(--g4);margin:0 0 12px}
.studio-content-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--g2);border-radius:10px;margin-bottom:8px;transition:all .15s}
.studio-content-row.selected{border-color:var(--g3);background:var(--bg)}
.studio-content-info{flex:1;min-width:0}
.studio-content-name{display:block;font-size:13px;font-weight:600;color:var(--tx)}
.studio-content-meta{display:block;font-size:11px;color:var(--g4);margin-top:1px}
.studio-featured-btn{padding:4px 10px;border:1px solid var(--g3);border-radius:8px;background:transparent;font-size:11px;font-weight:600;color:var(--g4);cursor:pointer;transition:all .15s;white-space:nowrap}
.studio-featured-btn.active{border-color:var(--ac);color:var(--ac);background:rgba(96,77,255,.05)}

/* Layout sub-tab */
.studio-section-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--g2);border-radius:10px;margin-bottom:6px}
.studio-section-drag{color:var(--g3);cursor:grab;display:flex;align-items:center}
.studio-section-label{font-size:13px;font-weight:600;color:var(--tx)}
.studio-section-move{width:24px;height:24px;border:1px solid var(--g2);border-radius:6px;background:var(--sf);color:var(--g4);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.studio-section-move:hover{background:var(--g1);color:var(--tx)}

/* Brand sub-tab */
.studio-color-swatches{display:flex;gap:8px;flex-wrap:wrap}
.studio-swatch{width:32px;height:32px;border-radius:50%;cursor:pointer;transition:transform .15s;border:2px solid transparent}
.studio-swatch:hover{transform:scale(1.15)}
.studio-swatch.active{box-shadow:0 0 0 3px var(--bg),0 0 0 5px var(--ac)}
.studio-font-pair{padding:10px 14px;border:1px solid var(--g2);border-radius:10px;margin-bottom:6px;cursor:pointer;display:flex;flex-direction:column;gap:2px;transition:all .15s}
.studio-font-pair.active{border-color:var(--ac);background:rgba(96,77,255,.04)}
.studio-font-pair:hover{border-color:var(--g3)}

/* Preview area */
.studio-preview-area{background:#1a1a1a;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px}
.studio-preview-frame{background:#0a0a0a;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.3);transition:width .3s ease;width:100%;height:100%;overflow-y:auto;scroll-behavior:smooth}
.studio-preview-desktop{width:100%;border-radius:0}
.studio-preview-tablet{width:768px;max-width:100%;border-radius:12px;margin:0 auto}
.studio-preview-mobile{width:375px;max-width:100%;border-radius:24px;margin:0 auto;border:4px solid #333}

/* Full preview mode */
.studio-preview-full{position:fixed;inset:0;z-index:600;background:#0a0a0a;display:flex;flex-direction:column}
.studio-preview-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:rgba(10,10,10,.95);border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;z-index:10}
.studio-preview-viewport{flex:1;overflow:auto}

/* ━━━ NOIR THEME ━━━ */
.noir-theme{background:#0a0a0a;color:#fff;font-family:'Inter',system-ui,-apple-system,sans-serif;overflow:visible;position:relative}
.noir-theme *{box-sizing:border-box}

/* Noir fixed bottom blur overlay */
.noir-blur-overlay{position:fixed;bottom:0;left:0;right:0;height:180px;z-index:90;pointer-events:none;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.15) 30%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.85) 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.15) 30%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.85) 100%)}

/* Noir custom cursor */
.noir-theme{cursor:none}
.noir-cursor{position:fixed;width:28px;height:28px;border-radius:50%;background:#fff;mix-blend-mode:difference;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .15s,height .15s}

/* Noir Nav */
.noir-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:20px 32px;transition:padding .4s cubic-bezier(.4,0,.2,1);background:transparent;mix-blend-mode:difference}
.noir-nav-compact{padding:16px 32px}
.noir-nav-name{font-size:14px;font-weight:900;letter-spacing:3px;text-transform:uppercase;font-family:'Inter',system-ui,sans-serif}
.noir-nav-links{display:flex;gap:28px;font-size:11px;font-weight:500;letter-spacing:2px;color:#fff}
.noir-nav-spread{width:100%;justify-content:space-between;gap:40px;font-size:14px;font-weight:500;letter-spacing:3px}
.noir-nav-links span{cursor:pointer;transition:opacity .2s;opacity:.7}
.noir-nav-links span:hover{opacity:1}

/* Noir Hero */
.noir-hero{position:relative;padding:0 32px;margin-bottom:0;overflow:hidden;height:95vh;min-height:600px}
.noir-hero-name-wrap{position:absolute;top:50%;left:32px;right:32px;transform:translateY(-50%);z-index:5;mix-blend-mode:difference;pointer-events:none;will-change:opacity}
.noir-hero-name{display:flex;flex-direction:column;line-height:.86;font-weight:900;letter-spacing:-0.04em;user-select:none;will-change:transform;transform-origin:center center;align-items:center;text-align:center}
.noir-hero-first,.noir-hero-last{display:block;font-size:clamp(80px,16vw,200px);text-transform:uppercase;white-space:nowrap;overflow:visible;color:#fff}
.noir-hero-grid{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:16px;position:absolute;top:8%;left:32px;right:32px;bottom:0;z-index:2;will-change:transform;align-items:start}
.noir-hero-img{border-radius:12px;overflow:hidden;aspect-ratio:3/4;position:relative}
.noir-hero-img img{width:100%;height:100%;object-fit:cover;filter:saturate(1.25) contrast(1.08) brightness(1.05)}
.noir-hero-img:hover img{transform:scale(1.04);transition:transform .6s ease}
.noir-hero-img-center{aspect-ratio:3/4.5;z-index:3;margin-top:-24px}
.noir-hero-gradient{position:absolute;bottom:0;left:0;right:0;height:250px;background:linear-gradient(transparent,#0a0a0a);z-index:6;pointer-events:none}

/* Noir scroll-driven reveal animations */
@keyframes noirRevealUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
@keyframes noirRevealScale{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes noirRevealLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
@keyframes noirRevealRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes noirTitleSlide{from{opacity:0;transform:translateY(30px) skewY(2deg)}to{opacity:1;transform:translateY(0) skewY(0)}}
.noir-reveal{opacity:0;transform:translateY(60px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.noir-reveal.revealed{opacity:1;transform:translateY(0)}
.noir-reveal-left{opacity:0;transform:translateX(-40px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
.noir-reveal-left.revealed{opacity:1;transform:translateX(0)}
.noir-reveal-right{opacity:0;transform:translateX(40px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
.noir-reveal-right.revealed{opacity:1;transform:translateX(0)}
.noir-reveal-scale{opacity:0;transform:scale(.92);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
.noir-reveal-scale.revealed{opacity:1;transform:scale(1)}
.noir-stagger-1{transition-delay:.1s}
.noir-stagger-2{transition-delay:.2s}
.noir-stagger-3{transition-delay:.3s}
.noir-stagger-4{transition-delay:.4s}
.noir-stagger-5{transition-delay:.5s}
.noir-stagger-6{transition-delay:.6s}

/* Noir parallax title overlays */
.noir-parallax-title{font-size:clamp(60px,12vw,160px);font-weight:900;line-height:.85;letter-spacing:-0.04em;text-transform:uppercase;color:rgba(255,255,255,.04);pointer-events:none;will-change:transform;position:absolute;white-space:nowrap}
.noir-parallax-title-left{left:-20px;top:0}
.noir-parallax-title-right{right:-20px;bottom:0;text-align:right}

/* Noir About */
.noir-about{padding:80px 32px}
.noir-about-split{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-bottom:60px;align-items:start}
.noir-about-left svg{color:rgba(255,255,255,.3);margin-bottom:20px}
.noir-about-headline{font-size:clamp(24px,3.5vw,42px);font-weight:800;line-height:1.1;letter-spacing:-0.02em;margin:0;text-transform:uppercase}
.noir-about-right{padding-top:20px}
.noir-available{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:1.5px;color:rgba(255,255,255,.7);margin-bottom:16px}
.noir-avail-dot{width:8px;height:8px;border-radius:50%;background:#10b981;flex-shrink:0;animation:noirPulse 2s ease infinite}
@keyframes noirPulse{0%,100%{opacity:1}50%{opacity:.4}}
.noir-about-body{font-size:13px;line-height:1.7;color:rgba(255,255,255,.6);margin:0}
.noir-about-portrait{position:relative;border-radius:14px;overflow:hidden;max-height:85vh}
.noir-about-portrait img{width:100%;height:100%;object-fit:cover;display:block}
.noir-about-overlay{position:absolute;bottom:0;left:0;right:0;padding:40px 32px;background:linear-gradient(transparent,rgba(0,0,0,.8))}
.noir-about-quote{font-size:13px;line-height:1.7;color:rgba(255,255,255,.8);text-align:center;text-transform:uppercase;letter-spacing:.5px;margin:0 0 16px}
.noir-about-link{display:block;text-align:center;font-size:12px;font-weight:600;letter-spacing:2px;color:#fff;text-decoration:underline;text-underline-offset:4px;cursor:pointer}

/* Noir Gallery / Explore */
.noir-gallery{padding:80px 0;position:relative;overflow:hidden}
.noir-section-title{font-size:clamp(32px,6vw,64px);font-weight:900;line-height:1;letter-spacing:-0.03em;text-transform:uppercase;margin:0 0 40px}
.noir-gallery-header{padding:0 32px;margin-bottom:40px}
.noir-gallery-cta{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#fff;cursor:pointer;margin-top:16px;transition:gap .3s}
.noir-gallery-cta:hover{gap:14px}
.noir-gallery-cta svg{width:14px;height:14px}
/* Auto-scrolling marquee rows */
.noir-marquee-row{display:flex;gap:16px;overflow:hidden;margin-bottom:16px;width:100%;position:relative}
.noir-marquee-row::before,.noir-marquee-row::after{content:'';position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
.noir-marquee-row::before{left:0;background:linear-gradient(to right,#0a0a0a,transparent)}
.noir-marquee-row::after{right:0;background:linear-gradient(to left,#0a0a0a,transparent)}
.noir-marquee-track{display:flex;gap:16px;animation:noirMarqueeLeft 80s linear infinite;flex-shrink:0}
.noir-marquee-row.reverse .noir-marquee-track{animation:noirMarqueeRight 80s linear infinite}
@keyframes noirMarqueeLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes noirMarqueeRight{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.noir-marquee-img{flex-shrink:0;width:360px;height:240px;border-radius:12px;overflow:hidden}
.noir-marquee-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.noir-marquee-img:hover img{transform:scale(1.06)}
/* Builder-only gallery layouts */
.noir-gallery-grid-builder{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 32px}
.noir-gallery-masonry-builder{columns:2;column-gap:16px;padding:0 32px}
.noir-gallery-masonry-builder .noir-gallery-item{break-inside:avoid;margin-bottom:16px;aspect-ratio:auto}
.noir-gallery-masonry-builder .noir-gallery-item:nth-child(odd) img{aspect-ratio:3/4;height:auto}
.noir-gallery-masonry-builder .noir-gallery-item:nth-child(even) img{aspect-ratio:4/5;height:auto}
.noir-gallery-masonry-builder .noir-gallery-item:nth-child(3n) img{aspect-ratio:1/1;height:auto}
.noir-gallery-magazine-builder{display:grid;grid-template-columns:1.6fr 1fr;grid-auto-rows:200px;gap:12px;padding:0 32px}
.noir-gallery-magazine-builder .noir-gallery-item:first-child{grid-row:span 2}
.noir-gallery-magazine-builder .noir-gallery-item:nth-child(4){grid-column:span 2}
.noir-gallery-spread-builder{display:flex;flex-wrap:wrap;gap:20px;justify-content:center;padding:0 32px}
.noir-gallery-spread-builder .noir-gallery-item{flex:0 0 auto;width:42%;border-radius:16px}
.noir-gallery-spread-builder .noir-gallery-item:nth-child(odd){transform:rotate(-1.5deg);margin-top:30px}
.noir-gallery-spread-builder .noir-gallery-item:nth-child(even){transform:rotate(1.5deg);margin-top:-10px}
.noir-gallery-item{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:4/3;cursor:none}
.noir-gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.noir-gallery-item:hover img{transform:scale(1.05)}
.noir-gallery-hover{position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s}
.noir-gallery-hover svg{width:40px;height:40px;padding:8px;background:rgba(255,255,255,.15);border-radius:50%;color:#fff}
.noir-gallery-item:hover .noir-gallery-hover{opacity:1}
.noir-gallery-caption{position:absolute;bottom:12px;left:14px;font-size:11px;color:rgba(255,255,255,.7);letter-spacing:.5px}

/* Noir Testimonials */
.noir-testimonials{position:relative;min-height:80vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
.noir-testimonials-bg{position:absolute;inset:0;z-index:1}
.noir-testimonials-bg img{width:100%;height:100%;object-fit:cover}
.noir-testimonials-card{position:relative;z-index:2;background:rgba(255,255,255,.08);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:48px 40px;max-width:540px;width:90%;text-align:center}
.noir-testimonials-quote{font-size:clamp(13px,1.6vw,16px);line-height:1.7;color:#fff;text-transform:uppercase;letter-spacing:.5px;font-weight:500;margin:0 0 24px}
.noir-testimonials-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);margin:0 auto 20px}
.noir-testimonials-name{font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;margin-bottom:4px}
.noir-testimonials-role{font-size:11px;letter-spacing:1.5px;color:rgba(255,255,255,.5);text-transform:uppercase}
.noir-testimonials-arrows{display:flex;gap:8px;justify-content:center;margin-top:32px}
.noir-testimonials-arrows button{width:40px;height:40px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:16px}
.noir-testimonials-arrows button:hover{background:rgba(255,255,255,.1)}

/* Noir Portfolios */
.noir-portfolios{padding:80px 32px;border-top:1px solid rgba(255,255,255,.06);position:relative;overflow:hidden}
.noir-portfolios-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.noir-portfolio-card{border:1px solid rgba(255,255,255,.06);border-radius:14px;overflow:hidden;background:rgba(255,255,255,.02);transition:all .5s cubic-bezier(.16,1,.3,1)}
.noir-portfolio-card:hover{border-color:rgba(255,255,255,.12);transform:translateY(-6px)}
.noir-portfolio-card.featured{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.04)}
.noir-pf-cover{aspect-ratio:16/9;overflow:hidden}
.noir-pf-cover img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.noir-portfolio-card:hover .noir-pf-cover img{transform:scale(1.04)}
.noir-pf-info{padding:20px 22px}
.noir-pf-badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#fff;background:rgba(255,255,255,.1);padding:3px 10px;border-radius:20px;margin-bottom:8px}
.noir-pf-info h3{font-size:18px;font-weight:700;margin:0 0 6px;text-transform:uppercase;letter-spacing:-.01em}
.noir-pf-info p{font-size:13px;line-height:1.6;color:rgba(255,255,255,.5);margin:0 0 12px}
.noir-pf-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.noir-pf-tags span{font-size:10px;letter-spacing:.5px;color:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.08);padding:3px 10px;border-radius:20px}
.noir-pf-stats{display:flex;gap:16px;font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.5px}

/* Noir Featured Work */
.noir-featured-work{padding:80px 32px;border-top:1px solid rgba(255,255,255,.06)}
.noir-fw-label{font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:12px}
.noir-fw-title{font-size:clamp(36px,5vw,72px);font-weight:900;line-height:1;letter-spacing:-0.03em;margin:0 0 12px;text-transform:uppercase}
.noir-fw-tagline{font-size:16px;color:rgba(255,255,255,.5);font-style:italic;margin:0 0 32px}
.noir-fw-cover{border-radius:14px;overflow:hidden;margin-bottom:32px;aspect-ratio:16/7}
.noir-fw-cover img{width:100%;height:100%;object-fit:cover}
.noir-fw-meta{display:flex;gap:20px;font-size:12px;letter-spacing:1px;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:20px}
.noir-fw-desc{font-size:14px;line-height:1.7;color:rgba(255,255,255,.6);max-width:640px;margin:0 0 40px}
.noir-fw-reviews{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px}
.noir-fw-quote{margin:0;padding:24px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.02)}
.noir-fw-quote p{font-size:14px;line-height:1.6;color:rgba(255,255,255,.7);margin:0 0 12px;font-style:italic}
.noir-fw-quote cite{font-size:11px;color:rgba(255,255,255,.4);font-style:normal;letter-spacing:.5px}
.noir-fw-performances h3{font-size:12px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,.4);margin:0 0 16px}
.noir-fw-perf{display:flex;gap:20px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px;color:rgba(255,255,255,.6)}
.noir-fw-perf-date{font-weight:600;color:#fff;min-width:120px}

/* Noir Experience */
.noir-experience{padding:80px 32px;border-top:1px solid rgba(255,255,255,.06)}
.noir-exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.noir-exp-card{padding:24px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:rgba(255,255,255,.02);transition:border-color .2s}
.noir-exp-card:hover{border-color:rgba(255,255,255,.12)}
.noir-exp-type{font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,.3);text-transform:uppercase;margin-bottom:10px}
.noir-exp-title{font-size:16px;font-weight:700;margin:0 0 4px}
.noir-exp-org{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:4px}
.noir-exp-period{font-size:11px;color:rgba(255,255,255,.3);margin-bottom:8px}
.noir-exp-desc{font-size:12px;line-height:1.6;color:rgba(255,255,255,.4);margin:0}

/* Noir Works */
.noir-works{padding:80px 32px;border-top:1px solid rgba(255,255,255,.06);position:relative;overflow:hidden}
.noir-works-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.noir-work-card{border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.06);cursor:pointer;transition:all .5s cubic-bezier(.16,1,.3,1)}
.noir-work-card:hover{border-color:rgba(255,255,255,.12);transform:translateY(-6px)}
.noir-work-card img{width:100%;aspect-ratio:16/9;object-fit:cover}
.noir-work-info{padding:16px 18px}
.noir-work-info h3{font-size:16px;font-weight:700;margin:0 0 4px;text-transform:uppercase}
.noir-work-info span{display:block;font-size:12px;color:rgba(255,255,255,.4)}
.noir-work-role{margin-top:2px;font-weight:500;color:rgba(255,255,255,.5)!important}

/* Noir Connect / CTA section */
.noir-connect{padding:100px 32px;border-top:1px solid rgba(255,255,255,.06);display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.noir-connect-left h2{font-size:clamp(36px,6vw,72px);font-weight:900;line-height:.95;letter-spacing:-0.03em;text-transform:uppercase;margin:0 0 20px}
.noir-connect-left p{font-size:14px;line-height:1.7;color:rgba(255,255,255,.45);margin:0 0 32px;max-width:400px}
.noir-connect-cta{display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;text-decoration:none;padding:16px 32px;border:1px solid rgba(255,255,255,.2);border-radius:40px;transition:all .3s}
.noir-connect-cta:hover{background:rgba(255,255,255,.08);gap:16px}
.noir-connect-right{display:flex;flex-direction:column;gap:20px}
.noir-connect-item{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.noir-connect-item-label{font-size:11px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,.35);text-transform:uppercase}
.noir-connect-item-value{font-size:14px;color:rgba(255,255,255,.7);text-align:right}
.noir-connect-item-value a{color:rgba(255,255,255,.7);text-decoration:none;transition:color .2s}
.noir-connect-item-value a:hover{color:#fff}
@media(max-width:768px){.noir-connect{grid-template-columns:1fr;gap:40px}}

/* Noir Footer */
.noir-footer-full{position:relative;overflow:hidden}
.noir-footer-bg{position:absolute;inset:0;z-index:1}
.noir-footer-bg img{width:100%;height:100%;object-fit:cover}
.noir-footer-bg-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,#0a0a0a 0%,rgba(10,10,10,.4) 30%,rgba(10,10,10,.6) 70%,rgba(10,10,10,.85) 100%)}
.noir-footer-content{position:relative;z-index:2;padding:120px 32px 0}
.noir-footer-subtitle{font-size:12px;font-weight:500;letter-spacing:1.5px;line-height:1.7;color:rgba(255,255,255,.6);margin:0 0 40px;text-transform:uppercase}
.noir-footer-mid{display:flex;justify-content:space-between;align-items:flex-start;padding:24px 0;border-top:1px solid rgba(255,255,255,.1)}
.noir-footer-nav{display:flex;gap:24px;font-size:11px;font-weight:500;letter-spacing:2px;color:rgba(255,255,255,.5);text-transform:uppercase}
.noir-footer-nav span{cursor:pointer;transition:color .2s}
.noir-footer-nav span:hover{color:#fff}
.noir-footer-socials{display:flex;gap:20px}
.noir-footer-socials a{font-size:11px;font-weight:600;letter-spacing:1.5px;color:rgba(255,255,255,.4);text-transform:uppercase;text-decoration:none;transition:color .2s}
.noir-footer-socials a:hover{color:#fff}
.noir-footer-bottom{display:flex;justify-content:space-between;padding:16px 0 20px;font-size:11px;color:rgba(255,255,255,.2);letter-spacing:.5px}
.noir-footer-bigname{font-weight:900;text-transform:uppercase;color:#fff;text-align:center;padding:0;margin:0 -32px 0;white-space:nowrap;overflow:visible;width:calc(100% + 64px);line-height:0}
.noir-footer-bigname svg{width:100%;height:auto;display:block}
.noir-footer-bigname svg text{fill:#fff;font-weight:900;font-family:'Inter',system-ui,sans-serif}

/* Noir responsive */
@media(max-width:768px){
  .noir-hero{min-height:auto}
  .noir-hero-name .noir-hero-first,.noir-hero-name .noir-hero-last{font-size:clamp(48px,14vw,100px)}
  .noir-hero-grid{grid-template-columns:1fr;gap:12px}
  .noir-hero-img-center{margin-top:0}
  .noir-about-split{grid-template-columns:1fr;gap:32px}
  .noir-gallery-grid{grid-template-columns:1fr}
  .noir-fw-reviews{grid-template-columns:1fr}
  .noir-exp-grid{grid-template-columns:1fr}
  .noir-works-grid{grid-template-columns:1fr}
  .noir-portfolios-grid{grid-template-columns:1fr}
  .noir-nav-links{gap:16px;font-size:11px}
  .studio-builder-body{grid-template-columns:280px 1fr}
}

/* ═══ ATRIUM THEME ═══ */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
.atrium-theme{background:#F7F7F5;color:#111;font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;position:relative}
.atrium-theme *{box-sizing:border-box}

/* Atrium Nav — translucent blur with gradient fade */
.atrium-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:24px 48px;background:linear-gradient(to bottom,rgba(247,247,245,.95) 0%,rgba(247,247,245,.8) 60%,rgba(247,247,245,0) 100%);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:padding .3s,background .3s}
.atrium-nav-compact{padding:16px 48px;background:rgba(247,247,245,.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,0,0,.04)}
.atrium-nav-name{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
.atrium-nav-links{display:flex;gap:32px;font-size:11px;font-weight:500;letter-spacing:.12em;color:rgba(17,17,17,.4);text-transform:uppercase}
.atrium-nav-links span{cursor:pointer;transition:color .2s}
.atrium-nav-links span:hover{color:#111}

/* Atrium section header with number */
.atrium-sh{display:flex;align-items:center;gap:20px;margin-bottom:40px}
.atrium-sh-num{font-family:'JetBrains Mono',monospace;font-size:12px;color:#bbb;font-weight:500;letter-spacing:.05em;flex-shrink:0}
.atrium-sh-line{height:1px;flex:1;background:rgba(0,0,0,.06)}
.atrium-sh-label{font-size:11px;text-transform:uppercase;letter-spacing:.2em;color:#aaa;font-weight:500;flex-shrink:0}

/* Atrium Hero — floating card with image */
.atrium-hero{padding:24px 32px 0;border-bottom:none;position:relative}
.atrium-hero-inner{position:relative;overflow:hidden;border-radius:20px}
.atrium-hero-img{width:100%;height:70vh;min-height:480px;object-fit:cover;display:block;filter:brightness(.82)}
.atrium-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,rgba(0,0,0,.2) 40%,transparent 65%);pointer-events:none;border-radius:20px}
.atrium-hero-content{position:absolute;bottom:0;left:0;right:0;padding:48px 56px 52px;color:#fff}
.atrium-hero-brand{font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:rgba(255,255,255,.6);font-weight:500;margin-bottom:16px}
.atrium-hero-name{font-size:clamp(44px,9vw,110px);font-weight:800;line-height:.9;letter-spacing:-0.04em;margin:0;text-transform:uppercase;color:#fff}
.atrium-hero-desc{font-size:15px;line-height:1.7;color:rgba(255,255,255,.6);max-width:480px;margin-top:20px}
.atrium-hero-tags{display:flex;gap:8px;margin-top:16px}
.atrium-hero-tags span{font-size:11px;letter-spacing:.08em;color:rgba(255,255,255,.5);padding:5px 14px;border:1px solid rgba(255,255,255,.15);border-radius:20px;text-transform:uppercase;backdrop-filter:blur(8px);background:rgba(255,255,255,.06)}

/* Atrium About */
.atrium-about{padding:80px 64px}
.atrium-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.atrium-about-left h2{font-size:clamp(24px,3vw,34px);font-weight:700;line-height:1.2;letter-spacing:-0.02em;margin:0;text-transform:uppercase}
.atrium-about-avail{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.15em;color:rgba(17,17,17,.5);margin-top:16px;text-transform:uppercase}
.atrium-about-avail-dot{width:7px;height:7px;border-radius:50%;background:#10b981;animation:noirPulse 2s ease infinite}
.atrium-about-right{font-size:14px;line-height:1.8;color:rgba(17,17,17,.5)}
.atrium-about-portrait{margin-top:48px;position:relative;overflow:hidden;border-radius:16px}
.atrium-about-portrait img{width:100%;max-height:70vh;object-fit:cover;display:block}

/* Atrium Gallery */
.atrium-gallery{padding:80px 64px;overflow:hidden}
.atrium-gallery-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.atrium-gallery-item{position:relative;overflow:hidden;aspect-ratio:4/3;border-radius:14px}
.atrium-gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.atrium-gallery-item:hover img{transform:scale(1.04)}
.atrium-gallery-item:first-child{grid-column:span 2;grid-row:span 2;aspect-ratio:auto}

/* Atrium Portfolios */
.atrium-portfolios{padding:80px 64px}
.atrium-pf-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.atrium-pf-card{border:1px solid rgba(0,0,0,.06);border-radius:16px;overflow:hidden;transition:all .3s;cursor:pointer;background:#fff}
.atrium-pf-card:hover{border-color:rgba(0,0,0,.12);box-shadow:0 8px 32px rgba(0,0,0,.06)}
.atrium-pf-card.featured{border-color:rgba(0,0,0,.15)}
.atrium-pf-cover{aspect-ratio:16/9;overflow:hidden}
.atrium-pf-cover img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.atrium-pf-card:hover .atrium-pf-cover img{transform:scale(1.03)}
.atrium-pf-info{padding:20px 24px}
.atrium-pf-badge{display:inline-block;font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#111;background:rgba(0,0,0,.04);padding:4px 12px;margin-bottom:8px;border-radius:6px}
.atrium-pf-info h3{font-size:16px;font-weight:600;margin:0 0 6px;letter-spacing:-0.01em}
.atrium-pf-info p{font-size:13px;line-height:1.6;color:rgba(17,17,17,.45);margin:0 0 12px}
.atrium-pf-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.atrium-pf-tags span{font-size:10px;letter-spacing:.05em;color:rgba(17,17,17,.35);border:1px solid rgba(0,0,0,.06);padding:3px 10px;border-radius:20px}
.atrium-pf-stats{display:flex;gap:16px;font-size:11px;color:rgba(17,17,17,.3);letter-spacing:.05em}

/* Atrium Featured Work */
.atrium-fw{padding:80px 64px}
.atrium-fw-label{font-size:11px;font-weight:600;letter-spacing:.2em;color:rgba(17,17,17,.35);text-transform:uppercase;margin-bottom:12px}
.atrium-fw-title{font-size:clamp(32px,5vw,60px);font-weight:800;line-height:1;letter-spacing:-0.03em;margin:0 0 12px;text-transform:uppercase}
.atrium-fw-tagline{font-size:15px;color:rgba(17,17,17,.45);font-style:italic;margin:0 0 32px}
.atrium-fw-cover{overflow:hidden;margin-bottom:32px;aspect-ratio:16/7;border-radius:16px}
.atrium-fw-cover img{width:100%;height:100%;object-fit:cover}
.atrium-fw-meta{display:flex;gap:24px;font-size:12px;letter-spacing:.1em;color:rgba(17,17,17,.35);text-transform:uppercase;margin-bottom:20px}
.atrium-fw-desc{font-size:14px;line-height:1.7;color:rgba(17,17,17,.5);max-width:640px;margin:0 0 40px}
.atrium-fw-reviews{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px}
.atrium-fw-quote{margin:0;padding:28px;border:1px solid rgba(0,0,0,.06);background:#fff;border-radius:14px}
.atrium-fw-quote p{font-size:14px;line-height:1.6;color:rgba(17,17,17,.6);margin:0 0 12px;font-style:italic}
.atrium-fw-quote cite{font-size:11px;color:rgba(17,17,17,.35);font-style:normal;letter-spacing:.05em}

/* Atrium Experience */
.atrium-experience{padding:80px 64px}
.atrium-exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.atrium-exp-card{padding:24px;border:1px solid rgba(0,0,0,.05);border-radius:14px;background:#fff;transition:all .2s}
.atrium-exp-card:hover{border-color:rgba(0,0,0,.1);box-shadow:0 4px 20px rgba(0,0,0,.04)}
.atrium-exp-type{font-size:10px;font-weight:600;letter-spacing:.15em;color:rgba(17,17,17,.3);text-transform:uppercase;margin-bottom:10px}
.atrium-exp-title{font-size:15px;font-weight:600;margin:0 0 4px}
.atrium-exp-org{font-size:13px;color:rgba(17,17,17,.45);margin-bottom:4px}
.atrium-exp-period{font-size:11px;color:rgba(17,17,17,.3);margin-bottom:8px;font-family:'JetBrains Mono',monospace}
.atrium-exp-desc{font-size:12px;line-height:1.6;color:rgba(17,17,17,.4);margin:0}

/* Atrium Works */
.atrium-works{padding:80px 64px}
.atrium-works-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.atrium-work-card{overflow:hidden;border:1px solid rgba(0,0,0,.05);border-radius:16px;cursor:pointer;transition:all .3s;background:#fff}
.atrium-work-card:hover{border-color:rgba(0,0,0,.1);box-shadow:0 8px 32px rgba(0,0,0,.06)}
.atrium-work-card img{width:100%;aspect-ratio:16/9;object-fit:cover}
.atrium-work-info{padding:16px 20px}
.atrium-work-info h3{font-size:15px;font-weight:600;margin:0 0 4px}
.atrium-work-info span{display:block;font-size:12px;color:rgba(17,17,17,.35)}

/* Atrium Testimonials */
.atrium-testimonials{padding:80px 64px;background:rgba(0,0,0,.025);border-radius:24px;margin:0 32px}
.atrium-test-card{max-width:640px;margin:0 auto;text-align:center;padding:40px 0}
.atrium-test-quote{font-size:clamp(16px,2vw,22px);line-height:1.6;color:#111;font-weight:400;margin:0 0 28px;letter-spacing:-0.01em}
.atrium-test-divider{width:32px;height:1px;background:rgba(0,0,0,.15);margin:0 auto 20px}
.atrium-test-name{font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.atrium-test-role{font-size:12px;color:rgba(17,17,17,.4);letter-spacing:.05em}
.atrium-test-arrows{display:flex;gap:8px;justify-content:center;margin-top:32px}
.atrium-test-arrows button{width:40px;height:40px;border:1px solid rgba(0,0,0,.08);border-radius:10px;background:#fff;color:#111;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:16px}
.atrium-test-arrows button:hover{background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.15)}

/* Atrium Contact */
.atrium-contact{padding:100px 64px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.atrium-contact-left h2{font-size:clamp(32px,5vw,56px);font-weight:800;line-height:.95;letter-spacing:-0.03em;text-transform:uppercase;margin:0 0 20px}
.atrium-contact-left p{font-size:14px;line-height:1.7;color:rgba(17,17,17,.45);margin:0 0 32px;max-width:400px}
.atrium-contact-cta{display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#111;text-decoration:none;padding:14px 32px;border:1px solid rgba(0,0,0,.12);border-radius:12px;transition:all .3s;background:#fff}
.atrium-contact-cta:hover{background:rgba(0,0,0,.04);gap:16px;box-shadow:0 4px 16px rgba(0,0,0,.06)}
.atrium-contact-right{display:flex;flex-direction:column;gap:0;background:#fff;border-radius:16px;padding:8px 24px;border:1px solid rgba(0,0,0,.05)}
.atrium-contact-item{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid rgba(0,0,0,.05)}
.atrium-contact-item:last-child{border-bottom:none}
.atrium-contact-item-label{font-size:11px;font-weight:600;letter-spacing:.15em;color:rgba(17,17,17,.3);text-transform:uppercase}
.atrium-contact-item-value{font-size:14px;color:rgba(17,17,17,.65);text-align:right}
.atrium-contact-item-value a{color:rgba(17,17,17,.65);text-decoration:none;transition:color .2s}
.atrium-contact-item-value a:hover{color:#111}

/* Atrium Footer */
.atrium-footer{padding:48px 64px;display:flex;justify-content:space-between;align-items:center}
.atrium-footer-nav{display:flex;gap:24px;font-size:11px;font-weight:500;letter-spacing:.15em;color:rgba(17,17,17,.3);text-transform:uppercase}
.atrium-footer-nav span{cursor:pointer;transition:color .2s}
.atrium-footer-nav span:hover{color:#111}
.atrium-footer-copy{font-size:11px;color:rgba(17,17,17,.18);letter-spacing:.05em}

/* Atrium reveal animations */
.atrium-reveal{opacity:0;transform:translateY(40px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
.atrium-reveal.revealed{opacity:1;transform:translateY(0)}
.atrium-stagger-1{transition-delay:.1s}
.atrium-stagger-2{transition-delay:.2s}
.atrium-stagger-3{transition-delay:.3s}
.atrium-stagger-4{transition-delay:.4s}

/* Atrium responsive */
@media(max-width:768px){
  .atrium-hero{padding:16px 16px 0}
  .atrium-hero-inner{border-radius:16px}
  .atrium-hero-overlay{border-radius:16px}
  .atrium-hero-content{padding:28px 24px 32px}
  .atrium-hero-img{height:55vh;min-height:360px}
  .atrium-about,.atrium-gallery,.atrium-portfolios,.atrium-fw,.atrium-experience,.atrium-works{padding:60px 32px}
  .atrium-testimonials{padding:60px 24px;margin:0 16px;border-radius:16px}
  .atrium-about-grid{grid-template-columns:1fr;gap:32px}
  .atrium-contact{grid-template-columns:1fr;gap:40px;padding:60px 32px}
  .atrium-gallery-grid{grid-template-columns:1fr 1fr}
  .atrium-gallery-item:first-child{grid-column:span 2;grid-row:auto}
  .atrium-pf-grid,.atrium-exp-grid,.atrium-works-grid,.atrium-fw-reviews{grid-template-columns:1fr}
  .atrium-footer{flex-direction:column;gap:16px;text-align:center;padding:32px}
  .atrium-nav{padding:16px 24px}
  .atrium-nav-links{gap:16px}

  .studio-panel{min-width:0}
}
@media(max-width:540px){
  .studio-builder-body{grid-template-columns:1fr}
  .studio-panel{display:none}
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
  archive: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>,
  archiveRestore: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="m9.5 14.5 2.5-2.5 2.5 2.5"/><path d="M12 12v5"/></svg>,
  kanban: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>,
  filter: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  studio: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
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
          ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
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
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
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

  /* Resume */
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
  const [appSearch, setAppSearch] = useState("");
  const [appSearchOpen, setAppSearchOpen] = useState(false);
  const [appView, setAppView] = useState("list");
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
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [ppViewPortfolio, setPpViewPortfolio] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCompCard, setShowCompCard] = useState(false);
  const [ccZoom, setCcZoom] = useState(75);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [resumeZoom, setResumeZoom] = useState(75);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSettings, setShareSettings] = useState({ trackLink: false, requireEmail: false, password: "" });
  const [lightbox, setLightbox] = useState(null); // { items: [{src,caption,type}], index: 0 }
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  /* Works */
  const [works, setWorks] = useState(MOCK_WORKS);
  const [viewWork, setViewWork] = useState(null);
  const [workTab, setWorkTab] = useState("overview");
  const [showNewWorkModal, setShowNewWorkModal] = useState(false);
  const [newWk, setNewWk] = useState({ name: "", tagline: "", role: "", genre: "" });
  const [workPreview, setWorkPreview] = useState(false);
  const [workLive, setWorkLive] = useState(false);
  const [showWorkShareModal, setShowWorkShareModal] = useState(false);
  const [workShareEmail, setWorkShareEmail] = useState("");
  const [workShareSettings, setWorkShareSettings] = useState({ trackLink: false, requireEmail: false, password: "" });

  /* Studio */
  const [studioTab, setStudioTab] = useState("website");
  const [studioMode, setStudioMode] = useState("gallery");
  const [studioTheme, setStudioTheme] = useState("noir");
  const [studioCustomizeTab, setStudioCustomizeTab] = useState("theme");
  const [studioPreviewDevice, setStudioPreviewDevice] = useState("desktop");
  const [studioBrand, setStudioBrand] = useState({ accentColor: "#ffffff", fontPairId: "inter" });
  const [studioSections, setStudioSections] = useState(STUDIO_DEFAULT_SECTIONS);
  const [studioContent, setStudioContent] = useState({
    selectedPortfolios: portfolios.filter(p => p.status === "published").map(p => p.id),
    featuredPortfolio: portfolios.find(p => p.status === "published")?.id || null,
    selectedWorks: works.filter(w => w.status === "published").map(w => w.id),
    featuredWork: works.find(w => w.status === "published")?.id || null,
  });
  const [studioSettings, setStudioSettings] = useState({
    slug: artist.handle || "amara-osei",
    customDomain: "",
    seoTitle: `${artist.name} — ${artist.styles?.[0] || "Artist"}`,
    seoDesc: artist.bio || "",
    visibility: "public",
  });
  const [studioPublished, setStudioPublished] = useState(false);
  const [studioScrollY, setStudioScrollY] = useState(0);
  const [studioGalleryLayout, setStudioGalleryLayout] = useState("masonry");
  const [noirRevealed, setNoirRevealed] = useState(new Set());
  const [studioTestimonialIdx, setStudioTestimonialIdx] = useState(0);
  const [noirCursorPos, setNoirCursorPos] = useState({ x: -100, y: -100 });

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
    { label: "Add Resume entries", done: false },
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

  /* Scroll-triggered animations for live view */
  useEffect(() => {
    if (!portfolioLive) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
    }, { threshold: 0.1, root: document.querySelector(".pfl-overlay") });
    const timer = setTimeout(() => {
      document.querySelectorAll(".pfl-anim").forEach(el => observer.observe(el));
    }, 50);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [portfolioLive]);

  /* Lightbox keyboard navigation */
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(prev => prev ? { ...prev, index: Math.min(prev.index + 1, prev.items.length - 1) } : null);
      if (e.key === "ArrowLeft") setLightbox(prev => prev ? { ...prev, index: Math.max(prev.index - 1, 0) } : null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightbox]);

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
    { id: "studio", icon: I.studio, label: "Studio" },
    { id: "academy", icon: I.academy, label: "Academy" },
    { id: "messages", icon: I.messages, label: "Messages", badge: messages.filter(m => m.unread).length || null },
  ];

  const SPOTLIGHT_TABS = [
    { id: "overview", icon: I.overview, label: "Overview" },
    { id: "application", icon: I.doc, label: "Application" },
    { id: "updates", icon: I.updates, label: "Updates" },
    { id: "faq", icon: I.faq, label: "FAQ" },
    { id: "community", icon: I.community, label: "Community" },
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

  const WORKS_TABS = [
    { id: "overview", icon: I.overview, label: "Overview" },
    { id: "about", icon: I.doc, label: "About" },
    { id: "media", icon: I.media, label: "Media" },
    { id: "credits", icon: I.profile, label: "Credits" },
    { id: "performances", icon: I.discover, label: "Performances" },
    { id: "reviews", icon: I.doc, label: "Reviews & Awards" },
    { id: "booking", icon: I.applications, label: "Booking" },
    { id: "tracking", icon: I.applications, label: "Tracking" },
    { id: "settings", icon: I.settings, label: "Settings" },
  ];

  const currentWork = viewWork ? works.find(w => w.id === viewWork) : null;

  /* ━━━ FILTERED DATA ━━━ */
  const filteredApps = applications.filter(a => {
    if (a.status === "draft") return false;
    if (appFilter === "all") { if (a.status === "archived") return false; }
    else if (a.status !== appFilter) return false;
    if (appSearch) {
      const q = appSearch.toLowerCase();
      if (!a.opportunity.toLowerCase().includes(q) && !a.company.toLowerCase().includes(q)) return false;
    }
    return true;
  }).slice().sort((a, b) => {
    if (appSort === "newest") return b.submitted.localeCompare(a.submitted);
    if (appSort === "oldest") return a.submitted.localeCompare(b.submitted);
    if (appSort === "a-z") return a.opportunity.localeCompare(b.opportunity);
    if (appSort === "z-a") return b.opportunity.localeCompare(a.opportunity);
    if (appSort === "deadline") return a.deadline.localeCompare(b.deadline);
    return 0;
  });
  const appCounts = {};
  for (const k of Object.keys(STATUS_LABELS)) appCounts[k] = applications.filter(a => a.status === k).length;
  const activeAppCount = applications.filter(a => a.status !== "draft" && a.status !== "archived").length;
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
    showToast(editEntry ? "Entry updated" : "Entry added to Resume");
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

              {/* ── Plan section ── */}
              <div className="plan-section">
                <div className="plan-section-left">
                  <div className="info-card" style={{ marginBottom: 0, height: "100%" }}>
                    <h4>Preparation Plan</h4>
                    <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 14 }}>Track your prep — check items off as you go.</p>
                    <div className="plan-checklist">
                      {[
                        { title: "Update Resume", desc: "Ensure all recent experience is added", done: true },
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
                </div>
                <div className="plan-section-right">
                  <div className="info-card" style={{ marginBottom: 16 }}>
                    <h4>Notes</h4>
                    <textarea className="msg-input" style={{ width: "100%", minHeight: 100, resize: "vertical" }} placeholder="Add personal notes for this audition..." />
                  </div>
                  <div className="info-card" style={{ marginBottom: 0 }}>
                    <h4>Important Dates</h4>
                    <div className="info-row"><span className="ir-label">Application Deadline</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>{spotlightApp.deadline}</span></div>
                    <div className="info-row"><span className="ir-label">Submitted</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>{spotlightApp.submitted}</span></div>
                    <div className="info-row"><span className="ir-label">Audition Period</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>TBD</span></div>
                    <div className="info-row"><span className="ir-label">Results Expected</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>TBD</span></div>
                  </div>
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
                    <h4 style={{ margin: 0 }}>Resume <span style={{ fontSize: 11, color: "var(--g4)", fontWeight: 400 }}>({stageRecords.filter(sr => sr.usedIn.includes("Resume")).length} entries)</span></h4>
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
                      <div>Reminder: Please ensure your Resume is up to date before the audition. The panel will review your profile in advance.</div>
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
                    { q: "Can I submit additional materials after applying?", a: "Yes, you can update your media and resume up until the application deadline. Any changes will be reflected in your submission." },
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

          {/* Step 2: Resume */}
          {applyStep === 2 && (
            <div style={{ animation: "slideInUp .3s ease" }}>
              <div className="info-card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h4 style={{ margin: 0 }}>Select Resume Entries</h4>
                  <button className="btn btn-p btn-sm" onClick={() => { setShowNewEntry(true); setNewEntryType(null); setEditEntry(null); setEntryForm({ title: "", org: "", start: "", end: "", location: "", desc: "", tags: "" }); }}>+ Add New</button>
                </div>
                <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 12 }}>Choose which entries from your Resume to include in this application.</p>
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
                <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 12 }}>Optionally upload a PDF resume alongside your Lanced Resume.</p>
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
                  <h4>Resume</h4>
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
              {["general", "resume", "comp-card"].map(t => (
                <button key={t} className={`tab-btn${profileTab === t ? " on" : ""}`} onClick={() => setProfileTab(t)}>
                  {t === "general" ? "General Info" : t === "resume" ? "Resume" : "Comp Card"}
                </button>
              ))}
            </div>

            {profileTab === "general" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Profile Details */}
                <div className="info-card">
                  <h4>Profile Details</h4>
                  <div className="pf-details-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div className="pf-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="pf-field">
                          <label className="pf-label">First Name</label>
                          <input className="pf-input" value={artist.firstName} onChange={e => setArtist(a => ({ ...a, firstName: e.target.value, name: `${e.target.value} ${a.lastName}` }))} />
                        </div>
                        <div className="pf-field">
                          <label className="pf-label">Last Name</label>
                          <input className="pf-input" value={artist.lastName} onChange={e => setArtist(a => ({ ...a, lastName: e.target.value, name: `${a.firstName} ${e.target.value}` }))} />
                        </div>
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Lanced Handle (username)</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                          <span style={{ padding: "9px 10px 9px 14px", background: "var(--bg)", border: "1px solid var(--g2)", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 13, color: "var(--g4)", fontWeight: 500 }}>@</span>
                          <input className="pf-input" style={{ borderRadius: "0 10px 10px 0" }} value={artist.handle} onChange={e => setArtist(a => ({ ...a, handle: e.target.value }))} />
                        </div>
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Date of Birth</label>
                        <input className="pf-input" type="date" value={artist.dob} onChange={e => setArtist(a => ({ ...a, dob: e.target.value }))} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Country of Residence</label>
                        <input className="pf-input" value={artist.country} onChange={e => setArtist(a => ({ ...a, country: e.target.value }))} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">City</label>
                        <input className="pf-input" value={artist.city} onChange={e => setArtist(a => ({ ...a, city: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <h4 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Your Headshot</h4>
                      <p style={{ fontSize: 12, color: "var(--g4)", margin: 0, textAlign: "center", lineHeight: 1.5 }}>Upload a clear headshot as profile image.<br/>This photo will appear on your profile and with all your applications.</p>
                      <img src={artist.photo} alt="" style={{ width: 220, height: 280, objectFit: "cover", borderRadius: 16, border: "3px solid var(--ac)", boxShadow: "0 4px 20px rgba(96,77,255,.15)" }} />
                      <button className="btn btn-s btn-sm" style={{ marginTop: 4 }}>Change Photo</button>
                    </div>
                  </div>
                </div>

                {/* General Info */}
                <div className="info-card">
                  <h4>General Info</h4>
                  <div className="pf-general-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="pf-field">
                      <label className="pf-label">Pronouns</label>
                      <input className="pf-input" value={artist.pronouns} onChange={e => setArtist(a => ({ ...a, pronouns: e.target.value }))} />
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Gender</label>
                      <select className="pf-input" value={artist.gender} onChange={e => setArtist(a => ({ ...a, gender: e.target.value }))}>
                        <option value="">Select...</option>
                        {["Female", "Male", "Non-Binary", "Trans Woman", "Trans Man", "Intersex", "Agender", "Genderqueer", "My gender is not listed", "Prefer not to say"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Nationality</label>
                      <div className="pf-multiselect">
                        {artist.nationality.map(n => (
                          <span key={n} className="pf-chip"><span className="pf-chip-x" onClick={() => setArtist(a => ({ ...a, nationality: a.nationality.filter(x => x !== n) }))}>×</span> {n}</span>
                        ))}
                        <input className="pf-add-input" placeholder="Add nationality..." onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim() && !artist.nationality.includes(e.target.value.trim())) { const v = e.target.value.trim(); setArtist(a => ({ ...a, nationality: [...a.nationality, v] })); e.target.value = ""; e.preventDefault(); } }} />
                      </div>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Ethnicity</label>
                      <div className="pf-multiselect">
                        {artist.ethnicity.map(et => (
                          <span key={et} className="pf-chip"><span className="pf-chip-x" onClick={() => setArtist(a => ({ ...a, ethnicity: a.ethnicity.filter(x => x !== et) }))}>×</span> {et}</span>
                        ))}
                        <select className="pf-add-select" value="" onChange={e => { const v = e.target.value; if (v && !artist.ethnicity.includes(v)) setArtist(a => ({ ...a, ethnicity: [...a.ethnicity, v] })); }}>
                          <option value="">Add...</option>
                          {["American Indian or Alaska Native", "Hispanic, Latino or Spanish Origin", "White or European", "Asian", "Indian", "Middle Eastern or North African", "Black or African American", "Pacific Islander", "Identity not listed", "Wish not to identify"].filter(o => !artist.ethnicity.includes(o)).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Height</label>
                      <div style={{ display: "flex", gap: 0 }}>
                        <input className="pf-input" style={{ borderRadius: "10px 0 0 10px", flex: 1 }} value={artist.height} onChange={e => setArtist(a => ({ ...a, height: e.target.value }))} placeholder={artist.heightUnit === "cm" ? "e.g. 173" : "e.g. 5'8\""} />
                        <div style={{ display: "flex", borderRadius: "0 10px 10px 0", overflow: "hidden", border: "1px solid var(--g2)", borderLeft: "none" }}>
                          <button style={{ padding: "0 10px", border: "none", background: artist.heightUnit === "ft" ? "var(--ac)" : "var(--bg)", color: artist.heightUnit === "ft" ? "#fff" : "var(--g4)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, heightUnit: "ft" }))}>ft/in</button>
                          <button style={{ padding: "0 10px", border: "none", borderLeft: "1px solid var(--g2)", background: artist.heightUnit === "cm" ? "var(--ac)" : "var(--bg)", color: artist.heightUnit === "cm" ? "#fff" : "var(--g4)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, heightUnit: "cm" }))}>cm</button>
                        </div>
                      </div>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Languages</label>
                      <div className="pf-multiselect">
                        {artist.languages.map(l => (
                          <span key={l} className="pf-chip"><span className="pf-chip-x" onClick={() => setArtist(a => ({ ...a, languages: a.languages.filter(x => x !== l) }))}>×</span> {l}</span>
                        ))}
                        <input className="pf-add-input" placeholder="Add language..." onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim() && !artist.languages.includes(e.target.value.trim())) { const v = e.target.value.trim(); setArtist(a => ({ ...a, languages: [...a.languages, v] })); e.target.value = ""; e.preventDefault(); } }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Biography */}
                <div className="info-card">
                  <h4>Your Biography</h4>
                  <div className="pf-field">
                    <label className="pf-label">Profile Bio (max 150 characters)</label>
                    <input className="pf-input" maxLength={150} value={artist.profileBio} onChange={e => setArtist(a => ({ ...a, profileBio: e.target.value }))} />
                  </div>
                  <div className="pf-field" style={{ marginTop: 14 }}>
                    <label className="pf-label">Your Biography</label>
                    <textarea className="pf-input" rows={8} style={{ resize: "vertical" }} value={artist.biography} onChange={e => setArtist(a => ({ ...a, biography: e.target.value }))} />
                  </div>
                </div>

                {/* Socials */}
                <div className="info-card">
                  <h4>Socials</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 480 }}>
                    {[
                      { key: "instagram", label: "Instagram", prefix: "@" },
                      { key: "tiktok", label: "Tik Tok", prefix: "@" },
                      { key: "youtube", label: "Youtube", prefix: null, placeholder: "Youtube URL" },
                      { key: "vimeo", label: "Vimeo", prefix: null, placeholder: "Vimeo URL" },
                      { key: "linkedin", label: "Linkedin", prefix: null, placeholder: "LinkedIn URL" },
                    ].map(s => (
                      <div key={s.key} className="pf-field">
                        <label className="pf-label">{s.label}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                          {s.prefix && <span style={{ padding: "9px 10px 9px 14px", background: "var(--bg)", border: "1px solid var(--g2)", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 13, color: "var(--g4)", fontWeight: 500 }}>@</span>}
                          <input className="pf-input" style={s.prefix ? { borderRadius: "0 10px 10px 0" } : {}} placeholder={s.placeholder || `${s.label} Username`} value={artist.socials[s.key]} onChange={e => setArtist(a => ({ ...a, socials: { ...a.socials, [s.key]: e.target.value } }))} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {profileTab === "resume" && (
              <div>
                {/* Generate Resume Banner */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg, rgba(96,77,255,.06), rgba(96,77,255,.12))", borderRadius: 14, border: "1px solid rgba(96,77,255,.1)", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx)" }}>Your Lanced Resume</div>
                    <div style={{ fontSize: 12, color: "var(--g4)", marginTop: 2 }}>Generate a printable multi-page resume with your experience, education, awards, and more.</div>
                  </div>
                  <button className="btn" style={{ background: "var(--ac)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }} onClick={() => setShowResumePreview(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                    Generate Resume
                  </button>
                </div>

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
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Generate Button */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg, rgba(96,77,255,.06), rgba(96,77,255,.12))", borderRadius: 14, border: "1px solid rgba(96,77,255,.1)" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx)" }}>Your Comp Card</div>
                    <div style={{ fontSize: 12, color: "var(--g4)", marginTop: 2 }}>Generate a printable one-pager with your headshot, stats, skills, and QR code.</div>
                  </div>
                  <button className="btn" style={{ background: "var(--ac)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }} onClick={() => setShowCompCard(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                    Generate Comp Card
                  </button>
                </div>

                {/* Physical Appearance */}
                <div className="info-card">
                  <h4>Physical Appearance</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                    <div className="pf-field">
                      <label className="pf-label">Eye Color</label>
                      <select className="pf-input" value={artist.eyeColor} onChange={e => setArtist(a => ({ ...a, eyeColor: e.target.value }))}>
                        <option value="">Select...</option>
                        {["Brown", "Blue", "Green", "Hazel", "Grey", "Amber", "Black", "Other"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Hair Color</label>
                      <select className="pf-input" value={artist.hairColor} onChange={e => setArtist(a => ({ ...a, hairColor: e.target.value }))}>
                        <option value="">Select...</option>
                        {["Black", "Brown", "Blonde", "Red", "Auburn", "Grey", "White", "Bald", "Other"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Clothing Size</label>
                      <select className="pf-input" value={artist.clothingSize} onChange={e => setArtist(a => ({ ...a, clothingSize: e.target.value }))}>
                        <option value="">Select...</option>
                        {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Body Measurements */}
                <div className="info-card">
                  <h4>Body Measurements</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="pf-field">
                      <label className="pf-label">Weight</label>
                      <div style={{ display: "flex", gap: 0 }}>
                        <input className="pf-input" style={{ borderRadius: "10px 0 0 10px", flex: 1 }} value={artist.weight} onChange={e => setArtist(a => ({ ...a, weight: e.target.value }))} placeholder={artist.weightUnit === "kg" ? "e.g. 58" : "e.g. 128"} />
                        <div style={{ display: "flex", borderRadius: "0 10px 10px 0", overflow: "hidden", border: "1px solid var(--g2)", borderLeft: "none" }}>
                          <button style={{ padding: "0 10px", border: "none", background: artist.weightUnit === "kg" ? "var(--ac)" : "var(--bg)", color: artist.weightUnit === "kg" ? "#fff" : "var(--g4)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, weightUnit: "kg" }))}>kg</button>
                          <button style={{ padding: "0 10px", border: "none", borderLeft: "1px solid var(--g2)", background: artist.weightUnit === "lbs" ? "var(--ac)" : "var(--bg)", color: artist.weightUnit === "lbs" ? "#fff" : "var(--g4)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, weightUnit: "lbs" }))}>lbs</button>
                        </div>
                      </div>
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Shoe Size</label>
                      <div style={{ display: "flex", gap: 0 }}>
                        <input className="pf-input" style={{ borderRadius: "10px 0 0 10px", flex: 1 }} value={artist.shoeSize} onChange={e => setArtist(a => ({ ...a, shoeSize: e.target.value }))} placeholder={artist.shoeSizeUnit === "EU" ? "e.g. 39" : "e.g. 8"} />
                        <div style={{ display: "flex", borderRadius: "0 10px 10px 0", overflow: "hidden", border: "1px solid var(--g2)", borderLeft: "none" }}>
                          {["EU", "US", "UK"].map(u => (
                            <button key={u} style={{ padding: "0 8px", border: "none", borderLeft: u !== "EU" ? "1px solid var(--g2)" : "none", background: artist.shoeSizeUnit === u ? "var(--ac)" : "var(--bg)", color: artist.shoeSizeUnit === u ? "#fff" : "var(--g4)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, shoeSizeUnit: u }))}>{u}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label className="pf-label" style={{ margin: 0 }}>Measurements (Chest / Waist / Hips)</label>
                      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--g2)" }}>
                        <button style={{ padding: "4px 10px", border: "none", background: artist.measurementUnit === "cm" ? "var(--ac)" : "var(--bg)", color: artist.measurementUnit === "cm" ? "#fff" : "var(--g4)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, measurementUnit: "cm" }))}>cm</button>
                        <button style={{ padding: "4px 10px", border: "none", borderLeft: "1px solid var(--g2)", background: artist.measurementUnit === "in" ? "var(--ac)" : "var(--bg)", color: artist.measurementUnit === "in" ? "#fff" : "var(--g4)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setArtist(a => ({ ...a, measurementUnit: "in" }))}>inches</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                      <div className="pf-field">
                        <label className="pf-label">Chest</label>
                        <input className="pf-input" value={artist.chest} onChange={e => setArtist(a => ({ ...a, chest: e.target.value }))} placeholder={artist.measurementUnit === "cm" ? "e.g. 86" : "e.g. 34"} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Waist</label>
                        <input className="pf-input" value={artist.waist} onChange={e => setArtist(a => ({ ...a, waist: e.target.value }))} placeholder={artist.measurementUnit === "cm" ? "e.g. 66" : "e.g. 26"} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Hips</label>
                        <input className="pf-input" value={artist.hips} onChange={e => setArtist(a => ({ ...a, hips: e.target.value }))} placeholder={artist.measurementUnit === "cm" ? "e.g. 91" : "e.g. 36"} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Representation & Union */}
                <div className="info-card">
                  <h4>Representation & Union</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="pf-field">
                      <label className="pf-label">Agency / Representation</label>
                      <input className="pf-input" value={artist.agency} onChange={e => setArtist(a => ({ ...a, agency: e.target.value }))} placeholder="Agency name (if applicable)" />
                    </div>
                    <div className="pf-field">
                      <label className="pf-label">Agent Contact</label>
                      <input className="pf-input" value={artist.agencyContact} onChange={e => setArtist(a => ({ ...a, agencyContact: e.target.value }))} placeholder="Agent email or phone" />
                    </div>
                  </div>
                  <div className="pf-field" style={{ marginTop: 14 }}>
                    <label className="pf-label">Union Status</label>
                    <div className="pf-multiselect">
                      {artist.unionStatus.map(u => (
                        <span key={u} className="pf-chip"><span className="pf-chip-x" onClick={() => setArtist(a => ({ ...a, unionStatus: a.unionStatus.filter(x => x !== u) }))}>×</span> {u}</span>
                      ))}
                      <select className="pf-add-select" value="" onChange={e => { const v = e.target.value; if (v && !artist.unionStatus.includes(v)) setArtist(a => ({ ...a, unionStatus: [...a.unionStatus, v] })); }}>
                        <option value="">Add...</option>
                        {["Equity", "SAG-AFTRA", "AGMA", "AEA", "MEAA", "BECTU", "Non-Union", "Other"].filter(o => !artist.unionStatus.includes(o)).map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Skills */}
                <div className="info-card">
                  <h4>Special Skills</h4>
                  <p style={{ fontSize: 12, color: "var(--g4)", margin: "0 0 12px" }}>Skills beyond your primary discipline that casting directors should know about.</p>
                  <div className="pf-multiselect">
                    {artist.specialSkills.map(s => (
                      <span key={s} className="pf-chip"><span className="pf-chip-x" onClick={() => setArtist(a => ({ ...a, specialSkills: a.specialSkills.filter(x => x !== s) }))}>×</span> {s}</span>
                    ))}
                    <input className="pf-add-input" placeholder="Add skill..." onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim() && !artist.specialSkills.includes(e.target.value.trim())) { const v = e.target.value.trim(); setArtist(a => ({ ...a, specialSkills: [...a.specialSkills, v] })); e.target.value = ""; e.preventDefault(); } }} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {["Singing", "Acting", "Acrobatics", "Aerial Silks", "Aerial Hoop", "Stage Combat", "Gymnastics", "Swimming", "Horse Riding", "Stilts", "Fire Performance", "Yoga", "Pilates", "Sign Language", "Voiceover", "Musical Instruments"].filter(s => !artist.specialSkills.includes(s)).map(s => (
                      <button key={s} style={{ padding: "4px 10px", borderRadius: 6, border: "1px dashed var(--g2)", background: "none", fontSize: 11, color: "var(--g4)", cursor: "pointer", fontFamily: "var(--sans)", transition: "all .15s" }} onClick={() => setArtist(a => ({ ...a, specialSkills: [...a.specialSkills, s] }))} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ac)"; e.currentTarget.style.color = "var(--ac)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--g2)"; e.currentTarget.style.color = "var(--g4)"; }}>+ {s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      /* ── Applications ── */
      case "applications": {
        const archiveApp = (e, id) => { e.stopPropagation(); setApplications(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "archived" ? "submitted" : "archived" } : a)); };
        const APP_FILTER_CHIPS = [
          ["all", "All", activeAppCount],
          ...Object.entries(STATUS_LABELS).filter(([k]) => k !== "draft" && k !== "archived").map(([k, v]) => [k, v, appCounts[k] || 0]),
        ];
        return (
          <div>
            <div className="pg-header">
              <h1><em>Applications</em></h1>
              <p className="pg-sub">Track and manage everything you've applied to</p>
            </div>

            {/* ── Unified Toolbar ── */}
            <div className="app-toolbar" ref={el => {
              if (!el) return;
              const obs = new IntersectionObserver(([e]) => el.classList.toggle("stuck", e.intersectionRatio < 1), { threshold: [1], rootMargin: "-1px 0px 0px 0px" });
              obs.observe(el);
            }}>
              <div className="at-filters">
                {APP_FILTER_CHIPS.map(([key, label, count]) => (
                  <button key={key} className={`chip${appFilter === key ? " on" : ""}`} onClick={() => setAppFilter(key)}>
                    {label}<span className="at-chip-count">{count}</span>
                  </button>
                ))}
              </div>

              <div className="at-right">
                {appSearchOpen ? (
                  <div className="at-search-expanded">
                    {I.search}
                    <input autoFocus placeholder="Search applications..." value={appSearch} onChange={e => setAppSearch(e.target.value)} />
                    <button className="at-search-close" onClick={() => { setAppSearchOpen(false); setAppSearch(""); }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ) : (
                  <button className="at-search-btn" onClick={() => setAppSearchOpen(true)} title="Search">
                    {I.search}
                  </button>
                )}

                <div className="view-toggle">
                  <button className={appView === "grid" ? "active" : ""} onClick={() => setAppView("grid")} title="Card view">{I.grid}</button>
                  <button className={appView === "kanban" ? "active" : ""} onClick={() => setAppView("kanban")} title="Board view">{I.kanban}</button>
                  <button className={appView === "list" ? "active" : ""} onClick={() => setAppView("list")} title="List view">{I.list}</button>
                </div>

                <select className="sort-filter" value={appSort} onChange={e => setAppSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="a-z">A → Z</option>
                  <option value="z-a">Z → A</option>
                  <option value="deadline">Deadline</option>
                </select>

                <button className={`at-filter-btn${appFilter === "archived" ? " active" : ""}`} onClick={() => setAppFilter(appFilter === "archived" ? "all" : "archived")}>
                  {I.archive} Archived
                </button>
              </div>
            </div>

            {appFilter === "archived" ? (
              /* ── Archived view ── */
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  {I.archive}
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--g5)", margin: 0 }}>Archived Applications</h3>
                  <span style={{ fontSize: 11, color: "var(--g4)", background: "var(--g1)", padding: "2px 8px", borderRadius: 40 }}>{applications.filter(a => a.status === "archived").length}</span>
                </div>
                {applications.filter(a => a.status === "archived").length === 0 ? (
                  <div style={{ textAlign: "center", padding: 60, color: "var(--g4)", fontSize: 13 }}>No archived applications yet. Archive applications you want to keep but hide from your main view.</div>
                ) : (
                  <div className="app-list">
                    {applications.filter(a => a.status === "archived").map(app => (
                      <div key={app.id} className="app-card" style={{ opacity: .7 }} onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }}>
                        <img className="ac-logo" src={app.companyLogo} alt="" />
                        <div className="ac-info">
                          <div className="ac-title">{app.opportunity}</div>
                          <div className="ac-company">{app.company}</div>
                          <div className="ac-meta">
                            <span>Submitted: {app.submitted}</span>
                            <span>Deadline: {app.deadline}</span>
                          </div>
                        </div>
                        <span className="ac-status" style={{ background: STATUS_COLORS.archived.bg, color: STATUS_COLORS.archived.color }}>Archived</span>
                        <button className="ac-archive" style={{ opacity: 1 }} onClick={e => archiveApp(e, app.id)} title="Unarchive">
                          {I.archiveRestore}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ── Normal views ── */
              <>
                {/* ── Drafts section ── */}
                {appFilter === "all" && applications.filter(a => a.status === "draft").length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--g4)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 12 }}>📝 Drafts</h3>
                    <div className="app-list">
                      {applications.filter(a => a.status === "draft").map(app => {
                        const progress = Math.round(((app.draftProgress?.profile ? 1 : 0) + (app.draftProgress?.resume ? 1 : 0) + (app.draftProgress?.materials ? 1 : 0) + (app.draftProgress?.motivation ? 1 : 0)) / 4 * 100);
                        return (
                          <div key={app.id} className="app-card" onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }}>
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

                {/* ── List view ── */}
                {appView === "list" ? (
                  <div className="app-list">
                    {filteredApps.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--g4)", fontSize: 13 }}>{appSearch ? "No applications match your search" : "No applications in this category"}</div>}
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
                          <button className="ac-archive" onClick={e => archiveApp(e, app.id)} title="Archive">
                            {I.archive}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : appView === "grid" ? (
                  /* ── Tile/Card view ── */
                  <div className="app-tiles">
                    {filteredApps.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--g4)", fontSize: 13 }}>{appSearch ? "No applications match your search" : "No applications in this category"}</div>}
                    {filteredApps.map(app => {
                      const sc = STATUS_COLORS[app.status];
                      return (
                        <div key={app.id} className="app-tile" onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }}>
                          <div className="at-banner">
                            <img src={app.banner} alt="" />
                            <span className="at-status" style={{ background: sc.bg, color: sc.color }}>{STATUS_LABELS[app.status]}</span>
                          </div>
                          <div className="at-body">
                            <div className="at-head">
                              <img src={app.companyLogo} alt="" />
                              <span className="at-company">{app.company}</span>
                            </div>
                            <div className="at-title">{app.opportunity}</div>
                            <div className="at-meta">
                              <span>📅 {app.submitted || "—"}</span>
                              <span>⏰ {app.deadline}</span>
                            </div>
                          </div>
                          <button className="at-archive" onClick={e => archiveApp(e, app.id)} title="Archive">
                            {I.archive}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ── Kanban/Board view ── */
                  <div className="app-kanban">
                    {Object.entries(STATUS_LABELS).filter(([k]) => k !== "draft" && k !== "archived").map(([status, label]) => {
                      const col = applications.filter(a => a.status === status);
                      const sc = STATUS_COLORS[status];
                      return (
                        <div key={status} className="ak-column">
                          <div className="ak-col-header">
                            <span className="ak-col-dot" style={{ background: sc.color }} />
                            <span className="ak-col-title">{label}</span>
                            <span className="ak-col-count">{col.length}</span>
                          </div>
                          <div className="ak-col-body">
                            {col.map(app => (
                              <div key={app.id} className="ak-card" onClick={() => { setViewSpotlight(app.id); setSpotlightTab("overview"); }}>
                                <img className="ak-logo" src={app.companyLogo} alt="" />
                                <div className="ak-info">
                                  <div className="ak-title">{app.opportunity}</div>
                                  <div className="ak-company">{app.company}</div>
                                  <div className="ak-deadline">⏰ {app.deadline}</div>
                                </div>
                              </div>
                            ))}
                            {col.length === 0 && <div className="ak-empty">No applications</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        );
      }

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
          { id: "c1", name: "Ballett Zürich", type: "Company", location: "Zürich, CH", lat: 47.37, lng: 8.54, logo: "/demo/artists/1.jpg", styles: ["Classical", "Contemporary"], openPositions: 2 },
          { id: "c2", name: "Theater Regensburg", type: "Company", location: "Regensburg, DE", lat: 49.02, lng: 12.10, logo: "/demo/artists/2.jpg", styles: ["Contemporary", "Classical"], openPositions: 3 },
          { id: "c3", name: "The Movers", type: "Casting Agency", location: "Berlin, DE", lat: 52.52, lng: 13.41, logo: "/demo/artists/3.jpg", styles: ["Contemporary", "Physical Theatre"], openPositions: 1 },
          { id: "c4", name: "Tanz Luzern", type: "Company", location: "Luzern, CH", lat: 47.05, lng: 8.31, logo: "/demo/artists/4.jpg", styles: ["Contemporary"], openPositions: 1 },
          { id: "c5", name: "Pina Bausch Tanztheater", type: "Company", location: "Wuppertal, DE", lat: 51.26, lng: 7.17, logo: "/demo/artists/5.jpg", styles: ["Tanztheater"], openPositions: 1 },
          { id: "c6", name: "Royal Ballet", type: "Company", location: "London, UK", lat: 51.51, lng: -0.13, logo: "/demo/artists/nisha-huizing.jpg", styles: ["Classical", "Contemporary"], openPositions: 2 },
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
                <div className={`pfp-hero${pf.cover ? " has-cover" : ""}`} style={pf.cover ? { backgroundImage: `url(${pf.cover})` } : {}}>
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
                  <button className="pfe-add-btn primary" onClick={() => showToast("Add from Resume")}>Add From Resume</button>
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

        /* ═══ WORKS EDITOR ═══ */
        if (viewWork && currentWork) {
          const wk = currentWork;
          const touringLabel = TOURING_STATUSES.find(s => s.id === wk.touringStatus)?.label || wk.touringStatus;

          if (workPreview) {
            /* ── Work Public Preview ── */
            return (
              <div style={{ padding: "0 8px" }}>
                {/* Hero */}
                <div className={`wkp-hero${wk.cover ? " has-cover" : ""}`} style={wk.cover ? { backgroundImage: `url(${wk.cover})` } : {}}>
                  <div className="wkp-hero-label">WORK</div>
                  <div className="wkp-hero-title">{wk.name}</div>
                  <div className="wkp-hero-tagline">{wk.tagline}</div>
                  <div className="wkp-hero-role">{wk.role}</div>
                  <div className="wkp-hero-actions">
                    {wk.upcomingPerformances.length > 0 && <button style={{ background: "#D97706", border: "none", color: "#fff" }}>Get Tickets</button>}
                    <button style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>Book This Work</button>
                  </div>
                </div>

                {/* Key Info */}
                <div className="wkp-keyinfo">
                  {wk.genre && <div className="wkp-keyinfo-pill"><strong>{wk.genre}</strong></div>}
                  {wk.duration && <div className="wkp-keyinfo-pill"><span>Duration</span> <strong>{wk.duration}</strong></div>}
                  {wk.premiereYear && <div className="wkp-keyinfo-pill"><span>Premiere</span> <strong>{wk.premiereYear}</strong></div>}
                  {wk.country && <div className="wkp-keyinfo-pill"><span>{wk.city},</span> <strong>{wk.country}</strong></div>}
                  {wk.language && <div className="wkp-keyinfo-pill"><span>Language</span> <strong>{wk.language}</strong></div>}
                  {wk.ageGuidance && <div className="wkp-keyinfo-pill"><span>Age</span> <strong>{wk.ageGuidance}</strong></div>}
                  <div className="wkp-keyinfo-pill"><span>Status</span> <strong>{touringLabel}</strong></div>
                </div>

                {/* About */}
                {(wk.shortPitch || wk.fullDescription) && (
                  <div className="wkp-about">
                    {wk.shortPitch && <div className="wkp-about-pitch">{wk.shortPitch}</div>}
                    {wk.fullDescription && <div className="wkp-about-desc">{wk.fullDescription}</div>}
                    {wk.conceptNote && <div className="wkp-about-note"><strong>Concept Note</strong><br/>{wk.conceptNote}</div>}
                  </div>
                )}

                {/* Trailer */}
                {wk.cover && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title"><em>Trailer</em> & Video</h3>
                    <div className="wkp-trailer">
                      <img src={wk.cover} alt="" />
                      <div className="wkp-trailer-play" />
                    </div>
                  </div>
                )}

                {/* Credits */}
                {wk.credits.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title">Credits & <em>Team</em></h3>
                    <div className="wkp-credits-grid">
                      {wk.credits.map(cr => (
                        <div key={cr.id} className="wkp-credit-card">
                          <div className="wkp-credit-avatar">{cr.name.split(" ").map(w => w[0]).join("")}</div>
                          <div><div className="wkp-credit-name">{cr.name}</div><div className="wkp-credit-role">{cr.role}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {wk.gallery.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title">Photo <em>Gallery</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{wk.gallery.length} photos</span></h3>
                    <div className="wkp-gallery">
                      {wk.gallery.map(ph => <div key={ph.id} className="wkp-gallery-item"><img src={ph.src} alt={ph.caption} /></div>)}
                    </div>
                  </div>
                )}

                {/* Reviews & Awards */}
                {(wk.reviews.length > 0 || wk.awards.length > 0) && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title"><em>Reviews</em> & Awards</h3>
                    {wk.reviews.map(rv => (
                      <div key={rv.id} className="wke-review-card">
                        <span className={`wke-review-type ${rv.type}`}>{rv.type === "press" ? "Press" : "Audience"}</span>
                        <div className="wke-review-quote">"{rv.quote}"</div>
                        <div className="wke-review-source"><strong>{rv.source}</strong>{rv.rating ? ` · ${"★".repeat(rv.rating)}${"☆".repeat(5 - rv.rating)}` : ""}</div>
                      </div>
                    ))}
                    {wk.awards.map(aw => (
                      <div key={aw.id} className="wke-award-card">
                        <div className={`wke-award-icon ${aw.type}`}>{aw.type === "win" ? "🏆" : aw.type === "nomination" ? "🌟" : "✨"}</div>
                        <div className="wke-award-info">
                          <div className="wke-award-title">{aw.title}</div>
                          <div className="wke-award-meta">{aw.festival} · {aw.year} · {aw.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upcoming Performances */}
                {wk.upcomingPerformances.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title">Upcoming <em>Performances</em></h3>
                    {wk.upcomingPerformances.map(p => {
                      const d = new Date(p.date);
                      return (
                        <div key={p.id} className="wke-perf-item">
                          <div className="wke-perf-date">
                            <div className="wke-perf-date-d">{d.getDate()}</div>
                            <div className="wke-perf-date-m">{d.toLocaleDateString("en-GB", { month: "short" })}</div>
                          </div>
                          <div className="wke-perf-info">
                            <div className="wke-perf-venue">{p.venue}</div>
                            <div className="wke-perf-city">{p.city}</div>
                          </div>
                          {p.ticketUrl && <button className="wke-perf-ticket">Get Tickets →</button>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Past Performances */}
                {wk.pastPerformances.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title">Performance <em>History</em></h3>
                    {wk.pastPerformances.map(p => {
                      const d = new Date(p.date);
                      return (
                        <div key={p.id} className="wke-perf-item" style={{ opacity: 0.7 }}>
                          <div className="wke-perf-date">
                            <div className="wke-perf-date-d">{d.getDate()}</div>
                            <div className="wke-perf-date-m">{d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</div>
                          </div>
                          <div className="wke-perf-info">
                            <div className="wke-perf-venue">{p.venue}</div>
                            <div className="wke-perf-city">{p.city}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Availability & Booking */}
                <div className="wkp-avail">
                  <div className="wkp-avail-status">
                    <div className={`wkp-avail-dot ${wk.touringStatus}`} />
                    {touringLabel}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {wk.bookingCtas.map((cta, i) => (
                      <button key={i} className={`wke-cta-btn ${cta.intent}`}>{cta.label}</button>
                    ))}
                    {wk.bookingCtas.length === 0 && wk.bookingEmail && <button className="wke-cta-btn contact">Contact</button>}
                  </div>
                </div>

                {/* Partners */}
                {wk.partners.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title">Partners & <em>Presented By</em></h3>
                    {wk.partners.map(pt => (
                      <div key={pt.id} className="wke-partner">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(217,119,6,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤝</div>
                        <div><div className="wke-partner-name">{pt.name}</div><div className="wke-partner-type">{pt.type}</div></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technical Info */}
                {(wk.techRequirements.stageMinWidth || wk.techRequirements.performers) && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title"><em>Technical</em> Info</h3>
                    <div className="wke-section" style={{ padding: 0 }}>
                      <table className="wke-tech-table">
                        <tbody>
                          {wk.techRequirements.stageMinWidth && <tr><td>Stage Width (min)</td><td>{wk.techRequirements.stageMinWidth}</td></tr>}
                          {wk.techRequirements.stageMinDepth && <tr><td>Stage Depth (min)</td><td>{wk.techRequirements.stageMinDepth}</td></tr>}
                          {wk.techRequirements.performers && <tr><td>Performers</td><td>{wk.techRequirements.performers}</td></tr>}
                          {wk.techRequirements.setupTime && <tr><td>Setup Time</td><td>{wk.techRequirements.setupTime}</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Accessibility */}
                {(wk.accessibility.captions || wk.accessibility.relaxedPerformance || wk.accessibility.audioDescription || wk.accessibility.sensoryNotes) && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title"><em>Accessibility</em></h3>
                    <div className="wke-section">
                      <div className="wke-access-row"><span className="wke-access-label">Captions</span><span className={`wke-access-badge ${wk.accessibility.captions ? "yes" : "no"}`}>{wk.accessibility.captions ? "Yes" : "No"}</span></div>
                      <div className="wke-access-row"><span className="wke-access-label">Relaxed Performance</span><span className={`wke-access-badge ${wk.accessibility.relaxedPerformance ? "yes" : "no"}`}>{wk.accessibility.relaxedPerformance ? "Yes" : "No"}</span></div>
                      <div className="wke-access-row"><span className="wke-access-label">Audio Description</span><span className={`wke-access-badge ${wk.accessibility.audioDescription ? "yes" : "no"}`}>{wk.accessibility.audioDescription ? "Yes" : "No"}</span></div>
                      {wk.accessibility.sensoryNotes && <div style={{ marginTop: 8, fontSize: 12, color: "var(--g4)" }}>Note: {wk.accessibility.sensoryNotes}</div>}
                    </div>
                  </div>
                )}

                {/* Downloads */}
                {wk.downloads.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="wkp-section-title"><em>Downloads</em></h3>
                    {wk.downloads.map(dl => (
                      <div key={dl.id} className="wke-dl-item">
                        <div className="wke-dl-icon">📄</div>
                        <div className="wke-dl-info"><div className="wke-dl-title">{dl.label}</div><div className="wke-dl-meta">{dl.format} · {dl.size}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          /* ── Work Tracking View ── */
          if (workTab === "tracking") {
            const views = MOCK_WORK_TRACKING.filter(t => t.workId === viewWork);
            const isPro = artist.plan === "Pro" || artist.plan === "Studio";
            return (
              <div style={{ padding: "0 8px", animation: "fadeIn .3s ease" }}>
                <div className="wke-section">
                  <h3><em style={{ color: "#D97706" }}>Tracking</em> & Analytics</h3>
                  {isPro ? (
                    <>
                      <div className="wkt-stats">
                        <div className="wkt-stat"><div className="wkt-val">{views.length}</div><div className="wkt-label">Total Views</div></div>
                        <div className="wkt-stat"><div className="wkt-val">{views.filter(v => v.email).length}</div><div className="wkt-label">Identified</div></div>
                        <div className="wkt-stat"><div className="wkt-val">{views.filter(v => v.sections.length >= 3).length}</div><div className="wkt-label">Deep Views</div></div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--g4)", marginBottom: 10 }}>Recent Viewers</div>
                      <div className="wkt-list">
                        {views.map(v => (
                          <div key={v.id} className="wkt-item">
                            <div className="wkt-avatar">{v.name === "Anonymous" ? "?" : v.name.split(" ").map(w => w[0]).join("")}</div>
                            <div className="wkt-info">
                              <div className="wkt-name">{v.name}</div>
                              <div className="wkt-org">{v.org || "Unknown"}{v.email ? ` · ${v.email}` : ""}</div>
                              <div className="wkt-sections">{v.sections.map(s => <span key={s}>{s}</span>)}</div>
                            </div>
                            <div className="wkt-meta">
                              <span>{v.duration}</span>
                              <span>{new Date(v.viewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                              <span>{v.device}</span>
                            </div>
                          </div>
                        ))}
                        {views.length === 0 && <p style={{ color: "var(--g4)", fontSize: 13, textAlign: "center", padding: 20 }}>No views yet. Share your work to start tracking.</p>}
                      </div>
                    </>
                  ) : (
                    <div className="wkt-pro-gate">
                      <h4>Upgrade to Pro</h4>
                      <p>Track who views your work page, see which sections they explore, and get notified when someone opens your link.</p>
                      <button onClick={() => showToast("Upgrade to Pro")}>Upgrade to Pro</button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          /* ── Work Settings ── */
          if (workTab === "settings") {
            return (
              <div style={{ padding: "0 8px", animation: "fadeIn .3s ease" }}>
                <div className="wke-section">
                  <h3>Work <em>Settings</em></h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label className="wke-input-label">Work Name</label>
                      <input className="wke-input" value={wk.name} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, name: e.target.value } : w))} />
                    </div>
                    <div>
                      <label className="wke-input-label">Tagline</label>
                      <input className="wke-input" value={wk.tagline} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, tagline: e.target.value } : w))} />
                    </div>
                    <div>
                      <label className="wke-input-label">Role</label>
                      <select className="wke-select" value={wk.role} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, role: e.target.value } : w))}>
                        <option value="">Select...</option>
                        {WORK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="wke-input-label">Genre</label>
                      <input className="wke-input" value={wk.genre} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, genre: e.target.value } : w))} />
                    </div>
                    <div>
                      <label className="wke-input-label">Duration</label>
                      <input className="wke-input" value={wk.duration} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, duration: e.target.value } : w))} />
                    </div>
                    <div>
                      <label className="wke-input-label">Premiere Year</label>
                      <input className="wke-input" value={wk.premiereYear} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, premiereYear: e.target.value } : w))} />
                    </div>
                    <div>
                      <label className="wke-input-label">Touring Status</label>
                      <select className="wke-select" value={wk.touringStatus} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, touringStatus: e.target.value } : w))}>
                        {TOURING_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="wke-input-label">Banner Image</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {wk.cover ? (
                          <div style={{ width: 200, height: 80, borderRadius: 10, overflow: "hidden", border: "1px solid var(--g2)", position: "relative" }}>
                            <img src={wk.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, cover: "" } : w))}>×</button>
                          </div>
                        ) : null}
                        <button className="wke-add-btn secondary" onClick={() => showToast("Upload banner image")}>{wk.cover ? "Replace Banner" : "Upload Banner Image"}</button>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid var(--g1)", paddingTop: 16 }}>
                      <button className="btn" style={{ background: "rgba(255,71,87,.08)", color: "var(--red)", border: "1px solid rgba(255,71,87,.15)" }} onClick={() => {
                        setWorks(prev => prev.filter(w => w.id !== viewWork));
                        setViewWork(null); setPage("present");
                        showToast("Work deleted");
                      }}>Delete Work</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ── Work Editor — Tab-based ── */
          return (
            <div style={{ padding: "0 8px", animation: "fadeIn .3s ease" }}>
              {/* Banner */}
              <div className="wke-banner">
                {wk.cover ? <img src={wk.cover} alt="" /> : null}
                <div className="wke-banner-overlay">
                  <div className="wke-banner-title">{wk.name}</div>
                  <div className="wke-banner-tagline">{wk.tagline}</div>
                </div>
              </div>

              {workTab === "overview" && (
                <>
                  {/* Key Info Pills */}
                  <div className="wke-section">
                    <h3><em>Key</em> Info</h3>
                    <div className="wke-pill-row">
                      {wk.genre && <span className="wke-pill">{wk.genre}</span>}
                      {wk.duration && <span className="wke-pill">{wk.duration}</span>}
                      {wk.premiereYear && <span className="wke-pill">Premiere {wk.premiereYear}</span>}
                      {wk.country && <span className="wke-pill">{wk.city}, {wk.country}</span>}
                      {wk.language && <span className="wke-pill">{wk.language}</span>}
                      {wk.ageGuidance && <span className="wke-pill">{wk.ageGuidance}</span>}
                      <span className="wke-pill">{touringLabel}</span>
                    </div>
                  </div>

                  {/* Short Pitch */}
                  <div className="wke-section">
                    <h3><em>Short</em> Pitch</h3>
                    <textarea className="wke-textarea" style={{ minHeight: 60 }} value={wk.shortPitch} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, shortPitch: e.target.value } : w))} placeholder="A 1-2 sentence hook for your work..." />
                  </div>

                  {/* Stats summary */}
                  <div className="wke-row">
                    <div className="wke-section" style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706" }}>{wk.credits.length}</div>
                      <div style={{ fontSize: 11, color: "var(--g4)", textTransform: "uppercase" }}>Credits</div>
                    </div>
                    <div className="wke-section" style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706" }}>{wk.upcomingPerformances.length}</div>
                      <div style={{ fontSize: 11, color: "var(--g4)", textTransform: "uppercase" }}>Upcoming Shows</div>
                    </div>
                  </div>
                  <div className="wke-row">
                    <div className="wke-section" style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706" }}>{wk.reviews.length}</div>
                      <div style={{ fontSize: 11, color: "var(--g4)", textTransform: "uppercase" }}>Reviews</div>
                    </div>
                    <div className="wke-section" style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706" }}>{wk.awards.length}</div>
                      <div style={{ fontSize: 11, color: "var(--g4)", textTransform: "uppercase" }}>Awards</div>
                    </div>
                  </div>
                </>
              )}

              {workTab === "about" && (
                <>
                  <div className="wke-section">
                    <h3><em>Short</em> Pitch</h3>
                    <textarea className="wke-textarea" style={{ minHeight: 60 }} value={wk.shortPitch} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, shortPitch: e.target.value } : w))} placeholder="A 1-2 sentence hook for your work..." />
                  </div>
                  <div className="wke-section">
                    <h3>Full <em>Description</em></h3>
                    <textarea className="wke-textarea" style={{ minHeight: 120 }} value={wk.fullDescription} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, fullDescription: e.target.value } : w))} placeholder="Full synopsis and background of the work..." />
                  </div>
                  <div className="wke-section">
                    <h3><em>Concept</em> Note</h3>
                    <textarea className="wke-textarea" style={{ minHeight: 100 }} value={wk.conceptNote} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, conceptNote: e.target.value } : w))} placeholder="Artistic concept note (optional)..." />
                  </div>
                  <div className="wke-section">
                    <h3>Key <em>Info</em></h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label className="wke-input-label">Genre</label><input className="wke-input" value={wk.genre} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, genre: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">Duration</label><input className="wke-input" value={wk.duration} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, duration: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">Premiere Year</label><input className="wke-input" value={wk.premiereYear} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, premiereYear: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">Country</label><input className="wke-input" value={wk.country} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, country: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">City</label><input className="wke-input" value={wk.city} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, city: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">Language</label><input className="wke-input" value={wk.language} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, language: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">Age Guidance</label><input className="wke-input" value={wk.ageGuidance} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, ageGuidance: e.target.value } : w))} /></div>
                      <div><label className="wke-input-label">Touring Status</label><select className="wke-select" value={wk.touringStatus} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, touringStatus: e.target.value } : w))}>{TOURING_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                    </div>
                  </div>
                </>
              )}

              {workTab === "media" && (
                <>
                  <div className="wke-section">
                    <h3><em>Trailer</em> / Video</h3>
                    <div>
                      <label className="wke-input-label">Trailer URL (YouTube/Vimeo)</label>
                      <input className="wke-input" value={wk.trailerUrl} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, trailerUrl: e.target.value } : w))} placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    {wk.cover && (
                      <div className="wkp-trailer" style={{ marginTop: 12 }}>
                        <img src={wk.cover} alt="" />
                        <div className="wkp-trailer-play" />
                      </div>
                    )}
                  </div>
                  <div className="wke-section">
                    <h3>Photo <em>Gallery</em> <span className="wke-count">{wk.gallery.length}</span></h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {wk.gallery.map(ph => (
                        <div key={ph.id} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 10, overflow: "hidden" }}>
                          <img src={ph.src} alt={ph.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, gallery: w.gallery.filter(g => g.id !== ph.id) } : w))}>×</button>
                        </div>
                      ))}
                      <div style={{ aspectRatio: "4/3", borderRadius: 10, border: "2px dashed var(--g2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: "var(--g4)", gap: 4 }} onClick={() => showToast("Add photos from Media Library")}>
                        <span style={{ fontSize: 18 }}>+</span>Add Photos
                      </div>
                    </div>
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => showToast("Opening Media Library picker...")}>Add From Library</button>
                    </div>
                  </div>
                </>
              )}

              {workTab === "credits" && (
                <div className="wke-section">
                  <h3>Credits & <em>Team</em> <span className="wke-count">{wk.credits.length}</span></h3>
                  {wk.credits.map(cr => (
                    <div key={cr.id} className="wke-credit">
                      <div className="wke-credit-avatar">{cr.name.split(" ").map(w => w[0]).join("")}</div>
                      <div className="wke-credit-info">
                        <div className="wke-credit-name">{cr.name}</div>
                        <div className="wke-credit-role">{cr.role}</div>
                      </div>
                      <div className="wke-credit-actions">
                        <button onClick={() => showToast("Edit credit")}>Edit</button>
                        <button onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, credits: w.credits.filter(c => c.id !== cr.id) } : w))}>×</button>
                      </div>
                    </div>
                  ))}
                  <div className="wke-add-row">
                    <button className="wke-add-btn primary" onClick={() => {
                      const id = "cr" + Date.now();
                      setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, credits: [...w.credits, { id, name: "New Credit", role: "Role", profileUrl: "" }] } : w));
                      showToast("Credit added — edit details");
                    }}>+ Add Credit</button>
                    <button className="wke-add-btn secondary" onClick={() => showToast("Link from Lanced profiles")}>Link Profile</button>
                  </div>
                </div>
              )}

              {workTab === "performances" && (
                <>
                  <div className="wke-section">
                    <h3>Upcoming <em>Performances</em> <span className="wke-count">{wk.upcomingPerformances.length}</span></h3>
                    {wk.upcomingPerformances.map(p => {
                      const d = new Date(p.date);
                      return (
                        <div key={p.id} className="wke-perf-item">
                          <div className="wke-perf-date">
                            <div className="wke-perf-date-d">{d.getDate()}</div>
                            <div className="wke-perf-date-m">{d.toLocaleDateString("en-GB", { month: "short" })}</div>
                          </div>
                          <div className="wke-perf-info">
                            <div className="wke-perf-venue">{p.venue}</div>
                            <div className="wke-perf-city">{p.city}</div>
                          </div>
                          <button style={{ background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                            onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, upcomingPerformances: w.upcomingPerformances.filter(x => x.id !== p.id) } : w))}>×</button>
                        </div>
                      );
                    })}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => {
                        const id = "up" + Date.now();
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, upcomingPerformances: [...w.upcomingPerformances, { id, date: "2026-12-01", venue: "New Venue", city: "City", ticketUrl: "" }] } : w));
                        showToast("Performance added — edit details");
                      }}>+ Add Performance</button>
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3>Performance <em>History</em> <span className="wke-count">{wk.pastPerformances.length}</span></h3>
                    {wk.pastPerformances.map(p => {
                      const d = new Date(p.date);
                      return (
                        <div key={p.id} className="wke-perf-item" style={{ opacity: 0.7 }}>
                          <div className="wke-perf-date">
                            <div className="wke-perf-date-d">{d.getDate()}</div>
                            <div className="wke-perf-date-m">{d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</div>
                          </div>
                          <div className="wke-perf-info">
                            <div className="wke-perf-venue">{p.venue}</div>
                            <div className="wke-perf-city">{p.city}</div>
                          </div>
                          <button style={{ background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                            onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, pastPerformances: w.pastPerformances.filter(x => x.id !== p.id) } : w))}>×</button>
                        </div>
                      );
                    })}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => {
                        const id = "pp" + Date.now();
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, pastPerformances: [...w.pastPerformances, { id, date: "2025-01-01", venue: "Past Venue", city: "City" }] } : w));
                        showToast("Past performance added");
                      }}>+ Add Past Performance</button>
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3><em>Availability</em></h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div className={`wkp-avail-dot ${wk.touringStatus}`} style={{ width: 10, height: 10 }} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{touringLabel}</span>
                    </div>
                    <select className="wke-select" value={wk.touringStatus} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, touringStatus: e.target.value } : w))}>
                      {TOURING_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                </>
              )}

              {workTab === "reviews" && (
                <>
                  <div className="wke-section">
                    <h3><em>Reviews</em> & Press <span className="wke-count">{wk.reviews.length}</span></h3>
                    {wk.reviews.map(rv => (
                      <div key={rv.id} className="wke-review-card">
                        <span className={`wke-review-type ${rv.type}`}>{rv.type === "press" ? "Press" : "Audience"}</span>
                        <div className="wke-review-quote">"{rv.quote}"</div>
                        <div className="wke-review-source">
                          <strong>{rv.source}</strong>{rv.rating ? ` · ${"★".repeat(rv.rating)}${"☆".repeat(5 - rv.rating)}` : ""}
                          <button style={{ marginLeft: 8, background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                            onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, reviews: w.reviews.filter(r => r.id !== rv.id) } : w))}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => {
                        const id = "rv" + Date.now();
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, reviews: [...w.reviews, { id, quote: "New review...", source: "Source", rating: 0, type: "press" }] } : w));
                        showToast("Review added — edit details");
                      }}>+ Add Review</button>
                      <button className="wke-add-btn secondary" onClick={() => {
                        const id = "rv" + Date.now();
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, reviews: [...w.reviews, { id, quote: "Audience quote...", source: "Audience member", rating: 0, type: "audience" }] } : w));
                        showToast("Audience quote added");
                      }}>+ Add Audience Quote</button>
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3><em>Awards</em> & Selections <span className="wke-count">{wk.awards.length}</span></h3>
                    {wk.awards.map(aw => (
                      <div key={aw.id} className="wke-award-card">
                        <div className={`wke-award-icon ${aw.type}`}>{aw.type === "win" ? "🏆" : aw.type === "nomination" ? "🌟" : "✨"}</div>
                        <div className="wke-award-info">
                          <div className="wke-award-title">{aw.title}</div>
                          <div className="wke-award-meta">{aw.festival} · {aw.year} · <em>{aw.type}</em></div>
                        </div>
                        <button style={{ background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                          onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, awards: w.awards.filter(a => a.id !== aw.id) } : w))}>×</button>
                      </div>
                    ))}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => {
                        const id = "aw" + Date.now();
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, awards: [...w.awards, { id, title: "Award Name", festival: "Festival", year: "2026", type: "win" }] } : w));
                        showToast("Award added");
                      }}>+ Add Award</button>
                    </div>
                  </div>
                </>
              )}

              {workTab === "booking" && (
                <>
                  <div className="wke-section">
                    <h3><em>Booking</em> Contact</h3>
                    <div>
                      <label className="wke-input-label">Booking Email</label>
                      <input className="wke-input" type="email" value={wk.bookingEmail} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, bookingEmail: e.target.value } : w))} placeholder="booking@yourcompany.com" />
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3>Call to <em>Action</em> Buttons <span className="wke-count">{wk.bookingCtas.length}</span></h3>
                    <p style={{ fontSize: 12, color: "var(--g4)", marginBottom: 12 }}>These buttons appear on your public work page</p>
                    {wk.bookingCtas.map((cta, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <button className={`wke-cta-btn ${cta.intent}`} style={{ pointerEvents: "none" }}>{cta.label}</button>
                        <span style={{ fontSize: 11, color: "var(--g4)" }}>{cta.intent}</span>
                        <button style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                          onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, bookingCtas: w.bookingCtas.filter((_, j) => j !== i) } : w))}>Remove</button>
                      </div>
                    ))}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => {
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, bookingCtas: [...w.bookingCtas, { label: "Book This Work", url: "", intent: "book" }] } : w));
                        showToast("CTA added");
                      }}>+ Add CTA</button>
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3>Partners & <em>Presented By</em> <span className="wke-count">{wk.partners.length}</span></h3>
                    {wk.partners.map(pt => (
                      <div key={pt.id} className="wke-partner">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(217,119,6,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤝</div>
                        <div><div className="wke-partner-name">{pt.name}</div><div className="wke-partner-type">{pt.type}</div></div>
                        <button style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                          onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, partners: w.partners.filter(p => p.id !== pt.id) } : w))}>×</button>
                      </div>
                    ))}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => {
                        const id = "pt" + Date.now();
                        setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, partners: [...w.partners, { id, name: "Partner Name", type: "co-producer" }] } : w));
                        showToast("Partner added");
                      }}>+ Add Partner</button>
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3><em>Technical</em> Requirements</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label className="wke-input-label">Stage Width (min)</label><input className="wke-input" value={wk.techRequirements.stageMinWidth} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, techRequirements: { ...w.techRequirements, stageMinWidth: e.target.value } } : w))} /></div>
                      <div><label className="wke-input-label">Stage Depth (min)</label><input className="wke-input" value={wk.techRequirements.stageMinDepth} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, techRequirements: { ...w.techRequirements, stageMinDepth: e.target.value } } : w))} /></div>
                      <div><label className="wke-input-label">Performers</label><input className="wke-input" value={wk.techRequirements.performers} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, techRequirements: { ...w.techRequirements, performers: e.target.value } } : w))} /></div>
                      <div><label className="wke-input-label">Setup Time</label><input className="wke-input" value={wk.techRequirements.setupTime} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, techRequirements: { ...w.techRequirements, setupTime: e.target.value } } : w))} /></div>
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3><em>Accessibility</em></h3>
                    <div className="wke-access-row">
                      <span className="wke-access-label">Captions available</span>
                      <div className={`sm-switch${wk.accessibility.captions ? " on" : ""}`} onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, accessibility: { ...w.accessibility, captions: !w.accessibility.captions } } : w))} />
                    </div>
                    <div className="wke-access-row">
                      <span className="wke-access-label">Relaxed performance available</span>
                      <div className={`sm-switch${wk.accessibility.relaxedPerformance ? " on" : ""}`} onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, accessibility: { ...w.accessibility, relaxedPerformance: !w.accessibility.relaxedPerformance } } : w))} />
                    </div>
                    <div className="wke-access-row">
                      <span className="wke-access-label">Audio description available</span>
                      <div className={`sm-switch${wk.accessibility.audioDescription ? " on" : ""}`} onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, accessibility: { ...w.accessibility, audioDescription: !w.accessibility.audioDescription } } : w))} />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label className="wke-input-label">Sensory Notes</label>
                      <input className="wke-input" value={wk.accessibility.sensoryNotes} onChange={e => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, accessibility: { ...w.accessibility, sensoryNotes: e.target.value } } : w))} placeholder="e.g. Occasional strobe effects..." />
                    </div>
                  </div>

                  <div className="wke-section">
                    <h3><em>Downloads</em> <span className="wke-count">{wk.downloads.length}</span></h3>
                    {wk.downloads.map(dl => (
                      <div key={dl.id} className="wke-dl-item">
                        <div className="wke-dl-icon">📄</div>
                        <div className="wke-dl-info"><div className="wke-dl-title">{dl.label}</div><div className="wke-dl-meta">{dl.format} · {dl.size}</div></div>
                        <button style={{ background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer" }}
                          onClick={() => setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, downloads: w.downloads.filter(d => d.id !== dl.id) } : w))}>×</button>
                      </div>
                    ))}
                    <div className="wke-add-row">
                      <button className="wke-add-btn primary" onClick={() => showToast("Upload file")}>+ Add Download</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        }

        /* ── Present — Portfolio & Works List ── */
        return (
          <div>
            <div className="pg-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1><em>Present</em></h1>
                <p className="pg-sub">Curate and share your portfolios & works</p>
              </div>
            </div>

            {/* ── Portfolios ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Portfolios</h2>
              <button className="btn btn-p" style={{ fontSize: 12, padding: "8px 16px" }} onClick={() => setShowNewPortfolioModal(true)}>+ New Portfolio</button>
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

            {/* ── Works ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#D97706" }}>Works</h2>
              <button className="btn" style={{ fontSize: 12, padding: "8px 16px", background: "linear-gradient(135deg,#D97706,#B45309)", color: "#fff", border: "none" }} onClick={() => setShowNewWorkModal(true)}>+ New Work</button>
            </div>
            <p style={{ fontSize: 13, color: "var(--g4)", margin: "-4px 0 16px" }}>Create dedicated pages for your shows, productions, and creative works.</p>
            <div className="wk-grid">
              {works.map(wk => (
                <div key={wk.id} className="wk-card" onClick={() => { setViewWork(wk.id); setWorkTab("overview"); }}>
                  {wk.cover ? <img className="wkc-cover" src={wk.cover} alt="" /> : <div className="wkc-cover" style={{ height: 140, background: "linear-gradient(135deg,rgba(217,119,6,.12),rgba(217,119,6,.03))", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", fontSize: 24 }}>🎭</div>}
                  <div className="wkc-body">
                    <div className="wkc-title">{wk.name}</div>
                    <div className="wkc-tagline">{wk.tagline}</div>
                    <div className="wkc-meta">
                      <span className="wkc-status" style={{ background: wk.status === "published" ? "#E6FFF0" : "var(--g1)", color: wk.status === "published" ? "var(--green)" : "var(--g4)" }}>
                        {wk.status}
                      </span>
                      <span className="wkc-genre">{wk.genre}</span>
                      {wk.touringStatus === "available" && <span className="wkc-touring">Touring</span>}
                    </div>
                    <div className="wkc-role">{wk.role} · {wk.duration}</div>
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
                  <p style={{ fontSize: 13, color: "var(--g5)", lineHeight: 1.6, marginBottom: 16 }}>Your Core plan includes unlimited applications, full Resume, media library, and portfolio builder.</p>
                  <div className="info-row"><span className="ir-label">Billing Period</span><span className="ir-value">Monthly</span></div>
                  <div className="info-row"><span className="ir-label">Next Billing</span><span className="ir-value">April 30, 2026</span></div>
                  <div className="info-row"><span className="ir-label">Amount</span><span className="ir-value" style={{ fontFamily: "var(--mono)" }}>€9.99/month</span></div>
                  <button className="btn btn-p btn-sm" style={{ marginTop: 14 }}>Upgrade Plan</button>
                </div>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4>Available Plans</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
                    {[
                      { name: "Free", price: "€0", features: ["5 applications/month", "Basic Resume", "1 Portfolio"] },
                      { name: "Core", price: "€9.99", features: ["Unlimited applications", "Full Resume", "Media Library", "3 Portfolios"], current: true },
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

      /* ── Studio ── */
      case "studio": {
        const selectedPfs = portfolios.filter(p => studioContent.selectedPortfolios.includes(p.id));
        const featuredPf = portfolios.find(p => p.id === studioContent.featuredPortfolio);
        const selectedWks = works.filter(w => studioContent.selectedWorks.includes(w.id));
        const featuredWk = works.find(w => w.id === studioContent.featuredWork);
        const allPhotos = selectedPfs.flatMap(p => p.photos || []);
        const heroPhotos = featuredPf ? (featuredPf.photos || []).slice(0, 3) : allPhotos.slice(0, 3);
        const enabledSections = studioSections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
        const currentThemeData = STUDIO_THEMES.find(t => t.id === studioTheme) || STUDIO_THEMES[0];

        /* ── Scroll-reveal observer ── */
        const noirRevealRef = (el) => {
          if (!el) return;
          // Find the nearest scrollable ancestor as IntersectionObserver root
          let root = el.parentElement;
          while (root && root !== document.body) {
            const ov = getComputedStyle(root).overflowY;
            if (ov === "auto" || ov === "scroll") break;
            root = root.parentElement;
          }
          if (root === document.body) root = null;
          const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
            { threshold: 0.08, root }
          );
          el.querySelectorAll(".noir-reveal,.noir-reveal-left,.noir-reveal-right,.noir-reveal-scale").forEach(child => observer.observe(child));
        };

        /* ── Noir Theme Renderer ── */
        const renderNoirTheme = () => {
          const nm = artist.name.toUpperCase();
          const firstName = artist.firstName?.toUpperCase() || nm.split(" ")[0];
          const lastName = artist.lastName?.toUpperCase() || nm.split(" ").slice(1).join(" ");
          const experiences = stageRecords.filter(s => s.type === "experience" || s.type === "education" || s.type === "award").slice(0, 6);

          /* Scroll phases */
          const imgPhase = Math.min(studioScrollY / 350, 1);
          const namePhase = Math.max(0, Math.min((studioScrollY - 150) / 400, 1));
          const navCompact = studioScrollY > 500;
          const parallaxSlow = studioScrollY * 0.15;
          const parallaxMed = studioScrollY * 0.3;
          /* Nav name entrance — grows from slightly large to normal as hero name arrives */
          const navNamePhase = Math.max(0, Math.min((studioScrollY - 420) / 120, 1));

          return (
            <div className="noir-theme" ref={noirRevealRef} onMouseMove={e => setNoirCursorPos({ x: e.clientX, y: e.clientY })}>
              {/* Custom cursor */}
              <div className="noir-cursor" style={{ left: noirCursorPos.x, top: noirCursorPos.y }} />
              {/* Fixed bottom blur overlay */}
              <div className="noir-blur-overlay" />
              {/* Noir Nav */}
              <nav className={`noir-nav${navCompact ? " noir-nav-compact" : ""}`}>
                {navCompact && (
                  <div className="noir-nav-name" style={{ opacity: navNamePhase, transform: `scale(${0.6 + navNamePhase * 0.4})`, transformOrigin: "left center" }}>{nm}</div>
                )}
                <div className={`noir-nav-links${navCompact ? "" : " noir-nav-spread"}`} style={navCompact ? { opacity: navNamePhase } : undefined}>
                  <span>HOME</span>
                  <span>ABOUT</span>
                  <span>GALLERY</span>
                  {selectedPfs.length > 0 && <span>PORTFOLIOS</span>}
                  {selectedWks.length > 0 && <span>WORKS</span>}
                  <span>CONTACT</span>
                </div>
              </nav>

              {/* Sections rendered in order */}
              {enabledSections.map(section => {
                switch (section.id) {
                  case "hero": {
                    const imgTranslate = -imgPhase * 350;
                    const imgOpacity = 1 - imgPhase * 0.9;
                    const imgScale = 1 - imgPhase * 0.08;
                    /* Name shrinks and flies toward top-left nav position */
                    const nameScale = 1 - namePhase * 0.92;
                    const nameOpacity = namePhase < 0.8 ? 1 : 1 - (namePhase - 0.8) / 0.2;
                    const nameMoveY = namePhase * -45;
                    const nameMoveX = namePhase * -35;
                    return (
                      <section key="hero" className="noir-hero">
                        <div className="noir-hero-name-wrap" style={{ opacity: nameOpacity, transformOrigin: "0% 0%" }}>
                          <div className="noir-hero-name" style={{ transform: `scale(${nameScale}) translate(${nameMoveX}%, ${nameMoveY}vh)` }}>
                            <span className="noir-hero-first">{firstName}</span>
                            {lastName && <span className="noir-hero-last">{lastName}</span>}
                          </div>
                        </div>
                        {heroPhotos.length > 0 && (
                          <div className="noir-hero-grid" style={{ transform: `translateY(${imgTranslate}px) scale(${imgScale})`, opacity: imgOpacity }}>
                            {heroPhotos.map((ph, i) => (
                              <div key={ph.id || i} className={`noir-hero-img${i === 1 ? " noir-hero-img-center" : ""}`}>
                                <img src={ph.src} alt={ph.caption || ""} />
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="noir-hero-gradient" />
                      </section>
                    );
                  }

                  case "about":
                    return (
                      <section key="about" className="noir-about" style={{ position: "relative", overflow: "hidden" }}>
                        <div className="noir-parallax-title noir-parallax-title-right" style={{ transform: `translateX(${-parallaxSlow}px)` }}>ABOUT</div>
                        <div className="noir-about-split">
                          <div className="noir-about-left noir-reveal-left">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                            <h2 className="noir-about-headline">
                              {artist.city?.toUpperCase() || "LONDON"}-BASED<br/>
                              CREATOR OF STRIKING<br/>
                              VISUALS & TIMELESS<br/>
                              PERFORMANCES
                            </h2>
                          </div>
                          <div className="noir-about-right noir-reveal-right">
                            <div className="noir-available">
                              <span className="noir-avail-dot" />
                              AVAILABLE FOR WORK
                            </div>
                            <p className="noir-about-body">{artist.biography || artist.bio}</p>
                          </div>
                        </div>
                        <div className="noir-about-portrait noir-reveal-scale">
                          <img src={artist.photo} alt={artist.name} />
                          <div className="noir-about-overlay">
                            <p className="noir-about-quote">
                              {artist.profileBio || "Step into my world, where every frame is a masterpiece, and your unique journey becomes the heart of my art."}
                            </p>
                            <span className="noir-about-link">ABOUT ME</span>
                          </div>
                        </div>
                      </section>
                    );

                  case "gallery": {
                    if (allPhotos.length === 0) return null;
                    const marqueePhotos = [...allPhotos, ...allPhotos, ...allPhotos];
                    const row1 = marqueePhotos;
                    const row2 = [...marqueePhotos].reverse();
                    const row3 = marqueePhotos;
                    return (
                      <section key="gallery" className="noir-gallery">
                        <div className="noir-parallax-title noir-parallax-title-left" style={{ transform: `translateX(${parallaxSlow}px)` }}>GALLERY</div>
                        <div className="noir-gallery-header noir-reveal">
                          <h2 className="noir-section-title" style={{ marginBottom: 8 }}>EXPLORE THE<br/>FULL GALLERY</h2>
                          <div className="noir-gallery-cta">
                            VIEW ALL WORK
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                        <div className="noir-marquee-row">
                          <div className="noir-marquee-track">
                            {row1.map((ph, i) => <div key={`r1-${i}`} className="noir-marquee-img"><img src={ph.src} alt={ph.caption || ""} /></div>)}
                          </div>
                          <div className="noir-marquee-track">
                            {row1.map((ph, i) => <div key={`r1d-${i}`} className="noir-marquee-img"><img src={ph.src} alt={ph.caption || ""} /></div>)}
                          </div>
                        </div>
                        <div className="noir-marquee-row reverse">
                          <div className="noir-marquee-track">
                            {row2.map((ph, i) => <div key={`r2-${i}`} className="noir-marquee-img"><img src={ph.src} alt={ph.caption || ""} /></div>)}
                          </div>
                          <div className="noir-marquee-track">
                            {row2.map((ph, i) => <div key={`r2d-${i}`} className="noir-marquee-img"><img src={ph.src} alt={ph.caption || ""} /></div>)}
                          </div>
                        </div>
                        <div className="noir-marquee-row">
                          <div className="noir-marquee-track">
                            {row3.map((ph, i) => <div key={`r3-${i}`} className="noir-marquee-img"><img src={ph.src} alt={ph.caption || ""} /></div>)}
                          </div>
                          <div className="noir-marquee-track">
                            {row3.map((ph, i) => <div key={`r3d-${i}`} className="noir-marquee-img"><img src={ph.src} alt={ph.caption || ""} /></div>)}
                          </div>
                        </div>
                      </section>
                    );
                  }

                  case "portfolios":
                    if (selectedPfs.length === 0) return null;
                    return (
                      <section key="portfolios" className="noir-portfolios">
                        <div className="noir-parallax-title noir-parallax-title-right" style={{ transform: `translateX(${-parallaxMed + 100}px)` }}>COLLECTIONS</div>
                        <h2 className="noir-section-title noir-reveal">PORTFOLIOS</h2>
                        <div className="noir-portfolios-grid">
                          {selectedPfs.map((pf, i) => (
                            <div key={pf.id} className={`noir-portfolio-card noir-reveal noir-stagger-${Math.min(i + 1, 4)}${pf.id === studioContent.featuredPortfolio ? " featured" : ""}`}>
                              {pf.cover && <div className="noir-pf-cover"><img src={pf.cover} alt={pf.name} /></div>}
                              <div className="noir-pf-info">
                                {pf.id === studioContent.featuredPortfolio && <span className="noir-pf-badge">Featured</span>}
                                <h3>{pf.name}</h3>
                                <p>{pf.description}</p>
                                <div className="noir-pf-tags">
                                  {pf.styles?.map(s => <span key={s}>{s}</span>)}
                                </div>
                                <div className="noir-pf-stats">
                                  <span>{pf.photos?.length || 0} Photos</span>
                                  <span>{pf.videos?.length || 0} Videos</span>
                                  {pf.references?.length > 0 && <span>{pf.references.length} References</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  case "featuredWork":
                    if (!featuredWk) return null;
                    return (
                      <section key="featuredWork" className="noir-featured-work" style={{ position: "relative", overflow: "hidden" }}>
                        <div className="noir-parallax-title noir-parallax-title-left" style={{ transform: `translateX(${parallaxSlow - 60}px)` }}>FEATURED</div>
                        <div className="noir-fw-label noir-reveal">FEATURED WORK</div>
                        <h2 className="noir-fw-title noir-reveal noir-stagger-1">{featuredWk.name}</h2>
                        <p className="noir-fw-tagline noir-reveal noir-stagger-2">{featuredWk.tagline}</p>
                        {featuredWk.cover && (
                          <div className="noir-fw-cover noir-reveal-scale noir-stagger-3">
                            <img src={featuredWk.cover} alt={featuredWk.name} />
                          </div>
                        )}
                        <div className="noir-fw-meta noir-reveal noir-stagger-4">
                          <span>{featuredWk.genre}</span>
                          <span>{featuredWk.duration}</span>
                          <span>{featuredWk.role}</span>
                        </div>
                        <p className="noir-fw-desc">{featuredWk.shortPitch}</p>
                        {featuredWk.reviews?.length > 0 && (
                          <div className="noir-fw-reviews">
                            {featuredWk.reviews.slice(0, 2).map(rv => (
                              <blockquote key={rv.id} className="noir-fw-quote">
                                <p>"{rv.quote}"</p>
                                <cite>— {rv.source}{rv.rating ? ` · ${"★".repeat(rv.rating)}` : ""}</cite>
                              </blockquote>
                            ))}
                          </div>
                        )}
                        {featuredWk.upcomingPerformances?.length > 0 && (
                          <div className="noir-fw-performances">
                            <h3>UPCOMING</h3>
                            {featuredWk.upcomingPerformances.map(p => (
                              <div key={p.id} className="noir-fw-perf">
                                <span className="noir-fw-perf-date">{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                                <span>{p.venue}, {p.city}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );

                  case "experience":
                    if (experiences.length === 0) return null;
                    return (
                      <section key="experience" className="noir-experience" style={{ position: "relative", overflow: "hidden" }}>
                        <div className="noir-parallax-title noir-parallax-title-right" style={{ transform: `translateX(${-parallaxSlow + 40}px)` }}>CAREER</div>
                        <h2 className="noir-section-title noir-reveal">CAREER<br/>HIGHLIGHTS</h2>
                        <div className="noir-exp-grid">
                          {experiences.map((sr, i) => (
                            <div key={sr.id} className={`noir-exp-card noir-reveal noir-stagger-${Math.min(i + 1, 6)}`}>
                              <div className="noir-exp-type">{sr.type.toUpperCase()}</div>
                              <h3 className="noir-exp-title">{sr.title}</h3>
                              <div className="noir-exp-org">{sr.org}</div>
                              <div className="noir-exp-period">{sr.start?.slice(0, 4)}{sr.end ? ` — ${sr.end.slice(0, 4)}` : " — Present"}</div>
                              {sr.desc && <p className="noir-exp-desc">{sr.desc}</p>}
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  case "works":
                    if (selectedWks.length === 0) return null;
                    return (
                      <section key="works" className="noir-works">
                        <div className="noir-parallax-title noir-parallax-title-left" style={{ transform: `translateX(${parallaxMed - 80}px)` }}>WORKS</div>
                        <h2 className="noir-section-title noir-reveal">WORKS</h2>
                        <div className="noir-works-grid">
                          {selectedWks.map((wk, i) => (
                            <div key={wk.id} className={`noir-work-card noir-reveal noir-stagger-${Math.min(i + 1, 4)}`}>
                              {wk.cover && <img src={wk.cover} alt={wk.name} />}
                              <div className="noir-work-info">
                                <h3>{wk.name}</h3>
                                <span>{wk.genre} · {wk.duration}</span>
                                <span className="noir-work-role">{wk.role}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  case "exploreGallery":
                    return null;

                  case "testimonials": {
                    const testimonials = [
                      { quote: "Working with " + artist.firstName + " was an extraordinary experience. Their artistry and dedication brought an entirely new dimension to our production.", name: "Sarah Chen", role: "Artistic Director, National Dance Theatre" },
                      { quote: "A truly remarkable talent. " + artist.firstName + " brings raw emotion and technical precision together in a way I've rarely seen in my career.", name: "Marcus Webb", role: "Choreographer" },
                      { quote: "Every movement tells a story. " + artist.firstName + " has an innate ability to connect with an audience that goes beyond technique — it's pure magic.", name: "Elena Petrova", role: "Creative Director, Movement Studios" },
                    ];
                    const t = testimonials[studioTestimonialIdx % testimonials.length];
                    return (
                      <section key="testimonials" className="noir-testimonials noir-reveal-scale">
                        <div className="noir-testimonials-bg">
                          <img src={allPhotos[2]?.src || allPhotos[0]?.src || artist.photo} alt="" />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)" }} />
                        </div>
                        <div className="noir-testimonials-card">
                          <p className="noir-testimonials-quote">"{t.quote}"</p>
                          <div className="noir-testimonials-dot" />
                          <div className="noir-testimonials-name">{t.name}</div>
                          <div className="noir-testimonials-role">{t.role}</div>
                          <div className="noir-testimonials-arrows">
                            <button onClick={() => setStudioTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}>&#8592;</button>
                            <button onClick={() => setStudioTestimonialIdx(i => (i + 1) % testimonials.length)}>&#8594;</button>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  case "contact":
                    return (
                      <section key="contact" className="noir-connect noir-reveal">
                        <div className="noir-connect-left">
                          <h2>LET'S<br/>WORK<br/>TOGETHER</h2>
                          <p>Open to new collaborations, performances, and creative partnerships. Reach out and let's create something memorable.</p>
                          <a className="noir-connect-cta" href={`mailto:${artist.email}`}>GET IN TOUCH <span>→</span></a>
                        </div>
                        <div className="noir-connect-right">
                          <div className="noir-connect-item">
                            <span className="noir-connect-item-label">Email</span>
                            <span className="noir-connect-item-value"><a href={`mailto:${artist.email}`}>{artist.email}</a></span>
                          </div>
                          {artist.socials?.instagram && (
                            <div className="noir-connect-item">
                              <span className="noir-connect-item-label">Instagram</span>
                              <span className="noir-connect-item-value"><a href="#">@{artist.socials.instagram}</a></span>
                            </div>
                          )}
                          {artist.links?.website && (
                            <div className="noir-connect-item">
                              <span className="noir-connect-item-label">Website</span>
                              <span className="noir-connect-item-value"><a href="#">{artist.links.website}</a></span>
                            </div>
                          )}
                          <div className="noir-connect-item">
                            <span className="noir-connect-item-label">Location</span>
                            <span className="noir-connect-item-value">{artist.city}, {artist.country}</span>
                          </div>
                          <div className="noir-connect-item">
                            <span className="noir-connect-item-label">Availability</span>
                            <span className="noir-connect-item-value" style={{ color: "rgba(130,220,130,.8)" }}>Open to work</span>
                          </div>
                        </div>
                      </section>
                    );

                  default:
                    return null;
                }
              })}

              {/* Noir Footer */}
              <footer className="noir-footer-full">
                <div className="noir-footer-bg">
                  <img src={allPhotos[1]?.src || allPhotos[0]?.src || artist.photo} alt="" />
                  <div className="noir-footer-bg-overlay" />
                </div>
                <div className="noir-footer-content">
                  <div className="noir-footer-tagline noir-reveal">
                    <p className="noir-footer-subtitle">EVERY MOMENT HOLDS<br/>A STORY WAITING TO BE<br/>CAPTURED</p>
                    <div className="noir-footer-mid">
                      <div className="noir-footer-nav">
                        <span>HOME</span><span>ABOUT</span><span>GALLERY</span>
                        {selectedPfs.length > 0 && <span>PORTFOLIOS</span>}
                        {selectedWks.length > 0 && <span>WORKS</span>}
                        <span>CONTACT</span>
                      </div>
                      <div className="noir-footer-socials">
                        {artist.socials?.instagram && <a href="#">INSTAGRAM</a>}
                        {artist.socials?.tiktok && <a href="#">TIKTOK</a>}
                        {artist.socials?.youtube && <a href="#">YOUTUBE</a>}
                        {artist.socials?.vimeo && <a href="#">VIMEO</a>}
                        {artist.socials?.linkedin && <a href="#">LINKEDIN</a>}
                      </div>
                    </div>
                  </div>
                  <div className="noir-footer-bottom">
                    <span>© {new Date().getFullYear()} {artist.name.toUpperCase()}. ALL RIGHTS RESERVED.</span>
                    <span>Built with Lanced</span>
                  </div>
                  <div className="noir-footer-bigname">
                    {(() => {
                      const footerName = artist.firstName?.toUpperCase() || nm.split(" ")[0];
                      const w = footerName.length * 190;
                      return (
                        <svg viewBox={`0 0 ${w} 320`} preserveAspectRatio="xMidYMax meet">
                          <text x={w / 2} y="280" textAnchor="middle" fontSize="320" letterSpacing="-10">{footerName}</text>
                        </svg>
                      );
                    })()}
                  </div>
                </div>
              </footer>
            </div>
          );
        };

        /* ── Atrium Theme Renderer ── */
        const atriumRevealRef = (el) => {
          if (!el) return;
          let root = el.parentElement;
          while (root && root !== document.body) {
            const ov = getComputedStyle(root).overflowY;
            if (ov === "auto" || ov === "scroll") break;
            root = root.parentElement;
          }
          if (root === document.body) root = null;
          const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
            { threshold: 0.08, root }
          );
          el.querySelectorAll(".atrium-reveal").forEach(child => observer.observe(child));
        };

        const renderAtriumTheme = () => {
          const nm = artist.name.toUpperCase();
          const firstName = artist.firstName?.toUpperCase() || nm.split(" ")[0];
          const lastName = artist.lastName?.toUpperCase() || nm.split(" ").slice(1).join(" ");
          const experiences = stageRecords.filter(s => s.type === "experience" || s.type === "education" || s.type === "award").slice(0, 6);
          const navCompact = studioScrollY > 300;
          let sNum = 0;

          const sh = (label) => { sNum++; return (
            <div className="atrium-sh">
              <span className="atrium-sh-num">{String(sNum).padStart(3, "0")}</span>
              <div className="atrium-sh-line" />
              <span className="atrium-sh-label">{label}</span>
            </div>
          ); };

          return (
            <div className="atrium-theme" ref={atriumRevealRef}>
              {/* Nav */}
              <nav className={`atrium-nav${navCompact ? " atrium-nav-compact" : ""}`}>
                <div className="atrium-nav-name">{nm}</div>
                <div className="atrium-nav-links">
                  <span>HOME</span>
                  <span>ABOUT</span>
                  <span>GALLERY</span>
                  {selectedPfs.length > 0 && <span>PORTFOLIOS</span>}
                  {selectedWks.length > 0 && <span>WORKS</span>}
                  <span>CONTACT</span>
                </div>
              </nav>

              {/* Sections in order */}
              {enabledSections.map(section => {
                switch (section.id) {
                  case "hero": {
                    const heroImg = heroPhotos?.[0]?.src || artist.photo;
                    return (
                      <section key="hero" className="atrium-hero">
                        <div className="atrium-hero-inner">
                        {heroImg && <img className="atrium-hero-img" src={heroImg} alt={artist.name} />}
                        <div className="atrium-hero-overlay" />
                        <div className="atrium-hero-content">
                          <div className="atrium-hero-brand">{artist.role || "Artist"}</div>
                          <h1 className="atrium-hero-name">
                            <span>{firstName}</span><br/>
                            {lastName && <span>{lastName}</span>}
                          </h1>
                          {artist.biography && <p className="atrium-hero-desc">{(artist.biography || artist.bio || "").slice(0, 160)}...</p>}
                          {artist.styles?.length > 0 && (
                            <div className="atrium-hero-tags">
                              {artist.styles.slice(0, 4).map(s => <span key={s}>{s}</span>)}
                            </div>
                          )}
                        </div>
                        </div>
                      </section>
                    );
                  }

                  case "about":
                    return (
                      <section key="about" className="atrium-about">
                        {sh("About")}
                        <div className="atrium-about-grid">
                          <div className="atrium-about-left atrium-reveal">
                            <h2>{artist.city?.toUpperCase() || "LONDON"}-BASED<br/>CREATOR OF STRIKING<br/>VISUALS & TIMELESS<br/>PERFORMANCES</h2>
                            <div className="atrium-about-avail">
                              <span className="atrium-about-avail-dot" />
                              AVAILABLE FOR WORK
                            </div>
                          </div>
                          <div className="atrium-about-right atrium-reveal atrium-stagger-1">
                            {artist.biography || artist.bio}
                          </div>
                        </div>
                        <div className="atrium-about-portrait atrium-reveal atrium-stagger-2">
                          <img src={artist.photo} alt={artist.name} />
                        </div>
                      </section>
                    );

                  case "gallery": {
                    if (allPhotos.length === 0) return null;
                    return (
                      <section key="gallery" className="atrium-gallery">
                        {sh("Gallery")}
                        <div className="atrium-gallery-grid">
                          {allPhotos.slice(0, 7).map((ph, i) => (
                            <div key={ph.id || i} className="atrium-gallery-item atrium-reveal">
                              <img src={ph.src} alt={ph.caption || ""} />
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  case "portfolios":
                    if (selectedPfs.length === 0) return null;
                    return (
                      <section key="portfolios" className="atrium-portfolios">
                        {sh("Portfolios")}
                        <div className="atrium-pf-grid">
                          {selectedPfs.map((pf, i) => (
                            <div key={pf.id} className={`atrium-pf-card atrium-reveal atrium-stagger-${Math.min(i + 1, 4)}${pf.id === studioContent.featuredPortfolio ? " featured" : ""}`}>
                              {pf.cover && <div className="atrium-pf-cover"><img src={pf.cover} alt={pf.name} /></div>}
                              <div className="atrium-pf-info">
                                {pf.id === studioContent.featuredPortfolio && <span className="atrium-pf-badge">Featured</span>}
                                <h3>{pf.name}</h3>
                                <p>{pf.description}</p>
                                <div className="atrium-pf-tags">{pf.styles?.map(s => <span key={s}>{s}</span>)}</div>
                                <div className="atrium-pf-stats">
                                  <span>{pf.photos?.length || 0} Photos</span>
                                  <span>{pf.videos?.length || 0} Videos</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  case "featuredWork":
                    if (!featuredWk) return null;
                    return (
                      <section key="featuredWork" className="atrium-fw">
                        {sh("Featured Work")}
                        <div className="atrium-fw-label atrium-reveal">FEATURED WORK</div>
                        <h2 className="atrium-fw-title atrium-reveal atrium-stagger-1">{featuredWk.name}</h2>
                        <p className="atrium-fw-tagline atrium-reveal atrium-stagger-2">{featuredWk.tagline}</p>
                        {featuredWk.cover && (
                          <div className="atrium-fw-cover atrium-reveal atrium-stagger-3"><img src={featuredWk.cover} alt={featuredWk.name} /></div>
                        )}
                        <div className="atrium-fw-meta atrium-reveal">
                          <span>{featuredWk.genre}</span>
                          <span>{featuredWk.duration}</span>
                          <span>{featuredWk.role}</span>
                        </div>
                        <p className="atrium-fw-desc">{featuredWk.shortPitch}</p>
                        {featuredWk.reviews?.length > 0 && (
                          <div className="atrium-fw-reviews">
                            {featuredWk.reviews.slice(0, 2).map(rv => (
                              <blockquote key={rv.id} className="atrium-fw-quote">
                                <p>"{rv.quote}"</p>
                                <cite>— {rv.source}{rv.rating ? ` · ${"★".repeat(rv.rating)}` : ""}</cite>
                              </blockquote>
                            ))}
                          </div>
                        )}
                      </section>
                    );

                  case "experience":
                    if (experiences.length === 0) return null;
                    return (
                      <section key="experience" className="atrium-experience">
                        {sh("Experience")}
                        <div className="atrium-exp-grid">
                          {experiences.map((sr, i) => (
                            <div key={sr.id} className={`atrium-exp-card atrium-reveal atrium-stagger-${Math.min(i + 1, 4)}`}>
                              <div className="atrium-exp-type">{sr.type.toUpperCase()}</div>
                              <h3 className="atrium-exp-title">{sr.title}</h3>
                              <div className="atrium-exp-org">{sr.org}</div>
                              <div className="atrium-exp-period">{sr.start?.slice(0, 4)}{sr.end ? ` — ${sr.end.slice(0, 4)}` : " — Present"}</div>
                              {sr.desc && <p className="atrium-exp-desc">{sr.desc}</p>}
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  case "works":
                    if (selectedWks.length === 0) return null;
                    return (
                      <section key="works" className="atrium-works">
                        {sh("Works")}
                        <div className="atrium-works-grid">
                          {selectedWks.map((wk, i) => (
                            <div key={wk.id} className={`atrium-work-card atrium-reveal atrium-stagger-${Math.min(i + 1, 4)}`}>
                              {wk.cover && <img src={wk.cover} alt={wk.name} />}
                              <div className="atrium-work-info">
                                <h3>{wk.name}</h3>
                                <span>{wk.genre} · {wk.duration}</span>
                                <span style={{ marginTop: 2, fontWeight: 500, color: "rgba(17,17,17,.5)" }}>{wk.role}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  case "exploreGallery":
                    return null;

                  case "testimonials": {
                    const testimonials = [
                      { quote: "Working with " + artist.firstName + " was an extraordinary experience. Their artistry and dedication brought an entirely new dimension to our production.", name: "Sarah Chen", role: "Artistic Director, National Dance Theatre" },
                      { quote: "A truly remarkable talent. " + artist.firstName + " brings raw emotion and technical precision together in a way I've rarely seen in my career.", name: "Marcus Webb", role: "Choreographer" },
                      { quote: "Every movement tells a story. " + artist.firstName + " has an innate ability to connect with an audience that goes beyond technique — it's pure magic.", name: "Elena Petrova", role: "Creative Director, Movement Studios" },
                    ];
                    const t = testimonials[studioTestimonialIdx % testimonials.length];
                    return (
                      <section key="testimonials" className="atrium-testimonials">
                        {sh("Testimonials")}
                        <div className="atrium-test-card atrium-reveal">
                          <p className="atrium-test-quote">"{t.quote}"</p>
                          <div className="atrium-test-divider" />
                          <div className="atrium-test-name">{t.name}</div>
                          <div className="atrium-test-role">{t.role}</div>
                          <div className="atrium-test-arrows">
                            <button onClick={() => setStudioTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}>&#8592;</button>
                            <button onClick={() => setStudioTestimonialIdx(i => (i + 1) % testimonials.length)}>&#8594;</button>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  case "contact":
                    return (
                      <section key="contact" className="atrium-contact atrium-reveal">
                        <div className="atrium-contact-left">
                          <h2>LET'S<br/>WORK<br/>TOGETHER</h2>
                          <p>Open to new collaborations, performances, and creative partnerships. Reach out and let's create something memorable.</p>
                          <a className="atrium-contact-cta" href={`mailto:${artist.email}`}>GET IN TOUCH <span>→</span></a>
                        </div>
                        <div className="atrium-contact-right">
                          <div className="atrium-contact-item">
                            <span className="atrium-contact-item-label">Email</span>
                            <span className="atrium-contact-item-value"><a href={`mailto:${artist.email}`}>{artist.email}</a></span>
                          </div>
                          {artist.socials?.instagram && (
                            <div className="atrium-contact-item">
                              <span className="atrium-contact-item-label">Instagram</span>
                              <span className="atrium-contact-item-value"><a href="#">@{artist.socials.instagram}</a></span>
                            </div>
                          )}
                          {artist.links?.website && (
                            <div className="atrium-contact-item">
                              <span className="atrium-contact-item-label">Website</span>
                              <span className="atrium-contact-item-value"><a href="#">{artist.links.website}</a></span>
                            </div>
                          )}
                          <div className="atrium-contact-item">
                            <span className="atrium-contact-item-label">Location</span>
                            <span className="atrium-contact-item-value">{artist.city}, {artist.country}</span>
                          </div>
                          <div className="atrium-contact-item">
                            <span className="atrium-contact-item-label">Availability</span>
                            <span className="atrium-contact-item-value" style={{ color: "#10b981" }}>Open to work</span>
                          </div>
                        </div>
                      </section>
                    );

                  default:
                    return null;
                }
              })}

              {/* Atrium Footer */}
              <footer className="atrium-footer">
                <div className="atrium-footer-nav">
                  <span>HOME</span><span>ABOUT</span><span>GALLERY</span>
                  {selectedPfs.length > 0 && <span>PORTFOLIOS</span>}
                  {selectedWks.length > 0 && <span>WORKS</span>}
                  <span>CONTACT</span>
                </div>
                <div className="atrium-footer-copy">
                  © {new Date().getFullYear()} {artist.name}. Built with Lanced.
                </div>
              </footer>
            </div>
          );
        };

        /* ── Full-screen preview mode ── */
        if (studioMode === "preview") {
          return (
            <div className="studio-preview-full">
              <div className="studio-preview-topbar">
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.15)" }} onClick={() => setStudioMode("builder")}>
                  {I.back} <span style={{ marginLeft: 6 }}>Back to Editor</span>
                </button>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Preview Mode — {currentThemeData.name}</span>
                <button className="btn btn-sm" style={{ background: "#fff", color: "#000" }} onClick={() => { setStudioPublished(true); showToast("Website published!"); setStudioMode("builder"); }}>
                  Publish
                </button>
              </div>
              <div className="studio-preview-viewport" onScroll={e => setStudioScrollY(e.target.scrollTop)}>
                {studioTheme === "noir" && renderNoirTheme()}
                {studioTheme === "atrium" && renderAtriumTheme()}
              </div>
            </div>
          );
        }

        /* ── Builder mode ── */
        if (studioMode === "builder") {
          return (
            <div className="studio-builder">
              {/* Top bar */}
              <div className="studio-builder-topbar">
                <div className="studio-builder-topbar-left">
                  <button className="btn btn-sm btn-s" onClick={() => setStudioMode("gallery")}>
                    {I.back} <span style={{ marginLeft: 6 }}>Exit</span>
                  </button>
                  <span className="studio-builder-theme-name">{currentThemeData.name} Theme</span>
                </div>
                <div className="studio-builder-devices">
                  {[
                    { id: "desktop", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
                    { id: "tablet", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 18h.01"/></svg> },
                    { id: "mobile", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg> },
                  ].map(d => (
                    <button key={d.id} className={`studio-device-btn${studioPreviewDevice === d.id ? " active" : ""}`} onClick={() => setStudioPreviewDevice(d.id)}>
                      {d.icon}
                    </button>
                  ))}
                </div>
                <div className="studio-builder-topbar-right">
                  <button className="btn btn-sm btn-s" onClick={() => { setStudioScrollY(0); setStudioMode("preview"); }}>Preview</button>
                  <button className="btn btn-sm btn-p" onClick={() => { setStudioPublished(true); showToast("Website published!"); }}>
                    {studioPublished ? "Update" : "Publish"}
                  </button>
                </div>
              </div>

              {/* Split pane */}
              <div className="studio-builder-body">
                {/* Left panel */}
                <div className="studio-panel">
                  <div className="studio-panel-tabs">
                    {["theme", "content", "layout", "brand"].map(t => (
                      <button key={t} className={`studio-panel-tab${studioCustomizeTab === t ? " active" : ""}`} onClick={() => setStudioCustomizeTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="studio-panel-content">
                    {/* Theme sub-tab */}
                    {studioCustomizeTab === "theme" && (
                      <div className="studio-theme-grid">
                        {STUDIO_THEMES.map(th => (
                          <div key={th.id} className={`studio-theme-card${studioTheme === th.id ? " active" : ""}${th.locked ? " locked" : ""}`}
                            onClick={() => !th.locked && setStudioTheme(th.id)}>
                            <div className="studio-theme-preview" style={{ backgroundImage: `url(${th.preview})` }}>
                              {th.locked && <div className="studio-theme-lock">PRO</div>}
                              {studioTheme === th.id && <div className="studio-theme-active">Active</div>}
                            </div>
                            <div className="studio-theme-info">
                              <span className="studio-theme-name">{th.name}</span>
                              <span className="studio-theme-desc">{th.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content sub-tab */}
                    {studioCustomizeTab === "content" && (
                      <div className="studio-content-tab">
                        <div className="studio-content-section">
                          <h4>Portfolios</h4>
                          <p className="studio-content-hint">Select which portfolios appear on your website. Mark one as featured for hero placement.</p>
                          {portfolios.map(pf => {
                            const isSelected = studioContent.selectedPortfolios.includes(pf.id);
                            const isFeatured = studioContent.featuredPortfolio === pf.id;
                            return (
                              <div key={pf.id} className={`studio-content-row${isSelected ? " selected" : ""}`}>
                                <div className={`sm-switch${isSelected ? " on" : ""}`} onClick={() => {
                                  setStudioContent(prev => ({
                                    ...prev,
                                    selectedPortfolios: isSelected ? prev.selectedPortfolios.filter(id => id !== pf.id) : [...prev.selectedPortfolios, pf.id],
                                    featuredPortfolio: isSelected && isFeatured ? null : prev.featuredPortfolio,
                                  }));
                                }} />
                                <div className="studio-content-info">
                                  <span className="studio-content-name">{pf.name}</span>
                                  <span className="studio-content-meta">{pf.photos.length} photos · {pf.videos.length} videos · {pf.status}</span>
                                </div>
                                {isSelected && (
                                  <button className={`studio-featured-btn${isFeatured ? " active" : ""}`} onClick={() => {
                                    setStudioContent(prev => ({ ...prev, featuredPortfolio: isFeatured ? null : pf.id }));
                                  }}>
                                    {isFeatured ? "★ Featured" : "☆ Feature"}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="studio-content-section" style={{ marginTop: 24 }}>
                          <h4 style={{ color: "#D97706" }}>Works</h4>
                          <p className="studio-content-hint">Select which works appear on your website. Mark one as featured for a dedicated section.</p>
                          {works.map(wk => {
                            const isSelected = studioContent.selectedWorks.includes(wk.id);
                            const isFeatured = studioContent.featuredWork === wk.id;
                            return (
                              <div key={wk.id} className={`studio-content-row${isSelected ? " selected" : ""}`}>
                                <div className={`sm-switch${isSelected ? " on" : ""}`} onClick={() => {
                                  setStudioContent(prev => ({
                                    ...prev,
                                    selectedWorks: isSelected ? prev.selectedWorks.filter(id => id !== wk.id) : [...prev.selectedWorks, wk.id],
                                    featuredWork: isSelected && isFeatured ? null : prev.featuredWork,
                                  }));
                                }} />
                                <div className="studio-content-info">
                                  <span className="studio-content-name">{wk.name}</span>
                                  <span className="studio-content-meta">{wk.genre} · {wk.role} · {wk.status}</span>
                                </div>
                                {isSelected && (
                                  <button className={`studio-featured-btn${isFeatured ? " active" : ""}`} style={{ borderColor: isFeatured ? "#D97706" : undefined, color: isFeatured ? "#D97706" : undefined }} onClick={() => {
                                    setStudioContent(prev => ({ ...prev, featuredWork: isFeatured ? null : wk.id }));
                                  }}>
                                    {isFeatured ? "★ Featured" : "☆ Feature"}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Layout sub-tab */}
                    {studioCustomizeTab === "layout" && (
                      <div className="studio-layout-tab">
                        <h4>Sections</h4>
                        <p className="studio-content-hint">Toggle sections on/off. Drag to reorder.</p>
                        {studioSections.sort((a, b) => a.order - b.order).map((sec, idx) => (
                          <div key={sec.id} className="studio-section-row">
                            <div className="studio-section-drag">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>
                            </div>
                            <span className="studio-section-label">{sec.label}</span>
                            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                              {idx > 0 && (
                                <button className="studio-section-move" onClick={() => {
                                  setStudioSections(prev => {
                                    const arr = [...prev].sort((a, b) => a.order - b.order);
                                    const curOrder = arr[idx].order;
                                    arr[idx].order = arr[idx - 1].order;
                                    arr[idx - 1].order = curOrder;
                                    return arr;
                                  });
                                }}>↑</button>
                              )}
                              {idx < studioSections.length - 1 && (
                                <button className="studio-section-move" onClick={() => {
                                  setStudioSections(prev => {
                                    const arr = [...prev].sort((a, b) => a.order - b.order);
                                    const curOrder = arr[idx].order;
                                    arr[idx].order = arr[idx + 1].order;
                                    arr[idx + 1].order = curOrder;
                                    return arr;
                                  });
                                }}>↓</button>
                              )}
                              <div className={`sm-switch${sec.enabled ? " on" : ""}`} onClick={() => {
                                setStudioSections(prev => prev.map(s => s.id === sec.id ? { ...s, enabled: !s.enabled } : s));
                              }} />
                            </div>
                          </div>
                        ))}

                        <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 20 }}>
                          <h4>Gallery Layout</h4>
                          <p className="studio-content-hint">Choose how your gallery images are displayed.</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                            {[{id:"grid",label:"Grid",desc:"Clean 2-column"},{id:"masonry",label:"Masonry",desc:"Pinterest-style"},{id:"magazine",label:"Magazine",desc:"Editorial spread"},{id:"spread",label:"Spread",desc:"Scattered cards"}].map(l => (
                              <div key={l.id} onClick={() => setStudioGalleryLayout(l.id)} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${studioGalleryLayout === l.id ? "rgba(99,102,241,.6)" : "rgba(255,255,255,.08)"}`, background: studioGalleryLayout === l.id ? "rgba(99,102,241,.1)" : "transparent", cursor: "pointer", transition: "all .2s" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: studioGalleryLayout === l.id ? "#fff" : "rgba(255,255,255,.7)" }}>{l.label}</div>
                                <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 2 }}>{l.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Brand sub-tab */}
                    {studioCustomizeTab === "brand" && (
                      <div className="studio-brand-tab">
                        <h4>Accent Color</h4>
                        <div className="studio-color-swatches">
                          {["#ffffff", "#604dff", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"].map(c => (
                            <button key={c} className={`studio-swatch${studioBrand.accentColor === c ? " active" : ""}`}
                              style={{ background: c, border: c === "#ffffff" ? "1px solid var(--g3)" : "none" }}
                              onClick={() => setStudioBrand(prev => ({ ...prev, accentColor: c }))} />
                          ))}
                        </div>

                        <h4 style={{ marginTop: 20 }}>Font Pair</h4>
                        {[
                          { id: "inter", label: "Inter", desc: "Clean & modern", sample: "'Inter',system-ui,sans-serif" },
                          { id: "playfair", label: "Playfair + DM Sans", desc: "Elegant editorial", sample: "'Georgia',serif" },
                          { id: "mono", label: "Monospace", desc: "Technical & raw", sample: "'SF Mono',monospace" },
                        ].map(fp => (
                          <div key={fp.id} className={`studio-font-pair${studioBrand.fontPairId === fp.id ? " active" : ""}`}
                            onClick={() => setStudioBrand(prev => ({ ...prev, fontPairId: fp.id }))}>
                            <span style={{ fontFamily: fp.sample, fontSize: 14, fontWeight: 600 }}>{fp.label}</span>
                            <span style={{ fontSize: 11, color: "var(--g4)" }}>{fp.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right preview */}
                <div className="studio-preview-area">
                  <div className={`studio-preview-frame studio-preview-${studioPreviewDevice}`} onScroll={e => setStudioScrollY(e.target.scrollTop)}>
                    {studioTheme === "noir" && renderNoirTheme()}
                {studioTheme === "atrium" && renderAtriumTheme()}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        /* ── Default: Studio page with tabs ── */
        return (
          <div>
            <div className="pg-header">
              <h1><em>Studio</em></h1>
              <p className="pg-sub">Build and publish your personal website</p>
            </div>

            <div className="tab-bar" style={{ marginBottom: 20 }}>
              {["website", "analytics", "settings"].map(t => (
                <button key={t} className={`tab-btn${studioTab === t ? " on" : ""}`} onClick={() => setStudioTab(t)}>
                  {t === "website" ? "Website" : t === "analytics" ? "Analytics" : "Settings"}
                </button>
              ))}
            </div>

            {/* Website tab — Gallery mode */}
            {studioTab === "website" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                {studioPublished && (
                  <div className="studio-live-banner">
                    <span className="noir-avail-dot" style={{ marginRight: 8 }} />
                    <span>Your website is live at <strong>lanced.io/{studioSettings.slug}</strong></span>
                    <button className="btn btn-sm btn-s" style={{ marginLeft: "auto" }} onClick={() => showToast("Link copied!")}>Copy Link</button>
                  </div>
                )}
                <div className="studio-gallery-header">
                  <h3>Choose a Theme</h3>
                  <p style={{ fontSize: 13, color: "var(--g4)", margin: "4px 0 0" }}>Select a theme and customize it to match your style.</p>
                </div>
                <div className="studio-theme-gallery">
                  {STUDIO_THEMES.map(th => (
                    <div key={th.id} className={`studio-gallery-card${studioTheme === th.id ? " active" : ""}${th.locked ? " locked" : ""}`}>
                      <div className="studio-gallery-preview" style={{ backgroundImage: `url(${th.preview})` }}>
                        {th.locked && <div className="studio-theme-lock">PRO</div>}
                        {studioTheme === th.id && <div className="studio-gallery-active">Current Theme</div>}
                        <div className="studio-gallery-overlay">
                          {!th.locked && (
                            <button className="btn btn-sm" style={{ background: "#fff", color: "#000", fontWeight: 600 }}
                              onClick={() => { setStudioTheme(th.id); setStudioMode("builder"); }}>
                              {studioTheme === th.id ? "Edit Website" : "Use Theme"}
                            </button>
                          )}
                          {th.locked && (
                            <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}
                              onClick={() => showToast("Upgrade to Pro to unlock this theme")}>
                              Unlock
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="studio-gallery-info">
                        <span className="studio-gallery-name">{th.name}</span>
                        <span className="studio-gallery-desc">{th.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics tab — Stub */}
            {studioTab === "analytics" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                <div className="stub-section">
                  <div className="stub-icon">📊</div>
                  <div className="stub-title">Website Analytics</div>
                  <p>Track page views, visitor locations, popular sections, and link clicks. Coming soon.</p>
                </div>
              </div>
            )}

            {/* Settings tab */}
            {studioTab === "settings" && (
              <div style={{ animation: "slideInUp .2s ease" }}>
                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: "0 0 16px" }}>Website URL</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: "var(--g4)", whiteSpace: "nowrap" }}>lanced.io/</span>
                    <input style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--g2)", borderRadius: 8, background: "var(--bg)", fontSize: 13, color: "var(--tx)", outline: "none" }}
                      value={studioSettings.slug}
                      onChange={e => setStudioSettings(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--g4)", marginBottom: 6 }}>Custom Domain <span style={{ fontSize: 10, color: "var(--ac)", fontWeight: 400 }}>PRO</span></label>
                    <input style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--g2)", borderRadius: 8, background: "var(--bg)", fontSize: 13, color: "var(--tx)", outline: "none" }}
                      placeholder="www.yourdomain.com"
                      value={studioSettings.customDomain}
                      onChange={e => setStudioSettings(prev => ({ ...prev, customDomain: e.target.value }))} />
                  </div>
                </div>

                <div className="info-card" style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: "0 0 16px" }}>SEO</h4>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--g4)", marginBottom: 6 }}>Page Title</label>
                    <input style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--g2)", borderRadius: 8, background: "var(--bg)", fontSize: 13, color: "var(--tx)", outline: "none" }}
                      value={studioSettings.seoTitle}
                      onChange={e => setStudioSettings(prev => ({ ...prev, seoTitle: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--g4)", marginBottom: 6 }}>Meta Description</label>
                    <textarea style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--g2)", borderRadius: 8, background: "var(--bg)", fontSize: 13, color: "var(--tx)", outline: "none", resize: "vertical", minHeight: 60, fontFamily: "var(--sans)" }}
                      value={studioSettings.seoDesc}
                      onChange={e => setStudioSettings(prev => ({ ...prev, seoDesc: e.target.value }))} />
                  </div>
                </div>

                <div className="info-card">
                  <h4 style={{ margin: "0 0 16px" }}>Visibility</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { id: "public", label: "Public", desc: "Anyone with the link can view" },
                      { id: "private", label: "Private", desc: "Only you can see your website" },
                      { id: "password", label: "Password Protected", desc: "Visitors need a password to access" },
                    ].map(v => (
                      <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid ${studioSettings.visibility === v.id ? "var(--ac)" : "var(--g2)"}`, borderRadius: 10, cursor: "pointer", background: studioSettings.visibility === v.id ? "var(--ac-light, rgba(96,77,255,.05))" : "transparent" }}
                        onClick={() => setStudioSettings(prev => ({ ...prev, visibility: v.id }))}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${studioSettings.visibility === v.id ? "var(--ac)" : "var(--g3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {studioSettings.visibility === v.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ac)" }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>{v.label}</div>
                          <div style={{ fontSize: 11, color: "var(--g4)" }}>{v.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  /* ━━━ MAIN RENDER ━━━ */
  const shellClass = `shell${darkMode ? " dark" : ""}${sidebarCollapsed ? " sb-collapsed" : ""}${(viewSpotlight || viewOpportunity) ? " ctx-spotlight" : ""}${viewPortfolio ? " ctx-portfolio" : ""}${viewWork ? " ctx-works" : ""}`;

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
              <button className={page === "network" ? "active" : ""} onClick={() => { setPage("network"); setViewSpotlight(null); }}>{I.network}<span>Network</span></button>
              <button className={["profile","present","media","academy","messages","studio"].includes(page) ? "active" : ""} onClick={() => setShowMobileMenu(true)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span>More</span></button>
            </>
          )}
        </nav>

        {/* ── Mobile Side Panel ── */}
        {showMobileMenu && <div className="mob-panel-overlay open" onClick={() => setShowMobileMenu(false)} />}
        <div className={`mob-panel${showMobileMenu ? " open" : ""}`}>
          <div className="mob-panel-header">
            <img src={artist.headshot || "/demo/artists/1.jpg"} alt="" />
            <div>
              <div className="mp-name">{artist.firstName} {artist.lastName}</div>
              <div className="mp-plan">{artist.plan === "studio" ? "Studio" : artist.plan === "pro" ? "Pro" : "Core"} Plan</div>
            </div>
            <button className="mob-panel-close" onClick={() => setShowMobileMenu(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="mob-panel-nav">
            {[
              { id: "profile", icon: I.profile, label: "Profile" },
              { id: "present", icon: I.present, label: "Present" },
              { id: "studio", icon: I.studio, label: "Studio" },
              { id: "media", icon: I.media, label: "Media Library" },
              { id: "messages", icon: I.messages, label: "Messages", badge: messages.filter(m => m.unread).length || null },
              { id: "academy", icon: I.academy, label: "Academy" },
            ].map(item => (
              <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { setPage(item.id); setShowMobileMenu(false); setViewSpotlight(null); }}>
                {item.icon}<span>{item.label}</span>
                {item.badge && <span className="mp-badge">{item.badge}</span>}
              </button>
            ))}
            <div className="mp-divider" />
            <button onClick={() => { setShowMobileMenu(false); showToast("Settings coming soon"); }}>
              {I.settings}<span>Settings</span>
            </button>
            <button onClick={() => { setDarkMode(!darkMode); }}>
              {darkMode ? I.sun : I.moon}<span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
          <div className="mob-panel-footer">
            <button onClick={() => { setShowMobileMenu(false); setLoggedIn(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>

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
            ) : viewWork && currentWork ? (
              <>
                <button className="sb-back-toggle" onClick={() => { setViewWork(null); setWorkTab("overview"); setWorkPreview(false); setWorkLive(false); setPage("present"); }}>
                  {I.back}
                  <span className="sb-label">Back to Present</span>
                </button>
                <div style={{ padding: "8px 14px", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }} className="sb-label">{currentWork.name}</div>
                  <div style={{ fontSize: 11, color: "#D97706", marginTop: 2 }} className="sb-label">{currentWork.role} · {currentWork.genre}</div>
                </div>
                {WORKS_TABS.map(t => (
                  <button key={t.id} className={`sidebar-item${workTab === t.id ? " active" : ""}`} onClick={() => {
                    if (t.id === "settings" || t.id === "tracking") { setWorkTab(t.id); setWorkPreview(false); }
                    else { setWorkTab(t.id); setWorkPreview(false); }
                  }}>
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
                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "none", background: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--ac)", textAlign: "left", fontFamily: "var(--sans)" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(96,77,255,.05)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"} onClick={() => { setShowPublicProfile(true); setShowUserMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View Public Profile
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
            <div className="topbar-avatar" style={{ cursor: "pointer" }} onClick={() => setShowPublicProfile(true)}>
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
                <button className="btn btn-s btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={() => { setPortfolioPreview(true); setPortfolioTab("gallery"); setTimeout(() => setPortfolioLive(true), 50); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View Live</button>
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
          {viewWork && currentWork && !workPreview && (
            <div className="breadcrumb-bar">
              <div>
                <span className="bc-link" style={{ cursor: "pointer", color: "var(--g4)", fontSize: 12 }} onClick={() => { setViewWork(null); setWorkTab("overview"); setPage("present"); }}>Present</span>
                <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: 12 }}>{currentWork.name}</span>
              </div>
              <div className="bc-actions">
                <span style={{ background: currentWork.status === "published" ? "#E6FFF0" : "var(--g1)", color: currentWork.status === "published" ? "var(--green)" : "var(--g4)", padding: "3px 10px", borderRadius: 40, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{currentWork.status}</span>
                <button className="btn btn-s btn-sm" onClick={() => setShowWorkShareModal(true)} style={{ display: "flex", alignItems: "center", gap: 4 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>Share</button>
                <button className="btn btn-s btn-sm" onClick={() => { setWorkPreview(true); setWorkTab("overview"); }}>Preview</button>
                <button className="btn btn-s btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={() => { setWorkPreview(true); setWorkTab("overview"); setTimeout(() => setWorkLive(true), 50); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View Live</button>
                {currentWork.status === "draft" ? (
                  <button className="btn btn-sm" style={{ background: "#D97706", color: "#fff", border: "none" }} onClick={() => { setWorks(prev => prev.map(w => w.id === viewWork ? { ...w, status: "published" } : w)); showToast("Work published!"); }}>Publish</button>
                ) : (
                  <button className="btn btn-sm" style={{ background: "#D97706", color: "#fff", border: "none" }} onClick={() => showToast("Changes published!")}>Publish Changes</button>
                )}
              </div>
            </div>
          )}
          {viewWork && currentWork && workPreview && (
            <div className="breadcrumb-bar">
              <div>
                <span className="bc-link" style={{ cursor: "pointer", color: "var(--g4)", fontSize: 12 }} onClick={() => setWorkPreview(false)}>Editor</span>
                <span style={{ color: "var(--g3)", margin: "0 6px" }}>›</span>
                <span style={{ fontWeight: 600, color: "#D97706", fontSize: 12 }}>Preview — {currentWork.name}</span>
              </div>
              <div className="bc-actions">
                <button className="btn btn-s btn-sm" onClick={() => { setWorkPreview(false); setWorkTab("overview"); }}>Back to Editor</button>
                <button className="btn btn-sm" style={{ background: "#D97706", color: "#fff", border: "none" }} onClick={() => setWorkLive(true)}>View Live</button>
                <button className="btn btn-sm" style={{ background: "rgba(217,119,6,.1)", color: "#D97706", border: "1px solid rgba(217,119,6,.2)" }} onClick={() => { navigator.clipboard?.writeText(`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/works/${currentWork.slug}`); showToast("Link copied!"); }}>Copy Link</button>
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
                { icon: "👤", title: "Profile & Resume", desc: "Build your professional identity with a modular career library" },
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
            <p className="modal-sub">{editEntry ? "Update your resume entry" : "Add to your Resume"}</p>

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

      {/* ── Resume Picker ── */}
      {showSRPicker && (
        <div className="picker-overlay" onClick={() => setShowSRPicker(false)}>
          <div className="picker-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h3>Add Resume Entries</h3>
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

      {/* ── Comp Card Preview ── */}
      {showCompCard && (
        <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCompCard(false); }}>
          <div className="cc-toolbar">
            <span>Comp Card Preview</span>
            <div className="cc-actions">
              <div className="cc-zoom">
                <button onClick={() => setCcZoom(z => Math.max(40, z - 10))}>−</button>
                <span>{ccZoom}%</span>
                <button onClick={() => setCcZoom(z => Math.min(120, z + 10))}>+</button>
              </div>
              <button style={{ background: "#fff", color: "#1a1a2e" }} onClick={() => window.print()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                Print / Save PDF
              </button>
              <button style={{ background: "var(--ac)", color: "#fff" }} onClick={() => { showToast("Comp card link copied!"); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                Share
              </button>
              <button style={{ background: "rgba(255,255,255,.15)", color: "#fff" }} onClick={() => setShowCompCard(false)}>Close</button>
            </div>
          </div>
          <div className="cc-page" style={{ transform: `scale(${ccZoom / 100})` }}>
            {/* Header */}
            <div className="cc-header">
              <img className="cc-photo" src={artist.photo} alt="" />
              <div className="cc-info">
                <h1>{artist.firstName} <span>{artist.lastName}</span></h1>
                <div className="cc-discipline">{artist.pronouns} · {artist.location}</div>
                <div className="cc-stats">
                  <div className="cc-stat"><div className="cc-stat-val">{artist.height}</div><div className="cc-stat-label">Height</div></div>
                  <div className="cc-stat"><div className="cc-stat-val">{artist.weight}{artist.weightUnit}</div><div className="cc-stat-label">Weight</div></div>
                  <div className="cc-stat"><div className="cc-stat-val">{artist.eyeColor}</div><div className="cc-stat-label">Eyes</div></div>
                  <div className="cc-stat"><div className="cc-stat-val">{artist.hairColor}</div><div className="cc-stat-label">Hair</div></div>
                </div>
                <div className="cc-bio">{artist.profileBio}</div>
              </div>
            </div>

            {/* Physical Details */}
            <div className="cc-section">
              <div className="cc-section-title">Physical Details</div>
              <div className="cc-grid">
                <div className="cc-grid-item"><span className="cc-gi-label">Gender</span><span className="cc-gi-value">{artist.gender}</span></div>
                <div className="cc-grid-item"><span className="cc-gi-label">Age</span><span className="cc-gi-value">{calcAge(artist.dob)}</span></div>
                <div className="cc-grid-item"><span className="cc-gi-label">Nationality</span><span className="cc-gi-value">{artist.nationality.join(", ")}</span></div>
                <div className="cc-grid-item"><span className="cc-gi-label">Ethnicity</span><span className="cc-gi-value">{artist.ethnicity.join(", ")}</span></div>
                <div className="cc-grid-item"><span className="cc-gi-label">Clothing Size</span><span className="cc-gi-value">{artist.clothingSize}</span></div>
                <div className="cc-grid-item"><span className="cc-gi-label">Shoe Size</span><span className="cc-gi-value">{artist.shoeSize} {artist.shoeSizeUnit}</span></div>
                {artist.chest && <div className="cc-grid-item"><span className="cc-gi-label">Chest</span><span className="cc-gi-value">{artist.chest} {artist.measurementUnit}</span></div>}
                {artist.waist && <div className="cc-grid-item"><span className="cc-gi-label">Waist</span><span className="cc-gi-value">{artist.waist} {artist.measurementUnit}</span></div>}
                {artist.hips && <div className="cc-grid-item"><span className="cc-gi-label">Hips</span><span className="cc-gi-value">{artist.hips} {artist.measurementUnit}</span></div>}
              </div>
            </div>

            {/* Styles & Training */}
            <div className="cc-section">
              <div className="cc-section-title">Styles & Training</div>
              <div className="cc-chips">
                {artist.styles.map(s => <span key={s}>{s}</span>)}
              </div>
            </div>

            {/* Special Skills */}
            {artist.specialSkills.length > 0 && (
              <div className="cc-section">
                <div className="cc-section-title">Special Skills</div>
                <div className="cc-chips">
                  {artist.specialSkills.map(s => <span key={s}>{s}</span>)}
                </div>
              </div>
            )}

            {/* Languages */}
            <div className="cc-section">
              <div className="cc-section-title">Languages</div>
              <div className="cc-chips">
                {artist.languages.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* Union & Representation */}
            <div className="cc-section">
              <div className="cc-section-title">Representation & Union</div>
              <div className="cc-grid">
                {artist.agency && <div className="cc-grid-item"><span className="cc-gi-label">Agency</span><span className="cc-gi-value">{artist.agency}</span></div>}
                {artist.agencyContact && <div className="cc-grid-item"><span className="cc-gi-label">Agent Contact</span><span className="cc-gi-value">{artist.agencyContact}</span></div>}
                <div className="cc-grid-item"><span className="cc-gi-label">Union</span><span className="cc-gi-value">{artist.unionStatus.length > 0 ? artist.unionStatus.join(", ") : "Non-Union"}</span></div>
              </div>
            </div>

            {/* Gallery */}
            {portfolios[0]?.photos?.length > 0 && (
              <div className="cc-section">
                <div className="cc-section-title">Gallery</div>
                <div className="cc-photos">
                  {portfolios[0].photos.slice(0, 4).map((p, i) => <img key={i} src={p} alt="" />)}
                </div>
              </div>
            )}

            {/* Contact & QR */}
            <div className="cc-footer">
              <div className="cc-qr">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=604DFF&data=${encodeURIComponent("https://lanced.app/" + artist.handle)}`} alt="QR" />
                <div className="cc-qr-text">
                  <strong>View Full Portfolio</strong>
                  lanced.app/{artist.handle}<br />
                  {artist.email}
                  {artist.socials.instagram && <><br />@{artist.socials.instagram}</>}
                </div>
              </div>
              <img className="cc-logo" src="/made-with-lanced.png" alt="Lanced" />
            </div>
          </div>
        </div>
      )}

      {/* ── Resume Preview ── */}
      {showResumePreview && (() => {
        const grouped = {};
        const sectionOrder = ["experience", "education", "award", "repertoire", "skills", "press"];
        const sectionLabels = { experience: "Experience", education: "Education", award: "Awards", repertoire: "Repertoire", skills: "Skills", press: "Press" };
        stageRecords.forEach(sr => {
          if (!grouped[sr.type]) grouped[sr.type] = [];
          grouped[sr.type].push(sr);
        });
        return (
          <div className="cr-overlay" onClick={e => { if (e.target === e.currentTarget) setShowResumePreview(false); }}>
            <div className="cr-toolbar">
              <span>Lanced Resume Preview</span>
              <div className="cr-actions">
                <div className="cr-zoom">
                  <button onClick={() => setResumeZoom(z => Math.max(40, z - 10))}>−</button>
                  <span>{resumeZoom}%</span>
                  <button onClick={() => setResumeZoom(z => Math.min(120, z + 10))}>+</button>
                </div>
                <button style={{ background: "#fff", color: "#1a1a2e" }} onClick={() => window.print()}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                  Print / Save PDF
                </button>
                <button style={{ background: "var(--ac)", color: "#fff" }} onClick={() => { showToast("Resume link copied!"); }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                  Share
                </button>
                <button style={{ background: "rgba(255,255,255,.15)", color: "#fff" }} onClick={() => setShowResumePreview(false)}>Close</button>
              </div>
            </div>
            <div className="cr-page" style={{ transform: `scale(${resumeZoom / 100})` }}>
              {/* Header */}
              <div className="cr-header">
                <img className="cr-photo" src={artist.photo} alt="" />
                <div className="cr-info">
                  <h1>{artist.firstName} <span>{artist.lastName}</span></h1>
                  <div className="cr-discipline">{artist.styles?.[0] || "Performer"} · {artist.location}</div>
                  <div className="cr-pronouns">{artist.pronouns}</div>
                  <div className="cr-contact">
                    <span>{artist.email}</span>
                    {artist.socials?.instagram && <span>@{artist.socials.instagram}</span>}
                    {artist.links?.website && <span>{artist.links.website}</span>}
                  </div>
                  <div className="cr-bio">{artist.profileBio}</div>
                </div>
                <div className="cr-qr-block">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=604DFF&data=${encodeURIComponent("https://lanced.app/" + artist.handle)}`} alt="QR" />
                  <div className="cr-qr-url">lanced.app/{artist.handle}</div>
                </div>
              </div>

              {/* Resume Sections */}
              {sectionOrder.map(type => {
                const entries = grouped[type];
                if (!entries || entries.length === 0) return null;
                return (
                  <div key={type} className="cr-section">
                    <div className="cr-section-title">{sectionLabels[type]}</div>
                    {entries.map(sr => (
                      <div key={sr.id} className="cr-entry">
                        <div className="cr-entry-header">
                          <div className="cr-entry-title">{sr.title}</div>
                          <div className="cr-entry-dates">{sr.start}{sr.end ? ` — ${sr.end}` : sr.start ? " — Present" : ""}</div>
                        </div>
                        {sr.org && <div className="cr-entry-org">{sr.org}</div>}
                        {sr.location && <div className="cr-entry-location">{sr.location}</div>}
                        {sr.desc && <div className="cr-entry-desc">{sr.desc}</div>}
                        {sr.tags.length > 0 && (
                          <div className="cr-entry-tags">
                            {sr.tags.map(t => <span key={t}>{t}</span>)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Footer */}
              <div className="cr-footer">
                <div className="cr-footer-text">Generated on {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
                <img src="/made-with-lanced.png" alt="Lanced" />
              </div>
            </div>
          </div>
        );
      })()}

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
              <div className={`pfp-hero pfl-anim${pf.cover ? " has-cover" : ""}`} style={pf.cover ? { backgroundImage: `url(${pf.cover})` } : {}}>
                <div className="pfp-hero-label">ARTIST PORTFOLIO</div>
                <div className="pfp-hero-name">{artist.name.split(" ")[0]} <em>{artist.name.split(" ").slice(1).join(" ")}</em></div>
                <div className="pfp-hero-sub">{pf.discipline} · {artist.location}</div>
                <div className="pfp-hero-actions">
                  <button style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>↓ Download CV</button>
                  <button style={{ background: "var(--ac)", border: "none", color: "#fff" }}>Contact →</button>
                </div>
              </div>
              <div className="pfp-stats pfl-anim">
                <div className="pfp-avatar"><img src={artist.photo} alt="" /></div>
                <div className="pfp-stat"><div className="pfp-stat-val">7</div><div className="pfp-stat-label">YRS EXP</div></div>
                <div className="pfp-stat"><div className="pfp-stat-val">12</div><div className="pfp-stat-label">COMPANIES</div></div>
                <div className="pfp-stat"><div className="pfp-stat-val">3</div><div className="pfp-stat-label">COUNTRIES</div></div>
                <div className="pfp-stat"><div className="pfp-stat-val">24</div><div className="pfp-stat-label">PRODUCTIONS</div></div>
              </div>
              <div className="pfp-tabs pfl-anim">
                {["gallery", "videos", "resume", "references", "documents"].map(t => (
                  <button key={t} className={`pfp-tab${portfolioTab === t ? " active" : ""}`} onClick={() => { setPortfolioTab(t); const el = document.getElementById("pfl-" + t); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>

              {highlightedVid && (
                <div className="pfe-highlight pfl-anim" style={{ marginBottom: 24, cursor: "pointer" }} onClick={() => setLightbox({ items: pf.videos.map(v => ({ src: v.thumb, caption: v.title, type: "image" })), index: pf.videos.findIndex(v => v.id === pf.highlightedVideo) })}>
                  <img src={highlightedVid.thumb} alt="" />
                  <div className="pfe-hl-play" />
                  <div className="pfe-hl-info">
                    <div className="pfe-hl-badge" style={{ background: "rgba(96,77,255,.8)" }}>Featured Showreel</div>
                    <div className="pfe-hl-title">{highlightedVid.title}</div>
                    <div className="pfe-hl-meta">{highlightedVid.duration}</div>
                  </div>
                </div>
              )}

              <div id="pfl-gallery" className="pfl-anim" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}>Photo <em style={{ color: "var(--ac)", fontStyle: "italic" }}>Gallery</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{pf.photos.length} photos</span></h3>
                <div className="pfp-gallery">
                  {pf.photos.map((ph, i) => <div key={ph.id} className="pfp-gallery-item" style={{ cursor: "pointer" }} onClick={() => setLightbox({ items: pf.photos.map(p => ({ src: p.src, caption: p.caption, type: "image" })), index: i })}><img src={ph.src} alt={ph.caption} /></div>)}
                </div>
              </div>

              <div id="pfl-videos" className="pfl-anim" style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px" }}>Video <em style={{ color: "var(--ac)", fontStyle: "italic" }}>& Showreel</em> <span style={{ fontSize: 12, fontWeight: 400, color: "var(--g4)" }}>{pf.videos.length} videos</span></h3>
                <div className="pfp-video-grid">
                  {otherVideos.map((v, i) => (
                    <div key={v.id} className="pfp-video-card" style={{ cursor: "pointer" }} onClick={() => setLightbox({ items: otherVideos.map(vid => ({ src: vid.thumb, caption: vid.title, type: "image" })), index: i })}>
                      <img src={v.thumb} alt="" />
                      <div className="pfp-vc-play" />
                      <div className="pfp-vc-info"><div className="pfp-vc-title">{v.title}</div><div className="pfp-vc-meta">{v.duration}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="pfl-resume" className="pfl-anim" style={{ marginBottom: 32 }}>
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

              <div id="pfl-references" className="pfl-anim" style={{ marginBottom: 32 }}>
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

              <div id="pfl-documents" className="pfl-anim" style={{ marginBottom: 32 }}>
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

            </div>
            <div className="pfl-footer">
              <img src="/made-with-lanced.png" alt="Made with Lanced" />
            </div>
          </div>
        );
      })()}

      {/* ── Public Profile ── */}
      {showPublicProfile && (() => {
        const publishedPortfolios = portfolios.filter(p => p.status === "published");
        const primaryPortfolio = publishedPortfolios[0];
        const highlightedVid = primaryPortfolio?.highlightedVideo ? primaryPortfolio.videos.find(v => v.id === primaryPortfolio.highlightedVideo) : null;
        const curatedPhotos = primaryPortfolio ? primaryPortfolio.photos.slice(0, 6) : [];
        const topResume = stageRecords.filter(sr => sr.usedIn.includes("Resume") || sr.usedIn.includes("Portfolio")).slice(0, 4);
        const RESUME_EMOJI = { experience: "💼", education: "🎓", award: "🏆", skills: "⚡", repertoire: "🎭", press: "📰" };
        const viewingPf = ppViewPortfolio ? portfolios.find(p => p.id === ppViewPortfolio) : null;
        return (
          <div className="pp-overlay">
            <div className="pp-topbar">
              <div className="pp-topbar-left">
                {viewingPf ? (
                  <>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tx)", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, padding: 0 }} onClick={() => { setPpViewPortfolio(null); document.querySelector(".pp-overlay")?.scrollTo({ top: 0 }); }}>
                      {I.back} <span style={{ color: "var(--g4)" }}>Back to profile</span>
                    </button>
                    <span style={{ color: "var(--g3)", margin: "0 4px" }}>·</span>
                    <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: 12 }}>{viewingPf.name}</span>
                  </>
                ) : (
                  <>
                    <img src="/lanced-logo-full.png" alt="Lanced" />
                    <span>·</span>
                    <span>@{artist.handle}</span>
                  </>
                )}
              </div>
              <div className="pp-topbar-actions">
                <button style={{ background: "none", border: "1px solid var(--g2)", color: "var(--tx)" }} onClick={() => { navigator.clipboard?.writeText(viewingPf ? `lanced.app/${artist.handle}/${viewingPf.slug}` : `lanced.app/${artist.handle}`); showToast("Link copied!"); }}>Copy Link</button>
                <button style={{ background: "var(--ac)", border: "none", color: "#fff" }} onClick={() => { setShowPublicProfile(false); setPpViewPortfolio(null); }}>Close</button>
              </div>
            </div>

            {viewingPf ? (
              /* ── Portfolio sub-page ── */
              <>
                <div className="pp-hero">
                  <img className="pp-hero-banner" src={viewingPf.cover} alt="" />
                  <div className="pp-hero-gradient" />
                  <div className="pp-hero-content">
                    <div className="pp-avatar"><img src={artist.photo} alt="" /></div>
                    <div className="pp-hero-info">
                      <div className="pp-hero-name">{viewingPf.name.split(" ")[0]} <em>{viewingPf.name.split(" ").slice(1).join(" ")}</em></div>
                      <div className="pp-hero-handle">{artist.firstName} {artist.lastName} · {viewingPf.discipline} · {artist.city}</div>
                      <div className="pp-hero-bio">{viewingPf.description}</div>
                      <div className="pp-hero-tags">
                        {viewingPf.styles?.map(s => <span key={s}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pp-body">
                  {/* Featured video */}
                  {viewingPf.highlightedVideo && (() => { const hv = viewingPf.videos.find(v => v.id === viewingPf.highlightedVideo); return hv ? (
                    <div className="pp-section">
                      <div className="pp-section-title">Featured <em>Reel</em></div>
                      <div className="pp-featured-video" onClick={() => setLightbox({ items: viewingPf.videos.map(v => ({ src: v.thumb, caption: v.title, type: "image" })), index: viewingPf.videos.indexOf(hv) })}>
                        <img src={hv.thumb} alt="" />
                        <div className="pp-fv-play" />
                        <div className="pp-fv-info">
                          <div className="pp-fv-badge">Featured Showreel</div>
                          <div className="pp-fv-title">{hv.title}</div>
                          <div className="pp-fv-dur">{hv.duration}</div>
                        </div>
                      </div>
                    </div>
                  ) : null; })()}
                  {/* Photos */}
                  {viewingPf.photos.length > 0 && (
                    <div className="pp-section">
                      <div className="pp-section-title">Photo <em>Gallery</em> <span style={{ fontSize: 13, fontWeight: 400, color: "var(--g4)", fontFamily: "var(--sans)" }}>{viewingPf.photos.length}</span></div>
                      <div className="pp-pf-photos">
                        {viewingPf.photos.map((ph, i) => (
                          <div key={ph.id} className="pp-pfp-item" onClick={() => setLightbox({ items: viewingPf.photos.map(p => ({ src: p.src, caption: p.caption, type: "image" })), index: i })}>
                            <img src={ph.src} alt={ph.caption} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Videos */}
                  {viewingPf.videos.filter(v => v.id !== viewingPf.highlightedVideo).length > 0 && (
                    <div className="pp-section">
                      <div className="pp-section-title">More <em>Videos</em></div>
                      <div className="pp-pf-videos">
                        {viewingPf.videos.filter(v => v.id !== viewingPf.highlightedVideo).map(v => (
                          <div key={v.id} className="pp-pf-vid" onClick={() => setLightbox({ items: viewingPf.videos.map(vid => ({ src: vid.thumb, caption: vid.title, type: "image" })), index: viewingPf.videos.indexOf(v) })}>
                            <div className="pp-pfv-thumb">
                              <img src={v.thumb} alt="" />
                              <div className="pp-pfv-play" />
                            </div>
                            <div className="pp-pfv-info">
                              <div className="pp-pfv-title">{v.title}</div>
                              <div className="pp-pfv-dur">{v.duration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* References */}
                  {viewingPf.references?.length > 0 && (
                    <div className="pp-section">
                      <div className="pp-section-title">References & <em>Reviews</em></div>
                      <div className="pp-pf-refs">
                        {viewingPf.references.map(ref => (
                          <div key={ref.id} className="pp-pf-ref">
                            <div className="pp-pf-ref-quote">"{ref.quote}"</div>
                            <div className="pp-pf-ref-source">{ref.name || ref.source}{ref.role ? ` — ${ref.role}` : ""}{ref.org ? `, ${ref.org}` : ""}</div>
                            {ref.context && <div className="pp-pf-ref-context">{ref.context}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Resume */}
                  {viewingPf.resume?.length > 0 && (
                    <div className="pp-section">
                      <div className="pp-section-title">Resume</div>
                      <div className="pp-resume-highlights">
                        {viewingPf.resume.map(sr => (
                          <div key={sr.id} className="pp-resume-item">
                            <div className="pp-ri-emoji">{RESUME_EMOJI[sr.type] || "📄"}</div>
                            <div>
                              <div className="pp-ri-title">{sr.title}</div>
                              <div className="pp-ri-org">{sr.org}</div>
                              <div className="pp-ri-meta">{sr.period}{sr.location ? ` · ${sr.location}` : ""}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── Main Profile ── */
              <>
                {/* Hero */}
                <div className="pp-hero">
                  <img className="pp-hero-banner" src={primaryPortfolio?.cover || "/demo/banners/danny-howe-gwqahislnra-unsplash.jpg"} alt="" />
                  <div className="pp-hero-gradient" />
                  <div className="pp-hero-content">
                    <div className="pp-avatar"><img src={artist.photo} alt="" /></div>
                    <div className="pp-hero-info">
                      <div className="pp-hero-name">{artist.firstName} <em>{artist.lastName}</em></div>
                      <div className="pp-hero-handle">@{artist.handle} · {artist.city}, {artist.country}</div>
                      <div className="pp-hero-bio">{artist.profileBio}</div>
                      <div className="pp-hero-tags">
                        {artist.styles?.map(s => <span key={s}>{s}</span>)}
                      </div>
                      <div className="pp-hero-socials">
                        {artist.socials?.instagram && <a href="#" title="Instagram">IG</a>}
                        {artist.socials?.tiktok && <a href="#" title="TikTok">TT</a>}
                        {artist.socials?.youtube && <a href="#" title="YouTube">YT</a>}
                        {artist.socials?.vimeo && <a href="#" title="Vimeo">VM</a>}
                        {artist.socials?.linkedin && <a href="#" title="LinkedIn">LI</a>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pp-body">
                  {/* Featured Video */}
                  {highlightedVid && (
                    <div className="pp-section" style={{ animationDelay: ".1s" }}>
                      <div className="pp-section-title">Featured <em>Reel</em></div>
                      <div className="pp-featured-video" onClick={() => setLightbox({ items: primaryPortfolio.videos.map(v => ({ src: v.thumb, caption: v.title, type: "image" })), index: primaryPortfolio.videos.findIndex(v => v.id === primaryPortfolio.highlightedVideo) })}>
                        <img src={highlightedVid.thumb} alt="" />
                        <div className="pp-fv-play" />
                        <div className="pp-fv-info">
                          <div className="pp-fv-badge">Featured Showreel</div>
                          <div className="pp-fv-title">{highlightedVid.title}</div>
                          <div className="pp-fv-dur">{highlightedVid.duration}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Portfolio Showcase */}
                  {publishedPortfolios.length > 0 && (
                    <div className="pp-section" style={{ animationDelay: ".2s" }}>
                      <div className="pp-section-title">Portfolio <em>Showcase</em></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {publishedPortfolios.map(pf => (
                          <div key={pf.id} className="pp-portfolio-card" onClick={() => { setPpViewPortfolio(pf.id); document.querySelector(".pp-overlay")?.scrollTo({ top: 0, behavior: "smooth" }); }}>
                            <img src={pf.cover} alt="" />
                            <div className="pp-pc-overlay">
                              <div className="pp-pc-label">ARTIST PORTFOLIO</div>
                              <div className="pp-pc-name">{pf.name.split(" ")[0]} <em>{pf.name.split(" ").slice(1).join(" ")}</em></div>
                              <div className="pp-pc-meta">
                                <span>{pf.discipline}</span>
                                <span>{pf.photos.length} photos</span>
                                <span>{pf.videos.length} videos</span>
                              </div>
                            </div>
                            <div className="pp-pc-arrow">→</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Curated Gallery */}
                  {curatedPhotos.length > 0 && (
                    <div className="pp-section" style={{ animationDelay: ".3s" }}>
                      <div className="pp-section-title">Photo <em>Gallery</em></div>
                      <div className="pp-gallery-strip">
                        {curatedPhotos.map((ph, i) => (
                          <div key={ph.id} className="pp-gal-item" onClick={() => setLightbox({ items: curatedPhotos.map(p => ({ src: p.src, caption: p.caption, type: "image" })), index: i })}>
                            <img src={ph.src} alt={ph.caption} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* About */}
                  <div className="pp-section" style={{ animationDelay: ".4s" }}>
                    <div className="pp-section-title">About <em>{artist.firstName}</em></div>
                    <div className="pp-about">
                      <div className="pp-about-bio">{artist.biography || artist.bio}</div>
                      <div className="pp-about-stats">
                        {artist.pronouns && <div className="pp-about-stat"><span className="pp-as-label">Pronouns</span><span className="pp-as-value">{artist.pronouns}</span></div>}
                        {artist.height && <div className="pp-about-stat"><span className="pp-as-label">Height</span><span className="pp-as-value">{artist.height}</span></div>}
                        {artist.nationality?.length > 0 && <div className="pp-about-stat"><span className="pp-as-label">Nationality</span><span className="pp-as-value">{artist.nationality.join(", ")}</span></div>}
                        {artist.languages?.length > 0 && <div className="pp-about-stat"><span className="pp-as-label">Languages</span><span className="pp-as-value">{artist.languages.join(", ")}</span></div>}
                        {artist.unionStatus?.length > 0 && <div className="pp-about-stat"><span className="pp-as-label">Union</span><span className="pp-as-value">{artist.unionStatus.join(", ")}</span></div>}
                      </div>
                    </div>
                  </div>

                  {/* Resume Highlights */}
                  {topResume.length > 0 && (
                    <div className="pp-section" style={{ animationDelay: ".5s" }}>
                      <div className="pp-section-title">Resume <em>Highlights</em></div>
                      <div className="pp-resume-highlights">
                        {topResume.map(sr => (
                          <div key={sr.id} className="pp-resume-item">
                            <div className="pp-ri-emoji">{RESUME_EMOJI[sr.type] || "📄"}</div>
                            <div>
                              <div className="pp-ri-title">{sr.title}</div>
                              <div className="pp-ri-org">{sr.org}</div>
                              <div className="pp-ri-meta">{sr.start}{sr.end ? ` — ${sr.end}` : " — Present"}{sr.location ? ` · ${sr.location}` : ""}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="pfl-footer" style={{ position: "sticky" }}>
              <img src="/made-with-lanced.png" alt="Made with Lanced" />
            </div>
          </div>
        );
      })()}

      {/* ── New Work Modal ── */}
      {showNewWorkModal && (
        <div className="nwk-overlay" onClick={() => setShowNewWorkModal(false)}>
          <div className="nwk-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "28px 28px 0" }}>
              <h2 style={{ color: "#D97706" }}>New Work</h2>
              <p style={{ fontSize: 12, color: "var(--g4)", margin: "4px 0 0" }}>Create a dedicated page for a show, production, or creative work.</p>
            </div>
            <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="wke-input-label">1. Work Name</label>
                <input className="wke-input" placeholder="e.g. Echoes in Glass" value={newWk.name} onChange={e => setNewWk(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="wke-input-label">2. Tagline</label>
                <input className="wke-input" placeholder="A short artistic hook..." value={newWk.tagline} onChange={e => setNewWk(p => ({ ...p, tagline: e.target.value }))} />
              </div>
              <div>
                <label className="wke-input-label">3. Your Role</label>
                <select className="wke-select" value={newWk.role} onChange={e => setNewWk(p => ({ ...p, role: e.target.value }))}>
                  <option value="">Select role...</option>
                  {WORK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="wke-input-label">4. Genre</label>
                <input className="wke-input" placeholder="e.g. Contemporary Dance" value={newWk.genre} onChange={e => setNewWk(p => ({ ...p, genre: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8 }}>
                <button className="btn btn-g" style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--g2)", background: "var(--bg)", color: "var(--tx)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }} onClick={() => setShowNewWorkModal(false)}>Cancel</button>
                <button style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#D97706,#B45309)", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)", opacity: (!newWk.name.trim() || !newWk.role) ? 0.5 : 1 }} disabled={!newWk.name.trim() || !newWk.role} onClick={() => {
                  const id = "wk" + Date.now();
                  const slug = newWk.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                  setWorks(prev => [...prev, {
                    id, name: newWk.name.trim(), status: "draft", tagline: newWk.tagline, shortPitch: "", fullDescription: "", conceptNote: "",
                    genre: newWk.genre, duration: "", premiereYear: "", country: "", city: "", language: "", ageGuidance: "", touringStatus: "in_creation",
                    role: newWk.role, cover: "", trailerUrl: "",
                    credits: [], gallery: [], reviews: [], awards: [],
                    upcomingPerformances: [], pastPerformances: [],
                    partners: [], techRequirements: { stageMinWidth: "", stageMinDepth: "", performers: "", setupTime: "" },
                    accessibility: { captions: false, relaxedPerformance: false, audioDescription: false, sensoryNotes: "" },
                    downloads: [], bookingEmail: "", bookingCtas: [], slug, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  }]);
                  setShowNewWorkModal(false);
                  setNewWk({ name: "", tagline: "", role: "", genre: "" });
                  setViewWork(id);
                  setWorkTab("overview");
                  showToast("Work created!");
                }}>Create Work</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Work Share Modal ── */}
      {showWorkShareModal && currentWork && (
        <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShowWorkShareModal(false); }}>
          <div className="share-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <h3 style={{ color: "#D97706" }}>Share Work</h3>
                <div className="sm-sub">{currentWork.name}</div>
              </div>
              <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--g4)", padding: 4 }} onClick={() => setShowWorkShareModal(false)}>×</button>
            </div>

            <div className="sm-section">
              <div className="sm-section-title">Share via Link</div>
              <div className="sm-link-row">
                <input readOnly value={`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/works/${currentWork.slug}`} />
                <button onClick={() => { navigator.clipboard?.writeText(`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/works/${currentWork.slug}`); showToast("Link copied!"); }}>Copy Link</button>
              </div>
            </div>

            <div className="sm-section">
              <div className="sm-section-title">Share via Email</div>
              <div className="sm-email-row">
                <input placeholder="recipient@company.com" value={workShareEmail} onChange={e => setWorkShareEmail(e.target.value)} />
                <button onClick={() => { if (workShareEmail.trim()) { showToast(`Work shared with ${workShareEmail}`); setWorkShareEmail(""); } }}>Send</button>
              </div>
            </div>

            <div className="sm-pro">
              <div className="sm-pro-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Pro Features <span>PRO</span></div>
              <div className="sm-toggle">
                <div>
                  <div className="sm-toggle-label">Track link views</div>
                  <div className="sm-toggle-desc">See who viewed your work page and when</div>
                </div>
                <div className={`sm-switch${workShareSettings.trackLink ? " on" : ""}`} onClick={() => {
                  if (artist.plan === "Core") { showToast("Upgrade to Pro to use this feature"); return; }
                  setWorkShareSettings(s => ({ ...s, trackLink: !s.trackLink }));
                }} />
              </div>
              <div className="sm-toggle">
                <div>
                  <div className="sm-toggle-label">Require email to view</div>
                  <div className="sm-toggle-desc">Viewers must enter their email before accessing</div>
                </div>
                <div className={`sm-switch${workShareSettings.requireEmail ? " on" : ""}`} onClick={() => {
                  if (artist.plan === "Core") { showToast("Upgrade to Pro to use this feature"); return; }
                  setWorkShareSettings(s => ({ ...s, requireEmail: !s.requireEmail }));
                }} />
              </div>
              <div className="sm-toggle" style={{ borderBottom: "none" }}>
                <div>
                  <div className="sm-toggle-label">Password protect</div>
                  <div className="sm-toggle-desc">Require a password to access your work page</div>
                </div>
                <div className={`sm-switch${workShareSettings.password ? " on" : ""}`} onClick={() => {
                  if (artist.plan === "Core") { showToast("Upgrade to Pro to use this feature"); return; }
                  setWorkShareSettings(s => ({ ...s, password: s.password ? "" : "demo123" }));
                }} />
              </div>
              {workShareSettings.password && (
                <input className="sm-pw-input" type="text" placeholder="Enter password..." value={workShareSettings.password} onChange={e => setWorkShareSettings(s => ({ ...s, password: e.target.value }))} />
              )}
            </div>

            <div className="sm-actions">
              <button style={{ background: "none", border: "1px solid var(--g2)", color: "var(--tx)" }} onClick={() => setShowWorkShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Work Live View ── */}
      {workLive && currentWork && (() => {
        const wk = currentWork;
        const touringLabel = TOURING_STATUSES.find(s => s.id === wk.touringStatus)?.label || wk.touringStatus;
        return (
          <div className="wkl-overlay">
            <div className="wkl-topbar">
              <div className="wkl-topbar-title">{wk.name} — Live Preview</div>
              <div className="wkl-topbar-actions">
                <button style={{ background: "none", border: "1px solid var(--g2)", color: "var(--tx)" }} onClick={() => { navigator.clipboard?.writeText(`lanced.app/${artist.name.toLowerCase().replace(/\s/g, "")}/works/${wk.slug}`); showToast("Link copied!"); }}>Copy Link</button>
                <button style={{ background: "#D97706", border: "none", color: "#fff" }} onClick={() => setWorkLive(false)}>Close</button>
              </div>
            </div>
            <div className="wkl-content">
              {/* Hero */}
              <div className={`wkp-hero wkl-anim${wk.cover ? " has-cover" : ""}`} style={wk.cover ? { backgroundImage: `url(${wk.cover})` } : {}}>
                <div className="wkp-hero-label">WORK</div>
                <div className="wkp-hero-title">{wk.name}</div>
                <div className="wkp-hero-tagline">{wk.tagline}</div>
                <div className="wkp-hero-role">{wk.role}</div>
                <div className="wkp-hero-actions">
                  {wk.upcomingPerformances.length > 0 && <button style={{ background: "#D97706", border: "none", color: "#fff" }}>Get Tickets</button>}
                  <button style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>Book This Work</button>
                </div>
              </div>

              {/* Key Info */}
              <div className="wkp-keyinfo wkl-anim" style={{ animationDelay: ".05s" }}>
                {wk.genre && <div className="wkp-keyinfo-pill"><strong>{wk.genre}</strong></div>}
                {wk.duration && <div className="wkp-keyinfo-pill"><span>Duration</span> <strong>{wk.duration}</strong></div>}
                {wk.premiereYear && <div className="wkp-keyinfo-pill"><span>Premiere</span> <strong>{wk.premiereYear}</strong></div>}
                {wk.country && <div className="wkp-keyinfo-pill"><span>{wk.city},</span> <strong>{wk.country}</strong></div>}
                {wk.language && <div className="wkp-keyinfo-pill"><span>Language</span> <strong>{wk.language}</strong></div>}
                {wk.ageGuidance && <div className="wkp-keyinfo-pill"><span>Age</span> <strong>{wk.ageGuidance}</strong></div>}
                <div className="wkp-keyinfo-pill"><span>Status</span> <strong>{touringLabel}</strong></div>
              </div>

              {/* About */}
              {(wk.shortPitch || wk.fullDescription) && (
                <div className="wkp-about wkl-anim" style={{ animationDelay: ".1s" }}>
                  {wk.shortPitch && <div className="wkp-about-pitch">{wk.shortPitch}</div>}
                  {wk.fullDescription && <div className="wkp-about-desc">{wk.fullDescription}</div>}
                  {wk.conceptNote && <div className="wkp-about-note"><strong>Concept Note</strong><br/>{wk.conceptNote}</div>}
                </div>
              )}

              {/* Trailer */}
              {wk.cover && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".15s" }}>
                  <h3 className="wkp-section-title"><em>Trailer</em> & Video</h3>
                  <div className="wkp-trailer">
                    <img src={wk.cover} alt="" />
                    <div className="wkp-trailer-play" />
                  </div>
                </div>
              )}

              {/* Credits */}
              {wk.credits.length > 0 && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".2s" }}>
                  <h3 className="wkp-section-title">Credits & <em>Team</em></h3>
                  <div className="wkp-credits-grid">
                    {wk.credits.map(cr => (
                      <div key={cr.id} className="wkp-credit-card">
                        <div className="wkp-credit-avatar">{cr.name.split(" ").map(w => w[0]).join("")}</div>
                        <div><div className="wkp-credit-name">{cr.name}</div><div className="wkp-credit-role">{cr.role}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {wk.gallery.length > 0 && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".25s" }}>
                  <h3 className="wkp-section-title">Photo <em>Gallery</em></h3>
                  <div className="wkp-gallery">
                    {wk.gallery.map(ph => <div key={ph.id} className="wkp-gallery-item"><img src={ph.src} alt={ph.caption} /></div>)}
                  </div>
                </div>
              )}

              {/* Reviews & Awards */}
              {(wk.reviews.length > 0 || wk.awards.length > 0) && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".3s" }}>
                  <h3 className="wkp-section-title"><em>Reviews</em> & Awards</h3>
                  {wk.reviews.map(rv => (
                    <div key={rv.id} className="wke-review-card" style={{ background: "var(--sf)" }}>
                      <span className={`wke-review-type ${rv.type}`}>{rv.type === "press" ? "Press" : "Audience"}</span>
                      <div className="wke-review-quote">"{rv.quote}"</div>
                      <div className="wke-review-source"><strong>{rv.source}</strong>{rv.rating ? ` · ${"★".repeat(rv.rating)}${"☆".repeat(5 - rv.rating)}` : ""}</div>
                    </div>
                  ))}
                  {wk.awards.map(aw => (
                    <div key={aw.id} className="wke-award-card" style={{ background: "var(--sf)" }}>
                      <div className={`wke-award-icon ${aw.type}`}>{aw.type === "win" ? "🏆" : aw.type === "nomination" ? "🌟" : "✨"}</div>
                      <div className="wke-award-info">
                        <div className="wke-award-title">{aw.title}</div>
                        <div className="wke-award-meta">{aw.festival} · {aw.year} · {aw.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming Performances */}
              {wk.upcomingPerformances.length > 0 && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".35s" }}>
                  <h3 className="wkp-section-title">Upcoming <em>Performances</em></h3>
                  {wk.upcomingPerformances.map(p => {
                    const d = new Date(p.date);
                    return (
                      <div key={p.id} className="wke-perf-item" style={{ background: "var(--sf)" }}>
                        <div className="wke-perf-date">
                          <div className="wke-perf-date-d">{d.getDate()}</div>
                          <div className="wke-perf-date-m">{d.toLocaleDateString("en-GB", { month: "short" })}</div>
                        </div>
                        <div className="wke-perf-info">
                          <div className="wke-perf-venue">{p.venue}</div>
                          <div className="wke-perf-city">{p.city}</div>
                        </div>
                        <button className="wke-cta-btn tickets" style={{ padding: "6px 14px", fontSize: 11 }}>Get Tickets</button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Availability */}
              <div className="wkp-avail wkl-anim" style={{ animationDelay: ".4s" }}>
                <div className="wkp-avail-status">
                  <div className={`wkp-avail-dot ${wk.touringStatus}`} />
                  {touringLabel}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {wk.bookingCtas.map((cta, i) => (
                    <button key={i} className={`wke-cta-btn ${cta.intent}`}>{cta.label}</button>
                  ))}
                  {wk.bookingCtas.length === 0 && wk.bookingEmail && <button className="wke-cta-btn contact">Contact</button>}
                </div>
              </div>

              {/* Partners */}
              {wk.partners.length > 0 && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".45s" }}>
                  <h3 className="wkp-section-title">Partners & <em>Presented By</em></h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {wk.partners.map(pt => (
                      <div key={pt.id} className="wke-partner" style={{ background: "var(--sf)" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(217,119,6,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤝</div>
                        <div><div className="wke-partner-name">{pt.name}</div><div className="wke-partner-type">{pt.type}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads */}
              {wk.downloads.length > 0 && (
                <div className="wkl-anim" style={{ marginBottom: 24, animationDelay: ".5s" }}>
                  <h3 className="wkp-section-title"><em>Downloads</em></h3>
                  {wk.downloads.map(dl => (
                    <div key={dl.id} className="wke-dl-item" style={{ background: "var(--sf)" }}>
                      <div className="wke-dl-icon">📄</div>
                      <div className="wke-dl-info"><div className="wke-dl-title">{dl.label}</div><div className="wke-dl-meta">{dl.format} · {dl.size}</div></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--g4)", fontSize: 11 }}>
                {wk.name} · {artist.name} · Powered by Lanced
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="pfl-lightbox" onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <button className="pfl-lb-close" onClick={() => setLightbox(null)}>×</button>
          {lightbox.index > 0 && <button className="pfl-lb-nav prev" onClick={e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: prev.index - 1 })); }}>‹</button>}
          {lightbox.index < lightbox.items.length - 1 && <button className="pfl-lb-nav next" onClick={e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: prev.index + 1 })); }}>›</button>}
          <img src={lightbox.items[lightbox.index].src} alt={lightbox.items[lightbox.index].caption || ""} onClick={e => e.stopPropagation()} style={{ cursor: "default" }} />
          {lightbox.items[lightbox.index].caption && <div className="pfl-lb-caption">{lightbox.items[lightbox.index].caption}</div>}
        </div>
      )}

      {/* ── Feedback Tab ── */}
      <div className="feedback-tab">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdwVLff94ZnL5lFM-F_Z7z4qUAjvppXQpEIQheRfKzZhX0nsw/viewform?usp=sharing&ouid=112162380164512043316" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Share Feedback
        </a>
      </div>

      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
