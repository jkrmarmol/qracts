/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Sections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sections_name_key" ON "Sections"("name");
