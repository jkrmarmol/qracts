/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");
