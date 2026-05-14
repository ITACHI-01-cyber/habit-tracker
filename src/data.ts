import { Github, Linkedin, Mail, Globe, Code, Shield, Cpu, Award, Home, User, FileText, Briefcase, MessageSquare } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'HOME' },
  { id: 'about', icon: User, label: 'ABOUT' },
  { id: 'resume', icon: FileText, label: 'RESUME' },
  { id: 'portfolio', icon: Briefcase, label: 'WORK' },
  { id: 'contact', icon: Mail, label: 'CONTACT' },
];

export const USER_DATA = {
  name: "Vivek Bhardwaj",
  profileImage: "https://i.ibb.co/gZ3WTg3b/personal-image.jpg",
  role: "Developer",
  github: "https://github.com/ITACHI-01-cyber",
  linkedin: "https://www.linkedin.com/in/example", // Placeholder
  email: "bvivek514@gmail.com",
  reddit: "https://www.reddit.com/user/example", // Placeholder
  about: "I'm a developer who genuinely enjoys bringing ideas to life on the web. I don't just write code—I like to solve real problems and create experiences that feel effortless for the user. Whether I'm snapping together clean interfaces with React or wiring up sturdy backends with Spring Boot and MongoDB, I love the whole process. I'm always messing around with new tech, asking questions, and trying to build things that people actually want to use.",
  techStack: [
    "Java",
    "Spring Boot",
    "C",
    "Python",
    "MySQL",
    "MongoDB",
    "ReactJS",
    "JavaScript",
    "HTML",
    "CSS",
    "TailwindCSS",
    "Figma",
    "Learning LLMs & AI"
  ],
  skills: [
    { name: "Frontend Development", icon: Globe, description: "Creating responsive and modern web interfaces using React and Tailwind CSS." },
    { name: "Backend Development", icon: Code, description: "Building robust APIs and server-side logic using Spring Boot and MongoDB." },
    { name: "Database Management", icon: Shield, description: "Designing and managing efficient data storage solutions with MongoDB and SQL." },
  ],
  resume: {
    education: [
      { period: "2024 - 2028", title: "B.Tech in Computer Science", institution: "University of Technology", description: "Currently pursuing Bachelor of Technology in Computer Science." },
      { period: "2022 - 2024", title: "Class 12 (High School)", institution: "Science Academy", description: "Passed with Physics, Chemistry, and Mathematics (PCM)." },
      { period: "2020 - 2022", title: "Class 10", institution: "Secondary School", description: "Completed secondary education." },
    ],
    experience: [
      { period: "2025 - Present", title: "Full Stack Projects", institution: "Independent Journey", description: "Architecting full-stack applications with React, Spring Boot, and MongoDB. Focusing on clean code and robust systems." },
      { period: "2024 - 2025", title: "Frontend Mastery", institution: "Self-Taught", description: "Deep dive into React, Tailwind CSS, and Framer Motion to create stunning, interactive user interfaces." },
      { period: "2023 - 2024", title: "Programming Foundations", institution: "Early Learning", description: "Started coding with core programming concepts, data structures, and algorithmic thinking." }
    ]
  },
  projects: [
    { title: "Little Lemon Website", category: "Frontend", image: "https://image.thum.io/get/width/1200/crop/800/https://littlelemonmrvbfit.netlify.app/", link: "https://littlelemonmrvbfit.netlify.app/", description: "A responsive table booking website for a local restaurant built strictly with frontend technologies." },
    { title: "Green Root Gamify", category: "Full Stack", image: "https://i.ibb.co/4gKzgkHd/Screenshot-from-2026-05-02-15-52-17.png", link: "https://greenrootgamify.netlify.app/", description: "A full-stack gamification platform built with basic HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB." },
    { title: "Expense Tracker", category: "Web Design", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800", link: "", description: "A personal finance application to easily track daily expenses and budgets, part of the Track Daily project." },
    { title: "Habit Tracker", category: "Web Design", image: "https://imgs.search.brave.com/44NP7OJDik-OXexJHG-ZOL-fU5a_nhRsxO_sFSscQfI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9keW5h/bWljLmJyYW5kY3Jv/d2QuY29tL2Fzc2V0/L2xvZ28vMjMyMzc0/NjEtNzRlMy00MjEx/LTkzY2ItY2YzYmQw/ODQyZDMwL2xvZ28t/c2VhcmNoLWdyaWQt/Mng_bG9nb1RlbXBs/YXRlVmVyc2lvbj0x/JnY9NjM4OTU0MTg4/MjE3MjMwMDAwJmxh/eW91dD1hdXRvLTEt/MQ", link: "https://track-daily-eta.vercel.app/", description: "A productivity app to track and build daily habits, also part of the Track Daily project." },
  ]
};
