# Stage 1: Build the Vite Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
# Install dependencies first for caching
COPY frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend source
COPY frontend/ ./
# Build the frontend, passing an empty VITE_API_URL so axios dynamically resolves to the relative host (the Spring app itself)
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-build
WORKDIR /app/backend
# Copy POM and download dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
# Copy backend source
COPY backend/src ./src
# Create the static resources folder dynamically to house the injected React app
RUN mkdir -p src/main/resources/static
# Inject the built React SPA directly into Spring Boot's static asset directory
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/
# Package the application into a unified executable JAR
RUN mvn clean package -DskipTests

# Stage 3: Production Runtime Environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Extract the monolithic jar from the build stage
COPY --from=backend-build /app/backend/target/*.jar app.jar
# Expose default HTTP Port 
EXPOSE 8080
# Run the robust, unified Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
