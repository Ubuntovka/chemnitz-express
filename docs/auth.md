# Authentication

This document explains the JWT-based authentication and authorization system used in Chemnitz Express.

## Overview

The application uses **JSON Web Tokens (JWT)** for stateless authentication. Users register, receive a token upon login, and include this token in subsequent requests to access protected resources.

## Authentication Flow

### 1. User Registration

**Endpoint**: `POST /api/users/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Process**:
1. Validates input (email format, password length ≥ 8)
2. Hashes password with bcrypt (10 rounds)
3. Creates user document in database
4. Generates JWT token
5. Returns user data and token

**Response**:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "ranking": 0,
  "tokens": [
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
}
```

### 2. User Login

**Endpoint**: `POST /api/users/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Process**:
1. Finds user by email
2. Compares provided password with hashed password using bcrypt
3. Generates new JWT token
4. Adds token to user's token array
5. Returns user data and token

**Response**: Same as registration

### 3. Accessing Protected Routes

**Example**: `GET /api/users/me`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Process**:
1. Auth middleware intercepts request
2. Extracts token from `Authorization` header
3. Verifies token signature using `JWT_KEY`
4. Finds user in database with matching token
5. Attaches user object to `req.user`
6. Proceeds to controller

**Response**:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "ranking": 15,
  "favorite_locations": [],
  "visited_locations": []
}
```

## Authentication Middleware

### Implementation (`src/middlewares/auth.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export interface CustomRequest extends Request {
    user?: IUser;
    token?: string;
}

interface DecodedToken {
    _id: string;
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).send({ error: 'Authentication token missing' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as DecodedToken;
        
        // Find user with this token
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });

        if (!user) {
            return res.status(401).send({ error: 'User not found or token invalid' });
        }

        // Attach user and token to request
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed.' });
    }
};

export default auth;
```

### Usage in Routes

```typescript
import auth from '../middlewares/auth';

// Public route (no auth required)
router.post('/api/users/register', registerHandler);

// Protected route (auth required)
router.get('/api/users/me', auth, getUserHandler);
router.post('/reviews/add', auth, addReviewHandler);
```

## Password Security

### Hashing (`src/models/user.ts`)

```typescript
import bcrypt from 'bcryptjs';

// Before saving user
userSchema.pre('save', async function (next) {
    const user = this;
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    
    next();
});
```

**Features**:
- Passwords hashed before storage
- Uses bcrypt with 10 salt rounds
- Passwords never stored or transmitted in plain text

### Password Verification

```typescript
userSchema.statics.findByCredentials = async function (email: string, password: string) {
    const user = await this.findOne({ email });
    
    if (!user) {
        throw new Error('Invalid login credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        throw new Error('Invalid login credentials');
    }
    
    return user;
};
```

## JWT Token Management

### Token Generation

```typescript
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_KEY as string,
        { expiresIn: '7 days' } // Optional: set expiration
    );
    
    user.tokens = user.tokens.concat({ token });
    await user.save();
    
    return token;
};
```

### Token Storage

Tokens are stored in the user document:
```typescript
{
  tokens: [
    { token: "jwt_token_1" },
    { token: "jwt_token_2" },
    // Multiple tokens support multiple device sessions
  ]
}
```

### Token Expiration

**Current Implementation**: Tokens don't expire by default.

**Recommended Enhancement**:
```typescript
// Add expiration
const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_KEY as string,
    { expiresIn: '7d' }
);
```

**Implement Token Refresh**:
- Short-lived access tokens (15 min)
- Long-lived refresh tokens (7 days)
- Endpoint to refresh access token

## Environment Configuration

### Required Variable

```env
JWT_KEY=your_super_secret_jwt_key_here
```

**Important**:
- Use a strong, random secret (minimum 32 characters)
- Generate with: `openssl rand -base64 32`
- Keep secret; never commit to version control
- Different keys for development/production

## Protected Endpoints

The following endpoints require authentication:

### User Routes
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/update` - Update user information
- `DELETE /api/users/delete` - Delete user account
- `PATCH /api/users/ranking` - Update user ranking

### Review Routes
- `POST /reviews/add` - Create a review
- `GET /reviews/user` - Get reviews by current user

## Error Responses

### Missing Token
```json
{
  "error": "Authentication token missing"
}
```
**Status**: 401 Unauthorized

### Invalid Token
```json
{
  "error": "Authentication failed."
}
```
**Status**: 401 Unauthorized

### Expired Token (if expiration enabled)
```json
{
  "error": "Token expired"
}
```
**Status**: 401 Unauthorized