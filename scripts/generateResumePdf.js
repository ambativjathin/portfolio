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

// Titanium Monochrome Color Palette:
// Primary Accent: Sleek Titanium Slate / Dark Charcoal (#18181B / #27272A)
const primaryColor = [24, 24, 27];
// Neutral Dark text: #111827
const darkColor = [17, 24, 39];
// Muted Slate text: #4B5563
const grayColor = [75, 85, 99];
// Secondary Slate / Tech: #52525B
const techColor = [82, 82, 91];
// Light Border: #E5E7EB
const borderColor = [229, 231, 235];

function addHeader() {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(...darkColor);
  doc.text("JATHIN AMBATI V", margin, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text("Computer Science & Engineering (AI & ML) | Aspiring Full Stack Developer", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(...grayColor);
  const contacts = [
    "jathinambati.netlify.app",
    "ambativjathin@gmail.com",
    "Bangalore, India",
    "linkedin.com/in/jathin-ambati-v-2897b321a",
    "github.com/ambativjathin"
  ];
  doc.text(contacts.join("   |   "), margin, y);
  y += 4.5;

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
  doc.setFontSize(11.5);
  doc.setTextColor(...darkColor);
  doc.text(title.toUpperCase(), margin, y);
  y += 2;

  // Solid dark underline
  doc.setDrawColor(...darkColor);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 28, y);

  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.line(margin + 28, y, margin + contentWidth, y);
  y += 5.5;
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
doc.setFontSize(9.2);
doc.setTextColor(...darkColor);
const summary = "Enthusiastic Computer Science and Engineering student specializing in Artificial Intelligence and Machine Learning at Jain University (Batch of 2025–2029). Driven by a passion for building scalable full-stack web platforms, interactive 3D WebGL experiences, and high-performance machine learning models. Dedicated to continuous learning, algorithmic precision, and developing production-grade software solutions.";
const summaryLines = doc.splitTextToSize(summary, contentWidth);
doc.text(summaryLines, margin, y);
y += summaryLines.length * 4.3 + 3.5;

// 3. Education
addSectionTitle("Education");
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(...darkColor);
doc.text("Bachelor of Technology (B.Tech) - Computer Science & Engineering (AI & ML)", margin, y);
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(...grayColor);
doc.text("2025 – 2029 (Expected)", margin + contentWidth - 34, y);
y += 4.2;

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(...primaryColor);
doc.text("Jain University, Bangalore, India", margin, y);
y += 4.2;

doc.setFont("helvetica", "normal");
doc.setFontSize(8.5);
doc.setTextColor(...grayColor);
const coursework = "Key Coursework: Data Structures & Algorithms, Operating Systems, Computer Organization & Architecture, Discrete Mathematics & Graph Theory, Object-Oriented Programming, Database Management Systems.";
const courseworkLines = doc.splitTextToSize(coursework, contentWidth);
doc.text(courseworkLines, margin, y);
y += courseworkLines.length * 3.8 + 4;

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
  doc.setFontSize(8.8);
  doc.setTextColor(...darkColor);
  doc.text(`•  ${cat.label}: `, margin, y);
  const labelWidth = doc.getTextWidth(`•  ${cat.label}: `);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  const skillLines = doc.splitTextToSize(cat.skills, contentWidth - labelWidth);
  doc.text(skillLines, margin + labelWidth, y);
  y += skillLines.length * 3.8 + 1.5;
});
y += 3.5;

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
  checkPageOverflow(22);
  // Title on its own dedicated line to prevent any overlapping
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text(p.title, margin, y);
  y += 3.8;

  // Tech stack cleanly positioned below title
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.2);
  doc.setTextColor(...techColor);
  doc.text(`[ ${p.tech} ]`, margin + 2, y);
  y += 3.8;

  p.bullets.forEach(b => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.3);
    doc.setTextColor(...grayColor);
    const bulletText = `–  ${b}`;
    const lines = doc.splitTextToSize(bulletText, contentWidth - 4);
    doc.text(lines, margin + 4, y);
    y += lines.length * 3.6;
  });
  y += 2.2;
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
  y += 3.8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.3);
  doc.setTextColor(...grayColor);
  doc.text(`    ${c.org}  •  ${c.date}`, margin + 2, y);
  y += 4.2;
});

const outDir = path.resolve("public");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, "Jathin_Ambati_Resume.pdf");
const pdfOutput = doc.output("arraybuffer");
fs.writeFileSync(outPath, Buffer.from(pdfOutput));

console.log("Resume PDF generated successfully at:", outPath);
