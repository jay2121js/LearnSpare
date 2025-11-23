# ────────────────
# Stage 1: Build React frontend (Vite)
# ────────────────
FROM node:18-slim AS frontend
WORKDIR /frontend
COPY learnsphere-vite/package*.json ./
RUN npm ci  # includes dev dependencies by default
COPY learnsphere-vite/ ./
RUN npm run build

# ────────────────
# Stage 2: Build Spring Boot backend
# ────────────────
FROM maven:3.8.5-openjdk-17-slim AS backend
WORKDIR /app
COPY Backend/pom.xml ./Backend/
RUN mvn -f Backend/pom.xml dependency:go-offline
COPY Backend/ ./Backend/
COPY --from=frontend /frontend/dist/ ./Backend/src/main/resources/static/
RUN mvn clean package -f Backend/pom.xml -DskipTests

# ────────────────
# Stage 3: Runtime Image
# ────────────────
FROM openjdk:17-jdk-slim
WORKDIR /app

# Optional: Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from backend stage
COPY --from=backend /app/Backend/target/*.jar app.jar

# Use the dynamic PORT for platforms like Render
ENV PORT=8080
EXPOSE 8080

# Healthcheck (optional for platforms that use it)
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:${PORT} || exit 1

# Run the app
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
  # Build with Docker Hub tag

