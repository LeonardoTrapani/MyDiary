import { Request, Response } from "express";
import { throwResponseError } from "../utilities";
import { prisma } from "../app";

export const createProfessor = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const professor = await prisma.professor.create({
      data: {
        name: name,
        userId: +req.userId!,
      },
    });
    res.json(professor);
  } catch (err) {
    console.error(err);
    throwResponseError("An error has occurred creating a professor", 400, res);
  }
};

export const getProfessor = async (req: Request, res: Response) => {
  const { professorId } = req.params;
  console.log(professorId);
  try {
    const professor = await prisma.professor.findFirst({
      where: {
        id: +professorId,
        userId: +req.userId!,
      },
      select: {
        id: true,
        name: true,
        //subject: true,
      },
    });
    res.json(professor);
  } catch (err) {
    console.error(err);
    throwResponseError("An error has occurred finding the professor", 400, res);
  }
};
