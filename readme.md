# 🛒 E-Commerce API

## **Overview**

The **E-Commerce API** is a robust backend system designed for managing an online shopping platform. It includes features such as user authentication, product management, cart functionality, and order processing. Built with **Node.js**, **Express.js**, and **Sequelize**, this API supports PostgreSQL/MySQL databases and ensures secure operations using JWT-based authentication.

---

## **Features**

- 🛍️ **Product Management**: Add, update, delete, and retrieve products.
- 🛒 **Cart Functionality**: Add items to the cart, update quantities, and view cart contents.
- 📦 **Order Management**: Place orders, track order history, and view order details.
- 🔐 **Authentication & Authorization**: Secure access using JWT.
- 📊 **Database Integration**: Seamless support for PostgreSQL/MySQL.

---

## **Getting Started**

### **1. Prerequisites**

Ensure you have the following installed:

- **Node.js**: v14 or higher.
- **npm**: v6 or higher.
- **PostgreSQL/MySQL**: Properly set up on your machine or a remote server.

---

### **2. Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<YourUsername>/<YourRepository>.git
   cd <YourRepository>
   ```

### **3. Install Dependencies**

Navigate to the project directory and install the required Node.js dependencies:

    npm install

### **4.Set Up Environment Variables**

Create a file named config.env in the root directory of the project and configure it as follows:

    DATABASE_URI=your_database_uri
    DATABASE_USER=your_database_username
    DATABASE_PASSWORD=your_database_password

    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=7d
    PORT=3000

    Example:

    DATABASE_URI=postgres://localhost:5432/ecommerce_db
    DATABASE_USER=admin
    DATABASE_PASSWORD=securepassword

    JWT_SECRET=myultrasecretjwtkey
    JWT_EXPIRES_IN=7d
    PORT=3000

    Replace your_database_uri, your_database_username, your_database_password, and other placeholders with your specific values.

### **5.Start the Server**

Start the application by running:

    npm start

    The server will be accessible at http://localhost:3000 (or the port you configured in config.env).

### **6-API Endpoints**

### Authentication

Method Endpoint Description

    POST /auth/register Register a new user
    POST /auth/login Log in and receive a JWT token

### Products

Method Endpoint Description

    GET /products Get all products
    POST /products Add a new product
    PUT /products/:id Update an existing product
    DELETE /products/:id Delete a product

### Cart

Method Endpoint Description

    GET /cart View items in the cart
    POST /cart Add a product to the cart
    PUT /cart/:id Update cart item quantity
    DELETE /cart/:id Remove an item from the cart

### Orders

Method Endpoint Description

    POST /orders Place an order from the cart
    GET /orders View all orders (Buyer only)
    GET /orders/:id View specific order details

### **Technologies Used**

    Node.js: Backend runtime.
    Express.js: Framework for building APIs.
    Sequelize: ORM for interacting with the database.
    PostgreSQL/MySQL: Relational database management systems.
    JWT: Secure user authentication.

License

This project is licensed under the MIT License.
Author

### Documentation in PostMan

https://documenter.getpostman.com/view/39411593/2sAYBRFZ3J

💻 Crafted by SeriousCharProgrammer 🚀
