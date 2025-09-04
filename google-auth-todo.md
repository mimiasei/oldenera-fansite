# Google OAuth 2.0 Implementation - Detailed TODO

## Phase 1: Google Cloud Console Setup

### 1.1 Google Cloud Project Configuration
- [ ] Go to Google Cloud Console (https://console.cloud.google.com/)
- [ ] Create new project or select existing project for "Heroes of Might and Magic: Olden Era Fan Site"
- [ ] Enable Google+ API in APIs & Services > Library
- [ ] Configure OAuth Consent Screen:
  - [ ] Choose "External" for testing, "Internal" for organization-only
  - [ ] Set Application name: "Heroes of Might and Magic: Olden Era Fan Site"
  - [ ] Add user support email and developer contact information
  - [ ] Add authorized domains if applicable

### 1.2 OAuth 2.0 Credentials Setup
- [ ] Navigate to APIs & Services > Credentials
- [ ] Click "Create Credentials" > "OAuth 2.0 Client IDs"
- [ ] Set application type to "Web application"
- [ ] Configure authorized JavaScript origins:
  - [ ] `http://localhost:5173` (Vite dev server)
  - [ ] `http://localhost:3000` (alternative React port)
  - [ ] Production domain (when available)
- [ ] Configure authorized redirect URIs:
  - [ ] `http://localhost:5000/signin-google` (ASP.NET Core dev)
  - [ ] Production API domain (when available)
- [ ] Download JSON credentials file
- [ ] Securely store Client ID and Client Secret

## Phase 2: Backend (ASP.NET Core) Implementation

### 2.1 NuGet Package Installation
- [ ] Add `Microsoft.AspNetCore.Authentication.Google` version 8.0.8
- [ ] Add `Microsoft.AspNetCore.Authentication.JwtBearer` version 8.0.8
- [ ] Add `Microsoft.AspNetCore.Identity.EntityFrameworkCore` version 8.0.8
- [ ] Add `System.IdentityModel.Tokens.Jwt` version 8.1.2
- [ ] Add `Microsoft.IdentityModel.Tokens` version 8.1.2
- [ ] Add `Google.Apis.Auth` for Google token validation
- [ ] Update project file and restore packages

### 2.2 Configuration Setup
- [ ] Update `appsettings.json` with Google OAuth credentials
- [ ] Add JWT configuration section (SecretKey, Issuer, Audience, ExpiryInMinutes)
- [ ] Create `appsettings.Development.json` for dev-specific settings
- [ ] Set up environment variables for sensitive data
- [ ] Configure connection strings for Identity database

### 2.3 User Model and Database Schema
- [ ] Create `User.cs` model extending `IdentityUser`
- [ ] Add properties: FirstName, LastName, ProfilePictureUrl, GoogleId, CreatedAt, LastLoginAt, IsActive
- [ ] Update `ApplicationDbContext.cs` to inherit from `IdentityDbContext<User>`
- [ ] Configure entity relationships and constraints in OnModelCreating
- [ ] Add unique index for GoogleId field
- [ ] Set up proper field length constraints

### 2.4 JWT Service Implementation
- [ ] Create `IJwtService` interface
- [ ] Implement `JwtService` class with methods:
  - [ ] `GenerateToken(User user)` - Creates JWT with user claims
  - [ ] `ValidateToken(string token)` - Validates token integrity
  - [ ] `GetPrincipalFromToken(string token)` - Extracts claims
- [ ] Configure token signing with HMAC-SHA256
- [ ] Set appropriate token expiration times
- [ ] Add user claims (ID, email, name, profile picture)

### 2.5 Authentication Controller
- [ ] Create `AuthController.cs` with endpoints:
  - [ ] `POST /api/auth/google` - Handle Google OAuth login
  - [ ] `POST /api/auth/refresh` - Refresh JWT tokens
  - [ ] `GET /api/auth/me` - Get current user info
  - [ ] `POST /api/auth/logout` - Handle user logout
- [ ] Implement Google ID token validation using GoogleJsonWebSignature
- [ ] Handle user creation for new Google accounts
- [ ] Update existing users with Google ID if needed
- [ ] Add comprehensive error handling and logging

### 2.6 Program.cs Configuration
- [ ] Add Entity Framework DbContext registration
- [ ] Configure ASP.NET Core Identity with custom User model
- [ ] Set up JWT Bearer authentication with proper validation parameters
- [ ] Add Google OAuth authentication configuration
- [ ] Register custom services (IJwtService implementation)
- [ ] Configure CORS for React frontend origins
- [ ] Set up authentication and authorization middleware

### 2.7 Database Migration
- [ ] Generate Entity Framework migration for Identity tables: `dotnet ef migrations add AddGoogleOAuth`
- [ ] Review generated migration for correctness
- [ ] Apply migration to database: `dotnet ef database update`
- [ ] Verify database schema includes Identity tables and custom User fields
- [ ] Test database connectivity and user operations

## Phase 3: Frontend (React) Implementation

### 3.1 NPM Package Installation
- [ ] Install `@react-oauth/google` for Google OAuth integration
- [ ] Install `jwt-decode` for JWT token handling
- [ ] Install `@types/jwt-decode` for TypeScript support
- [ ] Update package.json and verify installations
- [ ] Test imports in development environment

### 3.2 Authentication Context Setup
- [ ] Create `AuthContext.tsx` with React Context API
- [ ] Define User interface with required properties
- [ ] Implement AuthProvider component with state management
- [ ] Add token persistence using localStorage
- [ ] Handle token expiration and cleanup
- [ ] Create useAuth hook for consuming authentication state
- [ ] Add loading states and error handling

### 3.3 API Service Enhancement
- [ ] Update `api.ts` with authentication endpoints
- [ ] Create axios interceptor for adding Authorization headers
- [ ] Add response interceptor for handling 401 errors
- [ ] Implement automatic token refresh logic
- [ ] Create typed interfaces for authentication requests/responses
- [ ] Add comprehensive error handling for network failures

### 3.4 SWR Authentication Hooks
- [ ] Create `useAuth.ts` with SWR integration
- [ ] Implement `useCurrentUser()` hook for user data fetching
- [ ] Add proper SWR configuration for authentication data
- [ ] Handle authentication state synchronization
- [ ] Add retry logic and error boundaries

### 3.5 Google Login Component
- [ ] Create `GoogleLoginButton.tsx` component
- [ ] Integrate Google OAuth Provider wrapper
- [ ] Handle successful Google authentication
- [ ] Process Google credential response
- [ ] Send ID token to backend for validation
- [ ] Update authentication context on success
- [ ] Add loading states and error handling
- [ ] Style component to match site design

### 3.6 Login Page Implementation
- [ ] Create `Login.tsx` page component
- [ ] Design user-friendly login interface
- [ ] Integrate GoogleLoginButton component
- [ ] Add error display and handling
- [ ] Implement redirect logic for authenticated users
- [ ] Add loading states during authentication
- [ ] Style with Tailwind CSS to match site theme

### 3.7 Protected Route System
- [ ] Create `ProtectedRoute.tsx` component
- [ ] Implement route protection logic
- [ ] Handle authentication loading states
- [ ] Redirect unauthenticated users to login
- [ ] Add role-based access control foundation
- [ ] Test route protection functionality

### 3.8 App Integration
- [ ] Wrap main App component with AuthProvider
- [ ] Update routing to include login page
- [ ] Protect existing admin routes with ProtectedRoute
- [ ] Add authentication-aware navigation
- [ ] Update header component with user profile
- [ ] Add logout functionality to UI

## Phase 4: Security & Production Readiness

### 4.1 JWT Security Implementation
- [ ] Generate cryptographically secure JWT secret key (minimum 32 characters)
- [ ] Implement proper token expiration (1 hour for access tokens)
- [ ] Add refresh token mechanism for extended sessions
- [ ] Store JWT configuration in environment variables
- [ ] Enable HTTPS for all authentication endpoints
- [ ] Add token blacklisting for logout (optional)

### 4.2 Google OAuth Security
- [ ] Implement server-side Google ID token validation
- [ ] Verify token audience matches application client ID
- [ ] Check token expiration and issuer claims
- [ ] Add rate limiting for authentication endpoints
- [ ] Log authentication attempts and failures
- [ ] Implement CSRF protection for OAuth flow

### 4.3 Database Security
- [ ] Add unique constraints for GoogleId and Email fields
- [ ] Implement database connection encryption
- [ ] Add data validation for user inputs
- [ ] Implement soft deletes for user accounts
- [ ] Add audit logging for user changes
- [ ] Set up database backup and recovery procedures

### 4.4 Frontend Security
- [ ] Validate all user inputs on frontend and backend
- [ ] Implement Content Security Policy headers
- [ ] Add XSS protection measures
- [ ] Use HTTPS for all API communication
- [ ] Implement proper error boundaries
- [ ] Add input sanitization where needed

## Phase 5: Testing & Quality Assurance

### 5.1 Backend Testing
- [ ] Create unit tests for JWT service methods
- [ ] Test Google OAuth token validation logic
- [ ] Add integration tests for authentication endpoints
- [ ] Test user creation and management operations
- [ ] Verify database operations and constraints
- [ ] Test error handling scenarios
- [ ] Add performance tests for authentication flows

### 5.2 Frontend Testing
- [ ] Test authentication context functionality
- [ ] Create unit tests for Google login component
- [ ] Test protected route access control
- [ ] Verify error handling and user feedback
- [ ] Test token storage and retrieval
- [ ] Add integration tests for complete authentication flow
- [ ] Test responsive design on different devices

### 5.3 End-to-End Testing
- [ ] Test complete Google OAuth flow from start to finish
- [ ] Verify user registration and login processes
- [ ] Test session management and token refresh
- [ ] Verify logout functionality
- [ ] Test error scenarios (network failures, invalid tokens)
- [ ] Test cross-browser compatibility
- [ ] Verify mobile responsiveness

## Phase 6: Environment Configuration & Deployment

### 6.1 Development Environment
- [ ] Create `.env` file for backend with development settings
- [ ] Create `.env` file for frontend with development API URLs
- [ ] Set up local development certificates for HTTPS
- [ ] Configure development CORS policies
- [ ] Test complete flow in development environment

### 6.2 Production Environment Setup
- [ ] Configure production environment variables
- [ ] Set up HTTPS certificates for production domain
- [ ] Update CORS origins for production frontend
- [ ] Configure production database connection
- [ ] Set up application logging and monitoring
- [ ] Configure production JWT settings with secure keys

### 6.3 Deployment Preparation
- [ ] Update Google OAuth credentials for production URLs
- [ ] Test database migrations in staging environment
- [ ] Configure CI/CD pipeline for automated deployment
- [ ] Set up health checks for authentication endpoints
- [ ] Prepare rollback procedures
- [ ] Document deployment process and configuration

## Verification Checklist

### Authentication Flow Verification
- [ ] User can successfully log in with Google account
- [ ] New users are automatically registered in database
- [ ] Existing users can log in with Google account
- [ ] JWT tokens are properly generated and validated
- [ ] Protected routes are accessible only to authenticated users
- [ ] Users can successfully log out and tokens are invalidated

### Security Verification
- [ ] Google ID tokens are validated server-side
- [ ] JWT tokens use secure signing algorithms
- [ ] Sensitive configuration is stored in environment variables
- [ ] HTTPS is enforced for authentication endpoints
- [ ] Error messages don't leak sensitive information
- [ ] Rate limiting is applied to authentication endpoints

### Integration Verification
- [ ] Authentication integrates seamlessly with existing news system
- [ ] Admin routes are properly protected
- [ ] User information is correctly displayed in UI
- [ ] SWR caching works correctly with authenticated requests
- [ ] Database operations perform efficiently
- [ ] All TypeScript types are properly defined

## Notes

- **Security Priority**: Always validate Google tokens server-side, never trust client-side validation alone
- **Error Handling**: Implement comprehensive error handling for network failures, invalid tokens, and database errors
- **User Experience**: Provide clear feedback for loading states, errors, and successful operations
- **Performance**: Use SWR for efficient data fetching and caching of user information
- **Scalability**: Design authentication system to handle multiple OAuth providers in the future
- **Compliance**: Ensure GDPR compliance for user data collection and storage

## Current Status

- [ ] Google Cloud Console setup complete
- [ ] Backend implementation complete  
- [ ] Frontend implementation complete
- [ ] Security measures implemented
- [ ] Testing completed
- [ ] Production deployment ready

**Next Step**: Begin with Google Cloud Console setup and credential generation