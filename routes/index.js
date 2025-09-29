const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Home page
router.get('/', async (req, res) => {
  try {
    // Get featured products
    const [featuredProducts] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 
      ORDER BY p.created_at DESC 
      LIMIT 8
    `);

    // Get categories
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');

    res.render('index', {
      title: 'RC Toy Store - Premium Remote Controlled Toys',
      featuredProducts,
      categories,
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load the home page',
      error: { status: 500 }
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - RC Toy Store',
    user: req.session.admin
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - RC Toy Store',
    user: req.session.admin
  });
});

module.exports = router;