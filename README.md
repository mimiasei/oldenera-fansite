# Heroes of Might and Magic: Olden Era Fan Site

An unofficial fan site for the upcoming PC game "Heroes of Might and Magic: Olden Era". This site features news, game information, screenshots, and community features.

## 🏰 Features

### Core Systems (Production Ready)
- **Complete User Authentication System**: JWT-based authentication with role management, fantasy avatar selection (56 themed portraits), and comprehensive UX
- **Enhanced Admin Panel**: Complete dashboard with user management, statistics, and administrative controls
- **Professional Game Information System**: Full faction browsing, detailed unit/hero pages with filtering, and comprehensive game content database
- **Media Gallery System**: Professional screenshot gallery with 6 categories, lightbox viewer with fullscreen support, and comprehensive admin management interface
- **Community Forum Integration**: Optimized Disqus-powered forum system with streamlined UX and immediate access to discussions
- **Professional Loading Skeleton System**: Comprehensive skeleton components across all pages for enhanced user experience
- **Universal Admin Edit Shortcuts**: Quick-access edit buttons throughout the site for administrators and moderators
- **WebP Thumbnail Optimization**: Modern image format implementation with 25-50% file size reduction, dual-format serving (WebP + JPEG), and CLI management tools
- **Complete Thumbnail Sync System**: Automated GitHub Actions deployment pipeline with native JSON parsing, intelligent error handling, and seamless production sync
- **Hybrid Batch Thumbnail Processing**: Intelligent 60-minute batch sync system with manual admin triggers, GitHub Actions deployment, and cost-optimized architecture
- **Complete Game Asset Management System**: Professional admin interface for managing all game assets (factions, units, heroes, spells) with inline editing, batch operations, and comprehensive validation
- **Advanced Admin Workflow**: Intuitive batch editing system with local-only changes, Save/Revert controls, and inline validation replacing popup dialogs
- **Responsive Table Design**: Fully responsive asset management tables with intelligent column sizing, icon-based actions, and professional dropdown components

### Technical Excellence
- **Production-Ready Deployment**: Fully deployed with automatic database migrations, environment detection, and API connectivity
- **Robust Database Management**: PostgreSQL with Entity Framework Core, secure admin seeding, and schema validation tools
- **Smart Environment Configuration**: Automatic API endpoint detection (local ↔ production) with CORS policy management
- **Migration Safety System**: Comprehensive schema validation tools, automated checking scripts, and error prevention guidelines
- **Type-Safe Development**: Complete TypeScript coverage with strict mode compliance throughout
- **Modern Performance**: SWR data fetching for optimal caching, Vite build optimization, and responsive design

### User Experience
- **Fantasy-Themed Design**: Custom Tailwind CSS theme with Heroes of Might and Magic aesthetic
- **Fully Responsive Interface**: Professional mobile navigation with hamburger menu, overlay system, and touch-friendly interactions
- **Enhanced Loading States**: Professional skeleton animations eliminating jarring transitions across all components
- **Optimized Content Layout**: Streamlined page designs focusing on core functionality and eliminating UI bloat
- **Mobile-First Navigation**: Responsive hamburger menu with smooth animations, body scroll lock, and keyboard accessibility
- **Interactive Content**: Tabbed interfaces, filtering systems, and comprehensive game content presentation
- **Secure Authentication**: Production-grade password requirements, account lockout protection, and proper hash management

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

### CLI Tools (Production Management)
- `dotnet run -- regenerate-thumbnails` - Generate WebP thumbnails for all media
- `dotnet run -- regenerate-thumbnails --force` - Force regenerate all thumbnails
- `dotnet run -- regenerate-thumbnails --id 123` - Regenerate specific media item
- `dotnet run -- list-media` - Show media items missing WebP thumbnails
- `dotnet run -- list-media --all` - Show all media items with thumbnail status
- `dotnet run -- cleanup-thumbnails --dry-run` - Preview orphaned thumbnail cleanup
- `dotnet run -- cleanup-thumbnails` - Remove orphaned thumbnail files

### Admin Dashboard Features
- **Manual Thumbnail Sync**: Admin dashboard includes "Sync Thumbnails" button for immediate GitHub Actions deployment
- **Intelligent Batch Processing**: Background service processes thumbnails every 60 minutes with manual trigger support
- **Sync Status Monitoring**: Real-time feedback on pending thumbnails, sync success, and next scheduled sync
- **Timer Reset Logic**: Manual triggers reset the 60-minute auto-sync timer for optimal cost efficiency

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
- [x] Media management system with 6 categories and comprehensive admin interface
- [x] Professional lightbox component with keyboard navigation, video support, and fullscreen viewing
- [x] Universal admin edit shortcuts with seamless content management workflow
- [x] Complete media item editing system with metadata management
- [x] Community forum implementation with Disqus integration and UX optimization
- [x] WebP thumbnail optimization system with modern image format support
- [x] CLI command system for production thumbnail management and maintenance
- [x] Progressive image enhancement with HTML5 picture element and automatic fallbacks
- [x] Hybrid batch processing system with 60-minute intervals and manual admin triggers
- [x] GitHub Actions integration for automated thumbnail deployment with cost optimization
- [x] Intelligent sync scheduling with timer reset logic and comprehensive admin controls
- [x] Complete game asset management system with inline editing and batch operations
- [x] Advanced admin interface for factions, units, heroes, and spells with comprehensive validation
- [x] Responsive table design with intelligent column sizing and professional dropdown components
- [x] Batch editing workflow with Save/Revert controls and local-only new asset creation
- [x] Inline validation system replacing popup dialogs with hover tooltips and visual indicators
- [ ] Enhanced game asset filtering and search capabilities
- [ ] Bulk import/export functionality for game assets
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
