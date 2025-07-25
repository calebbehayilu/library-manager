# Library Manager API

A complete library management system built with NestJS, TypeORM, and SQLite.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database:
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   npm run start:dev
   ```

Server runs at: `http://localhost:3000/api`

## 🔐 Default Accounts

**Admin:**
- Username: `admin`
- Password: `admin123`

**Librarian:**
- Username: `librarian` 
- Password: `librarian123`

## ✨ Features

- 🔐 JWT Authentication (Admin/Librarian roles)
- 📚 Book Management (CRUD operations)
- 👥 Member Management
- 🏷️ Genre Management  
- 📋 Borrowing System (loans, returns, overdue tracking)
- 🗄️ SQLite Database with sample data
- 🔄 RESTful API endpoints

## 🛠️ Tech Stack

- **Backend:** NestJS, TypeORM, SQLite, JWT, bcrypt
- **Frontend:** React, TypeScript, Vite, Tailwind CSS

## 📡 Key API Endpoints

- `POST /api/auth/login` - Authentication
- `GET /api/books` - List books
- `POST /api/borrowings/borrow` - Borrow book
- `GET /api/members` - List members
- `GET /api/borrowings/overdue` - Overdue books

Ready to use with seeded sample data!
