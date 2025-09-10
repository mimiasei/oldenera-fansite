# Migration Best Practices & Schema Validation

## How to Avoid Schema-Related Migration Errors

### 1. Always Check Current Database Schema Before Creating Migrations

#### Method 1: Generate Current Schema Script
```bash
# Generate complete SQL script to see all table structures
dotnet ef migrations script > current_schema.sql

# View specific table structures
dotnet ef migrations script | grep -A 50 "CREATE TABLE \"AspNetUsers\""
```

#### Method 2: Check Applied Migrations
```bash
# List all applied migrations
dotnet ef migrations list

# Get database connection info
dotnet ef dbcontext info
```

#### Method 3: Query Model Properties Programmatically
```csharp
// In your DbContext or a test, inspect the model
var entityType = context.Model.FindEntityType(typeof(User));
var properties = entityType.GetProperties();
foreach (var prop in properties)
{
    Console.WriteLine($"Column: {prop.GetColumnName()} - Type: {prop.ClrType.Name}");
}
```

### 2. Pre-Migration Checklist

Before creating any migration that references specific columns:

1. **Read the Model Class**
   ```bash
   # Always check the actual model
   cat Models/User.cs
   ```

2. **Generate Schema Script**
   ```bash
   # See what columns actually exist
   dotnet ef migrations script | grep -A 20 "CREATE TABLE \"AspNetUsers\""
   ```

3. **Test on Fresh Database**
   ```bash
   # Create a test database to verify
   dotnet ef database drop --force
   dotnet ef database update
   ```

### 3. Migration Development Workflow

#### Step 1: Understand Current State
```bash
# Check what's currently applied
dotnet ef migrations list

# See the target model
dotnet ef migrations script --idempotent
```

#### Step 2: Validate Target Schema
```bash
# Generate script without applying
dotnet ef migrations script --from [previous-migration] --to [new-migration]
```

#### Step 3: Test Locally First
```bash
# Always test the complete migration path
dotnet ef database drop --force
dotnet ef database update

# Verify the result
dotnet ef migrations script | grep -A 30 "CREATE TABLE"
```

### 4. Production-Safe Migration Patterns

#### For Data Seeding Migrations
```csharp
// Always check existing schema in the migration
migrationBuilder.Sql(@"
    DO $$
    DECLARE 
        column_exists boolean;
    BEGIN
        -- Check if column exists before using it
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'AspNetUsers' AND column_name = 'UpdatedAt'
        ) INTO column_exists;
        
        IF column_exists THEN
            -- Use the column if it exists
            INSERT INTO ""AspNetUsers"" (..., ""UpdatedAt"") VALUES (..., NOW());
        ELSE
            -- Skip or use alternative
            INSERT INTO ""AspNetUsers"" (...) VALUES (...);
        END IF;
    END $$;
");
```

#### For Column References
```csharp
// Use information_schema to validate schema
migrationBuilder.Sql(@"
    -- Only proceed if table has expected structure
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'AspNetUsers' 
            AND column_name IN ('CreatedAt', 'LastLoginAt', 'IsActive')
        ) THEN
            -- Safe to proceed with migration
        ELSE
            RAISE EXCEPTION 'Required columns missing from AspNetUsers table';
        END IF;
    END $$;
");
```

### 5. Schema Validation Commands

#### Local Development
```bash
# Complete validation workflow
./scripts/validate-schema.sh  # (create this script)
```

#### Production Preparation
```bash
# Generate production-ready script
dotnet ef migrations script --idempotent --output production-migration.sql

# Review before applying
less production-migration.sql
```

### 6. Automated Schema Verification

Create a test that validates model-to-database alignment:

```csharp
[Test]
public void ValidateModelMatchesDatabaseSchema()
{
    using var context = new ApplicationDbContext(options);
    var userEntityType = context.Model.FindEntityType(typeof(User));
    
    // Verify all model properties have corresponding columns
    var properties = userEntityType.GetProperties();
    foreach (var property in properties)
    {
        var columnName = property.GetColumnName();
        // Query information_schema to verify column exists
        var columnExists = context.Database.SqlQueryRaw<int>(
            $"SELECT 1 FROM information_schema.columns WHERE table_name = 'AspNetUsers' AND column_name = '{columnName}'"
        ).Any();
        
        Assert.True(columnExists, $"Column {columnName} missing from database");
    }
}
```

### 7. Emergency Recovery

If a migration fails in production:

```bash
# Revert to last known good migration
dotnet ef database update [previous-migration-name]

# Fix the migration file
# Re-deploy with corrected migration
```

### 8. Documentation Requirements

Always document:
- What columns the migration expects to exist
- What the migration does at a high level  
- Any manual steps required
- Rollback procedures

## Key Takeaways

1. **Never assume column names** - Always verify against actual schema
2. **Test complete migration paths** - Not just the latest migration
3. **Use information_schema** for runtime schema validation
4. **Generate and review SQL scripts** before production deployment
5. **Have rollback plans** for every migration
6. **Document all assumptions** about database state

Following these practices will prevent schema mismatch errors and ensure reliable database deployments.