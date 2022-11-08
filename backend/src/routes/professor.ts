import { Router } from "express";
import { body, param } from "express-validator";
import { isAuthenticated, validateExpressValidation } from "../middlewares";
import { createProfessor, getProfessor } from "../controllers/professor";

const router = Router();

router.post(
  "/create",
  isAuthenticated,
  [body("name", "please insert a name").notEmpty()],
  validateExpressValidation,
  createProfessor
);

router.get(
  "/get/:professorId",
  isAuthenticated,
  [
    param("professorId", "please enter a valid professorId")
      .isNumeric()
      .notEmpty(),
  ],
  validateExpressValidation,
  getProfessor
);
export default router;
