# Design Document

## Overview

This design document outlines the completion of a comprehensive Library Management System built with a modern full-stack architecture. The system uses NestJS with TypeORM for the backend API, PostgreSQL for data persistence, and React with TypeScript for the frontend interface. The architecture follows RESTful API principles with JWT-based authentication and role-based access control.

The system will serve librarians and administrators in managing books, members, borrowings, genres, and staff accounts through an intuitive web interface with real-time statistics and comprehensive CRUD operations.

## Architecture

### System Architecture

The application follows a three-tier architecture:

1. **Presentation Layer**: React frontend with TypeScript, Tailwind CSS, and shadcn/ui components
2. **Business Logic Layer**: NestJS backend with modular service architecture
3. **Data Layer**: PostgreSQL database with TypeORM for object-relational mapping

### Technology Stack

**Backend:**

- NestJS framework for scalable Node.js applications
- TypeORM for database abstraction and migrations
- PostgreSQL for relational data storage
- JWT for stateless authentication
- bcrypt for password hashing
- Passport.js for authentication strategies

**Frontend:**

- React 19 with TypeScript for type safety
- Vite for fast development and building
- React Router for client-side routing
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent component library
- Recharts for data visualization
- TanStack Table for advanced data tables

### Design Rationale

- **NestJS**: Chosen for its modular architecture, built-in dependency injection, and excellent TypeScript support
- **TypeORM**: Provides type-safe database operations and automatic migrations
- **PostgreSQL**: Robust relational database suitable for complex relationships and data integrity
- **JWT Authentication**: Stateless authentication suitable for API-based architecture
- **React with TypeScript**: Provides type safety and excellent developer experience
- **Modular Architecture**: Each domain (books, members, borrowings) is isolated in separate modules for maintainability

## Components and Interfaces

### Backend Modules

#### 1. Authentication Module (`auth/`)

**Purpose**: Handles user authentication and authorization with comprehensive JWT-based security
**Components**:

- `AuthController`: Login endpoint and token validation
- `AuthService`: Authentication logic, JWT token generation, and password verification
- `JwtStrategy`: JWT token validation strategy with role extraction
- `LocalStrategy`: Username/password validation strategy with bcrypt verification
- `JwtAuthGuard`: Route protection guard with role-based access control
- `RolesGuard`: Additional guard for admin-only endpoints

**Key Interfaces**:

```typescript
interface LoginDto {
  username: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
  };
}
```

**Security Features**:

- Password hashing with bcrypt (minimum 10 rounds)
- JWT token expiration and refresh mechanisms
- Role-based endpoint protection
- Secure session management

#### 2. Users Module (`users/`)

**Purpose**: Manages staff user accounts and roles with comprehensive admin controls
**Components**:

- `UsersController`: CRUD operations for staff accounts with role-based restrictions
- `UsersService`: Business logic for user management with security validations
- `User` entity: Staff user data model with role relationships

**Key Features**:

- Role-based access control (Admin, Librarian)
- Secure password hashing with bcrypt
- Admin-only user management endpoints
- Prevention of last admin account deletion
- Immediate permission updates on role changes
- Staff account creation with role assignment
- User activity tracking and audit logs

**API Endpoints**:

```typescript
interface CreateUserDto {
  username: string;
  password: string;
  role: "admin" | "librarian";
}

interface UserResponse {
  id: string;
  username: string;
  role: "admin" | "librarian";
  createdAt: Date;
  lastLogin?: Date;
}

interface UpdateUserRoleDto {
  role: "admin" | "librarian";
}
```

**Business Rules**:

- Only admin users can create, update, or delete staff accounts
- System must maintain at least one admin account
- Role changes take effect immediately
- Username must be unique across all staff accounts

#### 3. Books Module (`books/`)

**Purpose**: Manages book inventory and availability with comprehensive search and filtering
**Components**:

- `BooksController`: CRUD operations with search and filtering endpoints
- `BooksService`: Business logic including copy management and availability tracking
- `Book` entity: Book data model with genre relationships

**Key Features**:

- Automatic copy tracking (total vs available copies)
- Real-time availability updates during borrowing/returns
- Advanced search capabilities (title, author, ISBN, genre)
- Filtering by availability, genre, and other criteria
- ISBN uniqueness validation and format checking
- Borrowing prevention when no copies available
- Integration with borrowings for copy management

**API Endpoints**:

```typescript
interface BookSearchQuery {
  search?: string;
  genre?: string;
  available?: boolean;
  page?: number;
  limit?: number;
}

interface BookResponse {
  id: string;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  genre: GenreResponse;
}
```

#### 4. Members Module (`members/`)

**Purpose**: Manages library member accounts with comprehensive borrowing history
**Components**:

- `MembersController`: CRUD operations for members with borrowing history endpoints
- `MembersService`: Member management business logic with history tracking
- `Member` entity: Member data model with borrowing relationships

**Key Features**:

- Member registration and profile management
- Complete borrowing history tracking and display
- Fast member search capabilities
- Contact information management with validation
- Active/inactive member status management
- Borrowing statistics and analytics

**API Endpoints**:

```typescript
interface MemberResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  membershipDate: Date;
  isActive: boolean;
  borrowingHistory: BorrowingResponse[];
  activeBorrowings: number;
  totalBorrowings: number;
}

interface MemberSearchQuery {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}
```

#### 5. Borrowings Module (`borrowings/`)

**Purpose**: Handles book circulation (borrowing and returns) with comprehensive tracking
**Components**:

- `BorrowingsController`: Borrowing and return operations with overdue tracking
- `BorrowingsService`: Circulation business logic with borrowing limits enforcement
- `Borrowing` entity: Borrowing transaction model with status tracking

**Key Features**:

- Automatic due date calculation (configurable loan period)
- Real-time overdue tracking and status updates
- Copy availability management with atomic operations
- Return processing with automatic copy increment
- Borrowing limits enforcement per member
- Overdue book reporting and notifications
- Integration with books service for availability updates

**API Endpoints**:

```typescript
interface BorrowingRequest {
  bookId: string;
  memberId: string;
  dueDate?: Date; // Optional, defaults to system setting
}

interface BorrowingResponse {
  id: string;
  book: BookResponse;
  member: MemberResponse;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "borrowed" | "returned" | "overdue";
  isOverdue: boolean;
  daysOverdue?: number;
}

interface OverdueQuery {
  memberId?: string;
  bookId?: string;
  daysOverdue?: number;
}
```

**Business Rules**:

- Maximum borrowing limit per member (configurable, default: 5 books)
- Loan period calculation (configurable, default: 14 days)
- Automatic overdue status update via scheduled tasks
- Prevention of new borrowings for members with overdue books

#### 6. Genres Module (`genres/`)

**Purpose**: Manages book categorization with usage tracking
**Components**:

- `GenresController`: CRUD operations for genres with usage statistics
- `GenresService`: Genre management logic with book relationship handling
- `Genre` entity: Genre data model with book count tracking

**Key Features**:

- Unique genre names with validation
- Real-time usage statistics and book counts
- Safe deletion with book relationship checks
- Popular genre analytics for dashboard
- Integration with books module for category management

**API Endpoints**:

```typescript
interface GenreResponse {
  id: string;
  name: string;
  bookCount: number;
  createdAt: Date;
}

interface GenreUsageStats {
  genre: GenreResponse;
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
}
```

**Business Rules**:

- Genre names must be unique across the system
- Cannot delete genres that have associated books
- Genre usage statistics update in real-time
- Popular genres displayed on dashboard

#### 7. Dashboard Module (`dashboard/`)

**Purpose**: Provides comprehensive statistics and overview for library operations
**Components**:

- `DashboardController`: Statistics aggregation endpoints
- `DashboardService`: Business logic for calculating real-time statistics
- Statistics aggregation across all modules

**Key Features**:

- Real-time statistics calculation and display
- Total books, members, active borrowings, and overdue books
- Popular genres analytics with usage statistics
- Quick action shortcuts for common tasks
- Performance metrics and system health indicators
- Responsive dashboard cards with interactive charts

**API Endpoints**:

```typescript
interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeBorrowings: number;
  overdueBooks: number;
  popularGenres: GenreUsageStats[];
  recentActivity: ActivityLog[];
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

interface ActivityLog {
  id: string;
  type: "borrow" | "return" | "member_created" | "book_added";
  description: string;
  timestamp: Date;
  userId: string;
}
```

**Business Rules**:

- Statistics update in real-time as operations occur
- Dashboard accessible to all authenticated users
- Admin users see additional system health metrics
- Popular genres ranked by borrowing frequency

### Frontend Components

#### 1. Authentication System

**Components**:

- `AuthContext`: Global authentication state management
- `ProtectedRoute`: Route protection based on authentication
- `LoginPage`: User login interface

#### 2. Layout and Navigation

**Components**:

- `AppSidebar`: Main navigation sidebar
- `Layout`: Common page layout wrapper
- `SiteHeader`: Top navigation bar
- `NavMain`: Primary navigation items
- `NavUser`: User profile and logout

#### 3. Feature Pages

**Components**:

- `DashboardPage`: Statistics and overview
- `BooksPage`: Book management interface
- `MembersPage`: Member management interface
- `BorrowingsPage`: Circulation management
- `GenresPage`: Genre management
- `StaffPage`: Staff account management (admin only)
- `SettingsPage`: System configuration

#### 4. Shared Components

**Components**:

- `DataTable`: Reusable table with sorting, filtering, and pagination
- `DashboardCards`: Statistics display cards
- `ChartAreaInteractive`: Data visualization charts

## Data Models

### Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role ENUM('admin', 'librarian') DEFAULT 'librarian',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Members Table

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  address TEXT,
  membership_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Genres Table

```sql
CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Books Table

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  author VARCHAR NOT NULL,
  isbn VARCHAR UNIQUE NOT NULL,
  total_copies INTEGER DEFAULT 0,
  available_copies INTEGER DEFAULT 0,
  genre_id UUID REFERENCES genres(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Borrowings Table

```sql
CREATE TABLE borrowings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) NOT NULL,
  member_id UUID REFERENCES members(id) NOT NULL,
  borrow_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP NOT NULL,
  return_date TIMESTAMP NULL,
  status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Entity Relationships

**Design Rationale for Relationships**:

- **Books ↔ Genres**: Many-to-One relationship allows categorization while maintaining referential integrity
- **Borrowings ↔ Books**: Many-to-One relationship tracks which books are borrowed
- **Borrowings ↔ Members**: Many-to-One relationship tracks member borrowing history
- **UUID Primary Keys**: Provides better security and scalability than auto-incrementing integers

### Data Validation Rules

**Books**:

- ISBN must be unique and follow standard format
- Available copies cannot exceed total copies
- Title and author are required fields

**Members**:

- Email must be unique and valid format
- Phone number format validation
- Required fields: first name, last name, email

**Borrowings**:

- Due date must be after borrow date
- Cannot borrow if no copies available
- Member must be active to borrow books

## Error Handling

### Backend Error Handling Strategy

#### 1. Global Exception Filter

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Standardized error response format
    // Logging for debugging
    // Security-conscious error messages
  }
}
```

#### 2. Custom Exception Types

- `BookNotAvailableException`: When attempting to borrow unavailable books
- `MemberNotActiveException`: When inactive members attempt operations
- `OverdueBookException`: When books are past due date
- `ValidationException`: For data validation failures

#### 3. HTTP Status Code Mapping

- `400 Bad Request`: Validation errors, business rule violations
- `401 Unauthorized`: Authentication failures
- `403 Forbidden`: Authorization failures (role-based)
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resources (ISBN, email)
- `500 Internal Server Error`: Unexpected system errors

### Frontend Error Handling Strategy

#### 1. Error Boundary Components

```typescript
class ErrorBoundary extends React.Component {
  // Catches JavaScript errors in component tree
  // Displays fallback UI
  // Logs errors for debugging
}
```

#### 2. API Error Handling

- Centralized error handling in API client
- User-friendly error messages
- Retry mechanisms for network failures
- Loading states and error states

#### 3. Form Validation

- Real-time validation feedback
- Clear error messages
- Field-level and form-level validation
- Accessibility-compliant error announcements

### Error Recovery Mechanisms

**Data Consistency**:

- Database transactions for multi-step operations
- Rollback mechanisms for failed operations
- Optimistic locking for concurrent updates

**User Experience**:

- Graceful degradation for network issues
- Offline capability indicators
- Auto-save for form data
- Clear recovery instructions

## Testing Strategy

### Backend Testing

#### 1. Unit Tests

**Coverage Areas**:

- Service layer business logic
- Entity validation rules
- Utility functions
- Authentication logic

**Testing Framework**: Jest with NestJS testing utilities

**Example Test Structure**:

```typescript
describe("BooksService", () => {
  describe("borrowBook", () => {
    it("should decrease available copies when book is borrowed");
    it("should throw exception when no copies available");
    it("should update borrowing status correctly");
  });
});
```

#### 2. Integration Tests

**Coverage Areas**:

- API endpoint functionality
- Database operations
- Authentication flows
- Module interactions

**Testing Approach**:

- In-memory database for isolated tests
- Test data factories for consistent setup
- API endpoint testing with supertest

#### 3. End-to-End Tests

**Coverage Areas**:

- Complete user workflows
- Authentication and authorization
- Data persistence across requests
- Error handling scenarios

### Frontend Testing

#### 1. Component Tests

**Coverage Areas**:

- Component rendering
- User interactions
- Props handling
- State management

**Testing Framework**: React Testing Library with Jest

#### 2. Integration Tests

**Coverage Areas**:

- API integration
- Routing functionality
- Form submissions
- Error handling

#### 3. Accessibility Tests

**Coverage Areas**:

- Screen reader compatibility
- Keyboard navigation
- Color contrast
- ARIA attributes

### Testing Data Management

**Test Database Strategy**:

- Separate test database instance
- Database seeding for consistent test data
- Cleanup between test runs
- Migration testing

**Mock Strategy**:

- External service mocking
- Database mocking for unit tests
- Authentication mocking for protected routes

### Performance Testing

**Load Testing**:

- API endpoint performance under load
- Database query optimization
- Memory usage monitoring
- Response time benchmarks

**Frontend Performance**:

- Bundle size optimization
- Rendering performance
- Memory leak detection
- Accessibility performance

This comprehensive design addresses all requirements while maintaining scalability, security, and maintainability. The modular architecture allows for independent development and testing of each component while ensuring proper integration across the entire system.
