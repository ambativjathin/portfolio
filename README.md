# Jathin Ambati — Personal 3D Portfolio & Interactive Web Experience 

[![Live Website](https://img.shields.io/badge/Live_Website-jathinambati.netlify.app-7c3aed?style=for-the-badge&logo=netlify&logoColor=white)](https://jathinambati.netlify.app)
[![Curriculum Vitae](https://img.shields.io/badge/Resume-Interactive_%26_PDF-4f46e5?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://jathinambati.netlify.app/resume)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jathin-ambati-v-2897b321a/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BUaYxqfvTROe2vkvEpn5Mww%3D%3D)

> **Live Production URL**: [https://jathinambati.netlify.app](https://jathinambati.netlify.app)  
> **Interactive Resume**: [https://jathinambati.netlify.app/resume](https://jathinambati.netlify.app/resume)

---

##  Overview

Welcome to the personal portfolio of **Jathin Ambati V**, a Computer Science & Engineering (AI & ML) student at **Jain University** and aspiring Full Stack Developer.

This project showcases a modern, high-performance web experience built with **React**, **Three.js**, **React Three Fiber**, **Rapier 3D Physics**, and **GSAP**.

### Key Highlights
- **3D Interactive Character**: Rendered using Three.js & WebGL with dynamic bone animations, ambient environment maps, and reactive lighting.
- **Rapier Physics Tech Stack**: Dynamic 3D balls colliding in a zero-gravity kinetic simulation with mouse pointer interactivity.
- **Timeline-Driven Horizontal Scrolling**: GSAP ScrollTrigger timeline smoothly sliding project cards with precise boundary alignment.
- **Dedicated Resume Page (`/resume`)**: Standalone A4 curriculum vitae with live print preview and direct vector PDF download.
- **100% Production Ready**: Fully migrated to the standard free `gsap` package, supporting seamless hosting on Netlify and Vercel.

---

##  Tech Stack

- **Frontend & UI**: React 18, TypeScript, Tailwind/Custom CSS, React Icons, React Fast Marquee
- **Backend & Database**: Python 3 (Native REST API with `http.server` + Flask alternative), SQLite3 persistent storage, Full CORS support
- **3D Graphics & Physics**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`
- **Animations**: GSAP 3.15, ScrollSmoother, ScrollTrigger, SplitText
- **Tooling & Build**: Vite, TypeScript Compiler (`tsc`), Node.js, jsPDF
- **Deployment**: Netlify, Vercel

---

##  Project Structure

```bash
Portfolio-Website/
├── backend/
│   ├── server.py             # Zero-dependency Python 3 REST API & SQLite server
│   ├── app_flask.py          # Alternative Flask backend implementation
│   ├── requirements.txt      # Flask & Flask-CORS dependencies (optional)
│   └── data/
│       └── portfolio.db      # SQLite database (contacts & visitor counters)
├── public/
│   ├── images/
│   │   └── projects/         # Curated project subject photos
│   ├── models/               # 3D glTF character and HDR environment
│   ├── Jathin_Ambati_Resume.pdf  # Downloadable executive PDF
│   └── _redirects            # Netlify SPA redirect rules
├── src/
│   ├── components/
│   │   ├── Character/        # Three.js 3D character viewport
│   │   ├── Landing.tsx       # Hero section with animated typography
│   │   ├── About.tsx         # Personal background & vision
│   │   ├── WhatIDo.tsx       # Domains: AI/ML & Full-Stack 3D Web
│   │   ├── Career.tsx        # Education & career milestone timeline
│   │   ├── Work.tsx          # Pinned horizontal project gallery (01-06)
│   │   ├── TechStack.tsx     # 3D Rapier rigid-body physics playground
│   │   ├── Contact.tsx       # Contact form, rating & live Python visitor counter
│   │   └── ResumePage.tsx    # Dedicated /resume page with print styling
│   ├── App.tsx               # Route handler & main container
│   └── main.tsx              # Application entry point
├── netlify.toml              # Netlify build & redirect configuration
├── vercel.json               # Vercel SPA rewrites configuration
└── vite.config.ts            # Multi-page build configuration with /api proxy
```

---

##  Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/ambativjathin/portfolio.git
cd portfolio
npm install
```

Start the Vite development server:

```bash
npm run dev
```

### 🐍 Starting the Python Backend

Start the zero-dependency Python 3 backend API server (runs on `http://localhost:5000`):

```bash
npm run backend
# or directly:
python3.12 backend/server.py
```

*(Optional) Alternatively run the Flask version:*
```bash
python3.12 backend/app_flask.py
```

#### API Endpoints:
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and server runtime status |
| `GET` | `/api/visitor-count` | Real-time visitor counter with atomic SQLite increment |
| `POST` | `/api/contact` | Submits contact/feedback message with rating to SQLite |
| `GET` | `/api/contact/messages` | Admin/viewer endpoint to review recent submissions |

Build for production:

```bash
npm run build
```

---

##  Contact & Connect

- **Email**: [ambativjathin@gmail.com](mailto:ambativjathin@gmail.com)
- **LinkedIn**: [Jathin Ambati V](https://www.linkedin.com/in/jathin-ambati-v-2897b321a/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BUaYxqfvTROe2vkvEpn5Mww%3D%3D)
- **GitHub**: [@ambativjathin](https://github.com/ambativjathin)
- **Twitter / X**: [@VJathin74139](https://x.com/VJathin74139)
- **Instagram**: [@jathin_ambati](https://www.instagram.com/jathin_ambati?vrfl=MWVyNnY4NDdkc2kwNw==)
- **Portfolio**: [https://jathinambati.netlify.app](https://jathinambati.netlify.app)
