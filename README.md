# Full-stack Backend Integration
**Next.js Frontend + Node.js (Express) API + MongoDB**

This repository contains a backend-focused fullstack demo
designed to showcase how a Node.js API is structured, exposed, and consumed
by a modern frontend application.

The project emphasizes backend architecture, API design, and separation
of concerns, with the frontend intentionally kept minimal.


## Tech Stack

### Backend (Primary Focus)
- Node.js
- Express
- RESTful API design
- Layered structure (routes, controllers, models)
- Environment-based configuration
- MongoDB (Docker Compose)

### Frontend (Supporting Role)
- Next.js
- React with TypeScript
- Consumes backend APIs via HTTP
- Minimal UI to demonstrate integration

---

## Project Structure

```
my-fullstack-app
├── frontend
│   ├── next.config.js
│   ├── package.json
│   ├── public
│   └── src
│       ├── pages
│       │   └── index.tsx
│       ├── components
│       └── styles
│           └── globals.css
├── backend
│   ├── package.json
│   └── config
│       └── db.js
│   └── src
│       ├── server.js
│       ├── controllers
│       ├── models
│       └── routes
├── docker-compose.yml
└── README.md
```

---

## Architecture Overview

- The backend exposes REST APIs and contains all business logic.
- The frontend acts strictly as an API consumer.
- Communication occurs over HTTP using JSON.
- Responsibilities are intentionally separated to keep the system
  maintainable and scalable.

This mirrors real-world systems where backend and frontend evolve independently.

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Docker (recommended for MongoDB via Compose)

---

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd my-fullstack-app
```

Install dependencies:

```bash
# root scripts (dev orchestration)
npm install

# backend deps
cd backend && npm install

# frontend deps
cd ../frontend && npm install
```

---

### Running the Application

The easiest way to run everything (MongoDB + backend + frontend) is:

```bash
npm run dev
```

Or run each service individually:

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

#### MongoDB (Docker)
```bash
docker-compose up -d mongodb
```

---

## Access

- Frontend: http://localhost:3000
- Backend API (direct): http://localhost:5001/api
- Backend API (via frontend rewrite): http://localhost:3000/api

---

## Purpose of This Project

This project exists to demonstrate:

- Backend API design with Node.js and Express
- Clean separation between client and server
- How frontends consume real backend APIs
- Patterns commonly used in production systems

It is **not** intended to be a feature-complete product.

---

## License

MIT License
