import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalSchema } from "../schemas/rental.schema.js";
import { deletarRental, finalizarRental, inserirRental, listarRentals } from "../controllers/rental.controller.js";


const rentals = Router();

rentals.get("/", listarRentals);
rentals.post("/", validateSchema(rentalSchema), inserirRental);
rentals.post("/:id/return", finalizarRental);
rentals.delete("/:id", deletarRental);

export default rentals;