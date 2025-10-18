# Cyshield Network Management System

A web application for managing network subnets and IP addresses. This system allows you to organize your network infrastructure, track IP allocations, and manage subnet configurations through an intuitive interface.

## Features

- User authentication with secure login system
- Create, edit, and delete network subnets
- Manage IP addresses within subnets
- Upload CSV files to import multiple subnets at once
- Clean and responsive user interface
- Pagination for handling large datasets
- Easy deployment with Docker

## Technologies Used

- Backend: ASP.NET Core 8.0 Web API
- Frontend: Angular 20 with Material Design
- Database: MySQL 8.0
- Authentication: JWT tokens
- Containerization: Docker

## Prerequisites

- Docker and Docker Compose
- Git

## Getting Started

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd cyshield
   ```

2. Start the application

   ```bash
   docker-compose up --build
   ```

3. Access the application
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5049
   - Database: localhost:3306

## Project Structure

```
cyshield/
├── backend/                 # ASP.NET Core Web API
│   ├── Controllers/         # API Controllers
│   ├── Models/             # Data Models
│   ├── Services/           # Business Logic
│   ├── Repositories/       # Data Access Layer
│   ├── DTOs/              # Data Transfer Objects
│   ├── Migrations/        # Entity Framework Migrations
│   └── Dockerfile         # Backend Docker configuration
├── frontend/               # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/   # Feature modules
│   │   │   │   ├── auth/   # Authentication
│   │   │   │   ├── subnet/ # Subnet management
│   │   │   │   └── ip/     # IP management
│   │   │   ├── libs/       # Shared components
│   │   │   └── shared/     # Shared interfaces
│   │   └── environments/   # Environment configuration
│   └── Dockerfile         # Frontend Docker configuration
├── docker-compose.yml     # Container orchestration
└── init.sql              # Database initialization
```

## Development Setup

### Backend Development

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Copy environment file
   ```bash
   cp env.example .env
   ```

3. Update .env with your configuration
   ```env
   DB_SERVER=localhost
   DB_PORT=3306
   DB_NAME=cyshield
   DB_USER=cyshield_user
   DB_PASSWORD=cyshield_password
   MYSQL_ROOT_PASSWORD=your_secure_root_password
   JWT_KEY=YourSuperSecretJWTKeyThatIsAtLeast32CharactersLong!
   JWT_ISSUER=Cyshield
   JWT_AUDIENCE=CyshieldUsers
   JWT_EXPIRE_MINUTES=60
   WHITELIST=http://localhost:4200
   ```

4. Run with Docker
   ```bash
   docker-compose up backend
   ```

### Frontend Development

1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Copy environment file
   ```bash
   cp env.example .env
   ```

3. Environment is pre-configured
   - API URL is set to `http://localhost:5049` in environment files
   - No additional configuration needed for development

4. Install dependencies and run
   ```bash
   npm install
   npm start
   ```

## Database Schema

### Users Table
- `UserId` (Primary Key)
- `Email` (Unique)
- `PasswordHash`
- `CreatedAt`

### Subnets Table
- `SubnetId` (Primary Key)
- `SubnetName`
- `SubnetAddress` (CIDR format)
- `CreatedBy` (Foreign Key to Users)
- `CreatedAt`

### IPs Table
- `IpId` (Primary Key)
- `IpAddress`
- `SubnetId` (Foreign Key to Subnets)
- `CreatedBy` (Foreign Key to Users)
- `CreatedAt`

## Authentication

The application uses JWT-based authentication:

1. Register: Create a new user account
2. Login: Authenticate and receive JWT token
3. Protected Routes: All API endpoints require valid JWT token
4. Token Expiry: Configurable token expiration time

## File Upload

Supported file formats:
- TxT files with subnet data
- Automatic IP generation from subnet ranges
- Bulk import capabilities

## UI Features

- Material Design: Modern, responsive interface
- Pagination: Efficient data browsing
- Modal Dialogs: Intuitive CRUD operations
- Loading States: User feedback during operations
- Form Validation: Client-side validation
- Error Handling: User-friendly error messages

## Configuration

### Environment Variables

**Backend (.env)**
- Database connection settings
- JWT configuration
- CORS whitelist

**Frontend (enviroments/environment.ts)**
- API endpoint URL

## Troubleshooting

### Common Issues

1. **Docker not running**: Make sure Docker Desktop is running before starting the application
2. **Port conflicts**: If ports 3306, 4200, or 5000 are already in use, stop the conflicting services
3. **Database connection issues**: Wait a few seconds after starting for MySQL to fully initialize
4. **Frontend not loading**: Check if the backend is running and accessible at http://localhost:5000

### Reset Everything

To completely reset the application:
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

## Known Issues

- Data protection keys are not persisted in Docker containers (development only)
- HTTPS redirection disabled for Docker environment

## Future Improvements

- Add role-based access control
- Add unit and integration tests



## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
