-- Toy E-commerce Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS toy_ecommerce;
USE toy_ecommerce;

-- Admin users table (simplified - only for admin access)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT,
  image_url VARCHAR(255),
  stock_quantity INT DEFAULT 0,
  brand VARCHAR(100),
  model VARCHAR(100),
  specifications JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Shopping cart table (session-based for guest users)
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255),
  product_id INT,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_session_product (session_id, product_id)
);

-- Orders table (guest orders with customer details)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  shipping_address TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES
('Sports Cars', 'High-speed remote-controlled sports cars for racing enthusiasts', '/images/categories/sports-cars.jpg'),
('Helicopters', 'Remote-controlled helicopters for aerial adventures', '/images/categories/helicopters.jpg'),
('Fighter Jets', 'Military-style remote-controlled fighter jets', '/images/categories/fighter-jets.jpg'),
('Speed Boats', 'Fast remote-controlled boats for water racing', '/images/categories/speed-boats.jpg');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, brand, model, specifications) VALUES
-- Sports Cars
('Thunder Racer Pro', 'High-performance RC sports car with 30mph top speed', 299.99, 1, '/images/products/thunder-racer-pro.jpg', 15, 'SpeedTech', 'TR-2024', '{"scale": "1:10", "speed": "30mph", "range": "100m", "battery": "7.4V Li-Po"}'),
('Lightning Drift King', 'Drift-ready sports car with precision handling', 249.99, 1, '/images/products/lightning-drift.jpg', 20, 'DriftMaster', 'DK-300', '{"scale": "1:12", "speed": "25mph", "range": "80m", "battery": "6V Ni-MH"}'),

-- Helicopters
('Sky Hunter Elite', 'Professional-grade RC helicopter with 6-axis gyro', 399.99, 2, '/images/products/sky-hunter.jpg', 10, 'AirForce', 'SH-450', '{"rotor_diameter": "450mm", "flight_time": "15min", "range": "150m", "channels": "6"}'),
('Mini Falcon', 'Compact indoor/outdoor helicopter perfect for beginners', 149.99, 2, '/images/products/mini-falcon.jpg', 25, 'SkyTech', 'MF-200', '{"rotor_diameter": "200mm", "flight_time": "8min", "range": "50m", "channels": "4"}'),

-- Fighter Jets
('F-22 Raptor RC', 'Scale replica of the famous stealth fighter', 449.99, 3, '/images/products/f22-raptor.jpg', 8, 'WarBird', 'F22-RC', '{"wingspan": "800mm", "speed": "40mph", "range": "200m", "channels": "6"}'),
('Tornado Strike', 'Twin-engine fighter jet with LED lights', 329.99, 3, '/images/products/tornado-strike.jpg', 12, 'JetPro', 'TS-500', '{"wingspan": "650mm", "speed": "35mph", "range": "150m", "channels": "5"}'),

-- Speed Boats
('Aqua Rocket 3000', 'High-speed racing boat with water cooling system', 279.99, 4, '/images/products/aqua-rocket.jpg', 18, 'WaveRider', 'AR-3000', '{"length": "600mm", "speed": "45mph", "range": "120m", "waterproof": "IPX7"}'),
('Tsunami Pro', 'Professional racing boat with brushless motor', 359.99, 4, '/images/products/tsunami-pro.jpg', 14, 'AquaSpeed', 'TP-700', '{"length": "700mm", "speed": "50mph", "range": "180m", "waterproof": "IPX8"}');

-- Create admin user (password: admin123 - should be hashed in production)
INSERT INTO admin_users (username, email, password, first_name, last_name) VALUES
('admin', 'admin@toystore.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User');