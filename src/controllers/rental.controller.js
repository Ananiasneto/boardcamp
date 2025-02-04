import { db } from "../database/database.conection.js";
import dayjs from "dayjs";
import { checaRentalExistente } from "../services/rental.service.js";
import { checaEstoque } from "../services/game.service.js";

  export async function listarRentals(req, res) {
    try {
      const aluguel = await db.query(`
       SELECT rentals.*, 
                   customers.id AS customerId, 
                   customers.name AS customerName, 
                   games.id AS gameId, 
                   games.name AS gameName
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id;
      `); 
      const formattedAluguel = aluguel.rows.map(row => ({
        rentalId: row.id,
        customerId:row.customerId ,
        gameId: row.gameId,
        rentDate: row.rentDate,
        daysRented: row.daysRented,
        returnDate: row.returnDate,
        originalPrice: row.originalPrice,
        delayFee: null,
        customer: {
          id: row.customerid,
          name: row.customername,
        },
        game: {
          id: row.gameid,
          name: row.gamename,
        }
      }));
  
      res.status(200).send(formattedAluguel);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro no servidor");
    }
  }
  export async function inserirRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format("YYYY-MM-DD");
    const resultado=await checaEstoque(gameId);
    if (resultado.stockTotal===0){
      return res.sendStatus(422);
    }

    try {
        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice") 
            VALUES ($1, $2, $3, $4, NULL, (SELECT "pricePerDay" FROM games WHERE id = $2) * $3)
           ;`, 
            [customerId, gameId, daysRented,rentDate]
        );
        await db.query(
          `UPDATE games 
           SET "stockTotal" = $1
           WHERE id = $2`,
          [resultado.stockTotal - 1, gameId]
      );
        res.sendStatus(201);
        ;
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

  export async function finalizarRental(req, res) {
    const {id}=req.params;
    const rental=await checaRentalExistente(id);
    if (!rental) {
        return res.status(404).send("o aluguel não existe");
    }
    if (rental.returnDate){
        return  res.status(422).send("aluguel já finalizado");
    }
    try {
      const estoque=await checaEstoque(rental.gameId)
      const rentDate = dayjs(rental.rentDate);
      const esperadoReturnDate = rentDate.add(rental.daysRented, "day");
      const atualReturnDate = dayjs();
      let delayFee = 0;
      const stockTotal=Number(estoque.stockTotal);

      if (atualReturnDate.isAfter(esperadoReturnDate)) {
        const diasDeAtraso = atualReturnDate.diff(esperadoReturnDate, "day");
        delayFee = diasDeAtraso * rental.originalPrice / rental.daysRented;
    }
  
  await db.query(
  `UPDATE rentals 
   SET "returnDate" = $1, "delayFee" = $2 
   WHERE id = $3`,
  [atualReturnDate.format("YYYY-MM-DD"), delayFee, id]
);

await db.query(
  `UPDATE games 
   SET "stockTotal" = $1 
   WHERE id = $2`,
  [stockTotal + 1, rental.gameId] 
);

  res.sendStatus(200);  
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  export async function deletarRental(req, res) {
    const {id}=req.params;
    const rental=await checaRentalExistente(id);
    if (!rental) {
        return res.status(404).send("o aluguel não existe");
    }
    if (!rental.returnDate){
      return  res.sendStatus(400);
  }
  try {
    await db.query(`DELETE FROM rentals WHERE id=$1`,[id])
    return  res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
  }