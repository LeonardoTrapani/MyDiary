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
  try {
    const professor = await prisma.professor.findFirst({
      where: {
        id: +professorId,
        userId: +req.userId!,
      },
      select: {
        id: true,
        name: true,
        subject: true,
      },
    });
    res.json(professor);
  } catch (err) {
    console.error(err);
    throwResponseError("An error has occurred finding the professor", 400, res);
  }
};

export const mergeProfessorAndSubject = async (req: Request, res: Response) => {
  const { professorId, subjectId } = req.body;
  const userId = +req.userId!;
  try {
    const transaction = await prisma.$transaction(async (trx) => {
      const professorCheck = await trx.professor.findUnique({
        where: { id: professorId },
        select: { id: true },
      });
      if (!professorCheck) {
        throw new Error("Professor Does not exist");
      }
      const subjectUpdateRes = await trx.subject.updateMany({
        data: {
          professorId: professorCheck?.id,
        },
        where: {
          id: subjectId,
          userId: userId,
        },
      });
      if (subjectUpdateRes.count < 1) {
        throw new Error("Updated 0 subjects");
      }
    });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    throwResponseError(
      "An error has occurred merging the professor and the subject",
      400,
      res
    );
  }
};
