
# FoodieHub

FoodieHub is a full-stack food delivery web application built using the MERN stack. It allows users to browse food items, manage their cart, place orders, and securely authenticate using JWT.

## Live Demo

Frontend: https://foodie-liard-alpha.vercel.app

Backend: https://foodie-backend-yd3a.onrender.com

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes

### Food Menu

- Browse Food Items
- Search Foods
- Category Filtering
- Veg / Non-Veg Indicators
- Quantity Selection
- Wishlist

### Cart

- Add to Cart
- Remove Items
- Update Quantity
- Real-Time Price Calculation

### Orders

- Place Orders
- View Order History
- Order Status

### UI

- Fully Responsive Design
- Mobile, Tablet and Desktop Support
- Built with Tailwind CSS

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- dotenv
- CORS

## Project Structure

```text
Foodie/
├── Frontend/
│   ├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
│
├── Backend/
│   ├── Models/
│   ├── Routes/
│   ├── Middleware/
│   ├── Controllers/
│   ├── index.js
│   └── .env
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/visheshsharma0100/Foodie.git
cd Foodie
```

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file.

```env
PORT=3000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
FRONTEND_ORIGIN=http://localhost:5173
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Run the server.

```bash
npm start
```

or

```bash
node index.js
```

### Frontend

```bash
cd Frontend
npm install
```

Create a `.env` file.

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the development server.

```bash
npm run dev
```

## Production Environment

Frontend

```env
VITE_API_BASE_URL=https://foodie-backend-yd3a.onrender.com
```

Backend

```env
FRONTEND_ORIGIN=https://foodie-liard-alpha.vercel.app
```

## Future Improvements

- Online Payment Integration
- Admin Dashboard
- Order Tracking
- Coupons and Discounts
- Reviews and Ratings
- Google Authentication
- Push Notifications
- Progressive Web App (PWA)

## Developer

**Vishesh Sharma**

GitHub: https://github.com/visheshsharma0100

LinkedIn: https://www.linkedin.com/in/vishesh-sharma0100/

## Contributing

```bash
git checkout -b feature-name
git commit -m "Add feature"
git push origin feature-name
```

Create a Pull Request after pushing your branch.

## License

This project is licensed under the MIT License.
