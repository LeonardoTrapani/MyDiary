import { Router } from 'express';
import { createHomework, getHomework } from '../controllers/homework';
import { isAuthenticated } from '../middlewares';

import { body } from 'express-validator';

const router = Router();

router.post(
  '/homework',
  isAuthenticated,
  [
    body('name').trim().isString().notEmpty().isLength({ min: 3 }),
    body('subject').trim().isString().notEmpty(),
    body('finishDate').isDate(),
    body('plannedDate').isDate(),
    body('duration').isNumeric(),
  ],
  createHomework
);

router.get('/homework/:homeworkId', isAuthenticated, getHomework);

export default router;
