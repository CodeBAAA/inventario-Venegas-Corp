const express = require('express');
const {
  getTools,
  createTool,
  updateTool,
  deleteTool,
  getLowStockTools
} = require('../controllers/toolController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getTools);
router.get('/low-stock', authMiddleware, getLowStockTools);
router.post('/', authMiddleware, createTool);
router.put('/:id', authMiddleware, updateTool);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTool);

module.exports = router;
