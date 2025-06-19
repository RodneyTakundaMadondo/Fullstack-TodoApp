# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY TodolistApp/*.csproj ./TodolistApp/
RUN dotnet restore TodolistApp/TodolistApp.csproj

# Copy everything else and build
COPY . .
WORKDIR /src/TodolistApp
RUN dotnet publish -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "TodolistApp.dll"]
