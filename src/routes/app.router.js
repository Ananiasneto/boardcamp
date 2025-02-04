import { Router } from "express";
import game from "./game.router.js";
import customer from "./customer.router.js";
import rental from "./rental.router.js";

const router=Router();

router.use("/games", game);
router.use("/customers", customer);
router.use("/rentals", rental);

export default router;