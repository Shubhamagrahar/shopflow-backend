# ShopFlow Backend API

E-commerce REST API built with Node.js, Express.js, MySQL, and Prisma ORM.

## Tech Stack

- Node.js, Express.js
- MySQL with Prisma ORM
- JWT Authentication (Access + Refresh Token)
- MVC Architecture

## Features

- User authentication — register, login, refresh token flow
- Role-based access control — Admin, Seller, Customer
- Category management (Admin only)
- Product management (Admin only)
- Relational schema — Users, Products, Orders, Payments

## In Development

- Order management
- Razorpay payment integration
- Cloudinary file uploads
- Email notifications

## Setup

```bash
git clone https://github.com/Shubhamagrahar/shopflow-backend.git
cd shopflow-backend
npm install
npm run dev
```

Add a .env file with DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET before running.

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/admin/categories | Admin |
| GET | /api/admin/categories | Admin |
| PUT | /api/admin/categories/:id | Admin |
| DELETE | /api/admin/categories/:id | Admin |
| POST | /api/admin/product | Admin |
| GET | /api/admin/product | Admin |
| GET | /api/admin/product/:id | Admin |
| PUT | /api/admin/product/:id | Admin |
| DELETE | /api/admin/product/:id | Admin |
