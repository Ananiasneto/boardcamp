import { db } from "../database/database.conection.js";

export async function checaGameExistente(name) {
    const gameExiste = await db.query('SELECT * FROM games WHERE name = $1', [name]);
    return gameExiste.rows[0];
  }

  export async function checaEstoque(id) {
    const estoqueExiste = await db.query('SELECT "stockTotal" FROM games WHERE id = $1', [id]);
    return estoqueExiste.rows[0];
  }

