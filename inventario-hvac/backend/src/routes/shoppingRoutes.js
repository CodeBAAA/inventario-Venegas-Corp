const express = require('express');
const {
  getShoppingLists,
  createShoppingList,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem
} = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getShoppingLists);
router.post('/', authMiddleware, createShoppingList);
router.post('/:listId/items', authMiddleware, addShoppingItem);
router.put('/items/:itemId', authMiddleware, updateShoppingItem);
router.delete('/items/:itemId', authMiddleware, deleteShoppingItem);

module.exports = router;
