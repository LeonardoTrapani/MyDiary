import { Router } from 'express';
import { isAuthenticated } from 'src/middlewares';
import { createWeek } from 'src/controllers/week';
// import { body } from 'express-validator';
const router = Router();

router.post('/week', isAuthenticated, [], createWeek);

export default router;
