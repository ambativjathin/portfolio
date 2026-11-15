import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

const pageWidth = 210;
const pageHeight = 297;
const margin = 16;
const contentWidth = pageWidth - margin * 2;
let y = 18;

// Primary Accent Color: Deep Indigo / Violet (#4F46E5)
const primaryColor = [79, 70, 229];
// Neutral Dark: #111827
const darkColor = [17, 24, 39];
// Muted Gray: #4B5563
const grayColor = [75, 85, 99];
// Light Border: #E5E7EB
const borderColor = [229, 231, 235];

function addHeader() {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...darkColor);
  doc.text("JATHIN AMBATI V", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("Computer Science & Engineering (AI & ML) | Aspiring Full Stack Developer", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const contacts = [
    "ambativjathin@gmail.com",
    "Bangalore, India",
    "linkedin.com/in/jathin-ambati-v-2897b321a",
    "github.com/ambativjathin",
    "x.com/VJathin74139"
  ];
  doc.text(contacts.join("   |   "), margin, y);
  y += 4;

  // Divider line
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;
}

function addSectionTitle(title) {
  if (y > pageHeight - 30) {
    doc.addPage();
    y = 18;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(title.toUpperCase(), margin, y);
  y += 2;

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 28, y);

  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.line(margin + 28, y, margin + contentWidth, y);
  y += 5;
}

function checkPageOverflow(spaceNeeded = 18) {
  if (y + spaceNeeded > pageHeight - margin) {
    doc.addPage();
    y = 18;
  }
}

// 1. Header
addHeader();

// 2. Summary
addSectionTitle("Professional Profile");
doc.setFont("helvetica", "normal");
doc.setFontSize(9.5);
doc.setTextColor(...darkColor);
const summary = "Enthusiastic Computer Science and Engineering student specializing in Artificial Intelligence and Machine Learning at Jain University (Batch of 2025–2029). Driven by a passion for building scalable full-stack web platforms, interactive 3D WebGL experiences, and high-performance machine learning models. Dedicated to continuous learning, algorithmic precision, and developing production-grade software solutions.";
const summaryLines = doc.splitTextToSize(summary, contentWidth);
doc.text(summaryLines, margin, y);
y += summaryLines.length * 4.5 + 4;

// 3. Education
addSectionTitle("Education");
doc.setFont("helvetica", "bold");
doc.setFontSize(10.5);
doc.setTextColor(...darkColor);
doc.text("Bachelor of Technology (B.Tech) - Computer Science & Engineering (AI & ML)", margin, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(9.5);
doc.setTextColor(...grayColor);
doc.text("2025 – 2029 (Expected)", margin + contentWidth - 34, y);
y += 4.5;

doc.setFont("helvetica", "italic");
doc.setFontSize(9.5);
doc.setTextColor(...primaryColor);
doc.text("Jain University, Bangalore, India", margin, y);
y += 4.5;

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(...grayColor);
doc.text("Key Coursework: Data Structures & Algorithms, Operating Systems, Computer Organization & Architecture, Discrete Mathematics & Graph Theory, Object-Oriented Programming, Database Management Systems.", margin, y, { maxWidth: contentWidth });
y += 8;

// 4. Technical Skills
addSectionTitle("Technical Skills");

const skillCategories = [
  { label: "Programming Languages", skills: "Python, JavaScript, TypeScript, C++, Java, SQL, HTML5, CSS3" },
  { label: "AI & Machine Learning", skills: "PyTorch, TensorFlow, OpenCV, Scikit-Learn, Deep Learning, CNNs, Transformers, NLP, Computer Vision, Pandas, NumPy" },
  { label: "Full-Stack Web & 3D", skills: "React.js, Next.js, Node.js, Express.js, Three.js, GSAP, WebGL, Tailwind CSS, REST APIs" },
  { label: "Databases & Storage", skills: "MongoDB, MySQL, PostgreSQL" },
  { label: "Tools & Methodologies", skills: "Git & GitHub, Linux/Unix, Vite, Docker, VS Code, Agile Development" }
];

skillCategories.forEach(cat => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text(`•  ${cat.label}: `, margin, y);
  const labelWidth = doc.getTextWidth(`•  ${cat.label}: `);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  const skillLines = doc.splitTextToSize(cat.skills, contentWidth - labelWidth);
  doc.text(skillLines, margin + labelWidth, y);
  y += skillLines.length * 4 + 1.5;
});
y += 4;

// 5. Featured Projects
addSectionTitle("Featured Projects");

const projects = [
  {
    title: "AI Vision & Deep Learning Suite",
    tech: "Python, PyTorch, OpenCV, CNNs",
    bullets: [
      "Designed and implemented high-accuracy computer vision classification models leveraging convolutional neural networks.",
      "Integrated real-time image preprocessing, augmentation pipelines, and automated performance evaluation metrics."
    ]
  },
  {
    title: "3D Interactive Web Experience & Physics Sandbox",
    tech: "React, Three.js, GSAP, Rapier 3D Physics, WebGL",
    bullets: [
      "Engineered an interactive 3D portfolio featuring rigid-body physics simulations, dynamic collision detection, and custom shaders.",
      "Implemented smooth GSAP scroll triggers and responsive camera movements for fluid user engagement."
    ]
  },
  {
    title: "OS Process Scheduler Simulator",
    tech: "C++, Operating Systems, Scheduling Algorithms",
    bullets: [
      "Built a simulation engine modeling Preemptive/Non-Preemptive CPU scheduling algorithms (Round Robin, SJF, Priority).",
      "Simulated turnaround time, wait time optimization, and memory allocation tracking."
    ]
  },
  {
    title: "Full-Stack Intelligent Web Application",
    tech: "Next.js, TypeScript, Node.js, Express, MongoDB",
    bullets: [
      "Architected a responsive full-stack platform with secure authentication, RESTful API endpoints, and dynamic database queries.",
      "Optimized server-side rendering and client state management for sub-second page transitions."
    ]
  },
  {
    title: "Discrete Math & Graph Visualizer",
    tech: "JavaScript, HTML5 Canvas, Graph Theory Algorithms",
    bullets: [
      "Interactive algorithm visualizer implementing Dijkstra's, BFS/DFS, and minimum spanning tree logic.",
      "Features dynamic node positioning, edge weight calculations, and real-time algorithmic step tracing."
    ]
  },
  {
    title: "Multi-Modal NLP & LLM Pipeline",
    tech: "Python, Hugging Face Transformers, PyTorch, REST APIs",
    bullets: [
      "Constructed a natural language pipeline for text extraction, sentiment classification, and semantic reasoning.",
      "Deployed automated tokenization and inference endpoints with optimized latency."
    ]
  }
];

projects.forEach(p => {
  checkPageOverflow(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text(p.title, margin, y);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text(`[${p.tech}]`, margin + doc.getTextWidth(p.title) + 3, y);
  y += 4;

  p.bullets.forEach(b => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...grayColor);
    const bulletText = `–  ${b}`;
    const lines = doc.splitTextToSize(bulletText, contentWidth - 4);
    doc.text(lines, margin + 4, y);
    y += lines.length * 3.8;
  });
  y += 2;
});

// 6. Certifications & Academic Milestones
checkPageOverflow(25);
addSectionTitle("Certifications & Academic Milestones");

const certs = [
  { title: "Introduction to Discrete Mathematics & Mathematical Logic", org: "Wolfram Certified Instructor Program", date: "2026" },
  { title: "Computer Organization & Architecture Problem-Based Learning", org: "Jain University Department of CSE", date: "2026" },
  { title: "B.Tech CSE (AIML) Academic Distinction Track", org: "Targeting Full Stack Engineering by 2029", date: "2025–2029" }
];

certs.forEach(c => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text(`•  ${c.title}`, margin, y);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...grayColor);
  doc.text(`— ${c.org} (${c.date})`, margin + doc.getTextWidth(`•  ${c.title} `), y);
  y += 4.5;
});

const outDir = path.resolve("public");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, "Jathin_Ambati_Resume.pdf");
const pdfOutput = doc.output("arraybuffer");
fs.writeFileSync(outPath, Buffer.from(pdfOutput));

console.log("Resume PDF generated successfully at:", outPath);
