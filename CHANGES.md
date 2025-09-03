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

## 2025-09-03 (Part 2)

### React Router v7 Migration Started
- **Architecture Change**: Initiated migration from React + Vite to React Router v7 (modern Remix)
- **New Project Structure**: Created `frontend-remix/` directory with React Router v7 setup
- **Technology Stack Update**:
  - React Router v7 with TypeScript support
  - Tailwind CSS v4 with new `@theme` configuration syntax
  - Server-side data loading with loaders (planned)
  - File-based routing system (in progress)

### Dependency Management
- Added axios for API communication with existing ASP.NET Core backend
- Maintained compatibility with current backend without changes
- Configured React Router v7 development environment

### Styling System Migration
- **Tailwind CSS v4**: Updated configuration to use new `@theme` syntax
- **Custom Properties**: Converted color schemes to CSS custom properties:
  - Primary colors: Orange/amber palette (--color-primary-50 to --color-primary-900)
  - Secondary colors: Blue palette (--color-secondary-50 to --color-secondary-900)
- **Typography**: Preserved Cinzel (fantasy) and Inter (body) font configuration
- **Component Classes**: Maintained existing utility classes (btn, card, fantasy-gradient)
- **Google Fonts**: Integrated font loading in new CSS structure

### Component Migration
- **Header Component**: Updated to use React Router v7 Link component
- **Footer Component**: Migrated with preserved styling and layout
- **Import Updates**: Changed from 'react-router-dom' to 'react-router'
- **Type Safety**: Maintained TypeScript interfaces and NewsArticle types

### API Integration
- **Service Layer**: Recreated API services in `app/lib/api.ts`
- **Types**: Copied NewsArticle interface to `app/types/index.ts`
- **Backend Compatibility**: Maintained connection to existing ASP.NET Core API
- **Environment Variables**: Configured for React Router v7 environment

### Migration Strategy
- **Hybrid Approach**: Keeping ASP.NET Core backend, migrating only frontend
- **Incremental Migration**: Starting with foundation, then routes and components
- **Data Loading**: Planning to implement React Router v7 loaders for server-side data fetching
- **File-based Routing**: Preparing route structure for /home, /news, /game-info, /screenshots, /forum

### Status
- Migration foundation completed successfully
- React Router v7 project structure established
- Styling and components migrated
- Ready for file-based routing implementation
- Backend API integration preserved

## 2025-09-03 (Part 3)

### React Router v7 File-based Routing Implementation
- **Complete Route Structure**: Implemented file-based routing system with all major pages:
  - `/` (home) - Homepage with hero section and latest news
  - `/news` - Full news listing page
  - `/news/:id` - Individual news article pages (placeholder)
  - `/game-info` - Game information page (placeholder)
  - `/screenshots` - Media gallery page (placeholder)
  - `/forum` - Community forum page (placeholder)

### Server-Side Data Loading (SSR)
- **Loader Functions**: Implemented proper React Router v7 loaders for data fetching:
  - Home route loader: Fetches latest 3 news articles for homepage display
  - News route loader: Fetches all news articles for listing page
  - Server-side rendering with real-time data from ASP.NET Core API
- **Type Safety**: Generated route types using React Router v7 TypeScript integration
- **Error Handling**: Proper server-side error handling with React Router patterns

### UI and Component Updates
- **Background Integration**: Added OE_wallpapper.webp background with gradient overlay
- **Responsive Design**: Enhanced mobile and desktop layouts with Tailwind CSS v4
- **Navigation**: Updated header navigation with proper React Router Link components
- **Card Components**: Improved news article card styling and hover effects

### Development Environment Configuration
- **Environment Variables**: Configured `.env` file with proper API URLs
- **Development Workflow**: Set up proper development server configuration
- **API Integration**: Seamless connection to existing ASP.NET Core backend

### Architecture Cleanup and Best Practices
- **Removed Temporary Workarounds**: Cleaned up development workarounds that were masking API connection issues
- **Proper Error Handling**: Implemented clean Remix/React Router error handling patterns
- **SSL Configuration**: Removed development SSL bypasses for proper production readiness
- **Mock Data Removal**: Eliminated mock data fallbacks in favor of proper server-side data loading

### Development Instructions
- **Backend Startup**: Documented proper ASP.NET Core backend startup procedure
- **API Dependencies**: Clear instructions on backend requirement for SSR data loading
- **Development Workflow**: Two-terminal setup (backend: `dotnet run`, frontend: `npm run dev`)

### Status
- **Complete Remix Migration**: Successfully migrated from React + Vite to React Router v7
- **SSR Implementation**: Full server-side rendering with real backend data
- **Production Ready**: Clean architecture without development workarounds
- **Proper Error Handling**: React Router error boundaries and server-side error handling
- **Backend Integration**: Seamless connection to existing ASP.NET Core API
- **Development Ready**: Clear startup instructions and proper environment configuration