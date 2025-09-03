# Heroes of Might and Magic: Olden Era Fan Site

An unofficial fan site for the upcoming PC game "Heroes of Might and Magic: Olden Era". This site features news, game information, screenshots, and community features.

## 🏰 Features

- **News Management System**: Full CRUD operations for news articles with global state management
- **Global State Management**: React Context API with TypeScript for centralized state
- **Notification System**: Toast-style notifications with auto-dismiss functionality
- **Responsive Design**: Built with Tailwind CSS and custom fantasy theme with background imagery
- **Modern Tech Stack**: ASP.NET Core backend with React TypeScript frontend
- **PostgreSQL Database**: Robust data storage with Entity Framework Core
- **Image Management**: Organized storage structure for static assets and user uploads
- **Type Safety**: Full TypeScript integration with custom hooks and interfaces
- **Admin Panel**: Content management capabilities (planned)
- **Community Features**: User comments and forum discussions (planned)

## 🛠 Technology Stack

- **Backend**: ASP.NET Core 8.0
- **Frontend**: React Router v7 (modern Remix) with TypeScript and SSR ⚡
- **Database**: PostgreSQL 15 in Docker container with Entity Framework Core
- **State Management**: React Router v7 loaders with server-side data fetching
- **Styling**: Tailwind CSS v4 with custom fantasy theme and background imagery
- **Build Tool**: React Router v7 bundler
- **API**: RESTful API with Swagger documentation
- **DevOps**: Docker Compose for database containerization

## 📁 Project Structure

```
oldenerafansite/
├── backend/                 # ASP.NET Core API
│   ├── Controllers/         # API controllers
│   ├── Models/             # Data models
│   ├── Data/               # Database context
│   └── Program.cs          # Application entry point
├── frontend-remix/         # React Router v7 frontend with SSR ⚡ (ACTIVE)
│   ├── app/
│   │   ├── components/     # React Router v7 components
│   │   ├── lib/            # API services and utilities
│   │   ├── routes/         # File-based routing with loaders
│   │   └── types/          # TypeScript interfaces
│   ├── public/             # Static assets
│   └── package.json        # React Router v7 dependencies
├── frontend/               # Legacy React TypeScript frontend (DEPRECATED)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Global state management
│   │   ├── types/          # TypeScript type definitions
│   │   └── assets/images/  # Build-processed images
│   ├── public/images/      # Static image assets
│   └── package.json        # Frontend dependencies
├── database/               # Database setup scripts
│   ├── setup.sql          # Database schema and sample data
│   ├── init.sql           # Docker database initialization
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

### Frontend Setup (React Router v7) ⚡

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
cd frontend-remix
npm install
npm run dev
```

The React Router v7 frontend will be available at `http://localhost:5173` with server-side rendering.

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

### Frontend (React Router v7) ⚡
- `cd frontend-remix && npm run dev` - Start development server
- `cd frontend-remix && npm run build` - Build for production
- `cd frontend-remix && npm run start` - Start production server
- `cd frontend-remix && npm run typecheck` - TypeScript type checking

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
- [x] Global state management with React Context (legacy)
- [x] React Router v7 migration with SSR
- [x] File-based routing system
- [x] Server-side data loading with loaders
- [x] Docker PostgreSQL database setup
- [x] Complete development environment
- [x] Image storage structure and organization
- [x] Background imagery and visual enhancements
- [x] Production-ready architecture cleanup
- [ ] User authentication system
- [ ] Comment system for news articles
- [ ] Admin panel for content management
- [ ] Image gallery for screenshots
- [ ] Game information pages
- [ ] Forum/discussion system
- [ ] User profiles and community features

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
