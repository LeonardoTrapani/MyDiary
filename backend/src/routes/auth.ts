import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

import { signup, login } from '../controllers/auth';

router.post(
  '/login',
  [
    body('email', 'please enter a valid email').trim().isEmail().notEmpty(),
    body('password', 'please enter a stronger password')
      .trim()
      .isStrongPassword(),
  ],
  login
);

router.post(
  '/signup',
  [
    body('email', 'please enter a valid email').trim().isEmail(),
    body('username', 'please enter a username with at least 5 characters')
      .trim()
      .isLength({ min: 5 }),
    body('password', 'please enter a stronger password')
      .trim()
      .isStrongPassword(),
  ],
  signup
);

export default router;
