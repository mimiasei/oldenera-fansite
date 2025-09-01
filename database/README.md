# Database Setup

## PostgreSQL Setup Instructions

### 1. Install PostgreSQL
Make sure PostgreSQL is installed on your system. You can download it from [postgresql.org](https://www.postgresql.org/download/).

### 2. Create Database and User
Connect to PostgreSQL as a superuser and run:

```sql
CREATE DATABASE oldenerafansite;
CREATE USER oldenerauser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE oldenerafansite TO oldenerauser;
```

### 3. Run Setup Script
Execute the setup script to create tables and insert sample data:

```bash
psql -U postgres -d oldenerafansite -f setup.sql
```

### 4. Update Connection String
Update the connection string in `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=oldenerafansite;Username=oldenerauser;Password=your_secure_password"
  }
}
```

### 5. Environment Variables (Optional)
For production, consider using environment variables for the connection string:

```bash
export ConnectionStrings__DefaultConnection="Host=localhost;Database=oldenerafansite;Username=oldenerauser;Password=your_secure_password"
```

## Entity Framework Migrations

Once .NET is installed, you can use Entity Framework migrations:

```bash
# Create migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

## Sample Data

The setup script includes sample news articles to help you get started with the application.