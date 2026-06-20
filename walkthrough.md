# Walkthrough - GiftCorner Gifts Platform

GiftCorner is fully implemented, verified, and builds successfully. Below is the comprehensive guide designed to prepare both team members for their **Project Viva & Review**.

---

## 🚀 How to Run the Project

To run both the backend mock database and frontend React application, execute the following commands in your workspace terminal:

### 1. Start the Backend API (JSON Server)
Starts the backend database on port `5000` to serve products, handle users, and record checkouts.
```bash
npm run server
```

### 2. Start the Frontend Dev Server
In a separate terminal window, start the React application:
```bash
npm run dev
```

Open your browser at the displayed local URL (typically `http://localhost:5174` or `http://localhost:5173`).

---

## 📂 Folder Structure

The project follows a standard modular React architecture:

```text
Gift corner/
├── index.html                   # Main HTML template & SEO entry point
├── package.json                 # Project dependencies & scripts
├── db.json                      # JSON database (Users, Products, Cart, Orders)
├── src/
├── main.jsx                     # Application entry point
├── App.jsx                      # Root layout provider configuration
├── index.css                    # Global glassmorphic styling system
├── App.css                      # Style reset
├── components/                  # Reusable Shared Components
│   ├── Navbar.jsx               # Header navigation
│   ├── Footer.jsx               # Brand footer
│   ├── ProductCard.jsx          # Individual product display card
│   ├── CartItem.jsx             # Cart row product display card
│   ├── SearchBar.jsx            # Keyword search component
│   └── ProtectedRoute.jsx       # Auth router guard
├── context/                     # Context API Authentication
│   └── AuthContext.jsx          # Session login/logout actions
├── redux/                       # Redux Toolkit Store
│   ├── store.js                 # Combined slices configureStore
│   ├── cartSlice.js             # Cart actions slice
│   └── productSlice.js          # Axios fetching thunk actions slice
├── pages/                       # Main Page Views
│   ├── Home.jsx                 # Homepage
│   ├── Products.jsx             # Catalog list page (Search & filters)
│   ├── ProductDetails.jsx       # Product details description page
│   ├── Cart.jsx                 # Cart layout page
│   ├── Checkout.jsx             # Secure order placement page
│   └── AdminDashboard.jsx       # Product CRUD catalog dashboard
├── routes/                      # Client Routing Config
│   └── AppRoutes.jsx            # Browser routes compilation
├── services/                    # Axios Network Instance
│   └── api.js                   # API instance configuration
└── utils/                       # Helpers
    └── currency.js              # Price currency formatting
```

---

## 🎤 Viva Cheat Sheet: Key Architecture Explanations

Here is a breakdown of what both team members must be prepared to explain:

### 1. Complete Project Flow
1. **User Landing:** User visits the homepage (`Home.jsx`), seeing promotional content and featured gifts.
2. **Search/Filter:** User navigates to `/products` or searches in the Navbar. They filter items by category (e.g., *Home Decor*) or sort by price.
3. **Product Selection:** Selecting an item loads `ProductDetails.jsx` to view image, descriptions, price and ratings.
4. **Cart Actions:** The selected item is added to the Redux state (which syncs to `localStorage`).
5. **Auth & Checkout:** To view the cart or checkout, the user is redirected to `/login`. They sign in (authentication handles session storage), fill in shipping and payment details, and complete the order.
6. **Admin CRUD:** Logging in with `admin@giftcorner.com` provides access to the `/admin` panel to add, edit, or delete items in real-time.

### 2. Context API vs. Redux Toolkit
* **Context API (`AuthContext.jsx`):** Chosen for **Authentication** because authentication is a global state that rarely changes and is lightweight. It manages user logins, signs, and session caching in `localStorage`.
* **Redux Toolkit (`store.js`):** Chosen for **Cart & Catalog state** because e-commerce cart interactions are highly frequent, require predictable state mutations, and benefit from structured slices/actions (e.g. `addToCart`, `updateQuantity`).

### 3. Axios API Integration & CRUD Operations
Axios is configured as a base instance in `src/services/api.js`.
* **CREATE:** Admin posts a new item form to `/products` (`productSlice.js -> addProduct`).
* **READ:** Fetching products from `/products` (`productSlice.js -> fetchProducts`).
* **UPDATE:** Admin updates price/stock/details via PUT to `/products/:id` (`productSlice.js -> updateProduct`).
* **DELETE:** Admin deletes a product via DELETE to `/products/:id` (`productSlice.js -> deleteProduct`).

### 4. Local Storage
* **Auth Session Persistence:** `AuthContext.jsx` saves logged-in users under `giftcorner_user`. Upon app load, this is parsed to keep the user signed in.
* **Cart Persistence:** `cartSlice.js` saves the cart state under `giftcorner_cart`. Even if the browser is refreshed, items remain in the cart.

---

## 🧪 Verification & UX Details

1. **Category Expansion (At least 6 items & more per category):**
   * Added 12 new premium gift items (3 per category) across the database (`db.json` and `data/data.json`).
   * Each of the 4 categories (`Home Decor`, `Accessories`, `Kitchenware`, and `Romantic & Hampers`) now contains **exactly 9 items**, satisfying the requirement of having at least 6 items and more.
   * Cleaned up the Admin Dashboard (`AdminDashboard.jsx`) category selector to only display the 4 active categories.
   * Fixed the query parameter on the Home page (`Home.jsx`) to point to the correct encoded category: `/products?category=Romantic & Hampers`.

2. **Horizontal Filter Layout:**
   * Restructured the filters layout on the Products page from a sidebar to a modern horizontal layout sitting right under the main header to conserve vertical space.
   * Leveraged CSS grid `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` for responsiveness.

3. **Star Rating Selection Pills (Seen Clearly):**
   * Replaced the standard rating dropdown filter with fully visible, interactive star pills showing all ratings (All, 4.5+, 4.6+, 4.7+, 4.8+, 4.9+) clearly.

4. **Successful Production Build:**
   Ran `npm run build` locally:
   * **Result:** Client compiled successfully in 810ms with zero errors or lints.

5. **Integration Checks & Simplified Features:**
   * **Simulated Authentication Persistence:** User sessions (excluding passwords) are stored in Local Storage to keep users logged in.
   * **Order Status Check:** Displays orders placed with simple 'Delivered' or 'In Transit' statuses based on elapsed hours.
   * **Email Confirmation Simulation:** Displays notification indicating confirmation emails are sent.
