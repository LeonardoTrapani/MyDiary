import { Router } from "express";
import { param } from "express-validator";
import { isAuthenticated, validateExpressValidation } from "../middlewares";
import {
  getCalendar,
  getDueCalendarDay,
  getPlannedCalendarDay,
} from "../controllers/calendar";
const router = Router();

router.get(
  "month/:page",
  isAuthenticated,
  [
    param("page", "please enter a valid page")
      .notEmpty()
      .custom((value) => value > 0)
      .isNumeric(),
  ],
  validateExpressValidation,
  getCalendar
);

router.get(
  "/planned/:date",
  isAuthenticated,
  [param("date", "please enter a valid date").notEmpty().isISO8601()],
  validateExpressValidation,
  getPlannedCalendarDay
);

router.get(
  "/due/:date",
  isAuthenticated,
  [param("date", "please enter a valid date").notEmpty().isISO8601()],
  validateExpressValidation,
  getDueCalendarDay
);

export default router;
