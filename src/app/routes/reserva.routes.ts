import { Router } from "express"
import { reservaController } from "../controllers"

const reserva = Router()

reserva.get('/index', reservaController.index)
reserva.post('/create', reservaController.create)
reserva.get('/find/:id', reservaController.find)
reserva.get('/findAll', reservaController.findAll)
reserva.put('/update/:id', reservaController.update)
reserva.patch('/delete/:id', reservaController.delete)
reserva.post('/cancelar/:id', reservaController.cancelar)
reserva.get('/send-ticket-mail/:id', reservaController.sendTicketMail)
reserva.post('/efetiva-reserva/:id', reservaController.efetivaReserva)
reserva.get('/download-voucher-reserva/:id', reservaController.downloadVoucherReserva)

export { reserva }
