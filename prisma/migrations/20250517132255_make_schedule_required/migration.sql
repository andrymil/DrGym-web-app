/*
  Warnings:

  - Made the column `schedule` on table `workouts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workouts" ALTER COLUMN "schedule" SET NOT NULL;
