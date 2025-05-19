/*
  Warnings:

  - Made the column `start_datetime` on table `workouts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_datetime` on table `workouts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workouts" ALTER COLUMN "start_datetime" SET NOT NULL,
ALTER COLUMN "end_datetime" SET NOT NULL;
