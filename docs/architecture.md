# Architecture

This document describes the architecture, design patterns, and structure of the Chemnitz Express application.

## Project Structure

```
chemnitz-express/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── config.ts          # Environment configuration
│   ├── controllers/
│   │   ├── locationController.ts
│   │   ├── reviewController.ts
│   │   └── userController.ts
│   ├── middlewares/
│   │   ├── auth.ts            # JWT authentication
│   │   └── errorHandler.ts   # Global error handler
│   ├── models/
│   │   ├── location.ts        # Location schema
│   │   ├── review.ts          # Review schema
│   │   └── user.ts            # User schema
│   ├── routes/
│   │   ├── locationRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── userRoutes.ts
│   └── scripts/
│       ├── Chemnitz.geojson   # Location data
│       └── init-db.ts         # Database initialization
├── dist/                      # Compiled JavaScript (generated)
├── docker-compose.yml         # Docker services configuration
├── Dockerfile                 # Container definition
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Main documentation
```

## Technology Stack

### Core
- **Node.js**: JavaScript runtime
- **TypeScript**: Static typing for JavaScript
- **Express.js 5.x**: Web application framework

### Database
- **MongoDB**: NoSQL document database
- **Mongoose**: ODM (Object Data Modeling) library

### Authentication & Security
- **jsonwebtoken**: JWT creation and verification
- **bcrypt/bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Development
- **ts-node**: TypeScript execution for development
- **nodemon**: Auto-restart on file changes
- **eslint**: Code linting
- **prettier**: Code formatting

### Additional
- **axios**: HTTP client (for external API calls)
- **dotenv**: Environment variable management
- **express-async-handler**: Async error handling

## Design Patterns

### MVC Architecture

The application follows the Model-View-Controller pattern (without the View layer, as this is an API):

**Models** (`src/models/`):
- Define data schemas using Mongoose
- Implement business logic methods (e.g., password hashing, token generation)
- Handle data validation

**Controllers** (`src/controllers/`):
- Process incoming requests
- Interact with models to retrieve/manipulate data
- Return responses to clients

**Routes** (`src/routes/`):
- Define API endpoints
- Map HTTP methods to controller functions
- Apply middleware (authentication, validation)

### Middleware Pipeline

Request flow through the application:

```
Request
  ↓
CORS Middleware
  ↓
Body Parser (express.json)
  ↓
Route Matching
  ↓
Auth Middleware (if required)
  ↓
Controller Logic
  ↓
Response / Error Handler
  ↓
Client
```

### Separation of Concerns

**Configuration** (`src/config/config.ts`):
- Centralizes environment variable access
- Provides type-safe configuration objects
- Validates required environment variables

**Error Handling** (`src/middlewares/errorHandler.ts`):
- Global error handler catches all errors
- Provides consistent error response format
- Prevents server crashes

**Authentication** (`src/middlewares/auth.ts`):
- Verifies JWT tokens
- Attaches user object to request
- Protects routes from unauthorized access

## Request Flow

### Example: Creating a Review (Protected Route)

1. **Client Request**:
   ```http
   POST /reviews/add
   Authorization: Bearer <JWT_TOKEN>
   Content-Type: application/json
   
   {
     "location": "location_id",
     "rating": 5,
     "comment": "Great place!"
   }
   ```

2. **CORS & Body Parsing**: Request processed by Express middleware

3. **Route Matching**: `/reviews/add` matches in `reviewRoutes.ts`

4. **Auth Middleware**: 
   - Extracts JWT from Authorization header
   - Verifies token with `JWT_KEY`
   - Queries database for user
   - Attaches user to `req.user`

5. **Controller**:
   - `reviewController.addReview` executes
   - Creates new review document
   - Saves to database
   - Returns success response

6. **Error Handling** (if error occurs):
   - Error caught by global error handler
   - Formatted error response sent to client

## Application Initialization

### Entry Point (`src/server.ts`)

```typescript
import app from './app.js';
import config from './config/config.js';

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
```

### App Configuration (`src/app.ts`)

```typescript
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
await connect(config.mongodbUrl);

// Routes
app.use('/', locationRoutes);
app.use('/api/users/', userRoutes);
app.use('/', reviewRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

## Deployment

### Development
```bash
npm run dev
```
- Uses `ts-node` to execute TypeScript directly
- `nodemon` watches for file changes and restarts

### Production
```bash
npm run build
npm start
```
- TypeScript compiled to JavaScript in `dist/`
- Runs compiled code with Node.js

### Docker

**Dockerfile** provides containerized deployment:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**docker-compose.yml** orchestrates services (app + MongoDB):
```bash
docker-compose up
```