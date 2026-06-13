# syntax=docker/dockerfile:1

# ---- Stage 1: Build ----
# Use a Maven image with JDK 21 to compile and package the application.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the Maven descriptor first and pre-fetch dependencies. This layer is
# cached as long as pom.xml does not change, so rebuilds are fast.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source and build the jar. Tests are skipped here — CI runs them.
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Stage 2: Run ----
# Use a slim JRE image for the final artifact — smaller and more secure than
# carrying the full JDK and Maven into production.
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Run as a non-root user.
RUN groupadd --system javacup && useradd --system --gid javacup javacup

# Copy only the built jar from the build stage.
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

USER javacup

# Render provides the port via the PORT environment variable. Spring Boot is
# configured to read it (see note below). Expose 8080 as the documented default.
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
