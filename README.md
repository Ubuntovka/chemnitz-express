# Chemnitz Express

## Getting Started

Follow the steps below to set up and run the project locally:

### 1. Install Node.js

Download and install Node.js from the [official website](https://nodejs.org/).

Verify installation:

```bash
node -v
npm -v
````

### 2. Install Dependencies

Install required packages using npm:

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory and define your environment variables. Example:

```env
PORT=3000
NODE_ENV=<node_env>
MONGODB_URI=<mongodb_url>
JWT_KEY=your_jwt_secret
```

> Update the variables according to your environment and use case.

### 4. Run the Development Server

Start the server in development mode using:

```bash
npm run dev
```

This uses **ts-node** and **nodemon** for automatic reload on code changes.


## Available Commands

* `npm run dev` - Run the development server with hot reload
* `npm run build` - Compile TypeScript into JavaScript
* `npm start` - Run the compiled server
