import express from 'express';
import {
    createManufacturer,
    updatedManufacturer,
    deleteManufacturer,
    getAllManufacturers
} from '../controllers/manufacturerController.js';

const router = express.Router();

router.post('/', createManufacturer);
router.put('/:id', updatedManufacturer);
router.delete('/:id', deleteManufacturer);
router.get('/', getAllManufacturers);

export default router;
