# RoyalBikes - Full-Stack Bike & Inventory Management System

RoyalBikes is a modern, high-performance full-stack web application designed for bike sales, inventory tracking, customer relation management (CRM), and user administration.

---

## 📁 Repository Directory Structure

```text
RoyalBikes/
│
├── frontend/                     # Standard React Frontend Application (react-scripts)
│   ├── public/                   # Public assets & HTML template
│   │   └── index.html
│   ├── src/
│   │   ├── assets/               # Media & global styles
│   │   ├── components/           # Reusable UI components (Navbar, Cards, Modals)
│   │   ├── pages/                # Page views (Dashboard, Products, Customers, Users, Login)
│   │   ├── layouts/              # Page layouts (Main, Dashboard, Auth)
│   │   ├── services/             # API integration service modules
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── context/              # Context Providers (Auth, Theme)
│   │   ├── utils/                # Helper functions & formatting utilities
│   │   ├── constants/            # API endpoints & app constants
│   │   ├── App.js                # Main React App component
│   │   ├── index.js              # Application entrypoint
│   │   └── routes.js             # Router configuration
│   │
│   ├── package.json              # Standard React (react-scripts) dependencies & scripts
│   └── .env                      # Frontend environment variables (REACT_APP_API_BASE_URL)
│
├── backend/                      # Python Flask REST API Backend
│   ├── app/
│   │   ├── __init__.py           # Flask App Factory initialization
│   │   ├── config.py             # Configuration classes (Dev, Prod, Test)
│   │   │
│   │   ├── models/               # SQLAlchemy Database Models
│   │   │   ├── user.py           # User model & authentication roles
│   │   │   ├── product.py        # Bike & product inventory model
│   │   │   └── customer.py       # Customer CRM model
│   │   │
│   │   ├── routes/               # Flask REST API Blueprints
│   │   │   ├── auth_routes.py    # Authentication routes
│   │   │   ├── user_routes.py    # User management routes
│   │   │   ├── product_routes.py # Product catalog routes
│   │   │   └── customer_routes.py# Customer management routes
│   │   │
│   │   ├── services/             # Business Logic & Service Layer
│   │   │   ├── auth_service.py   # Auth service logic
│   │   │   ├── product_service.py# Inventory service logic
│   │   │   └── customer_service.py# CRM service logic
│   │   │
│   │   ├── schemas/              # Data serialization & schemas
│   │   ├── utils/                # API helpers & error handlers
│   │   └── extensions.py         # SQLAlchemy, JWT, Bcrypt, CORS, Migrate instances
│   │
│   ├── migrations/               # Alembic database migration scripts
│   ├── tests/                    # Backend unit & integration tests
│   ├── requirements.txt          # Python dependencies
│   ├── run.py                    # Server startup entrypoint
│   └── .env                      # Backend environment configuration
│
├── README.md                     # Project documentation
└── .gitignore                    # Git exclusions
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18+ installed
- **Python**: v3.9+ installed

---

### 1. Setting up the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask development server:
   ```bash
   python run.py
   ```
   The backend API will run on `http://127.0.0.1:5000/api`.

---

### 2. Setting up the Frontend (Standard React)

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the standard React development server (`react-scripts`):
   ```bash
   npm start
   ```
   The frontend app will open at `http://localhost:3000`.

---

## 🔑 Default API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login & JWT issuance |
| `GET` | `/api/auth/me` | Current user profile |
| `GET` | `/api/products` | List all bikes/products |
| `POST` | `/api/products` | Create product (Admin) |
| `GET` | `/api/customers` | List customers |
| `POST` | `/api/customers` | Add customer record |
| `GET` | `/api/users` | List users (Admin) |

---

## 🎨 Tech Stack & Features
- **Frontend**: Standard React (`react-scripts`), React Router v6, Glassmorphic UI with CSS variables, Lucide React icons.
- **Backend**: Flask REST API, Flask-SQLAlchemy ORM, Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS.
- **Database**: SQLite (default zero-config) / MySQL support.
