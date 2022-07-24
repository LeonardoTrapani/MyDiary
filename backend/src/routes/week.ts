import { Router } from 'express';
import { isAuthenticated } from '../middlewares';
import { createWeek } from '../controllers/week';
import { body } from 'express-validator';
// import { body } from 'express-validator';
const router = Router();

router.post(
  '/create',
  isAuthenticated,
  [
    body('mondayHours', 'please enter monday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the monday hours'),
    body('tuesdayHours', 'please enter tuesday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the tuesday hours'),
    body('wednesdayHours', 'please enter wednesday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the wednesday hours'),
    body('thursdayHours', 'please enter thursday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the thursday hours'),
    body('fridayHours', 'please enter friday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the saturday hours'),
    body('saturdayHours', 'please enter saturday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the saturday hours'),
    body('sundayHours', 'please enter sunday hours')
      .notEmpty()
      .isNumeric()
      .withMessage('please enter a numeric value for the sunday hours'),
  ],
  createWeek
);

export default router;
