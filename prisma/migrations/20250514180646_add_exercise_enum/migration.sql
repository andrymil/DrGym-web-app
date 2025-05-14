/*
  Warnings:

  - You are about to alter the column `duration` on the `activities` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("interval")` to `Text`.
  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('strength', 'cardio', 'crossfit');

-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "email_fk";

-- AlterTable
ALTER TABLE "activities" ALTER COLUMN "reps" DROP DEFAULT,
ALTER COLUMN "weight" DROP DEFAULT,
ALTER COLUMN "duration" DROP DEFAULT,
ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "type",
ADD COLUMN     "type" "ExerciseType" NOT NULL;

-- DropTable
DROP TABLE "token";

-- CreateTable
CREATE TABLE "tokens" (
    "email" VARCHAR(255) NOT NULL,
    "verification_token" VARCHAR(255),
    "reset_token" VARCHAR(255),
    "reset_expiry" TIMESTAMP(6),

    CONSTRAINT "token_pkey" PRIMARY KEY ("email")
);

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "email_fk" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE NO ACTION;
