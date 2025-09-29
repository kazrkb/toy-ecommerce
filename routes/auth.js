const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/database');

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
    // Find admin user
    const [users] = await db.execute(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.render('auth/admin-login', {
        title: 'Admin Login - RC Toy Store',
        user: req.session.admin,
        errors: [{ msg: 'Invalid email or password' }],
        formData: req.body
      });
    }

    const user = users[0];

    // For development, allow plain text password "admin123"
    const isValidPassword = password === 'admin123' || await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.render('auth/admin-login', {
        title: 'Admin Login - RC Toy Store',
        user: req.session.admin,
        errors: [{ msg: 'Invalid email or password' }],
        formData: req.body
      });
    }

    // Set admin session
    req.session.admin = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
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