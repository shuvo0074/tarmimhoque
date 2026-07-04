// Portfolio content: single source of truth for copy, links, and list data.
// Views: web and mobile (shared content).
import convayWebImage from "../assets/project_images/Convay_web.png";
import convayLogoImage from "../assets/project_images/convay_logo.webp";
import convayAppImage from "../assets/project_images/convay_app.png";
import skootelLogoImage from "../assets/project_images/skootel_logo.webp";
import skootelAppImage from "../assets/project_images/skootel_app.png";

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
    title: "Convay Web",
    body: "Enterprise-grade AI meeting solution with video conferencing, WebRTC, and Matrix-backed realtime flows.",
    tags: ["React Native", "WebRTC", "Matrix"],
    visible: true,
    images: [
      {
        src: convayWebImage,
        alt: "Convay web landing page",
      },
      {
        src: convayLogoImage,
        alt: "Convay logo",
        buttons: [{ label: "Visit Convay", url: "https://convay.com/" }],
      },
    ],
  },
  {
    title: "Convay Mobile App",
    body: "Cross-platform video conferencing app for organizations, with secure meetings and realtime collaboration on iOS and Android.",
    tags: ["React Native", "WebRTC", "iOS", "Android"],
    visible: true,
    images: [
      {
        src: convayAppImage,
        alt: "Convay mobile app screenshot",
      },
      {
        src: convayLogoImage,
        alt: "Convay logo",
        buttons: [
          {
            label: "Play Store",
            url: "https://play.google.com/store/apps/details?id=org.synesisit.convay",
          },
          {
            label: "App Store",
            url: "https://apps.apple.com/us/app/convay/id6444846555",
          },
        ],
      },
    ],
  },
  {
    title: "Skootel",
    body: "Electric scooter sharing app with realtime maps, ride passes, group rides, and local payment flows.",
    tags: ["React Native", "Redux", "Google Maps"],
    visible: true,
    images: [
      {
        src: skootelAppImage,
        alt: "Skootel mobile app screenshot",
      },
      {
        src: skootelLogoImage,
        alt: "Skootel logo",
        buttons: [
          {
            label: "Play Store",
            url: "https://play.google.com/store/apps/details?id=com.otoride.skootel",
          },
          {
            label: "App Store",
            url: "https://apps.apple.com/us/app/skootel-scooter-sharing/id6615074657",
          },
        ],
      },
    ],
  },
  {
    title: "magnusai-chatbot-react-native",
    body: "Reusable React Native chatbot library published for integration flexibility.",
    tags: ["NPM Package", "React Native", "SDK Thinking"],
    visible: false,
    images: [],
  },
  {
    title: "Imagine Radio",
    body: "Streaming platform across Android, iOS, and web player experiences.",
    tags: ["React Native", "React.js", "MobX"],
    visible: false,
    images: [],
  },
  {
    title: "Pipra Store / Jirabo / Express Ticket",
    body: "Commerce and ticketing apps with checkout, search, and scalable frontend patterns.",
    tags: ["React Native", "Node.js", "E-commerce"],
    visible: false,
    images: [],
  },
];

/** Projects currently shown in the portfolio UI. */
export const VISIBLE_PROJECTS = PROJECTS.filter((project) => project.visible);

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
