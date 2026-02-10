# Chemnitz Express Documentation

Welcome to the Chemnitz Express API documentation. This folder contains detailed information about the project's architecture, setup, and usage.

## 📋 Table of Contents

### [Database Setup](./database.md)
Learn how to set up MongoDB, initialize the database with Chemnitz location data, and configure environment variables.

### [Architecture](./architecture.md)
Understand the project structure, technology stack, and design patterns used throughout the application.

### [Authentication](./auth.md)
Detailed guide on JWT-based authentication, authorization middleware, and security best practices.

### [API Reference](./api.md)
Complete API endpoint documentation with request/response examples for locations, users, and reviews.

---

## Quick Links

- [Main README](../README.md)
- [Getting Started Guide](../README.md#getting-started)
- [Environment Configuration](./database.md#environment-variables)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Development**: ts-node, nodemon for hot-reload
- **Containerization**: Docker & Docker Compose