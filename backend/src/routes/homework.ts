import { Router } from "express";
import {
  calculateFreeDays,
  createHomework,
  createHomeworkWihoutPlan,
  getAllHomework,
  getSingleHomework,
  planHomework,
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
    body("name", "plase enter a valid subject name")
      .trim()
      .isString()
      .notEmpty(),
    body("description", "the description maximum length is 400 characters")
      .trim()
      .isLength({ max: 400 })
      .notEmpty()
      .withMessage("please enter a description"),
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

router.post(
  "/createWithoutPlan",
  isAuthenticated,
  [
    body("name", "plase enter a valid subject name")
      .trim()
      .isString()
      .notEmpty(),
    body("description", "the description maximum length is 400 characters")
      .trim()
      .isLength({ max: 400 })
      .notEmpty()
      .withMessage("please enter a description"),
    body("expirationDate", "please insert a valid expiration date")
      .isISO8601()
      .custom((value) => {
        return moment(value).isAfter(moment());
      })
      .withMessage("please insert a future date")
      .notEmpty(),
    body("subjectId", "please enter a subject").isNumeric(),
  ],
  validateExpressValidation,
  createHomeworkWihoutPlan
);

router.post(
  "/plan",
  [
    body("duration", "please enter a duration").isNumeric(),
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
    body("homeworkId", "please enter a valid homeworkId")
      .isNumeric()
      .notEmpty(),
  ],
  isAuthenticated,
  plannedDatesAreValid,
  planHomework
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
      .withMessage("you can not have more than 24 free hours in a day!"),
    param("pageNumber", "page number not provided")
      .isNumeric()
      .withMessage("page number is not a number")
      .custom((value) => value > 0)
      .withMessage("the page needs to be at least 1"),
  ],
  validateExpressValidation,
  calculateFreeDays
);

router.get(
  "/:id",
  isAuthenticated,
  [param("id", "please enter a valid id").isNumeric()],
  validateExpressValidation,
  getSingleHomework
);

export default router;
