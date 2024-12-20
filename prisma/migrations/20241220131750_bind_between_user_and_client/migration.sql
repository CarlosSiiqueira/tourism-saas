-- AlterTable
ALTER TABLE "Pessoas" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Pessoas" ADD CONSTRAINT "Pessoas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
