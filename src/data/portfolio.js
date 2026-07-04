// Portfolio content: single source of truth for copy, links, and list data.
// Views: web and mobile (shared content).
export const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export const DOTS = ["#hero", "#about", "#experience", "#projects", "#contact"];

export const PROFILE = {
  name: "Sadi Md Tarmim Hoque",
  role: "Lead Mobile App Developer",
  email: "tarmimhoqueshuvo@gmail.com",
  phone: "+8801673552194",
  phoneHref: "tel:+8801673552194",
  github: "https://github.com/shuvo0074",
  githubLabel: "github.com/shuvo0074",
  linkedin: "https://www.linkedin.com/in/sadi-md-tarmim-hoque-6b3b4179/",
  linkedinLabel: "linkedin.com/in/sadi-md-tarmim-hoque-6b3b4179",
  location: "Dhaka, Bangladesh",
};

export const HERO = {
  lead: 'I build fast, scalable mobile apps and websites with JavaScript—mostly powered by React Native. I enjoy turning "that sounds complicated" into "wow, that just works."',
  meta: ["Dhaka, Bangladesh", "9+ years in software", "1000+ LinkedIn followers"],
};

export const ABOUT = {
  title: "Product-minded engineer with leadership focus",
  lead: "At Magnushub I lead mobile development, manage releases, and help teams deliver with clean architecture, CI/CD, and reliable app-store shipping.",
  whatIDo: [
    "Cross-platform app architecture with React Native",
    "App Store and Play Store release management",
    "Feature planning with clients and engineering teams",
    "Realtime communication with WebRTC and Matrix",
  ],
  coreStack: [
    "React Native",
    "React.js",
    "iOS / SwiftUI",
    "GraphQL",
    "Node.js",
    "Firebase",
    "WebRTC",
    "CI/CD",
  ],
};

export const EXPERIENCE = {
  title: "Building mobile products across startups and global teams",
  items: [
    {
      time: "Jan 2021 - Present",
      title: "Lead Mobile App Developer · Magnushub Ltd.",
      body: "Maintain React Native apps, manage store releases, analyze client requirements, distribute team tasks, and maintain the CI/CD pipeline.",
    },
    {
      time: "Jul 2024 - Feb 2025",
      title: "Lead Mobile App Developer · Synesis IT Ltd.",
      body: "Part-time role on React Native with WebRTC, Jitsi Meet, and Matrix, plus SwiftUI iOS chat app maintenance.",
    },
    {
      time: "Jul 2020 - Mar 2022",
      title: "Lead App Developer · Self Aware Machines Pvt. Ltd.",
      body: "Built a React Native meeting-room SDK and React web apps with Firebase, WebRTC, TensorFlow, and GraphQL for AI classrooms.",
    },
    {
      time: "Nov 2021 - Feb 2022",
      title: "Frontend Developer · Bots and People",
      body: "Contract role building a React.js and WordPress marketplace website for automation products in Germany.",
    },
    {
      time: "Jul 2020 - Jan 2021",
      title: "Mobile App Developer · Lotus Tech. Development Ltd.",
      body: "Built React Native e-commerce apps with React-Redux and maintained production release workflows.",
    },
    {
      time: "Jul 2018 - Jun 2020",
      title: "Software Developer · Imagine Entertainments Ltd.",
      body: "Shipped React Native apps with Firebase and MobX, store releases, React audio-player front-end, CMS work, and Scrum.",
    },
    {
      time: "Jul 2019 - Mar 2020",
      title: "Software Engineer · Northern Light Technologies",
      body: "Prepared React Native e-commerce apps using Firebase, Sentry, and OneSignal.",
    },
    {
      time: "Feb 2018 - Jun 2018",
      title: "Software Engineer · ERA Infotech Ltd.",
      body: "Prepared a React Native app for a pharmaceuticals company.",
    },
  ],
};

export const PROJECTS = [
  {
    title: "Convay",
    body: "Webinar and meeting solution with WebRTC and Matrix-backed realtime flows.",
    tags: ["React Native", "WebRTC", "Matrix"],
  },
  {
    title: "Skootel / Benji / HFX E-Scooters",
    body: "Ride-sharing apps with geo features, support modules, and production releases.",
    tags: ["React Native", "Redux", "Google Maps"],
  },
  {
    title: "magnusai-chatbot-react-native",
    body: "Reusable React Native chatbot library published for integration flexibility.",
    tags: ["NPM Package", "React Native", "SDK Thinking"],
  },
  {
    title: "Imagine Radio",
    body: "Streaming platform across Android, iOS, and web player experiences.",
    tags: ["React Native", "React.js", "MobX"],
  },
  {
    title: "Pipra Store / Jirabo / Express Ticket",
    body: "Commerce and ticketing apps with checkout, search, and scalable frontend patterns.",
    tags: ["React Native", "Node.js", "E-commerce"],
  },
];

export const CONTACT = {
  title: "Let's build the next mobile product",
  lead: "Available for leadership, product engineering, and high-impact mobile projects.",
  quote:
    "Enthusiastic in coding, eager to learn, and committed to shipping quality experiences.",
};

export const PHONE_ABOUT = {
  statusText: "React Native, shipped fast",
  title: "Think twice, code once",
  subtext:
    "It is 10% coding and 90% asking why it works on Android but breaks on iOS !!",
};

export const CHIP_PARTS = [
  { id: "camera", kind: "chip-camera-module", variant: "camera" },
  { id: "board", kind: "chip-motherboard", variant: "board" },
  { id: "battery", kind: "chip-battery", variant: "battery" },
  { id: "screen", kind: "chip-screen-layer", variant: "screen" },
  { id: "core", kind: "chip-core-processor", variant: "core" },
  { id: "lens", kind: "chip-lens-ring", variant: "lens" },
  { id: "connector1", kind: "chip-connector", variant: "connector" },
  { id: "connector2", kind: "chip-connector", variant: "connector" },
  { id: "tiny1", kind: "chip-tiny-block", variant: "ic" },
  { id: "tiny2", kind: "chip-tiny-block", variant: "capacitor" },
  { id: "tiny3", kind: "chip-tiny-block", variant: "resistor" },
  { id: "tiny4", kind: "chip-tiny-block", variant: "ic" },
];
