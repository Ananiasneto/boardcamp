import { Router } from "express";

import { inserirGames, listarGames } from "../controllers/game.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";



const games = Router();

games.post("/",validateSchema(gameSchema) ,inserirGames);
games.get("/", listarGames);

export default games;