import { db } from "../database/database.conection.js";
import { checaGameExistente } from "../services/game.service.js";

export async function listarGames(req, res){
    try {
      const games = await db.query("SELECT * FROM games;");
      return res.status(200).send(games.rows);
    } catch (error) {
      return res.sendStatus(500);
      
    }
}


export async function inserirGames(req, res){
        const { name, image, stockTotal, pricePerDay } = req.body;
        const gameExiste = await checaGameExistente(name);
        if (gameExiste) {
            return res.status(409).send("jogo já inserido");
        }
        try {
          await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
            [name, image, stockTotal, pricePerDay] 
          );
          res.sendStatus(201);
        } catch (error) {
          console.error(error); 
          return res.status(500).send("erro no servidor");
        }
      }