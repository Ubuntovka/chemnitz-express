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

or
```bash
npm run build
npm start
```
It compiles TypeScript into JavaScript and runs the compiled server

---

## Set up a database

### 1. Install MongoDB 
Set up MongoDB locally.

### 2. Add collections
- Reviews
- Locations
- Users

### 3. Download Chemnitz.geojson file

Put the file in the `src/scripts` directory.

### 4. Populate database
```bash
npm run init:db 
```
It will print the amount of inserted locations

### 5. Fill in the missing data
To fill the missing address data for some locations, complete all the instructions given above and 
then run the patch request:
```bash
localhost:3000/populate/address
```
It might take some time. After it is done, it will return a string with the amount of updated locations.

