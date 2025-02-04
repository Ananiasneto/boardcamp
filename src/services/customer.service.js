import { db } from "../database/database.conection.js";

export async function checaCpfExistente(cpf) {
    const cpfExiste = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
   return cpfExiste.rows.length > 0;
  }