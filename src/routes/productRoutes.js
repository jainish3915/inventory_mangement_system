const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getLowStockProducts,
} = require('../controllers/productController');
const {
  validateProduct,
  handleValidationErrors,
} = require('../middlewares/validate');

// Search & low stock routes (must be before /:id to avoid conflicts)
router.get('/search', searchProducts);
router.get('/low-stock', getLowStockProducts);

// CRUD routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validateProduct, handleValidationErrors, createProduct);
router.put('/:id', validateProduct, handleValidationErrors, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
