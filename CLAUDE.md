# Heroes of Might and Magic: Olden Era Fan Site

## Project Overview
This is a fan site for the upcoming PC game "Heroes of Might and Magic: Olden Era". The site will contain news, game information, screenshots, and community features.

## Technology Stack
- **Backend**: ASP.NET Core 8.0
- **Frontend**: React 18 with Vite and TypeScript
- **Data Fetching**: SWR (Stale-While-Revalidate) for client-side caching
- **Database**: PostgreSQL 15 in Docker container
- **CSS Framework**: Tailwind CSS v3 with custom fantasy theme
- **Build Tool**: Vite for fast development and optimized builds
- **DevOps**: Docker Compose for containerization

## Project Structure
```
oldenerafansite/
├── backend/                 # ASP.NET Core API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   └── Program.cs
├── frontend/               # React + Vite frontend with SWR (ACTIVE)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/         # SWR custom hooks
│   │   ├── services/      # API services
│   │   └── types/
│   ├── public/
│   └── package.json
├── database/               # Database setup scripts
│   ├── setup.sql
│   └── init.sql           # Docker initialization
├── docker-compose.yml      # PostgreSQL container
├── CHANGES.md             # Track all changes
└── README.md
```

## Development Commands

### Database (Docker)
- `docker-compose up -d postgres` - Start PostgreSQL container
- `docker-compose down` - Stop containers
- `docker ps` - Check running containers

### Backend (ASP.NET Core)
- `dotnet run` - Start development server (requires PostgreSQL running)
- `dotnet build` - Build the project
- `dotnet test` - Run tests

### Frontend (React + SWR)
- `cd frontend && npm run dev` - Start development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run lint` - Run ESLint
- `cd frontend && npm run type-check` - TypeScript type checking

### Complete Development Setup
1. `docker-compose up -d postgres` - Start database
2. `cd backend && dotnet run` - Start API server
3. `cd frontend && npm run dev` - Start frontend

## Features to Implement
1. News management system
2. Game information pages
3. Screenshot/media gallery
4. User comments system
5. Admin panel for content management
6. Responsive design with Tailwind CSS

## Git Workflow
- Commit after major changes
- Keep CHANGES.md updated with all modifications
- Use descriptive commit messages

## Database
- PostgreSQL 15 in Docker container for development
- Entity Framework Core for ORM
- Automatic database initialization with sample data
- Docker volume for persistent data storage

## Notes
- This is an unofficial fan site
- All game assets and trademarks belong to their respective owners
- Always ask user before running sudo commands
- always update todo file after finishing sub-tasks or complete sections
- when updating changes file for anything major, also update root readme file.
- whenever using the classes btn-primary or btn-secondary, always use the class btn first like this: className="btn btn-primary"
- when I say "update files" then update the todo, changes and root readme files.
- when I say "do git" then commit and push
- by "read files" I mean read the claude, changes and todo files