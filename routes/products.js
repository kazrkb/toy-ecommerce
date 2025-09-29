const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all products with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1
    `;
    const params = [];

    // Category filter
    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }

    // Search filter
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'price_low':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_high':
        query += ' ORDER BY p.price DESC';
        break;
      case 'name':
        query += ' ORDER BY p.name ASC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    const [products] = await db.execute(query, params);
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');

    res.render('products/index', {
      title: 'Products - RC Toy Store',
      products,
      categories,
      currentCategory: category || '',
      currentSearch: search || '',
      currentSort: sort || '',
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

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.is_active = 1
    `, [req.params.id]);

    if (products.length === 0) {
      return res.status(404).render('error', {
        title: '404 - Product Not Found',
        message: 'The product you are looking for does not exist.',
        error: { status: 404 }
      });
    }

    const product = products[0];

    // Get related products from same category
    const [relatedProducts] = await db.execute(`
      SELECT * FROM products 
      WHERE category_id = ? AND id != ? AND is_active = 1 
      LIMIT 4
    `, [product.category_id, product.id]);

    res.render('products/detail', {
      title: `${product.name} - RC Toy Store`,
      product,
      relatedProducts,
      user: req.session.admin
    });
  } catch (error) {
    console.error('Error loading product:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load product details',
      error: { status: 500 }
    });
  }
});

module.exports = router;