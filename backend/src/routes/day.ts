import { Router } from 'express';
import { body } from 'express-validator';
import {
  // areMoreMinutesAssigned,
  createDay,
  editDay,
  getAllDays,
} from '../controllers/day';
import { isAuthenticated, validateExpressValidation } from '../middlewares';
import { minutesAreLessThanDay } from '../utilities';

const router = Router();

router.get('/all', isAuthenticated, getAllDays);

router.put(
  '/edit',
  isAuthenticated,
  [
    body('id', 'please enter a valid date id').isNumeric().toInt(),
    body('freeMinutes', 'please enter valid freeMinutes')
      .isNumeric()
      .toInt()
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage('you can\t have more than 24 free hours in a day!'),
  ],
  validateExpressValidation,
  // areMoreMinutesAssigned,
  editDay
);

router.post(
  '/create',
  isAuthenticated,
  [
    body('date', 'please enter a valid date').isISO8601(),
    body('freeMinutes', 'please enter valid freeMinutes')
      .isNumeric()
      .toInt()
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage('you can\t have more than 24 free hours in a day!'),
  ],
  validateExpressValidation,
  // areMoreMinutesAssigned,
  createDay
);

export default router;
