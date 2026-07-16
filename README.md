# Personal Blog

A full-stack legal blog and Q&A platform built with React, Vite, Express, MongoDB, and Mongoose.

## Overview

This project includes:

- A public blog homepage with featured and recent articles
- An articles listing page with search and category filtering
- Full post detail pages with threaded comments and reactions
- A public question submission flow
- An admin dashboard for managing posts, questions, users, and password changes
- Authentication with role-based access for guests, authors, and admins

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT
- Media uploads: Multer
- Email notifications: Nodemailer

## Project Structure

- `frontend/` - React app
- `backend/` - Express API and MongoDB models

## Features

### Public Site

- Browse legal articles
- Search articles from the header
- Filter articles by category
- Read full posts
- Ask legal questions
- Leave comments and reactions on posts

### Admin Panel

- View dashboard stats
- Create, edit, and manage posts
- Review and answer questions
- Manage users and roles
- Change password

## Getting Started

### Prerequisites

- Node.js
- npm or pnpm
- MongoDB connection string

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Then start the server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:

```env
VITE_API_URL=http://localhost:5000/api
```

Then start the frontend:

```bash
npm run dev
```

## API Notes

The frontend expects the backend to expose routes under `/api`, including:

- `/api/auth`
- `/api/posts`
- `/api/comments`
- `/api/questions`
- `/api/users`
- `/api/upload`

## Default Roles

- `guest` - Public reader and commenter
- `author` - Can create and manage content
- `admin` - Full access to the dashboard and management tools

## Deployment

For deployment:

- Deploy the backend as a Node.js service
- Set `MONGODB_URI` and `JWT_SECRET` in the host environment
- Deploy the frontend separately
- Point `VITE_API_URL` to the deployed backend URL

## Notes

- The backend uses case-sensitive imports on Linux, so model file names and import paths must match exactly.
- Comments support nested replies and reactions.
- Search currently filters article lists through the `/posts` endpoint.

## License

No license has been specified for this project.
