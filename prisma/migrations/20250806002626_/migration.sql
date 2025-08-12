/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `properties` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."PropertyStatus" ADD VALUE 'brouillon';

-- AlterTable
ALTER TABLE "public"."properties" ADD COLUMN     "agencyReference" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "reference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "properties_reference_key" ON "public"."properties"("reference");
