const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Static admin user for demo (no database needed)
const adminUser = {
  id: 1,
  username: 'admin',
  email: 'admin@toystore.com',
  password: 'admin123', // Plain text for demo
  first_name: 'Admin',
  last_name: 'User'
};

// Admin login page
router.get('/admin-login', (req, res) => {
  if (req.session.admin) {
    return res.redirect('/admin');
  }
  res.render('auth/admin-login', {
    title: 'Admin Login - RC Toy Store',
    user: req.session.admin,
    errors: [],
    formData: {}
  });
});

// Admin login
router.post('/admin-login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.render('auth/admin-login', {
      title: 'Admin Login - RC Toy Store',
      user: req.session.admin,
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Check admin credentials
    if (email !== adminUser.email || password !== adminUser.password) {
      return res.render('auth/admin-login', {
        title: 'Admin Login - RC Toy Store',
        user: req.session.admin,
        errors: [{ msg: 'Invalid email or password' }],
        formData: req.body
      });
    }

    // Set admin session
    req.session.admin = {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      firstName: adminUser.first_name,
      lastName: adminUser.last_name,
      role: 'admin'
    };

    res.redirect('/admin');
  } catch (error) {
    console.error('Admin login error:', error);
    res.render('auth/admin-login', {
      title: 'Admin Login - RC Toy Store',
      user: req.session.admin,
      errors: [{ msg: 'Login failed. Please try again.' }],
      formData: req.body
    });
  }
});

// Admin logout
router.get('/admin-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;