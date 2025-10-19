-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `colorCount` INTEGER NULL DEFAULT 1,
    ADD COLUMN `printArea` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Production` (
    `id` VARCHAR(191) NOT NULL,
    `orderItemId` VARCHAR(191) NOT NULL,
    `assignedToId` VARCHAR(191) NULL,
    `sablonTypeId` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `progress` INTEGER NULL DEFAULT 0,
    `status` ENUM('WAITING', 'IN_PROGRESS', 'PAUSED', 'FINISHED', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'WAITING',
    `notes` VARCHAR(191) NULL,
    `fileProofUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Production_orderItemId_key`(`orderItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Production` ADD CONSTRAINT `Production_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Production` ADD CONSTRAINT `Production_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Production` ADD CONSTRAINT `Production_sablonTypeId_fkey` FOREIGN KEY (`sablonTypeId`) REFERENCES `SablonType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
