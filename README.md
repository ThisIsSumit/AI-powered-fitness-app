# AI Powered Fitness Tracker - Microservices Application

A comprehensive fitness tracking application built with microservices architecture using Spring Boot and React. The application allows users to track their workouts, monitor progress, and get AI-powered insights to reach their fitness goals.

## 🏗️ Architecture Overview

This application follows a microservices architecture pattern with the following components:

### Backend Services
- **Eureka Server** - Service discovery and registration
- **Config Server** - Centralized configuration management
- **API Gateway** - Single entry point for all client requests with OAuth2 security
- **User Service** - User management and authentication (PostgreSQL)
- **Activity Service** - Workout and activity tracking (MongoDB)
- **AI Service** - AI-powered insights and recommendations (MongoDB)

### Frontend
- **React SPA** - Modern single-page application with Material-UI

### Infrastructure
- **Service Discovery** - Netflix Eureka
- **Configuration Management** - Spring Cloud Config
- **Message Queue** - RabbitMQ for async communication
- **Authentication** - OAuth2 with PKCE flow (Keycloak)

## 🛠️ Technology Stack

### Backend
- **Java 23** / **Java 17**
- **Spring Boot 3.4.3**
- **Spring Cloud 2024.0.0**
- **Spring Cloud Gateway**
- **Spring Data JPA** (User Service)
- **Spring Data MongoDB** (Activity & AI Services)
- **Spring Security OAuth2**
- **Spring AMQP** (RabbitMQ)
- **PostgreSQL** (User data)
- **MongoDB** (Activity and AI data)

### Frontend
- **React 19**
- **Material-UI (MUI) 6**
- **Redux Toolkit**
- **React Router 7**
- **Vite** (Build tool)
- **OAuth2 PKCE** for authentication

## 📦 Services Details

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| Eureka Server | 8761 | - | Service discovery |
| Config Server | 8888 | - | Configuration management |
| API Gateway | 8080 | - | Entry point with OAuth2 security |
| User Service | 8081 | PostgreSQL | User management |
| Activity Service | 8082 | MongoDB | Activity tracking |
| AI Service | 8083 | MongoDB | AI insights |
| Frontend | 5173 | - | React SPA |
| Keycloak | 8181 | - | OAuth2 provider |

## 🚀 Quick Start

### Prerequisites
- Java 23 (for most services) / Java 17 (for Eureka & Config Server)
- Node.js 18+
- PostgreSQL
- MongoDB
- RabbitMQ
- Keycloak Server

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness-app-microservices
```

### 2. Start Infrastructure Services

#### Start Keycloak (OAuth2 Provider)
```bash
# Download and start Keycloak on port 8181
# Configure realm: fitness-app
# Create client: oauth-pkce-client
```

#### Start Databases
```bash
# PostgreSQL (for User Service)
# MongoDB (for Activity & AI Services)
# RabbitMQ (for messaging)
```

### 3. Start Backend Services (in order)

#### 1. Eureka Server
```bash
cd eureka
./mvnw spring-boot:run
```

#### 2. Config Server
```bash
cd configserver
./mvnw spring-boot:run
```

#### 3. API Gateway
```bash
cd gateway
./mvnw spring-boot:run
```

#### 4. User Service
```bash
cd userservice
./mvnw spring-boot:run
```

#### 5. Activity Service
```bash
cd activityservice
./mvnw spring-boot:run
```

#### 6. AI Service
```bash
cd aiservice
./mvnw spring-boot:run
```

### 4. Start Frontend
```bash
cd fitness-app-frontend
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080

## 🔧 Configuration

### Environment Variables
Create the following configuration files or set environment variables:

#### Database Configuration
```yaml
# PostgreSQL (User Service)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fitness_users
    username: ${DB_USERNAME:fitness_user}
    password: ${DB_PASSWORD:password}

# MongoDB (Activity & AI Services)
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/fitness_activities
```

#### OAuth2 Configuration
```yaml
# API Gateway
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8181/realms/fitness-app
```

### Keycloak Setup
1. Create realm: `fitness-app`
2. Create client: `oauth-pkce-client`
3. Configure redirect URIs: `http://localhost:5173`
4. Enable PKCE flow

## 📱 Features

### User Management
- OAuth2 authentication with PKCE
- User profile management
- Secure JWT-based sessions

### Activity Tracking
- Create and manage workout activities
- Track exercise details and metrics
- Activity history and progress monitoring

### AI Insights
- AI-powered workout recommendations
- Progress analysis and insights
- Personalized fitness suggestions

### Modern UI/UX
- Responsive Material Design
- Real-time updates
- Progressive Web App capabilities

## 🏃‍♂️ Development

### Building the Project
```bash
# Build all services
for service in eureka configserver gateway userservice activityservice aiservice; do
  cd $service
  ./mvnw clean package
  cd ..
done

# Build frontend
cd fitness-app-frontend
npm run build
```

### Testing
```bash
# Run backend tests
./mvnw test

# Run frontend tests
cd fitness-app-frontend
npm test
```

### API Documentation
Once the services are running, API documentation is available at:
- **User Service**: http://localhost:8081/swagger-ui.html
- **Activity Service**: http://localhost:8082/swagger-ui.html
- **AI Service**: http://localhost:8083/swagger-ui.html

## 🔍 Monitoring

### Service Discovery
Access the Eureka dashboard at http://localhost:8761 to monitor service registration and health.

### Health Checks
Each service exposes health endpoints:
- http://localhost:808x/actuator/health

## 🐳 Docker Deployment

### Docker Compose (Coming Soon)
A `docker-compose.yml` file will be provided for easy containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Service Discovery Issues**
   - Ensure Eureka server is running first
   - Check network connectivity between services

2. **Authentication Issues**
   - Verify Keycloak configuration
   - Check OAuth2 client settings
   - Ensure proper redirect URIs

3. **Database Connection Issues**
   - Verify database servers are running
   - Check connection strings and credentials
   - Ensure databases are created

4. **Port Conflicts**
   - Check if required ports are available
   - Update port configurations if needed

### Logs
Check service logs for detailed error information:
```bash
# View service logs
./mvnw spring-boot:run

# Frontend logs
npm run dev
```

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Happy Fitness Tracking! 💪🏃‍♀️🏃‍♂️**
