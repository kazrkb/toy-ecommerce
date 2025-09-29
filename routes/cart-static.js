const express = require('express');
const router = express.Router();

// Static product data for cart operations
const products = [
  { id: 1, name: 'Thunder Racer Pro', price: 299.99, image_url: '/images/products/sports-car-placeholder.svg', stock_quantity: 15 },
  { id: 2, name: 'Lightning Drift King', price: 249.99, image_url: '/images/products/sports-car-placeholder.svg', stock_quantity: 20 },
  { id: 3, name: 'Sky Hunter Elite', price: 399.99, image_url: '/images/products/helicopter-placeholder.svg', stock_quantity: 10 },
  { id: 4, name: 'Mini Falcon', price: 149.99, image_url: '/images/products/helicopter-placeholder.svg', stock_quantity: 25 },
  { id: 5, name: 'F-22 Raptor RC', price: 449.99, image_url: '/images/products/fighter-jet-placeholder.svg', stock_quantity: 8 },
  { id: 6, name: 'Tornado Strike', price: 329.99, image_url: '/images/products/fighter-jet-placeholder.svg', stock_quantity: 12 },
  { id: 7, name: 'Aqua Rocket 3000', price: 279.99, image_url: '/images/products/speed-boat-placeholder.svg', stock_quantity: 18 },
  { id: 8, name: 'Tsunami Pro', price: 359.99, image_url: '/images/products/speed-boat-placeholder.svg', stock_quantity: 14 }
];

// Helper function to get cart from session
const getCart = (req) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
};

// View cart
router.get('/', (req, res) => {
  try {
    const cart = getCart(req);
    const cartItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return {
          ...item,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          subtotal: (item.quantity * product.price).toFixed(2)
        };
      }
      return null;
    }).filter(item => item !== null);

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
router.post('/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = getCart(req);

  try {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingItem = cart.find(item => item.productId === parseInt(productId));
    if (existingItem) {
      const newQuantity = existingItem.quantity + parseInt(quantity);
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.push({
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      });
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.post('/update', (req, res) => {
  const { productId, quantity } = req.body;
  const cart = getCart(req);

  try {
    const item = cart.find(item => item.productId === parseInt(productId));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    const product = products.find(p => p.id === parseInt(productId));
    if (quantity <= 0) {
      // Remove item
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    } else if (product && product.stock_quantity >= quantity) {
      item.quantity = parseInt(quantity);
    } else {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
});

// Remove item from cart
router.post('/remove', (req, res) => {
  const { productId } = req.body;
  const cart = getCart(req);

  try {
    const index = cart.findIndex(item => item.productId === parseInt(productId));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    cart.splice(index, 1);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
  }
});

// Checkout page
router.get('/checkout', (req, res) => {
  try {
    const cart = getCart(req);
    if (cart.length === 0) {
      return res.redirect('/cart');
    }

    const cartItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return {
          ...item,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          subtotal: (item.quantity * product.price).toFixed(2)
        };
      }
      return null;
    }).filter(item => item !== null);

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

// Process order (demo version - just clears cart)
router.post('/place-order', (req, res) => {
  const { customerName, customerEmail } = req.body;
  const cart = getCart(req);

  try {
    if (cart.length === 0) {
      return res.redirect('/cart');
    }

    const cartItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...item, name: product.name, price: product.price } : null;
    }).filter(item => item !== null);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generate order ID
    const orderId = 'ORD-' + Date.now();

    // Clear cart
    req.session.cart = [];

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