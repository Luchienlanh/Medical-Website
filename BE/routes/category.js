import express from 'express';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
} from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/', getAllCategories);

export default router;
