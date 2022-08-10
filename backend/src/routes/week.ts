import { Router } from 'express';
import { isAuthenticated, validateExpressValidation } from '../middlewares';
import { createWeek, getWeek } from '../controllers/week';
import { body } from 'express-validator';
import { minutesAreLessThanDay } from '../utilities';
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
      .withMessage('please enter a numeric value for the monday free minutes')
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    body('tuesdayFreeMinutes', 'please enter tuesday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the tuesday free minutes')
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    body('wednesdayFreeMinutes', 'please enter wednesday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage(
        'please enter a numeric value for the wednesday free minutes'
      )
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    body('thursdayFreeMinutes', 'please enter thursday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the thursday free minutes')
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    body('fridayFreeMinutes', 'please enter friday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the saturday free minutes')
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    body('saturdayFreeMinutes', 'please enter saturday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the saturday free minutes')
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    body('sundayFreeMinutes', 'please enter sunday free minutes')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the sunday free minutes')
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
  ],
  validateExpressValidation,
  createWeek
);

export default router;
