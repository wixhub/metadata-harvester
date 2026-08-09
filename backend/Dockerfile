# --- Build Stage ---
FROM maven:3.9.9-eclipse-temurin-21-slim AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# --- Run Stage ---
FROM eclipse-temurin:21.0.5_11-jre-slim
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create non-root user for security
RUN addgroup --gid 1000 appuser || true \
    && adduser --uid 1000 --gid 1000 --disabled-password --gecos "" appuser || true
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]