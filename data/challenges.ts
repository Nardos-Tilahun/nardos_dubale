// data/challenges.ts

interface ChallengeData {
  title: string;
  description: string;
  solution: string;
  icon?: string;
}

interface ProjectChallenges {
  [projectId: string]: ChallengeData[];
}

const allChallenges: ProjectChallenges = {
  'goal-cracker': [
    {
      title: 'Streaming Mixed Content (JSON + Text)',
      description: 'The AI agents needed to provide a conversational response ("message") AND a structured plan ("steps") simultaneously. Waiting for the full response made the UI feel slow, but standard JSON parsers crash on incomplete strings during streaming, causing the UI to flicker or fail.',
      solution: 'I implemented a fault-tolerant streaming hook on the frontend using `best-effort-json-parser`. This allows the UI to "peek" into the incoming byte stream and render valid parts of the JSON (like the "Thinking" logs and partial "Steps") progressively as they arrive, creating a seamless, instant-feedback experience.',
      icon: 'code'
    },
    {
      title: 'Infinite Branching History',
      description: 'Unlike a linear chat, Goal Cracker allows users to edit any previous message or "drill down" into a specific step, creating a complex tree of alternate timelines and nested goals. Managing this state in a linear SQL database while keeping the UI navigational was complex.',
      solution: 'I designed a recursive "ChatTurn" and "TurnVersion" schema in PostgreSQL where every message links to a parent ID. On the frontend, I built a recursive "Mind Map" navigation system using React Context that rebuilds the visual tree structure from the flat array of turns fetched from the database.',
      icon: 'git-branch' // You might need to map this string to an icon in your component
    },
    {
      title: 'Multi-Agent State Management',
      description: 'Users can switch models (e.g., from Llama to Mixtral) mid-stream or for specific turns. Keeping track of which agent generated which part of the plan without race conditions or data overwrites was difficult.',
      solution: 'I utilized `AbortController` references mapped to specific agent/turn IDs. This ensures that if a user switches agents or stops generation, only the specific relevant network request is cancelled, and the state machine cleanly transitions to the new agent without affecting other history items.',
      icon: 'cpu'
    },
    {
      title: 'Preventing Hallucination',
      description: 'General purpose LLMs often "hallucinate" or drift into conversational fluff when asked for strict plans, breaking the application\'s rigid data structure requirements.',
      solution: 'I engineered a robust "System Prompt" layer that strictly enforces a specific JSON output schema. This is backed by a Pydantic validation layer on the backend that sanitizes inputs and outputs, ensuring the AI focuses purely on actionable, structured logic rather than creative writing.',
      icon: 'shield'
    }
  ],
   'personal-loan-management': [
    {
      title: 'Frontend Design Collaboration',
      description: 'I faced difficulties designing an intuitive and engaging main page that would represent the platform effectively. The UI needed to be professional while remaining user-friendly for various stakeholders.',
      solution: 'I recognized when to seek expertise and collaborated with a designer friend. This partnership allowed me to focus on functionality while ensuring a polished user experience. Through this collaboration, I learned valuable design principles that I have since incorporated into my development process.',
      icon: 'palette'
    },
    {
      title: 'Cash-Based Payment Algorithm',
      description: 'Since this was a cash-based system, payments needed to end in round figures (e.g., $10,000 instead of $10,541.50). I needed to create a system that would divide payments appropriately across terms while ensuring the total amount was covered without overloading customers.',
      solution: 'I developed a custom payment distribution algorithm that intelligently divides the total loan amount into manageable, rounded installments. The algorithm accounts for different term lengths and ensures the final payment adjusts accordingly, making cash transactions practical while maintaining accounting accuracy.',
      icon: 'calculator'
    },
    {
      title: 'Time Constraints & First Real-World Project',
      description: 'As my first full-scale real-world project, I faced significant time pressure to deliver a functioning product while learning new concepts and technologies simultaneously.',
      solution: 'I implemented an agile approach, breaking the project into manageable sprints with clear priorities. This allowed me to deliver core functionality first, then iterate with improvements. I also established a consistent development schedule and leveraged reusable components to accelerate development without sacrificing quality.',
      icon: 'clock'
    },
    {
      title: 'Evolving Requirements',
      description: 'Throughout the development process, customer requirements frequently changed, requiring flexibility and adaptability in the system architecture.',
      solution: 'I built the application with modularity in mind, using a component-based architecture that allowed for easier modifications. I also implemented regular stakeholder check-ins and created a structured change request process to manage evolving requirements systematically, preventing scope creep while accommodating necessary changes.',
      icon: 'refresh-cw'
    }
  ],
  'shipment-tracking-system': [
    {
      title: 'Robust Auth & RBAC Implementation',
      description: 'Building a secure authentication and role-based access control (RBAC) system from scratch, ensuring seamless integration between Next.js API routes and client-side protected pages, while preventing unauthorized data access or actions.',
      solution: 'I developed a custom JWT-based authentication flow using `jose` for token handling and `bcryptjs` for secure password hashing. Implemented middleware in Next.js API routes to verify tokens and inject user roles/IDs. Client-side, a global `AuthContext` managed user sessions, redirecting unauthenticated users and dynamically adjusting UI based on roles.',
      icon: 'lock' // Using a generic lock icon from my example, you can add an SVG if you have it.
    },
    {
      title: 'Complex Data Query Optimization',
      description: 'Optimizing Prisma queries for a dashboard displaying various aggregated statistics (counts, monthly trends) and for a flexible shipment list with search, filtering, sorting, and pagination, all while maintaining performance for potentially large datasets.',
      solution: 'I leveraged Prisma\'s `groupBy`, `count`, and `findMany` with dynamic `where` clauses and `orderBy` options. For the dashboard, I used `Promise.all` with multiple Prisma queries to fetch all required data concurrently. For the list, I implemented server-side pagination and filtering based on URL query parameters, ensuring only relevant data is fetched.',
      icon: 'database' // Using a generic database icon.
    },
    {
      title: 'Multi-Tabbed Form Validation & UX',
      description: 'Creating a multi-tabbed shipment creation/editing form that guides the user through required fields, provides real-time validation feedback, and ensures all necessary data is present before submission across different sections.',
      solution: 'The `ShipmentForm` component was structured using Shadcn UI\'s `Tabs`. I implemented a state-managed form with a validation function that checks all required fields on the *current* tab when navigating. Field-specific error messages are displayed below inputs, and a global toast notifies the user if validation fails before proceeding or submitting.',
      icon: 'form' // Using a generic form icon.
    },
    {
      title: 'Consistent Error Handling & User Feedback',
      description: 'Ensuring that all API interactions, whether for fetching, creating, updating, or deleting data, provide consistent, clear, and actionable error messages to the user across the application.',
      solution: 'I established a centralized error handling pattern. On the server-side, Next.js API routes return JSON `{ error: "..." }` with appropriate HTTP status codes. On the client, fetches use `try-catch` blocks and `response.json()` to extract custom error messages. `sonner` toasts are used to display these messages in a non-intrusive way, improving the overall user experience during unexpected issues.',
      icon: 'alert-triangle' // Using a generic alert icon.
    },
  ],
  
};

export const getChallengesByProjectId = (projectId: string): ChallengeData[] => {
  return allChallenges[projectId] || [];
};