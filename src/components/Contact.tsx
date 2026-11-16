import { useState, useEffect } from "react";
import { MdArrowOutward, MdCopyright, MdSend, MdCheckCircleOutline, MdErrorOutline, MdRemoveRedEye, MdStar } from "react-icons/md";
import "./styles/Contact.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const Contact = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: 5,
  });

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Check if this browser session has already counted a visit
    const hasVisitedSession = Boolean(sessionStorage.getItem("portfolio_session_visited"));
    const query = hasVisitedSession ? "?peek=true" : "";

    // Guard against React 18 StrictMode double-incrementing on component mount
    if (!hasVisitedSession) {
      sessionStorage.setItem("portfolio_session_visited", "true");
    }

    fetch(`${API_BASE}/api/visitor-count${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.visitor_count !== undefined) {
          setVisitorCount(data.visitor_count);
          setBackendOnline(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          if (!hasVisitedSession) {
            sessionStorage.removeItem("portfolio_session_visited");
          }
          setBackendOnline(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitState("error");
      setStatusMessage("Please fill in Name, Email, and Message.");
      return;
    }

    setSubmitState("loading");
    setStatusMessage("Sending to Python backend database...");

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        setSubmitState("success");
        setStatusMessage(result.message || "Thank you! Your message has been stored in the Python backend.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          rating: 5,
        });
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (err: unknown) {
      setSubmitState("error");
      const errText = err instanceof Error ? err.message : "Unable to reach Python backend.";
      setStatusMessage(`${errText} Feel free to write directly to ambativjathin@gmail.com.`);
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-header-row">
          <h3>Contact & Feedback</h3>
          <div className="python-backend-pill" title="Real-time Python 3 & SQLite service">
            <span className={`status-dot ${backendOnline ? "online" : backendOnline === false ? "offline" : "checking"}`} />
            <span className="pill-text">
              Python Backend: {backendOnline ? "Live" : backendOnline === false ? "Standby" : "Connecting..."}
            </span>
            {visitorCount !== null && (
              <span className="visitor-badge" title="Unique portfolio visits tracked by Python SQLite service">
                <MdRemoveRedEye className="eye-icon" /> {visitorCount} visits
              </span>
            )}
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-intro">
              <h4>Send a Message or Feedback</h4>
              <p>Powered by our custom Python backend API with SQLite persistence.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Alex Turing"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-cursor="disable"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-cursor="disable"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject / Topic</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Project inquiry, collaboration, or feedback"
                  value={formData.subject}
                  onChange={handleChange}
                  data-cursor="disable"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">
                  Portfolio Experience Rating <span className="rating-preview"><MdStar /> {formData.rating}/5</span>
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  data-cursor="disable"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Great)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                  <option value={2}>⭐⭐ (2 - Fair)</option>
                  <option value={1}>⭐ (1 - Needs Improvement)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Write your message or project requirements here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  data-cursor="disable"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={submitState === "loading"}
                data-cursor="pointer"
              >
                {submitState === "loading" ? "Saving to Python DB..." : (
                  <>
                    Send Message <MdSend />
                  </>
                )}
              </button>

              {statusMessage && (
                <div className={`form-status-msg ${submitState}`}>
                  {submitState === "success" && <MdCheckCircleOutline />}
                  {submitState === "error" && <MdErrorOutline />}
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Direct Email</h4>
            <p>
              <a href="mailto:ambativjathin@gmail.com" data-cursor="disable">
                ambativjathin@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+918123541856" data-cursor="disable">
                +91 81235 41856
              </a>
            </p>
            <h4>Location</h4>
            <p>
              <a href="#contact" data-cursor="disable">
                Bangalore, India
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/ambativjathin"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/jathin-ambati-v-2897b321a/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BUaYxqfvTROe2vkvEpn5Mww%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://x.com/VJathin74139"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Twitter <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/jathin_ambati?vrfl=MWVyNnY4NDdkc2kwNw=="
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Jathin Ambati</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
