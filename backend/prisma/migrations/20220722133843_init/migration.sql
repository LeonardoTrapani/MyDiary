/*
  Warnings:

  - You are about to alter the column `freeHours` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - Added the required column `date` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Day` ADD COLUMN `date` DATE NOT NULL,
    MODIFY `freeHours` SMALLINT NOT NULL DEFAULT 0;
