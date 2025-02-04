import { db } from "../database/database.conection.js";

export async function checaRentalExistente(id) {
    const rentalExiste = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    return rentalExiste.rows[0];
  }