# Finance Manager Backend

A comprehensive Node.js/Express backend for the Finance Manager application with full CRUD operations, authentication, file uploads, and automated job processing.

## 🚀 Features

- **User Authentication**: JWT-based authentication with email/password and Google OAuth
- **Transaction Management**: Full CRUD with receipt file upload
- **Category Management**: Custom categories for organizing transactions
- **Budget Management**: Set and track budgets by category
- **Recurring Transactions**: Automate regular payments and income
- **Reporting & Analytics**: Financial summaries and breakdowns
- **File Upload**: Secure receipt image upload and storage
- **Automated Jobs**: Background processing for recurring transactions
- **Security**: JWT tokens, password hashing, input validation

## 🛠️ Technology Stack

- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Passport.js** for Google OAuth
- **Multer** for file uploads
- **Node-cron** for scheduled jobs
- **Helmet** for security headers
- **Morgan** for request logging
- **Bcrypt** for password hashing
- **Express-validator** for input validation

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the Backend directory using the template:

```bash
cp env-template.txt .env
```

Required environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_manager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Email Configuration (optional - for future features)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 3. Database Setup
1. Create a PostgreSQL database
2. Run the SQL commands from `../Assets/cmdsql.sql` to create the tables

### 4. Start the Server
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 Complete API Documentation

### Authentication Endpoints

#### POST /api/users/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/users/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### GET /api/users/profile
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/auth/google
Initiate Google OAuth login.

#### GET /api/auth/google/callback
Handle Google OAuth callback (returns JWT token).

### Transaction Management

#### GET /api/transactions
Get all transactions for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "description": "Grocery shopping",
      "amount": 50.00,
      "type": "expense",
      "category_id": "uuid",
      "category_name": "Food",
      "date": "2024-01-01",
      "receipt_url": "uploads/receipt.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/transactions
Create a new transaction with optional receipt upload.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
description: "Grocery shopping"
amount: 50.00
type: "expense"
category_id: "uuid"
date: "2024-01-01"
receipt: [file] (optional)
```

**Response (201):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "uuid",
    "description": "Grocery shopping",
    "amount": 50.00,
    "type": "expense",
    "category_id": "uuid",
    "date": "2024-01-01",
    "receipt_url": "uploads/receipt.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/transactions/:id
Update an existing transaction.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Response (200):**
```json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "id": "uuid",
    "description": "Updated description",
    "amount": 60.00,
    "type": "expense",
    "category_id": "uuid",
    "date": "2024-01-01",
    "receipt_url": "uploads/new_receipt.jpg",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /api/transactions/:id
Delete a transaction.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Transaction deleted successfully"
}
```

### Category Management

#### GET /api/categories
Get all categories for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Food",
      "color": "#FF5733",
      "icon": "🍕",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/categories
Create a new category.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Food",
  "color": "#FF5733",
  "icon": "🍕"
}
```

#### PUT /api/categories/:id
Update a category.

#### DELETE /api/categories/:id
Delete a category.

### Budget Management

#### GET /api/budgets
Get all budgets for the authenticated user.

#### POST /api/budgets
Create a new budget.

**Request Body:**
```json
{
  "category_id": "uuid",
  "amount": 500.00,
  "period": "monthly"
}
```

#### PUT /api/budgets/:id
Update a budget.

#### DELETE /api/budgets/:id
Delete a budget.

### Recurring Transactions

#### GET /api/recurring-transactions
Get all recurring transactions.

#### POST /api/recurring-transactions
Create a new recurring transaction.

**Request Body:**
```json
{
  "description": "Monthly rent",
  "amount": 1200.00,
  "type": "expense",
  "category_id": "uuid",
  "frequency": "monthly",
  "next_date": "2024-02-01"
}
```

#### PUT /api/recurring-transactions/:id
Update a recurring transaction.

#### DELETE /api/recurring-transactions/:id
Delete a recurring transaction.

### Reports & Analytics

#### GET /api/reports/summary
Get financial summary.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
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

#### GET /api/reports/category-breakdown
Get spending breakdown by category.

#### GET /api/reports/budget-vs-spending
Get budget vs actual spending comparison.

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Password hashing with bcrypt
- Google OAuth integration
- Token expiration handling

### Input Validation
- Express-validator for request validation
- SQL injection prevention
- XSS protection with Helmet
- File upload security with Multer

### Data Protection
- CORS configuration
- Security headers with Helmet
- Request logging with Morgan
- Environment variable protection

## 📊 Database Schema

### Main Tables
- `users` - User accounts and authentication
- `categories` - Transaction categories
- `transactions` - Financial transactions with receipts
- `budgets` - Budget settings by category
- `recurring_transactions` - Automated recurring transactions

### Key Features
- Foreign key relationships
- Timestamp tracking
- Soft delete capability
- File path storage for receipts

## 🧪 Testing

### Postman Testing
See `POSTMAN_TESTING_GUIDE.md` for comprehensive testing instructions.

### Quick API Test
```bash
# Test server health
curl http://localhost:5000

# Test registration
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123"}'
```

## 🔧 Development

### File Structure
```
src/
├── config/          # Database and service configurations
├── controllers/     # Request handlers
├── middlewares/     # Authentication, validation, upload
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Helper functions
├── validations/     # Input validation schemas
└── jobs/            # Background job processing
```

### Adding New Features
1. Create controller in `src/controllers/`
2. Add validation in `src/validations/`
3. Create routes in `src/routes/`
4. Add middleware if needed in `src/middlewares/`
5. Update main `index.js` with new routes

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid credentials, missing token)
- 403: Forbidden (invalid token)
- 404: Not Found
- 500: Internal Server Error

## 📝 Validation Rules

### User Registration
- Name: 2-100 characters
- Email: Valid email format
- Password: Minimum 6 characters, must contain uppercase, lowercase, and number

### Transaction Creation
- Description: Required, 1-255 characters
- Amount: Required, positive number
- Type: Required, "income" or "expense"
- Category: Required, valid category ID
- Date: Required, valid date format

### Category Creation
- Name: Required, 1-50 characters
- Color: Optional, valid hex color
- Icon: Optional, emoji or icon string

## 🔄 Background Jobs

The application includes automated job processing:
- Recurring transaction processing
- Budget notifications
- Data cleanup tasks

Jobs are managed in `src/jobs/` and started via `src/jobRunner.js`.

---

**Status**: ✅ Complete and Production Ready 