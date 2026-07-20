const express = require('express');
const {
  getDashboardStats,
  downloadShoppingListPdf,
  generateInventoryPdf
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/shopping-list/:listId/pdf', authMiddleware, downloadShoppingListPdf);
router.get('/inventory/pdf', authMiddleware, adminMiddleware, generateInventoryPdf);

module.exports = router;
