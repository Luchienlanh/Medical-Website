import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductByName,
    getAllProduct
} from '../controllers/productController.js';

const router = express.Router();

// CRUD operations
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Query operations
router.get('/', getAllProduct);
router.get('/:id', getProductById);
router.get('/search/name', getProductByName);

export default router;
