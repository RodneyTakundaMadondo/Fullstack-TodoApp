# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy .csproj and restore dependencies
COPY TodolistApp/*.csproj ./TodolistApp/
RUN dotnet restore ./TodolistApp/TodolistApp.csproj

# Copy everything and publish
COPY . .
WORKDIR /src/TodolistApp
RUN dotnet publish -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Set ASP.NET Core to use port 10000 (Render expects a known port)
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Copy published output
COPY --from=build /app/publish .

# Launch app
ENTRYPOINT ["dotnet", "TodolistApp.dll"]
