/*
  Warnings:

  - A unique constraint covering the columns `[roleId,entity]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roleId]` on the table `UserToRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_entity_key" ON "Permission"("roleId", "entity");

-- CreateIndex
CREATE UNIQUE INDEX "UserToRole_userId_roleId_key" ON "UserToRole"("userId", "roleId");
