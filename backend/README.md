# Ecological Metadata Harvester - Backend

Enterprise-grade backend service for scientific data pipeline and metadata repository system (integrating with Movebank, Darwin Core standards and DSpace repository), built with Java 21, Spring Boot, WebFlux and PostgreSQL.

---

## Tech Stack

- **Java 21 (LTS)**
- **Spring Boot** (Web, WebFlux, Data JPA)
- **PostgreSQL** (Hosted via Neon / Docker)
- **Flyway** (Database migrations)
- **Springdoc OpenAPI / Swagger** (API documentation)

---

## Project Structure

```text
backend/
├── src/main/java/com/e_science/harvester/
│   ├── config/          # Configuration classes (WebConfig.java)
│   ├── controller/      # REST API endpoints (IngestionController.java, etc.)
│   ├── exception/       # Global exception handlers
│   ├── model/           # JPA Entities (Dataset.java, ProvenanceLog.java)
│   ├── repository/      # Spring Data JPA interfaces
│   ├── service/         # Business logic, strategies & DSpace integration
│   └── BackendApplication.java
├── src/main/resources/
│   ├── db/migration/    # Flyway SQL scripts (V1__init_schema.sql)
│   └── application.yml  # Application configuration
├── Dockerfile           # Multi-stage production container configuration
└── pom.xml              # Maven dependencies and build setup
```

---

## Getting Started Locally

### Prerequisites

- Java 21 installed

- Maven installed (or use included Maven wrapper)

- PostgreSQL running locally or remote URL (e.g., Neon Postgres)

### Environment Variables

Configure your database connection and DSpace integration in src/main/resources/application.yml or set environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/harvester_db
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password

# Optional: DSpace API configuration (Defaults to Mock mode locally)
export DSPACE_API_URL=https://your-dspace-instance/server/api
export DSPACE_API_TOKEN=your_token
```

### Run the Application

Navigate to the backend/ directory and run:

```bash
mvn spring-boot:run
```

The application will start on port 8080 using the local mock profile by default.

## API Documentation

Once the application is running, you can access the interactive Swagger UI documentation at:

👉 http://localhost:8080/swagger-ui/index.html

👉 https://metadata-harvester-backend.onrender.com/swagger-ui/index.html

![Cron job status](https://api.cron-job.org/jobs/8301153/c57997217bc5800b/status-1.svg)

## Deployment (Render)

1. Create a new Web Service on Render pointing to your repository.

2. Set Root Directory to backend.

3. Set Environment to Docker.

4. Add Environment Variables in the Render Dashboard:

- SPRING_DATASOURCE_URL

- SPRING_DATASOURCE_USERNAME

- SPRING_DATASOURCE_PASSWORD

- SPRING_PROFILES_ACTIVE = dspace-prod (optional, to switch from mock to real DSpace integration)

- DSPACE_API_URL (required if using real DSpace)

- DSPACE_API_TOKEN (required if using real DSpace)
