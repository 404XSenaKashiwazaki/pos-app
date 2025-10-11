/*
  Warnings:

  - Made the column `shippingFee` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discountAmount` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `totalAmount` VARCHAR(255) NOT NULL,
    MODIFY `shippingFee` VARCHAR(255) NOT NULL,
    MODIFY `discountAmount` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `unitPrice` VARCHAR(255) NOT NULL,
    MODIFY `subtotal` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `amount` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `sablontype` MODIFY `basePrice` VARCHAR(255) NOT NULL,
    MODIFY `pricePerColor` VARCHAR(255) NULL,
    MODIFY `pricePerArea` VARCHAR(255) NULL;
