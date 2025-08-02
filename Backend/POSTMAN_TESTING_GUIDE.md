# Postman Testing Guide for Finance Manager Backend

## Prerequisites

1. **Install Postman** (if not already installed)
2. **Create a `.env` file** in the Backend directory with the following variables:
   ```env
   PORT=5000
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
  - `base_url`: `http://localhost:5000`
  - `token`: (leave empty, will be filled after login)
  - `user_id`: (leave empty, will be filled after login)
  - `category_id`: (leave empty, will be filled after creating category)
  - `transaction_id`: (leave empty, will be filled after creating transaction)
  - `budget_id`: (leave empty, will be filled after creating budget)
  - `recurring_id`: (leave empty, will be filled after creating recurring transaction)

## API Endpoints to Test

### 1. Health Check
**GET** `{{base_url}}/`

**Expected Response:**
```json
{
  "message": "API is running"
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

**Test Script (to save token and user_id):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
    pm.environment.set("user_id", response.user.id);
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

**Test Script (to save token and user_id):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
    pm.environment.set("user_id", response.user.id);
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

### 5. Google OAuth (Optional)
**GET** `{{base_url}}/api/auth/google`

This will redirect to Google OAuth. For testing, you can use the callback endpoint directly.

### 6. Category Management

#### Create Category
**POST** `{{base_url}}/api/categories`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Food & Dining",
  "color": "#FF5733",
  "icon": "🍕"
}
```

**Expected Response (201):**
```json
{
  "message": "Category created successfully",
  "category": {
    "id": "uuid-here",
    "name": "Food & Dining",
    "color": "#FF5733",
    "icon": "🍕",
    "user_id": "uuid-here",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Test Script (to save category_id):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("category_id", response.category.id);
}
```

#### Get Categories
**GET** `{{base_url}}/api/categories`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "categories": [
    {
      "id": "uuid-here",
      "name": "Food & Dining",
      "color": "#FF5733",
      "icon": "🍕",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update Category
**PUT** `{{base_url}}/api/categories/{{category_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Food & Groceries",
  "color": "#FF8C00",
  "icon": "🛒"
}
```

#### Delete Category
**DELETE** `{{base_url}}/api/categories/{{category_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

### 7. Transaction Management

#### Create Transaction
**POST** `{{base_url}}/api/transactions`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
description: "Grocery shopping at Walmart"
amount: 75.50
type: "expense"
category_id: {{category_id}}
date: "2024-01-15"
receipt: [file] (optional)
```

**Expected Response (201):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "uuid-here",
    "description": "Grocery shopping at Walmart",
    "amount": 75.50,
    "type": "expense",
    "category_id": "uuid-here",
    "category_name": "Food & Groceries",
    "date": "2024-01-15",
    "receipt_url": "uploads/receipt.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Test Script (to save transaction_id):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("transaction_id", response.transaction.id);
}
```

#### Get Transactions
**GET** `{{base_url}}/api/transactions`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "transactions": [
    {
      "id": "uuid-here",
      "description": "Grocery shopping at Walmart",
      "amount": 75.50,
      "type": "expense",
      "category_id": "uuid-here",
      "category_name": "Food & Groceries",
      "date": "2024-01-15",
      "receipt_url": "uploads/receipt.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update Transaction
**PUT** `{{base_url}}/api/transactions/{{transaction_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
description: "Updated grocery shopping"
amount: 80.00
type: "expense"
category_id: {{category_id}}
date: "2024-01-15"
receipt: [file] (optional)
```

#### Delete Transaction
**DELETE** `{{base_url}}/api/transactions/{{transaction_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

### 8. Budget Management

#### Create Budget
**POST** `{{base_url}}/api/budgets`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "category_id": "{{category_id}}",
  "amount": 500.00,
  "period": "monthly"
}
```

**Expected Response (201):**
```json
{
  "message": "Budget created successfully",
  "budget": {
    "id": "uuid-here",
    "category_id": "uuid-here",
    "category_name": "Food & Groceries",
    "amount": 500.00,
    "period": "monthly",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Test Script (to save budget_id):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("budget_id", response.budget.id);
}
```

#### Get Budgets
**GET** `{{base_url}}/api/budgets`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### Update Budget
**PUT** `{{base_url}}/api/budgets/{{budget_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "amount": 600.00,
  "period": "monthly"
}
```

#### Delete Budget
**DELETE** `{{base_url}}/api/budgets/{{budget_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

### 9. Recurring Transactions

#### Create Recurring Transaction
**POST** `{{base_url}}/api/recurring-transactions`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "description": "Monthly rent payment",
  "amount": 1200.00,
  "type": "expense",
  "category_id": "{{category_id}}",
  "frequency": "monthly",
  "next_date": "2024-02-01"
}
```

**Expected Response (201):**
```json
{
  "message": "Recurring transaction created successfully",
  "recurring_transaction": {
    "id": "uuid-here",
    "description": "Monthly rent payment",
    "amount": 1200.00,
    "type": "expense",
    "category_id": "uuid-here",
    "frequency": "monthly",
    "next_date": "2024-02-01",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Test Script (to save recurring_id):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("recurring_id", response.recurring_transaction.id);
}
```

#### Get Recurring Transactions
**GET** `{{base_url}}/api/recurring-transactions`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### Update Recurring Transaction
**PUT** `{{base_url}}/api/recurring-transactions/{{recurring_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "description": "Updated monthly rent",
  "amount": 1250.00,
  "frequency": "monthly",
  "next_date": "2024-02-01"
}
```

#### Delete Recurring Transaction
**DELETE** `{{base_url}}/api/recurring-transactions/{{recurring_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

### 10. Reports & Analytics

#### Get Financial Summary
**GET** `{{base_url}}/api/reports/summary`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "summary": {
    "total_income": 5000.00,
    "total_expenses": 3000.00,
    "net_balance": 2000.00,
    "monthly_average": 2500.00
  }
}
```

#### Get Category Breakdown
**GET** `{{base_url}}/api/reports/category-breakdown`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "breakdown": [
    {
      "category_name": "Food & Groceries",
      "total_amount": 1500.00,
      "percentage": 50.0,
      "transaction_count": 20
    }
  ]
}
```

#### Get Budget vs Spending
**GET** `{{base_url}}/api/reports/budget-vs-spending`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "budget_vs_spending": [
    {
      "category_name": "Food & Groceries",
      "budget_amount": 500.00,
      "spent_amount": 450.00,
      "remaining": 50.00,
      "percentage_used": 90.0
    }
  ]
}
```

## Error Testing Scenarios

### 1. Authentication Errors

**Test Case 1: No Token**
- Send any protected request without Authorization header
**Expected Response (401):**
```json
{
  "error": "Access denied",
  "message": "No token provided"
}
```

**Test Case 2: Invalid Token**
- Send request with `Authorization: Bearer invalid-token`
**Expected Response (403):**
```json
{
  "error": "Invalid token",
  "message": "Invalid or corrupted token"
}
```

### 2. Validation Errors

**Test Case 1: Invalid Transaction Data**
```json
{
  "description": "",
  "amount": -50,
  "type": "invalid_type",
  "category_id": "invalid-uuid"
}
```
**Expected Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "description",
      "message": "Description is required"
    },
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

**Test Case 2: Invalid Category Data**
```json
{
  "name": "",
  "color": "invalid-color"
}
```
**Expected Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Category name is required"
    }
  ]
}
```

### 3. Resource Not Found

**Test Case: Non-existent Resource**
- Try to update/delete a transaction/category/budget with non-existent ID
**Expected Response (404):**
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

## Step-by-Step Testing Process

### Phase 1: Basic Setup
1. **Start the server**: `npm start`
2. **Test health endpoint**: GET `{{base_url}}/`
3. **Verify server is running**

### Phase 2: Authentication Testing
1. **Test user registration** with valid data
2. **Test user login** with registered credentials
3. **Test profile endpoint** with valid token
4. **Test authentication errors** (no token, invalid token)

### Phase 3: Category Management Testing
1. **Create category** with valid data
2. **Get all categories** and verify response
3. **Update category** with new data
4. **Delete category** and verify removal

### Phase 4: Transaction Management Testing
1. **Create transaction** with valid data
2. **Get all transactions** and verify response
3. **Update transaction** with new data
4. **Delete transaction** and verify removal
5. **Test file upload** with receipt image

### Phase 5: Budget Management Testing
1. **Create budget** for existing category
2. **Get all budgets** and verify response
3. **Update budget** with new amount
4. **Delete budget** and verify removal

### Phase 6: Recurring Transactions Testing
1. **Create recurring transaction** with valid data
2. **Get all recurring transactions** and verify response
3. **Update recurring transaction** with new data
4. **Delete recurring transaction** and verify removal

### Phase 7: Reports Testing
1. **Get financial summary** and verify calculations
2. **Get category breakdown** and verify data
3. **Get budget vs spending** and verify comparisons

### Phase 8: Error Testing
1. **Test validation errors** with invalid data
2. **Test authentication errors** with invalid tokens
3. **Test not found errors** with invalid IDs

## Troubleshooting

### Common Issues:

1. **Server won't start**:
   - Check if `.env` file exists with all required variables
   - Ensure PostgreSQL is running
   - Check if port 5000 is available

2. **Database connection errors**:
   - Verify database credentials in `.env`
   - Ensure PostgreSQL is running
   - Check if database exists

3. **Authentication errors**:
   - Ensure token is saved in environment variable
   - Check Authorization header format: `Bearer <token>`
   - Verify token hasn't expired

4. **File upload errors**:
   - Check if uploads directory exists
   - Verify file size limits
   - Check file type restrictions

5. **Validation errors**:
   - Ensure request body is valid JSON
   - Check Content-Type header is set correctly
   - Verify all required fields are present

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
          "raw": "{{base_url}}/",
          "host": ["{{base_url}}"],
          "path": [""]
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
              "    pm.environment.set(\"user_id\", response.user.id);",
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
              "    pm.environment.set(\"user_id\", response.user.id);",
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
    },
    {
      "name": "Create Category",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Food & Dining\",\n  \"color\": \"#FF5733\",\n  \"icon\": \"🍕\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/categories",
          "host": ["{{base_url}}"],
          "path": ["api", "categories"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    pm.environment.set(\"category_id\", response.category.id);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Get Categories",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/categories",
          "host": ["{{base_url}}"],
          "path": ["api", "categories"]
        }
      }
    },
    {
      "name": "Create Transaction",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "description",
              "value": "Grocery shopping at Walmart",
              "type": "text"
            },
            {
              "key": "amount",
              "value": "75.50",
              "type": "text"
            },
            {
              "key": "type",
              "value": "expense",
              "type": "text"
            },
            {
              "key": "category_id",
              "value": "{{category_id}}",
              "type": "text"
            },
            {
              "key": "date",
              "value": "2024-01-15",
              "type": "text"
            }
          ]
        },
        "url": {
          "raw": "{{base_url}}/api/transactions",
          "host": ["{{base_url}}"],
          "path": ["api", "transactions"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    pm.environment.set(\"transaction_id\", response.transaction.id);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Get Transactions",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/transactions",
          "host": ["{{base_url}}"],
          "path": ["api", "transactions"]
        }
      }
    },
    {
      "name": "Create Budget",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"category_id\": \"{{category_id}}\",\n  \"amount\": 500.00,\n  \"period\": \"monthly\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/budgets",
          "host": ["{{base_url}}"],
          "path": ["api", "budgets"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    pm.environment.set(\"budget_id\", response.budget.id);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Get Budgets",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/budgets",
          "host": ["{{base_url}}"],
          "path": ["api", "budgets"]
        }
      }
    },
    {
      "name": "Get Financial Summary",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/reports/summary",
          "host": ["{{base_url}}"],
          "path": ["api", "reports", "summary"]
        }
      }
    },
    {
      "name": "Get Category Breakdown",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/reports/category-breakdown",
          "host": ["{{base_url}}"],
          "path": ["api", "reports", "category-breakdown"]
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
- [ ] Category creation returns 201
- [ ] Category retrieval returns 200
- [ ] Transaction creation returns 201
- [ ] Transaction retrieval returns 200
- [ ] Budget creation returns 201
- [ ] Budget retrieval returns 200
- [ ] Recurring transaction creation returns 201
- [ ] Recurring transaction retrieval returns 200
- [ ] Reports endpoints return 200 with valid data
- [ ] File upload works for receipts
- [ ] All CRUD operations work correctly
- [ ] Error handling works for invalid data
- [ ] Authentication protects all protected routes 