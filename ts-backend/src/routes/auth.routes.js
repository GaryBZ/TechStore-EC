import express from 'express';
import * as C from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', C.login);

export default router;