import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in CSE (AI & ML)</h4>
                <h5>Jain University</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Joined Jain University to pursue my Bachelor of Technology in
              Computer Science and Engineering with a specialization in Artificial
              Intelligence and Machine Learning.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software & Systems Development</h4>
                <h5>Academic & Hands-on Projects</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Building foundational expertise across modern web technologies,
              algorithms, computer systems, and full-stack engineering practices.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Career Goal & Milestone</h5>
              </div>
              <h3>2029</h3>
            </div>
            <p>
              Aspiring to graduate and launch my career as a versatile Full Stack
              Developer by the end of 2029, delivering high-performance, scalable web systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
