import express from 'express';
import * as C from '../controllers/carrito.controller.js';

const router = express.Router();

router.get('/', C.getAll);
router.get('/:id', C.getById);
router.get('/cliente/:cli_id', C.getByCliente);
router.post('/', C.create);
router.put('/:id', C.update);
router.delete('/:id', C.remove);

export default router;