#!/bin/bash

# Schema Validation Script for Migration Development
# Run this before creating or modifying migrations

set -e

echo "=== Migration Schema Validation ==="

# Check if we're in the backend directory
if [[ ! -f "OldenEraFanSite.Api.csproj" ]]; then
    echo "❌ Error: Run this script from the backend directory"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Checking current migrations...${NC}"
dotnet ef migrations list

echo -e "\n${BLUE}2. Generating current schema script...${NC}"
dotnet ef migrations script > current_schema.sql
echo "✅ Schema saved to current_schema.sql"

echo -e "\n${BLUE}3. Extracting AspNetUsers table structure...${NC}"
echo -e "${YELLOW}Current AspNetUsers columns:${NC}"
grep -A 30 "CREATE TABLE \"AspNetUsers\"" current_schema.sql | grep -E '^\s*"[^"]+"\s+\w+' | sed 's/^\s*/  /'

echo -e "\n${BLUE}4. Checking User model properties...${NC}"
echo -e "${YELLOW}User model properties (from C# code):${NC}"
grep -E '^\s*public\s+\w+.*\{\s*get;\s*set;\s*\}' Models/User.cs | sed 's/^\s*/  /' || echo "  Could not read User.cs"

echo -e "\n${BLUE}5. Testing database connection...${NC}"
if dotnet ef dbcontext info > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo -e "${RED}❌ Database connection failed${NC}"
fi

echo -e "\n${BLUE}6. Validating migration consistency...${NC}"
# Check if local database matches migrations
if dotnet ef migrations list --no-connect | grep -q "(Applied)"; then
    echo "✅ Migrations are applied"
else
    echo -e "${YELLOW}⚠️  Some migrations may not be applied locally${NC}"
fi

echo -e "\n${GREEN}=== Schema Validation Complete ===${NC}"
echo -e "${YELLOW}Before creating migrations:${NC}"
echo "  1. Review current_schema.sql for exact column names"
echo "  2. Verify User.cs matches actual database structure"
echo "  3. Test migration on fresh database with: dotnet ef database drop --force && dotnet ef database update"
echo "  4. Always use column names from current_schema.sql, not assumptions"

# Cleanup
rm -f current_schema.sql