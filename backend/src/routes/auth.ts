import { Router } from 'express';
import { body } from 'express-validator';
import { isAuthenticated, validateExpressValidation } from '../middlewares';

const router = Router();

import { signup, login, getUserInfo } from '../controllers/auth';

router.post(
  '/login',
  [
    body('email', 'please enter a valid email').trim().isEmail(),
    body('password', 'please enter a stronger password')
      .trim()
      .isStrongPassword(),
  ],
  validateExpressValidation,
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
  validateExpressValidation,
  signup
);

router.get('/userInfo', isAuthenticated, getUserInfo);
export default router;
