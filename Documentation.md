# Taste Runners - Full Project Documentation

This documentation provides a comprehensive overview of the **Taste Runners** food delivery platform, covering its architecture, features, and technical implementations across the Frontend (User App), Admin Panel, and Backend API.

---

## 🏗️ 1. Architecture Overview
The project is built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with some additional tools for payments, styling, and background tasks.

- **Frontend (User Application)**: Built with React (Vite), Context API for state management, React Router for navigation, and Axios for API requests.
- **Admin Panel**: A separate React (Vite) application dedicated to restaurant management.
- **Backend API**: Node.js & Express server handling business logic, database operations, and third-party integrations.
- **Database**: MongoDB (Mongoose ORM) for storing users, foods, orders, and coupons.
- **Payments**: Stripe Checkout integration.
- **Background Jobs**: Node-cron for scheduled tasks.

---

## 🚀 2. Features Detailed Breakdown

### 🍔 A. User Application (Frontend)
The customer-facing application where users can browse food, manage their cart, and place orders.

1. **User Authentication & Session Management**:
   - JWT-based Login and Registration.
   - Persistent login state stored in `localStorage`.
   - Automatic session-expiry handling that logs users out securely.

2. **Food Catalog & Discovery**:
   - Browse food items dynamically fetched from the database.
   - Filtering by categories (e.g., Sandwich, Rolls, Salad, etc.).
   - Dietary preferences indicator (Veg / Non-Veg modes).
   - Food Recommendation System (`/recommend` endpoint) for personalized suggestions.

3. **Cart Management**:
   - Add/Remove items to/from the cart.
   - Real-time total calculation based on active flash sales and item quantities.
   - Secure server-side cart synchronization for logged-in users.

4. **⚡ Flash Sales System**:
   - Highlighted discounted items based on backend triggers.
   - Automated price calculation: Base price is slashed, and the 30% discounted price is applied in the cart.

5. **🎟️ Coupon System**:
   - Users can view active coupons and apply them at cart checkout.
   - Validates conditions: Minimum order amount, expiration date, and usage limits.
   - Supports both Flat discounts (e.g., ₹50 off) and Percentage discounts (e.g., 10% off).

6. **Order Placement & Payments**:
   - Checkout form capturing delivery address.
   - Applies a standard Delivery Fee (₹50).
   - Stripe Integration for secure card payments. Stripe handles the applied discounts automatically.
   - Order history page (`/userorders`) to track past orders.

---

### 🛡️ B. Admin Dashboard (Admin App)
A secure portal for restaurant owners or managers to control the platform.

1. **Admin Authentication**:
   - Secure login mechanism for authorized administrators.

2. **Food Inventory Management**:
   - **Add Food**: Upload food images (handled via Multer on backend), set name, description, category, veg/non-veg mode, and price.
   - **List Food**: View all available items on the menu.
   - **Remove Food**: Delete items from the database and remove the associated image from server storage.

3. **Order Management**:
   - View all incoming customer orders across the platform.
   - Update order status (e.g., Processing, Out for Delivery, Delivered).

4. **Coupon Management**:
   - Create new promotional coupons with specific rules (expiry, usage limits, discount type).
   - View coupon usage statistics.

5. **Flash Sale Manual Controls**:
   - Dedicated API endpoints allow admins to manually trigger or reset flash sales bypassing the automated cron jobs.

---

### ⚙️ C. Backend API & Background Services
The core engine powering the applications.

1. **Data Models (MongoDB / Mongoose)**:
   - `User`: Tracks name, email, encrypted password, cart data, and used coupons to prevent double usage.
   - `Food`: Tracks name, description, price, category, image path, dietary mode, and flash sale metrics (sales count, discount percentage, sale timeframe).
   - `Order`: Tracks buyer, items array, total amount, address, payment status, applied coupon, and order state.
   - `Coupon`: Tracks code, discount values, minimum order amount, validity dates, and usage limits.

2. **Cron Jobs & Automation** (`flashSaleJob.js`):
   - **Automated Trigger**: Runs daily at `8:00 PM IST`. It finds food items with less than 5 sales that day and automatically puts them on a 30% Flash Sale.
   - **Automated Reset**: Runs daily at `Midnight IST` to wipe the flash sale states and reset daily sales counts back to 0.
   - **Server Wake-up Catch**: Runs on server startup to activate the flash sale if the server was offline at 8 PM, ensuring no missed sales.

3. **Server Keep-Alive**:
   - Implements a self-ping mechanism (`/ping`) running every 14 minutes. This prevents free hosting tiers (like Render) from putting the server to sleep during inactivity.

4. **Image Handling**:
   - Utilizes `multer` for receiving multipart form data and saving images securely to the local `uploads/` directory, serving them statically via Express.

---

## 🤖 3. AI-Powered Innovations
The platform leverages state-of-the-art Generative AI (using Google Gemini models) to provide intelligent features for both customers and administrators.

### 🍽️ A. For Customers: Smart Food Recommendations
- **Endpoint**: `/api/food/recommend`
- **Model**: `gemini-3-flash-preview` (via OpenAI-compatible abstraction)
- **Functionality**: Users can get hyper-personalized food suggestions by specifying context such as dietary mode (veg/non-veg), preferred category, spice tolerance, and health goals. The AI processes these constraints and returns a structured JSON list of tailored dishes along with a short "reason" explaining why each dish fits the user's prompt.

### � B. For Admins: AI Business Analyst
- **Endpoint**: `/api/admin2/ai-sales-insights`
- **Model**: `gemini-2.5-flash` natively
- **Functionality**: Replaces manual data interpretation by analyzing raw store sales data (total revenue, average order value, total orders) over a specified date range. The AI generates a structured report containing a business summary, current sales trend (increasing/decreasing/stable), possible reasons for the trend, and actionable business recommendations.

### 💬 C. For Admins: Interactive Sales Assistant
- **Endpoint**: `/api/admin2/ai-sales-followup`
- **Model**: `gemini-2.5-flash` natively
- **Functionality**: Acts as an expert food-delivery business consultant. Admins can ask specific free-text questions about their recent performance metrics. The backend injects the aggregated sales context into the prompt, and the AI responds with short, highly contextual, and practical advice.

---

## �🛠️ 4. Environment & Deployment Setup
- **Ports**: Backend default `4000`, Frontend `Vite` defaults to `5173`.
- **Environment Variables**:
  - `PORT`: Backend server port
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Token signature key
  - `STRIPE_SECRET_KEY`: Payment gateway key
  - `GEMINI_API_KEY`: Generative AI authentication key
  - `VITE_BASE_URL`: Frontend pointer to backend API

## 📝 Future technical notes:
- The backend relies on local file storage (`/uploads`) for images. In a highly scaled production environment, this should be migrated to Cloud Storage (AWS S3, Cloudinary).
- The payment verification step uses a callback URL approach rather than a Stripe Webhook. Webhooks could provide slightly more resilience against user drop-offs post-payment.
