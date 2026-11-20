import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projects = [
  {
    title: "AI Vision & Deep Learning Suite",
    category: "Machine Learning & AI",
    tools: "Python, PyTorch, OpenCV, CNNs",
    image: "/images/projects/ai-vision.jpg",
    link: "https://github.com/ambativjathin",
  },
  {
    title: "3D Interactive Web Experience",
    category: "Creative Development",
    tools: "React, Three.js, GSAP, Rapier Physics",
    image: "/images/projects/3d-web.jpg",
    link: "https://github.com/ambativjathin",
  },
  {
    title: "OS Process Scheduler Simulator",
    category: "Systems & Architecture",
    tools: "C++, Operating Systems, Scheduling Algorithms",
    image: "/images/projects/os-scheduler.jpg",
    link: "https://github.com/ambativjathin",
  },
  {
    title: "Full-Stack Intelligent Web App",
    category: "Web Platform",
    tools: "Next.js, TypeScript, Node.js, MongoDB",
    image: "/images/projects/fullstack-app.jpg",
    link: "https://github.com/ambativjathin",
  },
  {
    title: "Discrete Math & Graph Visualizer",
    category: "Algorithms & Mathematics",
    tools: "JavaScript, HTML5 Canvas, Graph Theory",
    image: "/images/projects/graph-visualizer.jpg",
    link: "https://github.com/ambativjathin",
  },
  {
    title: "Multi-Modal NLP & LLM Pipeline",
    category: "Natural Language Processing",
    tools: "Python, Transformers, PyTorch, REST APIs",
    image: "/images/projects/nlp-llm.jpg",
    link: "https://github.com/ambativjathin",
  },
  {
    title: "ChronoLens",
    category: "Isomorphic Analyst Workstation",
    tools: "SPARQL, Wikidata, Pydantic v2, Comparative Chronology",
    image: "/images/projects/chronolens.jpg",
    link: "https://github.com/ambativjathin",
  },
];

const Work = () => {
  useGSAP(() => {
    function getTranslateX() {
      const boxes = document.querySelectorAll(".work-box");
      const workContainer = document.querySelector(".work-container") as HTMLElement;
      if (!boxes.length || !workContainer) return 0;
      const lastBox = boxes[boxes.length - 1] as HTMLElement;
      // Stop precisely as the last card reaches full view at the right boundary with zero excess gap
      return Math.max(0, lastBox.offsetLeft + lastBox.offsetWidth - workContainer.clientWidth);
    }

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${getTranslateX()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: () => -getTranslateX(),
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
