/*
  Warnings:

  - You are about to drop the `sablon_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `sablon_types`;

-- CreateTable
CREATE TABLE `SablonType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `basePrice` DECIMAL(12, 2) NOT NULL,
    `pricePerColor` DECIMAL(12, 2) NULL,
    `pricePerArea` DECIMAL(12, 2) NULL,
    `notes` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SablonType_name_key`(`name`),
    INDEX `SablonType_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
