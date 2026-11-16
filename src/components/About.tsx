import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";

const About = () => {
  const photoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = photoWrapperRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: ".about-section",
      start: "top 75%",
      end: "bottom 20%",
      onEnter: () => el.classList.add("in-view"),
      onLeave: () => el.classList.remove("in-view"),
      onEnterBack: () => el.classList.add("in-view"),
      onLeaveBack: () => el.classList.remove("in-view"),
    });

    if (trigger.isActive) {
      el.classList.add("in-view");
    }

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <div className="about-photo-wrapper" ref={photoWrapperRef}>
          <div className="about-photo-frame">
            <img
              src="/images/jathin.jpg"
              alt="Jathin Ambati"
              className="about-photo"
            />
            <div className="about-photo-ring" />
          </div>
          <div className="about-photo-info">
            <span className="about-photo-name">Jathin Ambati V</span>
            <span className="about-photo-tag">
              <span className="about-tag-dot" /> AI/ML & Full Stack
            </span>
          </div>
        </div>
        <h3 className="title">About Me</h3>
        <p className="para">
          I'm Jathin Ambati, a Computer Science & Engineering student specializing in Artificial Intelligence and Machine Learning at Jain University. I specialize in designing intelligent machine learning models, immersive 3D web applications, and robust software architectures.
        </p>
      </div>
    </div>
  );
};

export default About;
