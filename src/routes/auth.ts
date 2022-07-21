import { Router } from 'express';

const router = Router();

import { signup, login } from '../controllers/auth';

router.post('/login', login);

router.post('/signup', signup);

export default router;
