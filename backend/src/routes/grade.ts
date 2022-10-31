import { Router } from "express";
import { body } from "express-validator";
import { createGrade, getAllGrades } from "../controllers/grade";
import { isAuthenticated, validateExpressValidation } from "../middlewares";

const router = Router();

router.post(
  "/create",
  isAuthenticated,
  [
    body("grade", "please enter a valid grade").isNumeric(),
    body("subjectId", "please enter a valid subject id").isNumeric(),
  ],
  validateExpressValidation,
  createGrade
);

router.get("/all", isAuthenticated, getAllGrades);

export default router;
