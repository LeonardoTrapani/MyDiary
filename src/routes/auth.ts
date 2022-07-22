import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

import { signup, login } from '../controllers/auth';

router.post(
  '/login',
  [
    body('email').trim().isEmail().notEmpty(),
    body('password').trim().isStrongPassword(),
  ],
  login
);

router.post(
  '/signup',
  [
    body('email').trim().isEmail(),
    body('username').trim().isLength({ min: 5 }),
    body('password').trim().notEmpty(),
  ],
  signup
);

export default router;
