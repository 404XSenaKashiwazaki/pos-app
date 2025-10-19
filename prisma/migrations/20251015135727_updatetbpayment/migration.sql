/*
  Warnings:

  - Added the required column `filename` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `reference` on table `payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `design` MODIFY `filename` VARCHAR(191) NOT NULL DEFAULT '/preview.jpg',
    MODIFY `fileUrl` VARCHAR(191) NOT NULL DEFAULT '/preview.jpg';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `filename` VARCHAR(191) NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    MODIFY `reference` VARCHAR(191) NOT NULL;
