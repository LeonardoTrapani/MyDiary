import { Router } from "express";
import {
  calculateFreeDays,
  createHomework,
  getAllHomework,
} from "../controllers/homework";
import {
  isAuthenticated,
  plannedDatesAreValid,
  validateExpressValidation,
} from "../middlewares";
import { isValidDate, minutesAreLessThanDay } from "../utilities";
import { body, param } from "express-validator";
import moment from "moment";
const router = Router();

router.post(
  "/create",
  isAuthenticated,
  [
    body("name", "plase enter a valid subject name with at least 3 characters")
      .trim()
      .isString()
      .notEmpty(),
    body("description", "the description maximum length is 400 characters")
      .trim()
      .isLength({ max: 400 })
      .notEmpty(),
    body("expirationDate", "please insert a valid expiration date")
      .isISO8601()
      .custom((value) => {
        return moment(value).isAfter(moment());
      })
      .withMessage("please insert a future date")
      .notEmpty(),
    body("plannedDates", "please enter valid planned dates")
      .custom((value) => {
        return value.length;
      })
      .withMessage("please enter the planned dates")
      .custom((values: { date: string; minutes: number }[]) => {
        let isValid = true;
        values.forEach((value) => {
          if (
            !isValidDate(value.date) ||
            isNaN(value.minutes) ||
            !minutesAreLessThanDay(value.minutes)
          ) {
            isValid = false;
          }
        });
        return isValid;
      })
      .withMessage("the dates of the planned dates are not valid"),
    body("duration", "please enter a duration").isNumeric(),
    body("subjectId", "please enter a subject").isNumeric(),
  ],
  validateExpressValidation,
  plannedDatesAreValid,
  createHomework
);

router.get("/all", isAuthenticated, getAllHomework);

router.post(
  "/freeDays/:pageNumber",
  isAuthenticated,
  [
    body("expirationDate", "please insert a valid expiration date")
      .notEmpty()
      .isISO8601(),
    body("duration", "please enter a duration")
      .trim()
      .isNumeric()
      .custom((value) => minutesAreLessThanDay(value))
      .withMessage("you can't have more than 24 free hours in a day!"),
    param("pageNumber", "page number not provided")
      .isNumeric()
      .withMessage("page number is not a number")
      .custom((value) => value > 0)
      .withMessage("the page needs to be at least 1"),
  ],
  validateExpressValidation,
  calculateFreeDays
);
router.post("");
export default router;
