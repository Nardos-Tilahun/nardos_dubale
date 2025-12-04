// data/projects.ts

export interface ProjectTechnology {
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "other";
}

export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  imageUrl: string;
  features: string[];
  technologies: ProjectTechnology[];
  images: ProjectImage[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
}

export const projects: Project[] = [
  {
    id: "goal-cracker",
    title: "Goal Cracker - Recursive AI Strategy Engine",
    description: "A strategic planning engine that fractures ambiguous goals into atomic, actionable blueprints. Features infinite recursive drill-downs and non-hallucinating structured outputs.",
    type: "Full Stack AI Application",
    content:
      "Goal Cracker is not just another chatbot; it is a Strategic AI Planning Engine designed to cure the paralysis of big ambitions. Unlike standard LLMs that offer vague, hallucinated advice, Goal Cracker enforces strict JSON-structured reasoning to fracture complex goals into 5 specific, actionable steps. Users can 'drill down' infinitely into any step, creating a deep recursive tree of tasks using a fractal planning approach. With a visual Mind Map for navigation, exportable blueprints, and a multi-agent 'War Room' (switching between Llama 3.3 and Mixtral), it allows users to audit their strategy from the macro vision down to the micro execution, ensuring they always know exactly where they stand in relation to their actual goal.",
    imageUrl: "goal_cracker_landing", // Main landing page image
    features: [
      "Infinite Recursive Drill-Down (Fractal Planning)",
      "Multi-Agent 'War Room' (Hot-swap Llama 3.3/Mixtral)",
      "Interactive Mind Map with Zoom, Pan, & Filters",
      "Visual Complexity Mapping & Difficulty Charts",
      "Real-Time Streaming with Hybrid JSON/Text Parsing",
      "Non-Hallucinating Structured Output Enforcement",
      "Branching Timelines (Version Control for Ideas)",
      "Secure Authentication (Google/Email via Better Auth)",
      "Visual Data Export (SVG, PNG, PDF, JSON, Markdown)",
      "Dynamic Slogans & Featured Examples Engine",
    ],
    technologies: [
      { name: "Next.js 16", category: "frontend" },
      { name: "TypeScript", category: "frontend" },
      { name: "FastAPI (Python)", category: "backend" },
      { name: "PostgreSQL", category: "database" },
      { name: "Docker", category: "devops" },
      { name: "Groq API", category: "other" },
      { name: "Tailwind CSS v4", category: "frontend" },
      { name: "Framer Motion", category: "frontend" },
      { name: "Better Auth", category: "backend" },
      { name: "SQLAlchemy", category: "backend" },
      { name: "Recharts", category: "frontend" },
      { name: "Zustand", category: "frontend" }
    ],
    images: [],
    challenges: [
      "Orchestrating a robust streaming architecture that handles raw text and structured JSON simultaneously to prevent UI freezing.",
      "Managing infinite recursive branching where every 'step' can become a new parent 'goal', requiring a complex tree-based database schema.",
      "Ensuring seamless synchronization between a modern Next.js 16 frontend and a Python FastAPI backend using Docker containers.",
      "Preventing LLM hallucination by enforcing strict output protocols while maintaining a natural conversational flow."
    ],
    solutions: [
      "Implemented a fault-tolerant stream parser using `best-effort-json-parser` to render UI components (Charts/Logs) progressively as packets arrive.",
      "Designed a recursive data structure in PostgreSQL and a React context-based Mind Map navigator to handle infinite depth traversal.",
      "Utilized Docker Compose for local development consistency and established a clean REST API contract for Client-Server communication.",
      "Engineered a 'System Prompt' architecture that rejects chit-chat and enforces a specific JSON schema, backed by a Pydantic validation layer."
    ],
    learnings: [
      "Mastered the integration of Python (FastAPI) with Node.js (Next.js) in a microservices-like architecture.",
      "Deepened knowledge of LLM streaming protocols, Server-Sent Events (SSE), and handling non-deterministic outputs.",
      "Gained advanced experience in building interactive data visualizations (Mind Maps) and state management for recursive data.",
      "Refined skills in modern authentication flows using Better Auth and securing API routes against abuse."
    ],
  },
  {
    id: "personal-loan-management",
    title: "Personal Financial Loan Management System",
    description: "A comprehensive platform for managing personal loans online with separate interfaces for administrators and customers.",
    type: "Full Stack Web Application",
    content:
      "This full-stack web application enables secure loan management for both administrators and customers. Administrators can manage users, loans, and payments, while customers can track their loan statuses and payment history. The application streamlines the entire lending process with features like authentication, payment tracking, email notifications, and detailed analytics. The system is designed with role-based access to provide different views and capabilities depending on user permissions.",
    imageUrl: "dashboard1234",
    features: [
      "User authentication with role-based access control",
      "Comprehensive loan application management",
      "Payment tracking and transaction history",
      "Interactive dashboard with financial analytics",
      "Automated email notifications",
      "Customer verification system",
      "Multi-currency support",
      "Responsive design for all devices",
      "Batch operations for admin efficiency",
      "Real-time input validation",
    ],
    technologies: [
      { name: "React", category: "frontend" },
      { name: "Node.js", category: "backend" },
      { name: "Express", category: "backend" },
      { name: "MySQL", category: "database" },
      { name: "JWT", category: "backend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "Vite", category: "frontend" },
      { name: "SendGrid", category: "other" },
      { name: "D3.js", category: "frontend" },
      { name: "Material UI", category: "frontend" },
      { name: "Lodash", category: "backend" },
      { name: "Bcrypt", category: "backend" },
      { name: "Nodemailer", category: "other" },
      { name: "Winston", category: "backend" },
      { name: "Morgan", category: "backend" },
      { name: "Multer", category: "backend" },
      { name: "React Router DOM", category: "frontend" },
      { name: "Helmet", category: "backend" },
      { name: "CORS", category: "backend" },
      { name: "Country-State-City", category: "other" },
      { name: "React Phone Number Input", category: "frontend" }
    ],
    images: [],
    challenges: [
      "Frontend design collaboration was challenging; a UI/UX designer was consulted to refine the interface.",
      "Developed a cash-based payment algorithm to ensure rounded payment amounts.",
      "Faced time constraints as this was my first full-scale real-world project.",
      "Managed evolving requirements by adopting a modular and adaptable system architecture.",
    ],
    solutions: [
      "Designed wireframes and collaborated on UI/UX improvements.",
      "Created an optimized algorithm to distribute payments correctly.",
      "Used agile methodology to prioritize features and iterate efficiently.",
      "Built modular components for easier adaptability to changing requirements."
    ],
    learnings: [
      "Gained experience with full-stack architecture and integrating financial logic.",
      "Learned how to handle authentication and security with JWT and Bcrypt.",
      "Improved database management skills using MySQL for structured financial data.",
      "Refined project management skills using agile methodologies."
    ],
  },
  {
    id: "shipment-tracking-system",
    title: "Shipment Tracking System for Logistics",
    description: "A robust full-stack web application for managing and tracking logistics shipments, with user management and dashboard analytics.",
    type: "Full Stack Web Application",
    content:
      "This comprehensive system streamlines logistics operations by allowing administrators to manage users and track shipments from creation to delivery. It provides a user-friendly interface for creating, viewing, editing, and deleting shipment records. The system features a powerful dashboard with real-time statistics, charts for various metrics (status, type, office, payment), and recent activity. Secure JWT authentication and role-based access control ensure data integrity and user permissions. Built with Next.js, React, Prisma, and PostgreSQL, it offers a scalable and efficient solution for logistics management.",
    imageUrl: "shipment_dashboard_main",
    features: [
      "Secure User Authentication (JWT)",
      "Role-Based Access Control (Admin/User)",
      "Comprehensive Shipment CRUD (Create, Read, Update, Delete)",
      "Interactive Dashboard with Analytics and Charts",
      "Shipment Filtering, Search, Pagination, and Sorting",
      "Detailed Shipment Views",
      "User Management (Admin-only)",
      "Responsive Design",
      "Activity Logging",
      "Customizable Statuses for Shipments, Payments, and Tax Refunds",
    ],
    technologies: [
      { name: "Next.js", category: "frontend" },
      { name: "React", category: "frontend" },
      { name: "TypeScript", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "Shadcn UI", category: "frontend" },
      { name: "Recharts", category: "frontend" },
      { name: "Sonner", category: "frontend" },
      { name: "Node.js", category: "backend" },
      { name: "Next.js API Routes", category: "backend" },
      { name: "Prisma ORM", category: "backend" },
      { name: "PostgreSQL", category: "database" },
      { name: "JWT (Jose)", category: "backend" },
      { name: "Bcryptjs", category: "backend" },
      { name: "Cloudinary", category: "other" },
      { name: "Lucide React", category: "other" },
    ],
    images: [],
    challenges: [
      "Implementing robust authentication and authorization (RBAC) with JWT across Next.js API routes and client-side components.",
      "Designing and optimizing complex database queries with Prisma for the dashboard analytics and shipment list filtering/pagination.",
      "Handling multi-step forms and client-side validation dynamically for shipment creation/editing.",
      "Ensuring data consistency and graceful error handling across all API interactions and UI states.",
    ],
    solutions: [
      "Utilized Next.js middleware and custom JWT utilities (Jose, Bcryptjs) to verify tokens and attach user roles/IDs to API requests. Developed a custom `AuthContext` for global client-side auth state.",
      "Leveraged Prisma's `groupBy` and `count` aggregations for efficient dashboard statistics. Implemented dynamic `where` clauses and `orderBy` for the shipment list API for flexible filtering and sorting.",
      "Structured `ShipmentForm` into tabbed sections with per-tab validation. Used `useState` for field errors and `toast` for user feedback to guide users through required inputs.",
      "Implemented comprehensive `try-catch` blocks in API routes and client-side fetches. Used `sonner` for consistent user notifications and `loading`/`error` states in components for better UX.",
    ],
    learnings: [
      "Deepened understanding of full-stack development with Next.js, including SSG/SSR paradigms, API routes, and client/server component interaction.",
      "Mastered advanced Prisma queries and schema design for complex data models and efficient data retrieval.",
      "Gained hands-on experience with `recharts` for creating interactive and responsive data visualizations.",
      "Improved error handling strategies and user feedback mechanisms in single-page applications.",
      "Learned to integrate and manage user authentication flows from scratch, including secure password hashing and token management.",
    ],
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};