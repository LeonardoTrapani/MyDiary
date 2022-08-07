import { Router } from 'express';
import { param } from 'express-validator';
import { isAuthenticated, validateExpressValidation } from '../middlewares';
import { getCalendar } from '../controllers/calendar';
const router = Router();

router.get(
  '/:page',
  isAuthenticated,
  [
    param('page', 'please enter a valid page')
      .notEmpty()
      .custom((value) => value > 0)
      .isNumeric(),
  ],
  validateExpressValidation,
  getCalendar
);

export default router;
