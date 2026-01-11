# Expense Tracker

A full-stack web application for tracking personal expenses. This application allows users to manage their daily spending, categorize expenses, and visualize their financial habits through an interactive dashboard.

**Live Demo:** [https://expense-tracker-livid-iota.vercel.app](https://expense-tracker-livid-iota.vercel.app)

## Features

- **User Authentication:** Secure login and registration system using JWT.
- **Dashboard:** Overview of total expenses, monthly spending, and top spending categories.
- **Expense Management:** Add new expenses with date, amount, category, and notes.
- **Visualization:** Interactive charts to display expense distribution by category.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express, PostgreSQL (via Supabase)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt

## Project Structure

- `client/`: React frontend application
- `server/`: Node.js/Express backend API

## Getting Started (Local Development)

### Prerequisites

- Node.js installed
- PostgreSQL database (or Supabase connection string)

### Installation

1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env file with DATABASE_URL, JWT_SECRET, CLIENT_URL (e.g. http://localhost:5173 for local dev)
   # Optional: PORT (defaults to 5001)
   npm start
   ```
3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
