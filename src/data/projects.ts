import type { Project } from '@/types'

const IMG = '/project-images/'

/**
 * Projects, ordered most-recent first. `featured` projects render as large
 * cards in the Work section; every project appears in the 3D gallery wall and
 * opens a blog-style detail page (`sections` powers that long-form story).
 */
export const projects: Project[] = [
  {
    id: 'auto-code-review',
    index: '01',
    title: 'Automated GitHub PR Review System',
    category: 'AI & DevOps',
    year: '2026',
    role: 'Personal Project',
    tagline:
      'An AI-powered GitHub App that acts as an automated first line of defense for code security, using a fine-tuned Llama-3.1 model.',
    tools: ['Python', 'Flask', 'Llama-3.1 8B', 'Unsloth (QLoRA)', 'GitHub Apps',  'Github REST API','MySQL', 'Streamlit'],
    overview:
      'Code reviews are a critical part of the software development lifecycle, but they often create bottlenecks and are prone to human error when reviewers are fatigued. To solve this, I built an end-to-end automated Pull Request review system integrated directly into GitHub. Using a fine-tuned Llama-3.1-8B-Instruct model hosted via Ollama, the system acts as a strict, automated security engineer. It scans incoming git diffs, detects vulnerabilities, and leaves precise line-by-line comments on the PR, drastically reducing the manual review burden while maintaining a high recall rate for security flaws.',
    sections: [
      {
        heading: 'The AI Engine & Fine-Tuning Strategy',
        body: 'Instead of relying on general-purpose API calls that might compromise code privacy or hallucinate context, I fine-tuned the Llama-3.1-8B-Instruct model. Using the Unsloth framework and QLoRA for maximum training efficiency, the model was trained on an Alpaca-style prompt format. It learns to ingest raw unified git diffs and strictly output a specific JSON schema containing the target commit, the review action (APPROVE, REQUEST_CHANGES, or COMMENT), and an array of inline comments with custom severity tags (CRITICAL, HIGH, MEDIUM, LOW).',
      },
      {
        heading: 'Backend Orchestration & GitHub Integration',
        body: "The system is orchestrated by a lightweight Python Flask backend. Rather than using a standard Personal Access Token, it operates as a custom GitHub App, dynamically generating 1-hour Installation Tokens via JWTs to bypass restrictions against self-approving PRs. To handle GitHub's strict 10-second webhook timeout, the backend processes incoming payloads asynchronously. It immediately returns a 200 OK status while offloading the diff retrieval and LLM inference to a background thread.",
      },
      {
        heading: 'Defensive Guardrails: Taming the LLM',
        body: "Bridging the gap between a probabilistic LLM and the rigid GitHub API required robust defensive programming. I engineered several guardrails at the Data Transfer Object (DTO) level. 'The Line Number Rescue' automatically intercepts and fixes hallucinatory line keys. The 'Flattened JSON Repair' rebuilds broken array structures, and the 'Custom Severity Injection' embeds the AI's custom tags directly into Markdown. Crucially, the 'Bipolar Logic Override' checks the AI's sentiment: if the text summary is overwhelmingly positive but triggers a REQUEST_CHANGES event, the system automatically downgrades it to a harmless COMMENT to prevent unjustified pipeline blocks.",
      },
      {
        heading: 'Analytics & Monitoring Dashboard',
        body: "To monitor system performance and track security metrics over time, I built a decoupled Single Page Application (SPA) using Streamlit. Connected to the self-hosted MySQL database, the dashboard provides live metrics on inference times and total PRs reviewed. It features an interactive 'Deep Dive Viewer' that parses the nested JSON model outputs, color-coding the custom severity tags to help developers audit the AI's logic file-by-file and monitor for inference degradation.",
      },
    ],
    accent: 'linear-gradient(120deg, #0d1117 0%, #1f6feb 50%, #8957e5 100%)',
    featured: true,
  },
  {
    id: 'private-cloud-service',
    index: '02',
    title: 'Dockerized Private Cloud Storage Service',
    category: 'Cloud Engineering & DevOps',
    year: '2026',
    role: 'Personal Project',
    tagline: 'A highly scalable, self-hosted microservices architecture for private cloud storage.',
    tools: ['Docker', 'Nextcloud', 'MariaDB', 'Redis', 'Ubuntu Server', 'Imaginary (Go)'],
    overview:
      'This project outlines the deployment roadmap for a production-grade, three-tier private cloud storage solution. Building on established workflows for self-hosted environments — such as deploying containerized web services and managing relational databases — it expands those core concepts into a highly scalable microservices architecture using Docker Compose.',
    sections: [
      {
        heading: 'Architecture Overview',
        body: 'The infrastructure relies on three distinct, containerized layers communicating over an isolated Docker bridge network. This decoupled approach ensures data persistence, high availability, and rapid disaster recovery. The stack is divided into an Application Layer running Nextcloud (PHP/Apache), a Database Layer using MariaDB as a MySQL drop-in, and a Caching Layer using Redis.',
      },
      {
        heading: 'Infrastructure as Code & Data Persistence',
        body: 'To guarantee data integrity across container lifecycle events, the deployment utilizes persistent Docker volumes defined within a YAML configuration file. By separating the core application runtime from the persistent storage, the system ensures that the application containers can be destroyed, updated, or rebuilt without any data loss or interruption to the underlying database files. The underlying host is a headless Linux distribution, ensuring maximum system resources are allocated strictly to the container runtime rather than a graphical desktop.',
      },
      {
        heading: 'Overcoming Media Processing Bottlenecks',
        body: 'A significant engineering challenge was enabling the native rendering of proprietary iOS media formats (.HEIC) while maintaining performance. Initially, this required writing a custom Dockerfile to extend the lightweight vendor image and inject essential `libheif` dependencies. However, to prevent CPU bottlenecking during heavy media generation, I offloaded these tasks entirely.',
      },
      {
        heading: 'Microservice Offloading',
        body: "To achieve true enterprise-grade scalability, I decoupled the heavy background tasks from the main web application. I integrated 'Imaginary', a dedicated, Go-based microservice utilizing the `libvips` C-library, to handle all image and thumbnail processing asynchronously over the internal network. This architectural shift dramatically reduced application-layer latency and resolved proprietary codec incompatibilities.",
      },
      {
        heading: 'State Management & Cache Invalidation',
        body: 'Working with complex containerized databases required strict state management. I successfully navigated database cache invalidation by manually triggering targeted metadata rescans, flushing Redis memory caches, and resetting OS-level file permissions. This ensured the database accurately indexed real-time file states and successfully generated previews without relying on outdated failure logs. Redis specifically handled transactional file locking and memory caching to prevent UI bottlenecking during transfers.',
      },
    ],
    accent: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    featured: true,
  },
  {
    id: 'bali-school-kids',
    index: '03',
    title: 'Bali School Kids',
    category: 'Web Development',
    year: '2025',
    role: 'Team Lead & Full-Stack Developer',
    tagline: 'A role-based platform bridging the gap between sponsors, schools, and foster children.',
    tools: ['React', 'TypeScript', 'Supabase'],
    overview:
      "Bali School Kids is a web platform built to bring transparency and efficiency to the Bali School Kids initiative. By providing a centralized, role-based system, the platform streamlines sponsorship management and equips schools with the necessary tools to monitor and report on foster children's academic progress, ensuring sponsors stay connected to their impact.",
    sections: [
      {
        heading: 'The Challenge',
        body: 'Managing educational sponsorships often involves fragmented communication and scattered data between sponsors, school administrators, and the foundation itself. The Bali School Kids initiative needed a unified solution to securely handle student records, track academic progress, and manage complex role-based access without overwhelming administrative overhead.',
      },
      {
        heading: 'Building the Foundation',
        body: "To build a highly responsive and type-safe frontend, I utilized React and TypeScript, creating custom templates tailored to distinct user dashboards. For the backend, the platform relied on Supabase. Leveraging Supabase's hosted PostgreSQL database allowed for rapid implementation of complex relational schemas to map out users, student records, and sponsorship flows, while its built-in authentication securely handled the role-based logic.",
      },
      {
        heading: 'Impact and Features',
        body: "The resulting architecture provided distinct, secure portals for sponsors to track their respective foster children's milestones, while giving schools a streamlined interface to update grades and statuses. By utilizing a Backend-as-a-Service approach initially, the focus remained entirely on delivering a seamless user experience and establishing a robust data model for the foundation.",
      },
    ],
    accent: 'linear-gradient(213deg, #8B5CF6 0%, #EC4899 100%)',
    featured: false,
  },
  {
    id: 'sidewi-bali',
    index: '04',
    title: 'Sidewi Bali',
    category: 'Web Development',
    year: '2024',
    role: 'Frontend Developer',
    tagline:
      "A digital gateway connecting tourists with the rich culture and natural beauty of Bali's tourist villages.",
    tools: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Figma', 'Postman'],
    overview:
      'A comprehensive information system aimed at promoting and cataloging tourist villages across the Bali region, Indonesia. Built as a Campus Project-Based Learning initiative, the platform is designed to facilitate tourists who want to explore local traditions, natural landscapes, and unique cultural experiences. By digitizing this information, the application aims to boost local tourism and support community economies.',
    sections: [
      {
        heading: 'Project Background & Team Structure',
        body: 'Developed as a campus project-based lerning initiative. The project required coordinating across different teams to design a scalable platform capable of handling diverse tourism data.',
      },
      {
        heading: 'Tech Stack Evolution: Pivoting to Laravel',
        body: 'While our initial repository and documentation were structured around a Node.js/Express backend coupled with a Flutter mobile app, our team was tasked to develop the website part of the system. We ultimately utilized Laravel for the entire system architecture. This monolithic, full-stack approach allowed us to streamline development, reduce overhead, and deliver a robust web platform more efficiently.',
      },
      {
        heading: 'Core Features & Impact',
        body: "The platform serves as an interactive directory, detailing the distinct offerings of various Balinese villages. From UI/UX wireframing in Figma to the final deployment, the goal was to create an intuitive experience for travelers while providing local administrators an easy way to manage their village's digital presence.",
      },
    ],
    accent: 'linear-gradient(213deg, #a8edea 0%, #fed6e3 100%)',
    featured: false,
  },
  {
    id: 'broom-project',
    index: '05',
    title: 'BRoom Project',
    category: 'Web Development',
    year: '2023',
    role: 'Team Lead & Full-Stack Developer',
    tagline:
      'A comprehensive facility reservation system featuring multi-role access and automated approval workflows.',
    tools: ['PHP', 'CodeIgniter', 'MySQL', 'jQuery'],
    overview:
      'BRoom is a web-based room reservation platform designed to streamline facility bookings. Built using the CodeIgniter PHP framework, the application separates user access into distinct functional roles. It handles everything from checking room availability schedules to multi-level approvals, OTP verification, and generating PDF reports.',
    sections: [
      {
        heading: 'Multi-Role Architecture',
        body: "The system's architecture is divided into three dedicated actor dashboards: 'Peminjam' (Borrowers) for requesting rooms and checking schedules, 'Pengelola' (Managers) for managing room data and overseeing reservations, and 'Pimpinan' (Leadership) for the final approval workflow.",
      },
      {
        heading: 'Reservation & Approval Workflow',
        body: 'Users navigate through an intuitive, step-by-step reservation form powered by jQuery Steps. Once a booking is submitted, the system triggers live notifications and requires One-Time Password (OTP) authentication. Final approvals are systematically routed to the Leadership module for sign-off.',
      },
      {
        heading: 'Tech Stack & Custom Integrations',
        body: 'Built on a robust CodeIgniter MVC architecture, the platform includes custom libraries for session validation, authentication, and email verification. It features a relational MySQL database, Memcached integration for optimized performance, and native PDF generation capabilities for formal documentation and reservation slips.',
      },
    ],
    accent: 'linear-gradient(213deg, #f6d365 0%, #fda085 100%)',
    featured: false,
  },
  {
    id: 'toorism',
    index: '06',
    title: 'Toorism Project',
    category: 'Hackathon Project',
    year: '2026',
    role: 'Team Lead & Frontend Developer',
    tagline: "An open-source, real-time map and routing application for navigating Bali and beyond.",
    tools: ['NuxtJS', 'Go Fiber', 'MySQL', 'OSRM API', 'Geolocator'],
    overview: "Toorism is a feature-rich web mapping application built during a fast-paced hackathon. Designed as a comprehensive travel companion, it empowers users with interactive maps, destination suggestions, and route planning, while uniquely tracking the CO<sub>2</sub> impact of their trips. The frontend is powered by a highly scalable Nuxt architecture, communicating seamlessly with a robust Go backend.",
    sections: [
      {
        heading: "Architecting for Scale in Nuxt",
        body: "Map applications can quickly turn into a tangled mess of UI components and background streams. To prevent this, Toorism was built using Nuxt's powerful directory structure to enforce separation of concerns. We organized the codebase into distinct feature modules, including `map`, `destination`, and `onboarding`. Complex domain logic was abstracted into pure Vue Composables (like `useDashboardData.ts` and `useAuth.ts`), while state management was centralized in dedicated store files like `map.store.ts` and `auth.store.ts`."
      },
      {
        heading: "Interactive Mapping & Route Planning",
        body: "The core of the application relies on an interactive map component (`InteractiveMap.vue`) powered by Leaflet under the hood, managed via the `useLeafletMap.ts` composable. Users can interact with map overlay navbars (`MapOverlayNavbar.vue`) and location chips (`MapLocationChip.vue`) to seamlessly navigate the UI. A dedicated `useRoutePlanner.ts` composable handles the pathfinding logic, while a responsive `MapBottomSheet.vue` provides an intuitive, mobile-friendly interface for destination details."
      },
      {
        heading: "Destination Discovery & Social Proof",
        body: "Toorism goes beyond simple A-to-B navigation by offering a rich destination discovery experience. The app features dedicated components for showcasing nearby destinations (`NearbyDestinationCard.vue`) and detailed point-of-interest views (`DestinationDetailCard.vue`). To build trust, we integrated user reviews directly into the platform, leveraging composables like `useDestinationReviews.ts` alongside UI elements like `ReviewCard.vue`."
      },
      {
        heading: "Eco-Conscious User Dashboard & Authentication",
        body: "A standout feature of Toorism is its focus on sustainability. The user dashboard (`dashboard.vue`) provides a comprehensive `TripSummary.vue`, but more importantly, it includes a `Co2Summary.vue` component. This allows users to actively monitor the environmental footprint of their planned routes. Access to this dashboard is protected by custom middleware (`dashboard-auth.ts`) and features a seamless Google OAuth login flow (`google/popup-callback.vue`)."
      }
    ],
    accent: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

/** Look up a single project by its id (used for deep-linking the detail view). */
export function getProject(id: string | undefined): Project | undefined {
  return projects.find((p) => p.id === id)
}
