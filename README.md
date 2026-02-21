# Herbal Hot

## Docker Deployment

To deploy the application using Docker, follow these steps:

1. Ensure you have Docker installed on your machine.
2. Clone the repository:
   ```bash
   git clone https://github.com/navanithaadhav/Herbal_Hot.git
   cd Herbal_Hot
   ```
3. Build the Docker image:
   ```bash
   docker build -t herbal-hot .
   ```
4. Run the Docker container:
   ```bash
   docker run -d -p 5000:5000 herbal-hot
   ```

## Detailed API Documentation

### User API
- **POST /api/users**: Create a new user.
- **GET /api/users/{id}**: Retrieve user details.
- **PUT /api/users/{id}**: Update user details.

### Product API
- **GET /api/products**: Get a list of products.
- **POST /api/products**: Add a new product.

### Order API
- **POST /api/orders**: Place a new order.
- **GET /api/orders/{id}**: Get order details.

## Troubleshooting/FAQ

### Q1: What to do if the application fails to start?
**A:** Ensure that all environment variables are set correctly and that you have the necessary permissions to run Docker.

### Q2: How to reset the database?
**A:** You can reset the database by running the migration commands in your setup.

### Q3: Why am I getting a CORS error?
**A:** Ensure that your API allows requests from your frontend origin.