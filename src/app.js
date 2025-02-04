import express, { json } from "express";
import cors from "cors";
import router from "./routes/app.router.js";
import { db } from "./database/database.conection.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(json());
app.use(cors());
app.use(router);

  //CLIENTES
 
  //ALUGUEL

  app.get("/aluguel", async (req, res) => {
    try {
      const aluguel = await db.query(`
        SELECT *
        FROM rentals 
        JOIN customers ON "clienteID" = customers.id
        JOIN games ON rentals."gameID" = games.id;
      `);

      const formattedAluguel = aluguel.rows.map(row => ({
        rentalId: row.rentalId,
        daysRented: row.daysRented,
        rentDate: row.rentDate,
        returnDate: row.returnDate,
        cliente: {
          id: row.clienteId,
          name: row.clienteName,
        },
        game: {
          id: row.gameId,
          name: row.gameName,
        }
      }));
  
      res.json(formattedAluguel);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro no servidor");
    }
  });

  app.post("/aluguel", async (req, res) => {
    const { clienteID, gameID, daysRented} = req.body;
    const rentDate = new Date();
    const returnDate = null;
    try {
        await db.query(
            `INSERT INTO rentals (clienteID, gameID,daysRented) VALUES ($1, $2, $3,$4,$5);`,
            [clienteID, gameID, daysRented,rentDate,returnDate]
          );
          res.status(201).json({ message: "aluguel inserido com sucesso!" });
    } catch (error) {
        return res.status(500).send("erro no servidor");
    }
  });

  app.delete("/aluguel/:id", async (req, res) => {
    const { id } = req.params; 
    try {
        await db.query(
            `DELETE FROM rentals WHERE id=$1`, 
            [id] 
        );
        res.status(200).json({ message: "Aluguel deletado com sucesso!" }); //
    } catch (error) {
        console.error(error);
        return res.status(500).send("erro no servidor");
    }
});

  

  
app.listen(5000, () => {
  console.log("Rodando liso na porta 5000 ");
});
