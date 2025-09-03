# Changes Log

## 2024-09-01

### Initial Project Setup
- Created CLAUDE.md with project instructions and technology stack
- Created CHANGES.md to track all modifications
- Project structure planned:
  - ASP.NET Core backend
  - React TypeScript frontend with Vite
  - PostgreSQL database
  - Tailwind CSS for styling

### ASP.NET Core Backend Setup
- Created backend project structure with directories:
  - Controllers/
  - Models/
  - Data/
  - Services/
- Created Program.cs with CORS configuration for React frontend
- Created OldenEraFanSite.Api.csproj with required NuGet packages:
  - Microsoft.EntityFrameworkCore 8.0.8
  - Npgsql.EntityFrameworkCore.PostgreSQL 8.0.4
  - Swashbuckle.AspNetCore 6.4.0
- Created NewsArticle model with properties for title, content, summary, etc.
- Created ApplicationDbContext with NewsArticles DbSet
- Created NewsController with full CRUD operations
- Created appsettings.json with PostgreSQL connection string

### React TypeScript Frontend Setup
- Created frontend project structure with Vite configuration
- Set up package.json with dependencies:
  - React 18.3.1
  - TypeScript
  - React Router DOM
  - Axios for API calls
  - Tailwind CSS and PostCSS
- Created vite.config.ts with proxy configuration for backend API
- Created TypeScript configuration files (tsconfig.json, tsconfig.node.json)

### Tailwind CSS Setup
- Created tailwind.config.js with custom color scheme:
  - Primary colors (orange/amber palette)
  - Secondary colors (blue palette)
  - Custom fonts: Cinzel (fantasy) and Inter (body)
- Created postcss.config.js for Tailwind processing
- Created src/index.css with:
  - Google Fonts imports
  - Tailwind directives
  - Custom component classes (btn-primary, btn-secondary, card)
  - Fantasy gradient utility

### Frontend Components and Pages
- Created TypeScript type definitions in src/types/index.ts
- Created API service layer in src/services/api.ts with axios configuration
- Created Header component with navigation
- Created Footer component with copyright information
- Created Home page with:
  - Hero section
  - Latest news display
  - Game information teaser
- Created News page with full article listing
- Created main App.tsx with React Router setup
- Created main.tsx entry point

### PostgreSQL Database Configuration
- Created database/setup.sql with:
  - Database and user creation commands
  - NewsArticles table schema
  - Sample news articles data
  - Database indexes for performance
  - Update trigger for UpdatedAt column
- Created database/README.md with setup instructions

### Environment Configuration
- Created frontend/.env.example with API URL configuration
- Set up CORS policy in backend for frontend communication

### Status
- All major components are created and configured
- Project ready for development once .NET SDK is installed
- Database scripts ready for PostgreSQL setup
- Frontend ready for npm install and development

## 2025-09-03

### UI and Visual Enhancements
- Updated site branding to "Olden Wiki" with tagline
- Implemented background wallpaper (OE_wallpapper.webp) with 80% black overlay
- Enhanced button styling with opacity transitions instead of color changes
- Added fantasy gradient variations for better visual hierarchy
- Updated footer copyright year to 2025
- Added Forum route and navigation menu item

### Image Storage Structure
- Created comprehensive image directory structure:
  - `frontend/public/images/` - Static assets (logos, backgrounds, icons, UI, screenshots)
  - `frontend/src/assets/images/` - Build-processed images (components, pages)
  - `backend/wwwroot/uploads/news/` - User-uploaded content
  - `backend/wwwroot/static/images/` - Backend-managed static files
- Added documentation for each image directory with usage guidelines
- Created .gitignore to prevent committing unwanted files (node_modules, IDE files, etc.)

### Global State Management Implementation
- Implemented React Context API with useReducer for centralized state management
- Created comprehensive state structure covering:
  - User authentication and authorization
  - News articles with pagination and error handling
  - UI state (sidebar, theme, notifications)
  - Forum state (prepared for future implementation)
- Built type-safe architecture with TypeScript interfaces:
  - `AppState` - Complete application state structure
  - `AppAction` - All possible state actions
  - `User` and `Notification` interfaces
- Developed custom hooks for component access:
  - `useAuth()` - Authentication state and actions
  - `useNews()` - News data management
  - `useUI()` - UI state and notifications
- Added localStorage persistence for user preferences and authentication
- Created notification system with toast-style messages:
  - Auto-dismissing notifications with configurable duration
  - Success, error, info, and warning notification types
  - NotificationContainer component for display management
- Updated existing components to use global state:
  - Home component now uses centralized news state
  - News component integrated with global state management
  - Improved error handling and user feedback

### Technical Improvements
- Enhanced type safety across the application
- Improved state management patterns and data flow
- Added proper loading states and error handling for async operations
- Implemented automatic cleanup for notifications and UI state
- Better separation of concerns with custom hooks

### Status
- Global state management fully implemented and integrated
- Notification system operational with auto-dismiss functionality
- All components updated to use centralized state
- Image storage structure ready for content
- Enhanced user experience with better visual feedback
- Project ready for further feature development