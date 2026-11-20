import { useEffect } from "react";
import {
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import "./styles/ResumePage.css";

const ResumePage = () => {
  useEffect(() => {
    document.title = "Jathin Ambati - Resume & Curriculum Vitae";
    window.scrollTo(0, 0);

    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverflowY = document.body.style.overflowY;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "auto";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overflowY = prevBodyOverflowY;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page-wrapper">
      {/* Top Floating Control Bar */}
      <header className="resume-header-bar no-print">
        <a href="/" className="resume-back-btn">
          <FaArrowLeft />
          <span>Back to Portfolio</span>
        </a>
        <div className="resume-actions">
          <button onClick={handlePrint} className="resume-btn secondary">
            <FaPrint />
            <span>Print View</span>
          </button>
          <a
            href="/Jathin_Ambati_Resume.pdf"
            download="Jathin_Ambati_Resume.pdf"
            className="resume-btn primary"
          >
            <FaDownload />
            <span>Download PDF</span>
          </a>
        </div>
      </header>

      {/* Main Resume Document Canvas */}
      <main className="resume-document a4-sheet">
        {/* Header Section */}
        <header className="cv-header">
          <div className="cv-header-row">
            <div className="cv-header-main">
              <h1 className="cv-name">JATHIN AMBATI V</h1>
              <h2 className="cv-title">
                Computer Science & Engineering (AI & ML) • Aspiring Full Stack Developer
              </h2>
            </div>
            <div className="cv-photo-frame">
              <img
                src="/images/jathin.jpg"
                alt="Jathin Ambati"
                className="cv-photo"
              />
            </div>
          </div>

          <div className="cv-contacts">
            <a
              href="https://jathinambati.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <FaGlobe /> jathinambati.vercel.app
            </a>
            <a href="mailto:ambativjathin@gmail.com" className="cv-contact-item">
              <FaEnvelope /> ambativjathin@gmail.com
            </a>
            <a href="tel:+918123541856" className="cv-contact-item">
              <FaPhoneAlt /> +91 81235 41856
            </a>
            <span className="cv-contact-item">
              <FaMapMarkerAlt /> Bangalore, India
            </span>
            <a
              href="https://www.linkedin.com/in/jathin-ambati-v-2897b321a/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BUaYxqfvTROe2vkvEpn5Mww%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <FaLinkedin /> LinkedIn Profile
            </a>
            <a
              href="https://github.com/ambativjathin"
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <FaGithub /> GitHub: ambativjathin
            </a>
            <a
              href="https://x.com/VJathin74139"
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <FaXTwitter /> @VJathin74139
            </a>
            <a
              href="https://www.instagram.com/jathin_ambati?vrfl=MWVyNnY4NDdkc2kwNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <FaInstagram /> @jathin_ambati
            </a>
          </div>
        </header>

        <hr className="cv-divider" />

        {/* Professional Summary */}
        <section className="cv-section">
          <h3 className="cv-section-title">Professional Summary</h3>
          <p className="cv-summary-text">
            Passionate Computer Science & Engineering undergraduate specializing in
            Artificial Intelligence and Machine Learning at Jain University (Batch of
            2025–2029). Aspiring to graduate and launch a career as a versatile Full
            Stack Developer by the end of 2029. Proven expertise in building modern,
            responsive web platforms, 3D interactive WebGL graphics, and scalable machine
            learning architectures with algorithmic precision.
          </p>
        </section>

        {/* Education */}
        <section className="cv-section">
          <h3 className="cv-section-title">Education</h3>
          <div className="cv-item">
            <div className="cv-item-header">
              <div>
                <h4 className="cv-item-title">
                  Bachelor of Technology (B.Tech) — Computer Science & Engineering (AI & ML)
                </h4>
                <div className="cv-item-subtitle">Jain University, Bangalore, India</div>
              </div>
              <span className="cv-item-date">2025 – 2029 (Expected)</span>
            </div>
            <p className="cv-item-desc">
              <strong>Core Coursework:</strong> Data Structures & Algorithms, Operating
              Systems, Computer Organization & Architecture, Discrete Mathematics & Graph
              Theory, Artificial Intelligence, Database Management Systems.
            </p>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="cv-section">
          <h3 className="cv-section-title">Technical Skills</h3>
          <div className="cv-skills-grid">
            <div className="cv-skill-group">
              <span className="cv-skill-label">Programming Languages:</span>
              <span className="cv-skill-values">
                Python, JavaScript (ES6+), TypeScript, C++, Java, SQL, HTML5, CSS3
              </span>
            </div>
            <div className="cv-skill-group">
              <span className="cv-skill-label">AI & Machine Learning:</span>
              <span className="cv-skill-values">
                PyTorch, TensorFlow, OpenCV, Scikit-Learn, Deep Learning, CNNs, Transformers,
                NLP, Computer Vision, NumPy, Pandas
              </span>
            </div>
            <div className="cv-skill-group">
              <span className="cv-skill-label">Full Stack & 3D Web:</span>
              <span className="cv-skill-values">
                React.js, Next.js, Node.js, Express.js, Three.js, GSAP, WebGL, Rapier 3D
                Physics, Tailwind CSS, REST APIs
              </span>
            </div>
            <div className="cv-skill-group">
              <span className="cv-skill-label">Databases & Tools:</span>
              <span className="cv-skill-values">
                MongoDB, MySQL, PostgreSQL, Git, GitHub, Linux/Unix, Vite, VS Code, Postman
              </span>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="cv-section">
          <h3 className="cv-section-title">Featured Projects</h3>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">AI Vision & Deep Learning Suite</h4>
              <span className="cv-tech-pill">Python • PyTorch • OpenCV • CNNs</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Engineered high-accuracy convolutional neural network models for real-time
                visual object detection and feature extraction.
              </li>
              <li>
                Implemented preprocessing, dataset augmentation, and automated model
                evaluation pipelines.
              </li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">3D Interactive Web Experience & Physics Sandbox</h4>
              <span className="cv-tech-pill">React • Three.js • GSAP • Rapier • WebGL</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Architected an interactive 3D portfolio incorporating rigid-body physics,
                colliders, and custom materials using React Three Fiber.
              </li>
              <li>
                Orchestrated timeline-driven GSAP ScrollSmoother animations and responsive
                camera views.
              </li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">OS Process Scheduler Simulator</h4>
              <span className="cv-tech-pill">C++ • Operating Systems • CPU Scheduling</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Built a CPU scheduling engine modeling Round Robin, Shortest Job First (SJF),
                and Priority Scheduling algorithms.
              </li>
              <li>
                Analyzed and optimized metrics including wait times, turnaround latency, and
                context-switching overhead.
              </li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">Full-Stack Intelligent Web Application</h4>
              <span className="cv-tech-pill">Next.js • TypeScript • Node.js • MongoDB</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Developed a responsive web application featuring RESTful API integration,
                secure authentication, and dynamic state management.
              </li>
              <li>
                Designed modular backend micro-services with database indexing for sub-second
                query responses.
              </li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">Discrete Math & Graph Visualizer</h4>
              <span className="cv-tech-pill">JavaScript • HTML5 Canvas • Graph Theory</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Interactive graph visualizer executing Dijkstra's shortest path, topological
                sorting, and minimum spanning tree algorithms.
              </li>
              <li>
                Enables users to dynamically create weighted nodes and step through algorithmic
                execution visually.
              </li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">Multi-Modal NLP & LLM Pipeline</h4>
              <span className="cv-tech-pill">Python • Transformers • PyTorch • REST APIs</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Built natural language processing workflows for semantic analysis, text
                summarization, and token inference.
              </li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-item-header">
              <h4 className="cv-item-title">ChronoLens — Isomorphic Analyst Workstation</h4>
              <span className="cv-tech-pill">SPARQL • Wikidata • Pydantic v2 • TypeScript</span>
            </div>
            <ul className="cv-bullets">
              <li>
                Built a comparative historical analysis workstation anchored to live Wikidata
                SPARQL queries with Pydantic v2 schema validation.
              </li>
              <li>
                Computes isomorphic alignment, divergence index, temporal velocity, and
                equivalence risk across historical events with JSON and print brief exports.
              </li>
            </ul>
          </div>
        </section>

        {/* Certifications & Milestones */}
        <section className="cv-section">
          <h3 className="cv-section-title">Certifications & Milestones</h3>
          <ul className="cv-bullets">
            <li>
              <strong>Discrete Mathematics & Mathematical Logic Course:</strong> Completed
              under the Wolfram Certified Instructor Program (2026).
            </li>
            <li>
              <strong>Computer Organization & Architecture Problem-Based Learning:</strong>{" "}
              Practical implementation of Booth's algorithm and instruction set architecture
              design (2026).
            </li>
            <li>
              <strong>Full Stack Career Goal:</strong> On track to graduate as an industry-ready
              Full Stack Software Developer by the end of 2029.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ResumePage;
