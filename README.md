# Solvify

## 🚀 Overview
Solvify is a modern, full-stack web application designed to help users enhance their coding skills. By integrating automated question scraping and an AI-powered prompt system, Solvify offers a seamless platform for users to discover, solve, and track programming challenges. It aims to bridge the gap between learning and practice by providing real-time problem-solving environments and personalized AI assistance.

## 🧠 Features
- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **AI Prompt System**: Integrated AI assistance to help users with hints, explanations, and code reviews.
- **Progress Tracking**: Keep track of solved questions and overall performance metrics.
- **Modern UI**: Fully responsive, animated, and accessible frontend built with Next.js 16, Tailwind CSS v4, and Framer Motion.
- **Robust Backend**: Fast and scalable REST API powered by Node.js, Express, and PostgreSQL via Prisma ORM.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Web Scraping**: Puppeteer Core
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Language**: TypeScript

### Database & DevOps
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Linting & Formatting**: ESLint
- **Development Tools**: Nodemon, tsx

## 📂 Project Structure

```text
solvify-round-2/
├── backend/                  # Node.js/Express backend
│   ├── prisma/               # Database schema and migrations
│   │   └── schema.prisma     # Prisma schema defining User, Question, PromptQuery, etc.
│   ├── src/                  # Backend source code
│   │   ├── controllers/      # Route handlers (auth, scrapper, questions)
│   │   ├── middlewares/      # Express middlewares (e.g., auth protection)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic and external service integrations
│   │   └── server.ts         # Express server entry point
│   └── package.json          # Backend dependencies and scripts
│
└── client/                   # Next.js frontend
    ├── app/                  # Next.js App Router pages and layouts
    ├── component/            # Reusable React components (Navbar, Hero, Login, etc.)
    ├── lib/                  # Utility functions and Axios client configuration
    ├── services/             # Frontend services for API communication (e.g., authService)
    ├── public/               # Static assets
    └── package.json          # Frontend dependencies and scripts
```

## 🧩 System Architecture
The system follows a standard client-server architecture. The Next.js frontend communicates with the Node.js/Express backend via RESTful APIs using Axios. The backend handles business logic, including user authentication, web scraping using Puppeteer, and AI prompt processing. Data is persistently stored in a PostgreSQL database, managed through Prisma ORM. JWTs are used to secure protected routes, ensuring that only authenticated users can submit answers, use the AI assistant, or trigger the web scraper.

## 🖼️ Architecture Diagram

```mermaid
flowchart TD
    %% Define styles
    classDef user fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef frontend fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b;
    classDef backend fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#1b5e20;
    classDef database fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100;
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c;

    %% Nodes
    User(("🧑‍💻 User")):::user

    subgraph Frontend_Layer ["🖥️ Frontend (Next.js)"]
        UI["🎨 React UI / Components"]:::frontend
        AuthServ["🔐 Auth Service"]:::frontend
        Axios["🌐 Axios Client"]:::frontend
    end

    subgraph Backend_Layer ["⚙️ Backend (Node.js/Express)"]
        API["📡 REST API Routes"]:::backend
        AuthMW["🛡️ Auth Middleware"]:::backend
        Controllers["🧠 Controllers"]:::backend
        Scraper["🕷️ Puppeteer Scraper"]:::backend
        ORM["🗄️ Prisma ORM"]:::backend
    end

    subgraph Database_Layer ["💾 Database"]
        PG[("🐘 PostgreSQL\n(Users, Questions, Prompts)")]:::database
    end

    subgraph External_Services ["🌍 External Services"]
        ExtSites["🌐 Target Coding Sites"]:::external
        AI["🤖 AI/LLM Provider"]:::external
    end

    %% Relationships
    User -->|Interacts| UI
    UI -->|Uses| AuthServ
    UI -->|Makes Requests| Axios
    AuthServ -->|Configures| Axios

    Axios -->|HTTP Requests| API
    
    API -->|Validates Token| AuthMW
    AuthMW -->|Passes Request| Controllers
    
    Controllers -->|Triggers| Scraper
    Controllers -->|Queries| ORM
    Controllers -->|Generates Hints| AI
    
    Scraper -->|Fetches Problems| ExtSites
    
    ORM <-->|Reads/Writes| PG
```

## 📡 API Endpoints

### Authentication
- `POST /api/signup`: Register a new user account.
- `POST /api/login`: Authenticate a user and return a JWT.

### Questions & Scraping
- `POST /api/scrapper`: (Protected) Trigger the web scraper to fetch new coding questions.
- `GET /api/:id`: Retrieve details of a specific question by its ID.
- `POST /api/:id/submit`: (Protected) Submit an answer or solution for a specific question.