import express from 'express';
import * as C from '../controllers/producto.controller.js';
const router = express.Router();

router.get('/', C.getAll);
router.get('/:id', C.getById);
router.get('/marca/:mar_id', C.getByMarca);
router.get('/categoria/:cat_id', C.getByCategoria);
router.post('/', C.create);
router.put('/:id', C.update);
router.delete('/:id', C.remove);

export default router;