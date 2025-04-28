### CEMA Health Information System

A health information system for managing clients and health programs and services.

## Table of Contents
1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
   1. [Prerequisites](#prerequisites)  
   2. [Installation](#installation)  
   3. [Environment Variables](#environment-variables)  
   4. [Running the App](#running-the-app)  
4. [Testing](#testing)  
5. [Deployment](#deployment)  
6. [Contributing](#contributing)  
7. [License](#license)  

---

## Features
- **Create Health Programs**: Add programs like TB, Malaria, HIV.  
- **Client Registration**: Register new clients with personal details.  
- **Program Enrollment**: Enroll clients in one or more health programs.  
- **Client Search**: Search registered clients by name or ID.  
- **Profile View**: View client profiles including enrolled programs.  
- **RESTful API**: Expose client profiles via API for external integration.  


## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js, TypeScript, Sequelize ORM 
- **Testing** Jest
- **Database:** PostgreSQL  
- **DevOps:** Docker (local), GitHub Actions (CI/CD)  
- **Authentication:** JWT  


## Getting Started


### Prerequisites
- **Node.js** v16+  
- **npm** or **yarn**  
- **Docker** (for local containers)  
- **Git**

### Installation
1. **Clone the repository**
   ```
   git clone https://github.com/Beri-P/CEMA-health-information-system.git
   cd CEMA-health-information-system
   ```


Setup Backend

```
cd backend
npm install
cp .env.example .env
# Edit backend/.env with your database credentials:
# DATABASE_URL=postgres://user:password@localhost:5432/cema_db
# JWT_SECRET=your_jwt_secret
```


Setup Frontend

```
cd ../frontend
npm install
```


Environment Variables
In backend/.env:

```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/cema_db
JWT_SECRET=your_jwt_secret
```

Running the App Locally
Start Backend (port 5000)

```
cd backend
npm run dev
```

Start Frontend (port 5173)

```
cd ../frontend
npm run dev
```

Then open http://localhost:5173 in your browser.


Using Docker

1. Ensure you have Docker & Docker Compose installed.

2. Create a .env file at the project root (next to docker-compose.yml) with:

```
# backend service
DATABASE_URL=postgres://user:password@db:5432/cema_db
JWT_SECRET=your_jwt_secret

# frontend service
VITE_API_URL=http://localhost:3000
```
3. Build & start all services:

```
docker-compose up --build
```
4. Access:

Frontend → http://localhost

Backend API → http://localhost:3000

PostgreSQL DB → localhost:5432 (user/password as set in .env)

5. Stop services when done:

```
docker-compose down
```

Testing

```
# Backend tests
cd backend
npm test
```


Deployment

- Backend: Containerize with Docker and deploy to DigitalOcean/App Platform.

- Frontend: Build via npm run build and host on Netlify/Vercel.

- Ensure environment variables are set in production.


Contributing

1. Fork the repository

2. Create a feature branch (git checkout -b feature/YourFeature)

3. Commit your changes (git commit -m "Add some feature")

4. Push to the branch (git push origin feature/YourFeature)

5. Open a Pull Request



License

This project is licensed under the MIT License.
