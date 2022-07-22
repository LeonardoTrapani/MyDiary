/*
  Warnings:

  - Added the required column `plannedDate` to the `Homework` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Homework` ADD COLUMN `plannedDate` DATETIME(3) NOT NULL;
