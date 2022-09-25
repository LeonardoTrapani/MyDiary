import { prisma } from "../app";
import { Request, Response } from "express";
import { throwResponseError } from "../utilities";

export const createGrade = async (req: Request, res: Response) => {
  const { grade, subjectId } = req.body;
  const { userId } = req;
  try {
    const gradeResult = await prisma.grade.create({
      data: {
        grade: +grade,
        userId: +userId!,
        subjectId: +subjectId,
      },
    });
    res.json(gradeResult);
  } catch (err) {
    console.log(err);
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
                userId: +userId!,
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
