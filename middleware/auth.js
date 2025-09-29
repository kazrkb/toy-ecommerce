const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).render('error', {
    title: '403 - Access Denied',
    message: 'You do not have permission to access this page.',
    error: { status: 403 }
  });
};

const isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isGuest
};