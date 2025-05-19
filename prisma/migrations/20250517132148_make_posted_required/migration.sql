/*
  Warnings:

  - Made the column `is_posted` on table `workouts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workouts" ALTER COLUMN "is_posted" SET NOT NULL;
