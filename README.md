# Heroes of Might and Magic: Olden Era Fan Site

An unofficial fan site for the upcoming PC game "Heroes of Might and Magic: Olden Era". This site features news, game information, screenshots, and community features.

## 🏰 Features

- **Production-Ready Deployment**: Fully deployed to Render.com with automatic database migrations and environment detection
- **Smart Environment Configuration**: Automatic API endpoint detection (local dev ↔ production) without manual changes
- **Secure Secret Management**: Complete .env file system with proper Git exclusion and production environment variables
- **Complete Screenshot/Media Gallery**: Professional media gallery with category filtering, lightbox functionality, and admin management
- **Complete Faction Overview Pages**: Professional faction listing and detailed pages with unit/hero filtering and comprehensive game content display
- **Complete Game Information System**: Full infrastructure for factions, units, heroes, and spells with REST API
- **Complete News Management System**: Full CRUD operations for news articles with advanced search and filtering
- **Advanced User Authentication System**: JWT-based authentication with role-based access control and comprehensive UX
- **Fantasy Avatar System**: 56 Heroes of Might and Magic themed character portraits with category selection
- **Enhanced Admin Panel**: Comprehensive dashboard with user management, statistics, and site settings
- **Media Management**: Complete media gallery with 6 categories (Screenshots, Concept Art, Character Art, Environment Art, UI Screenshots, Wallpapers)
- **Lightbox Viewer**: Full-featured image/video viewer with keyboard navigation and metadata display
- **Game Content Database**: PostgreSQL schema with faction data (Haven, Necropolis, Inferno) ready for expansion
- **Professional API Design**: RESTful architecture with filtering, pagination, and admin-only endpoints
- **SWR Data Fetching**: Optimal client-side caching with custom hooks for game content management
- **Interactive Game Content**: Tabbed interfaces with unit/hero filtering, stat displays, and faction information
- **Type-Safe Development**: Complete TypeScript coverage for all game models and API interactions
- **Responsive Design**: Built with Tailwind CSS and custom fantasy theme with background imagery
- **Modern Tech Stack**: ASP.NET Core backend with React TypeScript frontend
- **PostgreSQL Database**: Robust data storage with Entity Framework Core and ASP.NET Core Identity
- **Security**: Production-ready authentication with password requirements and account lockout protection
- **Enhanced Development Logging**: Detailed HTTP request tracking, SQL queries, and authentication debugging
- **Community Features**: User comments and forum discussions (planned)

## 🛠 Technology Stack

- **Backend**: ASP.NET Core 8.0
- **Frontend**: React 18 with Vite and TypeScript ⚡
- **Database**: PostgreSQL 15 in Docker container with Entity Framework Core
- **Data Fetching**: SWR (Stale-While-Revalidate) for client-side caching and revalidation
- **Styling**: Tailwind CSS v3 with custom fantasy theme and background imagery
- **Build Tool**: Vite for fast development and optimized builds
- **API**: RESTful API with Swagger documentation
- **DevOps**: Docker Compose for database containerization

## 📁 Project Structure

```
oldenerafansite/
├── backend/                 # ASP.NET Core API
│   ├── Controllers/         # API controllers (News, Faction, Unit, GameInfo, Media, Admin, Auth)
│   ├── Models/             # Data models (Faction, Unit, Hero, Spell, GameInfo, MediaItem, MediaCategory)
│   ├── Data/               # Database context with game content and media tables
│   └── Program.cs          # Application entry point
├── frontend/               # React + Vite frontend with SWR ⚡ (ACTIVE)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # SWR custom hooks for data fetching
│   │   ├── services/       # API service layer
│   │   ├── store/          # Global state management
│   │   ├── types/          # TypeScript type definitions
│   │   └── assets/images/  # Build-processed images
│   ├── public/images/      # Static image assets
│   └── package.json        # Frontend dependencies
├── frontend-remix/         # React Router v7 frontend (EXPERIMENTAL)
│   ├── app/
│   │   ├── components/     # React Router v7 components
│   │   ├── lib/            # API services and utilities
│   │   ├── routes/         # File-based routing with loaders
│   │   └── types/          # TypeScript interfaces
│   ├── public/             # Static assets
│   └── package.json        # React Router v7 dependencies
├── database/               # Database setup scripts
│   ├── setup.sql          # Database schema and sample data
│   ├── init.sql           # Docker database initialization
│   ├── add-game-content-tables.sql # Game content schema and faction data
│   └── README.md          # Database setup instructions
├── docker-compose.yml      # PostgreSQL Docker container setup
├── backend/wwwroot/        # Static files served by backend
│   ├── uploads/news/       # User-uploaded images
│   └── static/images/      # Backend-managed images
├── .gitignore             # Git ignore file
├── CHANGES.md             # Change log
└── CLAUDE.md              # Project instructions
```

## 🚀 Quick Start

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)

### Database Setup (Docker)

1. Start PostgreSQL container:
   ```bash
   docker-compose up -d postgres
   ```

2. Verify container is running:
   ```bash
   docker ps
   # Should show: oldenerafansite-postgres
   ```

The database will be automatically initialized with the schema and sample data.

### Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

The API will be available at `https://localhost:5001` with Swagger documentation.

### Frontend Setup (React + SWR) ⚡

**IMPORTANT**: Start services in order for proper operation.

**Terminal 1 - Database:**
```bash
docker-compose up -d postgres
```

**Terminal 2 - Backend:**
```bash
cd backend
dotnet run
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The React frontend will be available at `http://localhost:5173` with SWR data fetching and caching.

## 🧪 Development Commands

### Backend
- `dotnet run` - Start development server
- `dotnet build` - Build the project
- `dotnet test` - Run tests
- `dotnet ef database update` - Apply database migrations

### Database (Docker)
- `docker-compose up -d postgres` - Start PostgreSQL container
- `docker-compose down` - Stop all containers
- `docker-compose logs postgres` - View database logs
- `docker-compose exec postgres psql -U oldenerauser -d oldenerafansite` - Connect to database

### Frontend (React + SWR) ⚡
- `cd frontend && npm run dev` - Start development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run preview` - Preview production build
- `cd frontend && npm run lint` - Run ESLint
- `cd frontend && npm run type-check` - TypeScript type checking

## 🎨 Design

The site features a fantasy-themed design inspired by the Heroes of Might and Magic series:
- **Colors**: Orange/amber primary palette with blue secondary colors
- **Typography**: Cinzel font for headings, Inter for body text
- **Components**: Custom styled buttons, cards, and gradients
- **Responsive**: Mobile-first design approach

## 📋 Roadmap

- [x] Basic project setup and structure
- [x] News management system
- [x] Responsive UI with fantasy theme
- [x] Global state management with React Context
- [x] SWR implementation for optimal data fetching
- [x] Client-side caching and background updates
- [x] Custom hooks for data management
- [x] Docker PostgreSQL database setup
- [x] Complete development environment
- [x] Image storage structure and organization
- [x] Background imagery and visual enhancements
- [x] Production-ready architecture with React + SWR
- [x] Complete user authentication system with JWT and role-based access control
- [x] Enhanced admin panel with dashboard, user management, and site settings
- [x] User profiles and role-based navigation
- [x] Advanced news management with search and filtering
- [x] Complete game information system infrastructure (backend API, database, frontend types)
- [x] Game content models (Faction, Unit, Hero, Spell) with sample faction data
- [x] SWR hooks and API services for optimal game content data fetching
- [x] Faction overview pages with professional listing and detailed faction pages
- [x] Interactive unit/hero filtering and comprehensive stat displays
- [x] Tabbed interface for faction overview, units, and heroes sections
- [x] Complete screenshot/media gallery system with category filtering and lightbox
- [x] Media management system with 6 categories and admin interface
- [x] Professional lightbox component with keyboard navigation and video support
- [ ] Game information admin interface for content management
- [ ] Comment system for news articles
- [ ] Forum/discussion system
- [ ] Google OAuth integration
- [ ] Email notifications and user engagement features

## 🤝 Contributing

This is a fan project. Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This is an unofficial fan site. All game assets, trademarks, and intellectual property belong to their respective owners.

## ⚡ Quick Development Notes

- Always update `CHANGES.md` when making modifications
- Follow the existing code conventions and patterns
- Test both backend and frontend before committing
- Use descriptive commit messages
