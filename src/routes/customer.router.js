import { Router } from "express";
import { customerSchema } from "../schemas/customer.schema.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import {inserirClientes, listarClientePorId, listarClientes } from "../controllers/customer.controller.js";

const customer = Router();

customer.post("/",validateSchema(customerSchema), inserirClientes);
customer.get("/", listarClientes);
customer.get("/:id",listarClientePorId);

export default customer;