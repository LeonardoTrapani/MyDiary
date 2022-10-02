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
    //add the grade
    const transaction = await prisma.$transaction(async (trx) => {
      await trx.grade.create({
        data: {
          grade: +grade,
          subjectId: +subjectId,
          userId: +userId!,
        },
      });
      //calculate the new average of the subject
      const newSubjectAvg = await trx.grade.aggregate({
        where: {
          subjectId: +subjectId,
        },
        _avg: {
          grade: true,
        },
      });
      //update subject average field on the subject
      await trx.subject.update({
        where: {
          id: +subjectId,
        },
        data: {
          averageGrade: newSubjectAvg._avg.grade,
        },
      });
      console.log(newSubjectAvg._avg.grade);
      //recalculate total avg
      const newTotalAvg = await trx.subject.aggregate({
        where: {
          userId: +userId!,
          averageGrade: {
            gte: 0,
          },
        },
        _avg: {
          averageGrade: true,
        },
      });
      console.log(newTotalAvg);
      //updatre new total average
      await trx.user.update({
        where: {
          id: +userId!,
        },
        data: {
          averageGrade: newTotalAvg._avg.averageGrade,
        },
      });
    });
    res.json(transaction);
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
    //await prisma.grade.aggregate({
    //where: {
    //subject: {
    //userId: +userId!,
    //},
    //},
    //_avg: {
    //grade: true,
    //},
    //});
    res.json(result);
  } catch (err) {
    throwResponseError("an error has occurred finding the grades", 400, res);
  }
};
