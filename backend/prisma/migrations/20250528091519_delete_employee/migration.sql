/*
  Warnings:

  - You are about to drop the column `EmployeeId` on the `bill` table. All the data in the column will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bill` DROP FOREIGN KEY `Bill_EmployeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- DropIndex
DROP INDEX `Bill_EmployeeId_fkey` ON `bill`;

-- AlterTable
ALTER TABLE `bill` DROP COLUMN `EmployeeId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('MANAGER', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE';

-- DropTable
DROP TABLE `employee`;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
