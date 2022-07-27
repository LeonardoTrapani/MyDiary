import { Router } from 'express';
import {
  calculateFreeDays,
  createHomework,
  getAllHomework,
} from '../controllers/homework';
import { isAuthenticated } from '../middlewares';
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
    body('plannedDate', 'please enter a valid date')
      .custom((value) => validatorDateHandler(value))
      .toDate(),
    body('duration', 'please enter a valid duration').isNumeric(), //TODO: the date needs to be in the future
  ],
  createHomework
);

router.get('/all', isAuthenticated, getAllHomework);

router.post(
  '/freeDays/:weekNumber',
  isAuthenticated,
  [
    body('expirationDate', 'please insert a valid date')
      .notEmpty()
      .custom((value) => validatorDateHandler(value)),
    body('duration', 'please enter a valid duration (min: 5)')
      .trim()
      .isNumeric()
      .custom((value) => +value >= 5),
    param('weekNumber', 'week number not provided').isNumeric(),
  ],
  calculateFreeDays
);
router.post('');
export default router;
