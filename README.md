# Finance Manager Application

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Web%20Framework-000000)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000)](https://jwt.io/)
[![Passport.js](https://img.shields.io/badge/Passport.js-OAuth-34E27A)](https://passportjs.org/)
[![Multer](https://img.shields.io/badge/Multer-File%20Upload-FF6B6B)](https://github.com/expressjs/multer)
[![Helmet](https://img.shields.io/badge/Helmet-Security-000000)](https://helmetjs.github.io/)
[![Morgan](https://img.shields.io/badge/Morgan-Logging-000000)](https://github.com/expressjs/morgan)
[![Bcrypt](https://img.shields.io/badge/Bcrypt-Password%20Hashing-000000)](https://github.com/dcodeIO/bcrypt.js/)
[![Node-cron](https://img.shields.io/badge/Node--cron-Scheduled%20Jobs-000000)](https://github.com/node-cron/node-cron)

A comprehensive personal finance management application with a Node.js/Express backend and modern frontend interface.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based authentication with email/password and Google OAuth
- **Transaction Management**: Create, read, update, delete transactions with receipt upload
- **Category Management**: Custom categories for organizing transactions
- **Budget Management**: Set and track budgets by category
- **Recurring Transactions**: Automate regular payments and income
- **Reporting & Analytics**: Financial summaries, category breakdowns, budget vs spending
- **File Upload**: Receipt image upload and storage
- **Automated Jobs**: Background processing for recurring transactions

### Frontend Features (Planned)
- Modern React interface
- Real-time data visualization
- Responsive design
- Interactive charts and reports

## 📁 Project Structure

```
Finance Manager Application/
├── Backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database and service configurations
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Authentication, validation, upload
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── validations/    # Input validation schemas
│   ├── uploads/            # Receipt file storage
│   ├── index.js            # Main server file
│   └── package.json        # Dependencies
├── Assets/                 # Database schemas and resources
└── Frontend/              # React frontend (planned)
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Passport.js** for Google OAuth
- **Multer** for file uploads
- **Node-cron** for scheduled jobs
- **Helmet** for security headers
- **Morgan** for request logging

### Frontend (Planned)
- **React** with modern hooks
- **TypeScript** for type safety
- **Material-UI** or **Tailwind CSS** for styling
- **Chart.js** or **D3.js** for data visualization

## 🚀 Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Finance-Manager-Application
   ```

2. **Install dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp env-template.txt .env
   # Edit .env with your database credentials
   ```

4. **Database Setup**
   - Create a PostgreSQL database
   - Run the SQL commands from `Assets/cmdsql.sql`

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Transaction Management
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Category Management
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budget Management
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Recurring Transactions
- `GET /api/recurring-transactions` - Get all recurring transactions
- `POST /api/recurring-transactions` - Create new recurring transaction
- `PUT /api/recurring-transactions/:id` - Update recurring transaction
- `DELETE /api/recurring-transactions/:id` - Delete recurring transaction

### Reports & Analytics
- `GET /api/reports/summary` - Get financial summary
- `GET /api/reports/category-breakdown` - Get category breakdown
- `GET /api/reports/budget-vs-spending` - Get budget vs spending report

## 🧪 Testing

### Postman Testing
See `Backend/POSTMAN_TESTING_GUIDE.md` for detailed testing instructions.

### Quick API Test
```bash
# Test server health
curl http://localhost:5000

# Test registration
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123"}'
```

## 🔧 Environment Variables

Required environment variables (see `Backend/env-template.txt`):

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

# Email Configuration (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `categories` - Transaction categories
- `transactions` - Financial transactions with receipts
- `budgets` - Budget settings by category
- `recurring_transactions` - Automated recurring transactions

## 🔒 Security Features

- **JWT Authentication** for API protection
- **Password Hashing** with bcrypt
- **Input Validation** with express-validator
- **Security Headers** with Helmet
- **CORS Protection** for cross-origin requests
- **File Upload Security** with Multer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation in the `Backend/` directory
2. Review the Postman testing guide
3. Open an issue on GitHub

---

**Status**: Backend ✅ Complete | Frontend 🚧 In Development 
