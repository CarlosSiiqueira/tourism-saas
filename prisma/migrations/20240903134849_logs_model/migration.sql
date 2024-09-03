-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "newData" JSONB NOT NULL,
    "oldData" JSONB NOT NULL,
    "usuariosId" TEXT NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
