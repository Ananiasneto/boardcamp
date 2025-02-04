import { db } from "../database/database.conection.js";
import dayjs from "dayjs";

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
    try {
        const result = await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice") 
            VALUES ($1, $2, $3, $4, NULL, (SELECT "pricePerDay" FROM games WHERE id = $2) * $3)
            ;`, 
            [customerId, gameId, daysRented,rentDate]
        );

        res.status(201);
        ;
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

  export async function finalizarRental(req, res) {
    
  }
  export async function deletarRental(req, res) {
    
  }