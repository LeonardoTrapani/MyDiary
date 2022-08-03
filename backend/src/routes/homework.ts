import { Router } from 'express';
import {
  calculateFreeDays,
  createHomework,
  getAllHomework,
} from '../controllers/homework';
import { isAuthenticated, validateExpressValidation } from '../middlewares';
import { validatorDateHandler } from '../utilities';
import { body, param } from 'express-validator';

const router = Router();

router.post(
  '/create',
  isAuthenticated,
  [
    body('name', 'plase enter a valid subject name with at least 3 characters')
      .trim()
      .isString()
      .notEmpty()
      .isLength({ min: 3 }),
    body(
      'description',
      'please enter a description between 5 and 400 characters'
    )
      .trim()
      .isLength({ min: 5, max: 400 })
      .notEmpty(),
    body('subject', 'please enter a subject').trim().isString().notEmpty(),
    body('expirationDate', 'plase enter a valid date')
      .custom((value) => validatorDateHandler(value))
      .toDate(),
    body('plannedDates', 'please enter valid planned dates')
      .custom((value) => value.length)
      .withMessage('please enter the planned dates')
      .custom((values: { date: string; minutes: number }[]) => {
        let isValid = true;
        values.forEach((value) => {
          if (!validatorDateHandler(value.date) || isNaN(value.minutes)) {
            isValid = false;
          }
        });
        return isValid;
      }),
    body('duration', 'please enter a valid duration').isNumeric(), //Validate dates and times etc...
  ],
  validateExpressValidation,
  createHomework
);

router.get('/all', isAuthenticated, getAllHomework);

router.post(
  '/freeDays/:pageNumber',
  isAuthenticated,
  [
    body('expirationDate', 'please insert a valid date')
      .notEmpty()
      .custom((value) => validatorDateHandler(value)),
    body('duration', 'please enter a valid duration (min: 5)')
      .trim()
      .isNumeric()
      .custom((value) => +value >= 5),
    param('pageNumber', 'page number not provided')
      .isNumeric()
      .custom((value) => value > 0)
      .withMessage('the page needs to be at least 1'),
  ],
  validateExpressValidation,
  calculateFreeDays
);
router.post('');
export default router;
