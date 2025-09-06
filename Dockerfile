# build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/*.csproj ./backend/
RUN dotnet restore ./backend
COPY backend/. ./backend
RUN dotnet publish ./backend -c Release -o /app

# run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
# Render setter $PORT. Appen må lytte på 0.0.0.0:$PORT (løses i Program.cs)
ENTRYPOINT ["dotnet","OldenEraFanSite.Api.dll"]
