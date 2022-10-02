import { prisma } from "../app";
import { Request, Response } from "express";
import { throwResponseError } from "../utilities";

export const createGrade = async (req: Request, res: Response) => {
  const { grade, subjectId } = req.body;
  const { userId } = req;

  const validSubjects = await prisma.subject.findMany({
    where: {
      userId: +userId!,
    },
  });

  if (!validSubjects.length) {
    throwResponseError("this subject was not created by you", 400, res);
    return;
  }
  try {
    const gradeResult = await prisma.grade.create({
      data: {
        grade: +grade,
        subjectId: +subjectId,
        userId: +userId!,
      },
    });
    res.json(gradeResult);
  } catch (err) {
    console.error(err);
    throwResponseError("an error has occurred creating the grade", 400, res);
  }
};

export const getAllGrades = async (req: Request, res: Response) => {
  const { userId } = req;
  try {
    const result = await prisma.user.findMany({
      where: {
        id: +userId!,
      },
      select: {
        averageGrade: true,
        id: true,
        subjects: {
          select: {
            id: true,
            averageGrade: true,
            color: true,
            name: true,
            grades: {
              select: {
                grade: true,
              },
              where: {
                deleted: false,
              },
            },
          },
        },
      },
    });
    res.json(result);
  } catch (err) {
    throwResponseError("an error has occurred finding the grades", 400, res);
  }
};
