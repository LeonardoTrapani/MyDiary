import { Router } from 'express';
import { createHomework, getAllHomework } from '../controllers/homework';
import { isAuthenticated } from '../middlewares';
import { validatorDateHandler } from '../utilities';
import { body } from 'express-validator';

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
    body('description', 'please enter a description with at least 5 characters')
      .trim()
      .isLength({ min: 5 })
      .notEmpty(),
    body('subject', 'please enter a subject').trim().isString().notEmpty(),
    body('finishDate', 'plase enter a valid date')
      .custom((value) => validatorDateHandler(value))
      .toDate(),
    body('plannedDate', 'please enter a valid date')
      .custom((value) => validatorDateHandler(value))
      .toDate(),
    body('duration', 'please enter a valid duration').isNumeric(),
  ],
  createHomework
);

router.get('/all', isAuthenticated, getAllHomework);

export default router;
