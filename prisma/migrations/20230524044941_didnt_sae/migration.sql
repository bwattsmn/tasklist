-- CreateEnum
CREATE TYPE "TaskStatusEnum" AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatusEnum" NOT NULL DEFAULT 'PENDING';
