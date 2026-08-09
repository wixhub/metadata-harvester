# Ecological Metadata Harvester - Backend

Enterprise-grade backend service for scientific data pipeline and metadata repository system (integrating with Movebank and Darwin Core standards), built with Java 21, Spring Boot, and PostgreSQL.

---

## Tech Stack

- **Java 21 (LTS)**
- **Spring Boot** (Web, Data JPA)
- **PostgreSQL** (Hosted via Neon / Docker)
- **Flyway** (Database migrations)
- **Springdoc OpenAPI / Swagger** (API documentation)

---

## Project Structure

```text
backend/
├── src/main/java/com/e_science/harvester/
│   ├── controller/      # REST API endpoints (IngestionController.java)
│   ├── model/           # JPA Entities (Dataset.java, ProvenanceLog.java)
│   ├── repository/      # Spring Data JPA interfaces
│   ├── service/         # Core business logic & parsing (IngestionService.java)
│   └── BackendApplication.java
├── src/main/resources/
│   ├── db/migration/    # Flyway SQL scripts (V1__init_schema.sql)
│   └── application.yml  # Application configuration
├── Dockerfile           # Multi-stage production container configuration
└── pom.xml              # Maven dependencies and build setup
```

## Getting Started Locally

1. Prerequisites

- Java 21 installed
- Maven installed (or use included Maven wrapper)
- PostgreSQL running locally or remote URL (e.g., Neon Postgres)

2. Environment Variables

Configure your database connection in src/main/resources/application.yml or set environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/harvester_db
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
```

3. Run the Application

Navigate to the backend/ directory and run:

```bash
mvn spring-boot:run
```

The application will start on port 8080.

## API Documentation

Once the application is running, you can access the interactive Swagger UI documentation at:

👉 http://localhost:8080/swagger-ui/index.html

## Deployment (Render)

1. Create a new Web Service on Render pointing to your repository.

2. Set Root Directory to backend.

3. Set Environment to Docker.

4. Add Environment Variables (SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD).
