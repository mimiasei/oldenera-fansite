# Heroes of Might and Magic: Olden Era Fan Site

An unofficial fan site for the upcoming PC game "Heroes of Might and Magic: Olden Era". This site features news, game information, screenshots, and community features.

## 🏰 Features

- **News Management System**: Full CRUD operations for news articles
- **Responsive Design**: Built with Tailwind CSS and fantasy-themed styling
- **Modern Tech Stack**: ASP.NET Core backend with React TypeScript frontend
- **PostgreSQL Database**: Robust data storage with Entity Framework Core
- **Admin Panel**: Content management capabilities (planned)
- **Community Features**: User comments and discussions (planned)

## 🛠 Technology Stack

- **Backend**: ASP.NET Core 8.0
- **Frontend**: React 18 with TypeScript
- **Database**: PostgreSQL with Entity Framework Core
- **Styling**: Tailwind CSS with custom fantasy theme
- **Build Tool**: Vite
- **API**: RESTful API with Swagger documentation

## 📁 Project Structure

```
oldenerafansite/
├── backend/                 # ASP.NET Core API
│   ├── Controllers/         # API controllers
│   ├── Models/             # Data models
│   ├── Data/               # Database context
│   └── Program.cs          # Application entry point
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   └── package.json        # Frontend dependencies
├── database/               # Database setup scripts
│   ├── setup.sql          # Database schema and sample data
│   └── README.md          # Database setup instructions
├── CHANGES.md             # Change log
└── CLAUDE.md              # Project instructions
```

## 🚀 Quick Start

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 12+](https://www.postgresql.org/download/)

### Database Setup

1. Install and start PostgreSQL
2. Create database and user:
   ```sql
   CREATE DATABASE oldenerafansite;
   CREATE USER oldenerauser WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE oldenerafansite TO oldenerauser;
   ```
3. Run setup script:
   ```bash
   psql -U postgres -d oldenerafansite -f database/setup.sql
   ```
4. Update connection string in `backend/appsettings.json`

### Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

The API will be available at `https://localhost:5001` with Swagger documentation.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🧪 Development Commands

### Backend
- `dotnet run` - Start development server
- `dotnet build` - Build the project
- `dotnet test` - Run tests
- `dotnet ef database update` - Apply database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

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
- [ ] User authentication system
- [ ] Comment system for news articles
- [ ] Admin panel for content management
- [ ] Image gallery for screenshots
- [ ] Game information pages
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
