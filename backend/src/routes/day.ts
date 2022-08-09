import { Router } from 'express';
import { body } from 'express-validator';
import { createDay, getAllDays } from '../controllers/day';
import { isAuthenticated, validateExpressValidation } from '../middlewares';

const router = Router();

router.get('/all', isAuthenticated, getAllDays);

router.post(
  '/create',
  isAuthenticated,
  [
    body('date', 'please enter a valid date').isISO8601(),
    body('freeMinutes', 'please enter valid freeMinutes').isNumeric().toInt(),
  ],
  validateExpressValidation,
  createDay
);

export default router;
