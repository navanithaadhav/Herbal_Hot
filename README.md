# Herbal Hot

## Project Overview
Herbal Hot is an innovative solution aimed at promoting wellness through herbal remedies. Our platform provides users with access to a variety of herbal products along with detailed information and usage guidelines.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker
- **Deployment**: Heroku

## Features
- User authentication
- Browse and search herbal products
- Detailed product descriptions and user guides
- User reviews and ratings
- Admin panel for product management

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/navanithaadhav/Herbal_Hot.git
   cd Herbal_Hot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root of the project:
   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Run the application:
   ```bash
   npm start
   ```

## Docker Deployment
To deploy the Herbal Hot application using Docker, follow these steps:
1. Build the Docker image:
   ```bash
   docker build -t herbal-hot .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 5000:5000 herbal-hot
   ```
   The application will be accessible at `http://localhost:5000`.

## Detailed API Documentation
- **GET /api/products**: Retrieve all herbal products.
- **GET /api/products/:id**: Retrieve a specific product by ID.
- **POST /api/products**: Add a new product (Admin only).
- **PUT /api/products/:id**: Update a product (Admin only).
- **DELETE /api/products/:id**: Delete a product (Admin only).

## Troubleshooting
- If the application does not start, ensure all dependencies are installed and environment variables are correctly set.
- Check your MongoDB connection string and permissions.
- For any issues related to API calls, use tools like Postman to test endpoints and inspect responses.

## License
This project is licensed under the MIT License.