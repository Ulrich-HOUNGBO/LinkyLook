# Docker Setup for Linklyst

This guide explains how to use Docker to run the Linklyst application and its dependencies.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd linklysts
   ```

2. Create a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

3. Modify the `.env` file with your desired configuration.

4. (Optional) Run the test script to verify your Docker setup:

   **For Linux/macOS:**
   ```bash
   # Make the script executable
   chmod +x docker-test.sh

   # Run the test
   ./docker-test.sh
   ```

   **For Windows (PowerShell):**
   ```powershell
   # Run the test
   .\docker-test.ps1
   ```

   These scripts will check if Docker and Docker Compose are installed, create a `.env` file if needed, start the containers, and verify that all services are running correctly.

## Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
docker-compose up
```

This will start the following services:
- NestJS API on port 3000
- PostgreSQL on port 5432
- MongoDB on port 27017

### Production Mode

To run the application in production mode:

1. Build the production Docker image:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

2. Run the production stack:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Database Migrations

To run database migrations inside the Docker container:

```bash
docker-compose exec api pnpm run migration:run
```

To create a new migration:

```bash
docker-compose exec api pnpm run migration:create -- migrations/MigrationName
```

To generate a migration based on entity changes:

```bash
docker-compose exec api pnpm run migration:generate -- migrations/MigrationName
```

## Accessing Services

- API: http://localhost:3000
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017

## Stopping the Application

To stop the application:

```bash
docker-compose down
```

To stop the application and remove volumes (this will delete all data):

```bash
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues

If the API service fails to connect to the database, it might be because the database service hasn't fully started yet. You can try restarting the API service:

```bash
docker-compose restart api
```

### Volume Permissions

If you encounter permission issues with volumes, you might need to adjust the permissions:

```bash
sudo chown -R $USER:$USER ./postgres_data
sudo chown -R $USER:$USER ./mongodb_data
```

### Logs

To view logs for a specific service:

```bash
docker-compose logs api
docker-compose logs postgres
docker-compose logs mongodb
```

To follow logs in real-time:

```bash
docker-compose logs -f api
```
