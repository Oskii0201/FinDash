# FinDash - Currency Rates Dashboard

## 📄 Application Features
The **FinDash** application allows you to:

- Fetch currency exchange rates from an external API (NBP).
- Display data in a table with the following capabilities:
    - Grouping by year, quarter, month, or day.
    - Filtering by date range.
    - Pagination and data sorting.
- Update currency data with a single click.
- Run unit, integration, and E2E tests.

---

## Technologies 🛠

| Area            | Tools                                                                                                                                                                                                                                                                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend**     | ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)                    |
| **Backend**      | ![Next.js API Routes](https://img.shields.io/badge/-Next.js%20API-000000?logo=nextdotjs&logoColor=white) ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white)                                                                                                                                                                                                  |
| **Database**     | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)                                                                                                                                                                                                                                                                                               |
| **Testing** | ![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=white) ![React Testing Library](https://img.shields.io/badge/-Testing%20Library-E33332?logo=testinglibrary&logoColor=white) ![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?logo=playwright&logoColor=white) ![Supertest](https://img.shields.io/badge/-Supertest-000000?logo=supertest&logoColor=white) |
| **Tools** | ![React Toastify](https://img.shields.io/badge/-React%20Toastify-FFDD4B?logo=react&logoColor=black) ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white) ![Prettier](https://img.shields.io/badge/-Prettier-F7B93E?logo=prettier&logoColor=black)                                                                                                                                 |

---

## 📋 Installation and Testing Guide

**Installation**

1.**Clone the repository:**
   ```bash
    git clone https://github.com/Oskii0201/FinDash.git
    cd FinDash
   ```
2.**Add environment files:**
- Create a .env file in the root directory and add the following variables:
   ```bash
    POSTGRES_USER=username
    POSTGRES_PASSWORD=db-password
    POSTGRES_DB=dbname
    
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    NEXTAUTH_SECRET=your-secret-key
    NEXTAUTH_URL=host
   ```
3.**Build and run Docker containers:**
   ```bash
    docker-compose up --build
   ```
4.**Access the application:**
- Open a browser and navigate to http://localhost:3000.
- Test user:
  ```bash
  email: test@example.com
  password: Test123!
  ```

**Running Tests**

1.**Unit and integration tests (frontend and backend):**
   ```bash
    npm run test
   ```
2.**Frontend unit tests:**
   ```bash
    npm run test:frontend
   ```
3.**Backend unit tests:**
   ```bash
    npm run test:backend
   ```
3.**E2E Tests:**
- Ensure the application is running:
   ```bash
    docker-compose up
   ```
- Then run the tests:
   ```bash
    npm run test:e2e
   ```
  