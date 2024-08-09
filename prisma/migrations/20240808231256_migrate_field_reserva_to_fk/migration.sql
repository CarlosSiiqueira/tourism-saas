-- AddForeignKey
ALTER TABLE "ExcursaoPassageiros" ADD CONSTRAINT "ExcursaoPassageiros_reserva_fkey" FOREIGN KEY ("reserva") REFERENCES "Reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
