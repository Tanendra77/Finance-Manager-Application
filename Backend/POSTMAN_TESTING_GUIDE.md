# Postman Testing Guide for Finance Manager Backend

## Prerequisites

1. **Install Postman** (if not already installed)
2. **Create a `.env` file** in the Backend directory with the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=finance_manager
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

## Postman Collection Setup

### 1. Create a New Collection
- Open Postman
- Click "New" → "Collection"
- Name it "Finance Manager API"

### 2. Set up Environment Variables
- Click "Environments" → "New"
- Name it "Finance Manager Local"
- Add these variables:
  - `base_url`: `http://localhost:3000`
  - `token`: (leave empty, will be filled after login)

## API Endpoints to Test

### 1. Health Check
**GET** `{{base_url}}/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 2. User Registration
**POST** `{{base_url}}/api/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

**Test Script (to save token):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

### 3. User Login
**POST** `{{base_url}}/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-here"
}
```

**Test Script (to save token):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

### 4. Get User Profile (Protected Route)
**GET** `{{base_url}}/api/users/profile`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Testing Scenarios

### 1. Registration Validation Errors

**Test Case 1: Invalid Email**
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "SecurePass123"
}
```
**Expected Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**Test Case 2: Weak Password**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "weak"
}
```
**Expected Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

**Test Case 3: Duplicate Email**
- First register a user with email "john@example.com"
- Then try to register another user with the same email
**Expected Response (400):**
```json
{
  "error": "User already exists",
  "message": "An account with this email already exists"
}
```

### 2. Login Error Scenarios

**Test Case 1: Invalid Credentials**
```json
{
  "email": "john@example.com",
  "password": "WrongPassword123"
}
```
**Expected Response (401):**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

**Test Case 2: Non-existent User**
```json
{
  "email": "nonexistent@example.com",
  "password": "SecurePass123"
}
```
**Expected Response (401):**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### 3. Protected Route Error Scenarios

**Test Case 1: No Token**
- Send GET request to `/api/users/profile` without Authorization header
**Expected Response (401):**
```json
{
  "error": "Access denied",
  "message": "No token provided"
}
```

**Test Case 2: Invalid Token**
- Send GET request with `Authorization: Bearer invalid-token`
**Expected Response (403):**
```json
{
  "error": "Invalid token",
  "message": "Invalid or corrupted token"
}
```

## Step-by-Step Testing Process

### Phase 1: Basic Setup
1. **Start the server**: `npm start`
2. **Test health endpoint**: GET `{{base_url}}/health`
3. **Verify server is running**

### Phase 2: Registration Testing
1. **Test valid registration** with proper data
2. **Test validation errors** with invalid data
3. **Test duplicate email** scenario

### Phase 3: Login Testing
1. **Test valid login** with registered user
2. **Test invalid credentials**
3. **Test non-existent user**

### Phase 4: Protected Routes Testing
1. **Test profile endpoint** with valid token
2. **Test without token**
3. **Test with invalid token**

## Troubleshooting

### Common Issues:

1. **Server won't start**:
   - Check if `.env` file exists with all required variables
   - Ensure PostgreSQL is running
   - Check if port 3000 is available

2. **Database connection errors**:
   - Verify database credentials in `.env`
   - Ensure PostgreSQL is running
   - Check if database exists

3. **Validation errors**:
   - Ensure request body is valid JSON
   - Check Content-Type header is set to `application/json`
   - Verify all required fields are present

4. **Authentication errors**:
   - Ensure token is saved in environment variable
   - Check Authorization header format: `Bearer <token>`
   - Verify token hasn't expired

## Postman Collection Export

You can import this collection by copying the following JSON:

```json
{
  "info": {
    "name": "Finance Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/users/register",
          "host": ["{{base_url}}"],
          "path": ["api", "users", "register"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    pm.environment.set(\"token\", response.token);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/users/login",
          "host": ["{{base_url}}"],
          "path": ["api", "users", "login"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 200) {",
              "    const response = pm.response.json();",
              "    pm.environment.set(\"token\", response.token);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Get User Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/users/profile",
          "host": ["{{base_url}}"],
          "path": ["api", "users", "profile"]
        }
      }
    }
  ]
}
```

## Quick Test Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Registration with valid data returns 201
- [ ] Registration with invalid data returns 400
- [ ] Login with valid credentials returns 200
- [ ] Login with invalid credentials returns 401
- [ ] Profile endpoint with valid token returns 200
- [ ] Profile endpoint without token returns 401
- [ ] Profile endpoint with invalid token returns 403 