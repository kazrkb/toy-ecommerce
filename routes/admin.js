const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.admin || req.session.admin.role !== 'admin') {
    return res.redirect('/auth/admin-login');
  }
  next();
};

// Admin dashboard
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get statistics
    const [orderCount] = await db.execute('SELECT COUNT(*) as count FROM orders');
    const [productCount] = await db.execute('SELECT COUNT(*) as count FROM products WHERE is_active = 1');
    const [revenueResult] = await db.execute('SELECT SUM(total_amount) as revenue FROM orders WHERE payment_status = "completed"');

    const stats = {
      orders: orderCount[0].count,
      products: productCount[0].count,
      revenue: revenueResult[0].revenue || 0
    };

    // Get recent orders
    const [recentOrders] = await db.execute(`
      SELECT o.*, o.customer_name, o.customer_email 
      FROM orders o 
      ORDER BY o.created_at DESC 
      LIMIT 10
    `);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - RC Toy Store',
      stats,
      recentOrders,
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load admin dashboard',
      error: { status: 500 }
    });
  }
});

// Products management
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);

    res.render('admin/products', {
      title: 'Manage Products - Admin',
      products,
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load products',
      error: { status: 500 }
    });
  }
});

// Add product page
router.get('/products/add', requireAdmin, async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    
    res.render('admin/product-form', {
      title: 'Add Product - Admin',
      product: null,
      categories,
      user: req.session.user,
      errors: []
    });
  } catch (error) {
    console.error('Error loading add product page:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load add product page',
      error: { status: 500 }
    });
  }
});

// Edit product page
router.get('/products/edit/:id', requireAdmin, async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    
    if (products.length === 0) {
      return res.status(404).render('error', {
        title: '404 - Product Not Found',
        message: 'The product you are looking for does not exist.',
        error: { status: 404 }
      });
    }

    res.render('admin/product-form', {
      title: 'Edit Product - Admin',
      product: products[0],
      categories,
      user: req.session.user,
      errors: []
    });
  } catch (error) {
    console.error('Error loading edit product page:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load edit product page',
      error: { status: 500 }
    });
  }
});

// Save product (add/edit)
router.post('/products/save', requireAdmin, async (req, res) => {
  const { id, name, description, price, category_id, brand, model, stock_quantity, image_url, specifications } = req.body;

  try {
    if (id) {
      // Update existing product
      await db.execute(`
        UPDATE products 
        SET name = ?, description = ?, price = ?, category_id = ?, brand = ?, model = ?, 
            stock_quantity = ?, image_url = ?, specifications = ?
        WHERE id = ?
      `, [name, description, price, category_id, brand, model, stock_quantity, image_url, specifications, id]);
    } else {
      // Add new product
      await db.execute(`
        INSERT INTO products (name, description, price, category_id, brand, model, stock_quantity, image_url, specifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name, description, price, category_id, brand, model, stock_quantity, image_url, specifications]);
    }

    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to save product',
      error: { status: 500 }
    });
  }
});

// Delete product
router.post('/products/delete/:id', requireAdmin, async (req, res) => {
  try {
    await db.execute('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// Orders management
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, u.username, u.email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);

    res.render('admin/orders', {
      title: 'Manage Orders - Admin',
      orders,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load orders',
      error: { status: 500 }
    });
  }
});

// Update order status
router.post('/orders/update-status', requireAdmin, async (req, res) => {
  const { orderId, status } = req.body;

  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

module.exports = router;