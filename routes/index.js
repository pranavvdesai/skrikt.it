const express = require('express');
const router = express.Router();
const passport = require('passport');

const homeController = require('../controllers/home_controller');
const postscontroller = require('../controllers/showpost');

router.get('/register', homeController.register);
router.post('/create', homeController.create);

router.get('/login', homeController.login);
router.get('/', postscontroller.showPost);

// passport as a middleware to authenticate
router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/' }),
  homeController.loginvalidation
);

router.use('/users', require('./users'));

router.use('/api', require('./api'));

router.use('/logout', homeController.logout);

// OAuth authentication routes.
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  homeController.loginvalidation
);

module.exports = router;
