const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper function to get session ID
const getSessionId = (req) => {
  if (!req.session.cartId) {
    req.session.cartId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return req.session.cartId;
};

// View cart
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [cartItems] = await db.execute(`
      SELECT ci.*, p.name, p.price, p.image_url, p.stock_quantity,
             (ci.quantity * p.price) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ?
    `, [sessionId]);

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.render('cart/index', {
      title: 'Shopping Cart - RC Toy Store',
      cartItems,
      total: total.toFixed(2),
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading cart:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load shopping cart',
      error: { status: 500 }
    });
  }
});

// Add to cart
router.post('/add', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = getSessionId(req);

  try {
    // Check if product exists and is in stock
    const [products] = await db.execute(
      'SELECT * FROM products WHERE id = ? AND is_active = 1',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Check if item already in cart
    const [existingItems] = await db.execute(
      'SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?',
      [sessionId, productId]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + parseInt(quantity);
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }

      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE session_id = ? AND product_id = ?',
        [newQuantity, sessionId, productId]
      );
    } else {
      // Add new item
      await db.execute(
        'INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)',
        [sessionId, productId, quantity]
      );
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.post('/update', async (req, res) => {
  const { productId, quantity } = req.body;
  const sessionId = getSessionId(req);

  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db.execute(
        'DELETE FROM cart_items WHERE session_id = ? AND product_id = ?',
        [sessionId, productId]
      );
    } else {
      // Check stock
      const [products] = await db.execute(
        'SELECT stock_quantity FROM products WHERE id = ?',
        [productId]
      );

      if (products.length === 0 || products[0].stock_quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }

      // Update quantity
      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE session_id = ? AND product_id = ?',
        [quantity, sessionId, productId]
      );
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
});

// Remove item from cart
router.post('/remove', async (req, res) => {
  const { productId } = req.body;
  const sessionId = getSessionId(req);

  try {
    await db.execute(
      'DELETE FROM cart_items WHERE session_id = ? AND product_id = ?',
      [sessionId, productId]
    );

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
  }
});

// Checkout page
router.get('/checkout', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [cartItems] = await db.execute(`
      SELECT ci.*, p.name, p.price, p.image_url,
             (ci.quantity * p.price) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ?
    `, [sessionId]);

    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.render('cart/checkout', {
      title: 'Checkout - RC Toy Store',
      cartItems,
      total: total.toFixed(2),
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading checkout:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load checkout page',
      error: { status: 500 }
    });
  }
});

// Process order
router.post('/place-order', async (req, res) => {
  const { customerName, customerEmail, customerPhone, address, city, state, zipCode, paymentMethod } = req.body;
  const sessionId = getSessionId(req);

  try {
    // Get cart items
    const [cartItems] = await db.execute(`
      SELECT ci.*, p.name, p.price, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ?
    `, [sessionId]);

    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    // Create order
    const [orderResult] = await db.execute(`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, 
                         city, state, zip_code, total_amount, payment_method, session_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [customerName, customerEmail, customerPhone, address, city, state, zipCode, total, paymentMethod, sessionId]);

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of cartItems) {
      await db.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.price]);

      // Update stock
      await db.execute(`
        UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
      `, [item.quantity, item.product_id]);
    }

    // Clear cart
    await db.execute('DELETE FROM cart_items WHERE session_id = ?', [sessionId]);

    res.render('cart/order-success', {
      title: 'Order Placed - RC Toy Store',
      orderId,
      total: total.toFixed(2),
      customerName,
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to place order',
      error: { status: 500 }
    });
  }
});

module.exports = router;