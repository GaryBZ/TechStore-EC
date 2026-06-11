import express from 'express';
import * as C from '../controllers/cliente.controller.js';

const router = express.Router();

router.get('/', C.getAll);
router.get('/:id', C.getById);
router.post('/', C.create);
router.put('/:id', C.update);
router.delete('/:id', C.remove);

export default router;