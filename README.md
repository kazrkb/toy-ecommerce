# RC Toy Store

A modern e-commerce website specializing in remote-controlled toys including sports cars, helicopters, fighter jets, and speed boats.

## Features

- **Product Catalog**: Browse products by category with search and filtering
- **User Authentication**: Secure registration and login system
- **Shopping Cart**: Add, update, and remove items from cart
- **Admin Panel**: Manage products, orders, and users
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **MySQL Database**: Robust data storage and management

## Technology Stack

- **Frontend**: HTML, CSS, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Template Engine**: EJS
- **Authentication**: Session-based authentication with bcrypt
- **Validation**: Express-validator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd toy-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `toy_ecommerce`
   - Run the SQL schema from `database/schema.sql`
   ```bash
   mysql -u root -p toy_ecommerce < database/schema.sql
   ```

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the database credentials and other settings
   ```bash
   cp .env.example .env
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Default admin credentials: admin@toystore.com / admin123

## Project Structure

```
toy-ecommerce/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── config/
│   └── database.js       # Database configuration
├── routes/
│   ├── index.js         # Home page routes
│   ├── products.js      # Product catalog routes
│   ├── auth.js         # Authentication routes
│   ├── cart.js         # Shopping cart routes
│   └── admin.js        # Admin panel routes
├── views/
│   ├── layout.ejs      # Main layout template
│   ├── index.ejs       # Home page
│   ├── error.ejs       # Error page
│   ├── auth/           # Authentication views
│   ├── products/       # Product views
│   ├── cart/          # Cart views
│   └── admin/         # Admin views
├── public/
│   ├── css/
│   │   └── style.css  # Custom styles
│   ├── js/
│   │   └── main.js    # Client-side JavaScript
│   └── images/        # Product and category images
├── middleware/
│   └── auth.js        # Authentication middleware
├── database/
│   └── schema.sql     # Database schema
└── .github/
    └── copilot-instructions.md
```

## Product Categories

1. **Sports Cars** - High-speed RC racing cars
2. **Helicopters** - Remote-controlled helicopters for aerial fun
3. **Fighter Jets** - Military-style RC aircraft
4. **Speed Boats** - Fast water racing boats

## API Endpoints

### Public Routes
- `GET /` - Home page
- `GET /products` - Product catalog
- `GET /products/:id` - Product details
- `GET /auth/login` - Login page
- `GET /auth/register` - Registration page

### Protected Routes (Requires Authentication)
- `GET /cart` - Shopping cart
- `POST /cart/add` - Add item to cart
- `POST /cart/update` - Update cart item
- `POST /cart/remove` - Remove cart item

### Admin Routes (Requires Admin Role)
- `GET /admin` - Admin dashboard
- `GET /admin/products` - Manage products
- `GET /admin/orders` - Manage orders

## Database Schema

The application uses MySQL with the following main tables:
- `users` - User accounts and profiles
- `categories` - Product categories
- `products` - Product information
- `cart_items` - Shopping cart items
- `orders` - Order records
- `order_items` - Order line items

## Development

### Running in Development Mode
```bash
npm run dev
```
This starts the server with nodemon for auto-restart on file changes.

### Adding New Products
1. Access the admin panel at `/admin`
2. Go to "Manage Products"
3. Click "Add New Product"
4. Fill in product details and save

### Customizing Styles
- Edit `public/css/style.css` for custom styles
- The project uses Tailwind CSS via CDN
- Main layout is in `views/layout.ejs`

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- SQL injection prevention with prepared statements
- XSS protection with proper template escaping

## Deployment

1. Set up a production MySQL database
2. Update environment variables for production
3. Install dependencies: `npm install --production`
4. Start the application: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team or create an issue in the repository.# toy-ecommerce
