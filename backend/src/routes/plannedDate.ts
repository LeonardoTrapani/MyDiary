import { Router } from "express";
import { param } from "express-validator";
import { isAuthenticated, validateExpressValidation } from "../middlewares";
import {
  completePlannedDate,
  uncompletePlannedDate,
} from "../controllers/plannedDates";

const router = Router();

router.post(
  "/complete/:id",
  [param("id", "please enter a valid planned date id").isNumeric()],
  validateExpressValidation,
  isAuthenticated,
  completePlannedDate
);

router.post(
  "/uncomplete/:id",
  [param("id", "please enter a valid planned date id").isNumeric()],
  validateExpressValidation,
  isAuthenticated,
  uncompletePlannedDate
);

export default router;
