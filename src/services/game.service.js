import { db } from "../database/database.conection.js";

export async function checaGameExistente(name) {
    const gameExiste = await db.query('SELECT * FROM games WHERE name = $1', [name]);
    return gameExiste.rows[0];
  }