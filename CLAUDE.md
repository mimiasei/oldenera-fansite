# Heroes of Might and Magic: Olden Era Fan Site

## Project Overview
This is a fan site for the upcoming PC game "Heroes of Might and Magic: Olden Era". The site will contain news, game information, screenshots, and community features.

## Technology Stack
- **Backend**: ASP.NET Core (latest version)
- **Frontend**: React.js with TypeScript
- **Database**: PostgreSQL
- **CSS Framework**: Tailwind CSS
- **Build Tool**: Vite (for React frontend)

## Project Structure
```
oldenerafansite/
├── backend/                 # ASP.NET Core API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   └── Program.cs
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   └── package.json
├── database/               # Database scripts and migrations
├── CHANGES.md             # Track all changes
└── README.md
```

## Development Commands

### Backend (ASP.NET Core)
- `dotnet run` - Start development server
- `dotnet build` - Build the project
- `dotnet test` - Run tests
- `dotnet ef database update` - Apply database migrations

### Frontend (React + Vite)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

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
- PostgreSQL database for storing news, game info, and user data
- Entity Framework Core for ORM
- Migrations for database schema changes

## Notes
- This is an unofficial fan site
- All game assets and trademarks belong to their respective owners
- Always ask user before running sudo commands