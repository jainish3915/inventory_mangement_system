# Inventory Management System

A complete Inventory Management System built with **Node.js (Express.js)**, **MongoDB (Mongoose)**, and **Vanilla JavaScript** frontend.

---

## Features

- **Add Product** — Create new products with name, price, quantity, and category
- **Update Product** — Edit existing product details inline
- **Delete Product** — Remove products with confirmation dialog
- **View All Products** — Display all products in a responsive table
- **Search Products** — Search by product name (case-insensitive)
- **Low Stock Alert** — Automatic warning when product quantity is below 5

---

## Project Folder Structure

```
inventory_mangement_system/
├── public/                    # Frontend (static files)
│   ├── css/
│   │   └── style.css          # Styles & responsive design
│   ├── js/
│   │   └── app.js             # Frontend logic (fetch API calls)
│   └── index.html             # Main HTML page
├── src/                       # Backend (MVC pattern)
│   ├── config/
│   │   └── db.js              # MongoDB connection config
│   ├── controllers/
│   │   └── productController.js  # Business logic for products
│   ├── middlewares/
│   │   ├── errorHandler.js    # Global error handling middleware
│   │   └── validate.js        # Input validation middleware
│   ├── models/
│   │   └── Product.js         # Mongoose schema & model
│   ├── routes/
│   │   └── productRoutes.js   # RESTful API routes
│   └── server.js              # Express app entry point
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies & scripts
└── README.md                  # Project documentation
```

---

## Tech Stack

| Layer      | Technology           |
| ---------- | -------------------- |
| Backend    | Node.js, Express.js  |
| Database   | MongoDB, Mongoose    |
| Frontend   | HTML, CSS, Vanilla JS|
| Validation | express-validator    |

---

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud — e.g., MongoDB Atlas)
- **npm** (comes with Node.js)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jainish3915/inventory_mangement_system.git
   cd inventory_mangement_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and update the MongoDB connection string:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory_db
   ```
   > For MongoDB Atlas, use your connection string:
   > `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory_db`

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

---

## Run Commands

### Development (with auto-restart)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start at **http://localhost:5000**

---

## API Endpoints

| Method   | Endpoint                    | Description              |
| -------- | --------------------------- | ------------------------ |
| `GET`    | `/api/products`             | Get all products         |
| `GET`    | `/api/products/:id`         | Get product by ID        |
| `POST`   | `/api/products`             | Create a new product     |
| `PUT`    | `/api/products/:id`         | Update a product         |
| `DELETE` | `/api/products/:id`         | Delete a product         |
| `GET`    | `/api/products/search?q=`   | Search products by name  |
| `GET`    | `/api/products/low-stock`   | Get low stock products   |

### Example Request Body (POST/PUT)

```json
{
  "name": "Wireless Mouse",
  "price": 29.99,
  "quantity": 50,
  "category": "Electronics"
}
```

### Example Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "name": "Wireless Mouse",
    "price": 29.99,
    "quantity": 50,
    "category": "Electronics",
    "createdAt": "2026-04-08T...",
    "updatedAt": "2026-04-08T..."
  }
}
```

---

## MongoDB Schema

```javascript
{
  name:     { type: String, required: true, trim: true, maxlength: 100 },
  price:    { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, integer: true },
  category: { type: String, required: true, trim: true, maxlength: 50 },
  createdAt: { type: Date, auto: true },
  updatedAt: { type: Date, auto: true }
}
```

---

## License

MIT
