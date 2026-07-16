-- CreateTable
CREATE TABLE `JobType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JobType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobTypeTool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobTypeId` INTEGER NOT NULL,
    `toolId` INTEGER NOT NULL,
    `quantityNeed` INTEGER NOT NULL DEFAULT 1,
    `note` VARCHAR(191) NULL,

    UNIQUE INDEX `JobTypeTool_jobTypeId_toolId_key`(`jobTypeId`, `toolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JobTypeTool` ADD CONSTRAINT `JobTypeTool_jobTypeId_fkey` FOREIGN KEY (`jobTypeId`) REFERENCES `JobType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobTypeTool` ADD CONSTRAINT `JobTypeTool_toolId_fkey` FOREIGN KEY (`toolId`) REFERENCES `Tool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
