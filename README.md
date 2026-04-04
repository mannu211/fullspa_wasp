# WASP - Premium Women's Fashion E-commerce

![WASP Banner](https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc)

A beautiful, modern e-commerce platform for women's fashion featuring Indian, Western, and Korean clothing collections. Built with Next.js, MongoDB, and styled with Tailwind CSS, inspired by Apple's design philosophy.

## 🌟 Features

### Customer Features
- **Beautiful Homepage** with auto-sliding hero banners
- **Category Shopping**: Indian Wear, Western, Korean Fashion, Jeans, Tops
- **Product Pages** with size selection and quantity management
- **Shopping Cart** with Redux state management
- **User Authentication** (Register/Login with JWT)
- **Checkout System** with demo payment integration
- **Order Tracking** and history
- **Discount Badges** and sale pricing
- **Responsive Design** - works on all devices

### Admin Features
- **Product Management** - Add, edit, delete products
- **Banner Management** - Manage homepage banners
- **Order Management** - View and update order status
- **Category Organization** - Organize products by category
- **Discount Management** - Set discounts on products

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Redux Toolkit** - State management for cart and auth
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Modern icons

### Backend
- **Next.js API Routes** - Serverless API
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js                    # Homepage
│   ├── layout.js                  # Root layout with Redux Provider
│   ├── category/[category]/       # Category pages
│   ├── product/[id]/              # Product detail pages
│   ├── login/                     # Login page
│   ├── register/                  # Register page
│   ├── checkout/                  # Checkout page
│   ├── profile/                   # User profile & orders
│   ├── admin/                     # Admin panel
│   ├── order-success/             # Order confirmation page
│   └── api/[[...path]]/           # API routes
├── components/
│   ├── Navbar.jsx                 # Navigation bar
│   ├── CartSidebar.jsx            # Shopping cart sidebar
│   ├── HeroSlider.jsx             # Homepage hero slider
│   └── ProductCard.jsx            # Product card component
├── lib/
│   ├── mongodb.js                 # MongoDB connection
│   ├── store.js                   # Redux store
│   ├── cartSlice.js               # Cart state management
│   └── authSlice.js               # Auth state management
└── scripts/
    └── seed.js                    # Database seeding script
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- MongoDB instance

### Installation

1. **Install dependencies**
```bash
cd /app
yarn install
```

2. **Set up environment variables**
Already configured in `/app/.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=wasp_ecommerce
NEXT_PUBLIC_BASE_URL=https://wasp-fashion-hub.preview.emergentagent.com
```

3. **Seed the database** (First time only)
```bash
node scripts/seed.js
```

4. **Start development server**
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Collections

### Products
- id, name, description, price, salePrice
- category, image, images, sizes
- discount, featured, isNew, stock

### Users
- id, name, email, password (hashed)
- isAdmin, createdAt

### Orders
- id, userId, items, total
- shippingAddress, paymentMethod, status
- createdAt

### Banners
- id, title, description, image
- link, active, createdAt

## 🔑 API Endpoints

### Public Endpoints
```
GET  /api                          # API status
GET  /api/products                 # Get products (with filters)
GET  /api/products/:id             # Get single product
GET  /api/categories               # Get all categories
GET  /api/banners                  # Get active banners
POST /api/auth/register            # Register user
POST /api/auth/login               # Login user
```

### Protected Endpoints (Require Authentication)
```
GET  /api/user/profile             # Get user profile
GET  /api/orders                   # Get user orders
POST /api/orders                   # Create order
```

### Admin Endpoints (Require Admin Role)
```
GET    /api/admin/products         # Get all products
POST   /api/admin/products         # Create product
PUT    /api/admin/products/:id     # Update product
DELETE /api/admin/products/:id     # Delete product

GET    /api/admin/banners          # Get all banners
POST   /api/admin/banners          # Create banner
PUT    /api/admin/banners/:id      # Update banner
DELETE /api/admin/banners/:id      # Delete banner

GET    /api/admin/orders           # Get all orders
PUT    /api/admin/orders/:id       # Update order status
```

## 👤 Default Admin Access

To access the admin panel, you need to:
1. Register a new account
2. Manually set `isAdmin: true` in MongoDB for your user
3. Login and navigate to `/admin`

Alternatively, create an admin user via MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@wasp.com" },
  { $set: { isAdmin: true } }
)
```

## 🎨 Design Features

- **Apple-Inspired Design** - Clean, minimal, premium aesthetic
- **Dark Theme** - Black background with white accents
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Mobile-first design approach
- **Image Hover Effects** - Zoom and overlay effects
- **Loading States** - Skeleton screens and spinners

## 🛒 Shopping Flow

1. **Browse Products** - Homepage or category pages
2. **View Product** - Click any product for details
3. **Add to Cart** - Select size and quantity
4. **Review Cart** - Cart sidebar opens automatically
5. **Checkout** - Login required
6. **Order Placed** - Confirmation page with order details

## 📱 Pages Overview

### Homepage
- Auto-sliding hero banners
- Category showcase grid
- Featured products section
- Discount banner
- Feature highlights

### Category Pages
- Category-specific hero banner
- Product filtering and sorting
- Grid layout with hover effects

### Product Pages
- Large product image
- Size selection
- Quantity controls
- Add to cart
- Product information

### Checkout
- Shipping address form
- Order summary
- Demo payment notice

### Admin Panel
- Product CRUD operations
- Banner management
- Order management
- Tabbed interface

## 🎯 Key Features to Note

1. **Cart Persistence** - Cart state saved in localStorage
2. **Auth Persistence** - User session maintained across refreshes
3. **Real-time Cart Updates** - Redux state management
4. **Demo Payment** - Checkout works without actual payment integration
5. **Seed Data** - Sample products included for testing

## 🔒 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- Protected API routes
- Admin role verification
- CORS configuration

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Product search
- [ ] Email notifications
- [ ] Advanced filtering (price range, colors)
- [ ] Product image gallery
- [ ] Size guide
- [ ] Related products
- [ ] Order tracking with status updates

## 🐛 Known Limitations

- Payment is in demo mode (orders created without actual payment)
- Product images are from Unsplash (random fashion images)
- No email verification for registration
- Admin access requires manual database update

## 📞 Support

For issues or questions:
- Check the API logs: `tail -f /var/log/supervisor/nextjs.out.log`
- Check MongoDB connection
- Restart services: `sudo supervisorctl restart all`

## 🎉 Credits

- Images: Unsplash
- Icons: Lucide React
- UI Components: shadcn/ui
- Design Inspiration: Apple.com

---

**Built with ❤️ for WASP - Where Style Meets Elegance**
