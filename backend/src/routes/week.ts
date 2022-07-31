import { Router } from 'express';
import { isAuthenticated } from '../middlewares';
import { createWeek, getWeek } from '../controllers/week';
import { body } from 'express-validator';
// import { body } from 'express-validator';
const router = Router();

router.get('/get', isAuthenticated, getWeek);

router.post(
  '/create',
  isAuthenticated,
  [
    body('mondayFreeMinutes', 'please enter monday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the monday free minutes'),
    body('tuesdayFreeMinutes', 'please enter tuesday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the tuesday free minutes'),
    body('wednesdayFreeMinutes', 'please enter wednesday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage(
        'please enter a numeric value for the wednesday free minutes'
      ),
    body('thursdayFreeMinutes', 'please enter thursday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage(
        'please enter a numeric value for the thursday free minutes'
      ),
    body('fridayFreeMinutes', 'please enter friday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage(
        'please enter a numeric value for the saturday free minutes'
      ),
    body('saturdayFreeMinutes', 'please enter saturday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage(
        'please enter a numeric value for the saturday free minutes'
      ),
    body('sundayFreeMinutes', 'please enter sunday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the sunday free minutes'),
  ],
  createWeek
);

export default router;
