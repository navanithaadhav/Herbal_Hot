# Herbal_Hot E-Commerce Project Documentation

## Project Overview
Herbal_Hot is an e-commerce platform designed specifically for selling herbal products. The application allows users to browse through various herbal items, place orders online, and manage their accounts.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Features
- User registration and authentication
- Product listing with filtering options
- Shopping cart functionality
- Order management system
- User profile management

## Project Structure
- **/client:** Contains the frontend application using React.js
- **/server:** Contains the backend application using Node.js
- **/models:** Database schema definitions
- **/routes:** API route handlers
- **/controllers:** Business logic for handling requests

## Setup Instructions
1. Clone the repository:  
   `git clone https://github.com/navanithaadhav/Herbal_Hot.git`
2. Navigate to the server directory:  
   `cd Herbal_Hot/server`
3. Install dependencies:  
   `npm install`
4. Set up environment variables for database connection and JWT keys.
5. Start the server:  
   `npm run start`
6. Navigate to the client directory:  
   `cd ../client`
7. Install frontend dependencies:  
   `npm install`
8. Start the frontend app:  
   `npm start`

## Environment Variables
- **MONGO_URI:** MongoDB connection string  
- **JWT_SECRET:** Secret key for signing JWT tokens  
- **PORT:** Port number on which the server will run (default: 5000)

## Running the Application
1. Ensure your MongoDB server is running.
2. Run the backend server and then the frontend application.
3. Access the application at `http://localhost:3000`.

## API Documentation Outline
- **Authentication API:**  
  - POST `/api/auth/register`: User registration  
  - POST `/api/auth/login`: User login  

- **Product API:**  
  - GET `/api/products`: Get a list of products  
  - POST `/api/products`: Add a new product (Admin only) 

- **Order API:**  
  - GET `/api/orders`: Get user orders  
  - POST `/api/orders`: Create a new order

## Contributing Guidelines
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.