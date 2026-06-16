FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# solution and project files first for better caching
COPY ["api.slnx", "."]
COPY ["api/Domain/Domain.csproj", "api/Domain/"]
COPY ["api/Entrypoint/Entrypoint.csproj", "api/Entrypoint/"]
COPY ["api/Infrastructure/Infrastructure.csproj", "api/Infrastructure/"]
COPY ["api/Service/Service.csproj", "api/Service/"]
COPY ["tests/Tests.csproj", "tests/"]

# Restore dependencies
RUN dotnet restore "api.slnx"

# Copy the rest of the source code
COPY . .

# Build and publish
WORKDIR "/src/api/Entrypoint"
RUN dotnet publish "Entrypoint.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Entrypoint.dll"]
