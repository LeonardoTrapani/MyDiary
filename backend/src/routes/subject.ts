import { Router } from 'express';
import { body } from 'express-validator';
import { getAllSubjects, createSubject } from '../controllers/subjects';
import { isAuthenticated, validateExpressValidation } from '../middlewares';

const router = Router();

router.get('/all', isAuthenticated, getAllSubjects);

router.post(
  '/create',
  isAuthenticated,
  [
    body('name', 'please enter a name').isString(),
    body('color', 'please enter a valid hex color')
      .isHexColor()
      .custom((value) => value[0] === '#')
      .withMessage('the hex color should start with "#"'),
  ],
  validateExpressValidation,
  createSubject
);
export default router;
