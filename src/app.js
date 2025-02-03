import express, { json } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

export const db = new Pool(configDatabase);

app.get("/games", async (req, res) => {
  try {
    const games = await db.query("SELECT * FROM games;");
    res.json(games.rows);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/games", async (req, res) => {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
      await db.query(
        `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
        [name, image, stockTotal, pricePerDay] 
      );
      res.status(201).json({ message: "Jogo inserido com sucesso!" });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  //CLIENTES
  app.get("/clientes", async (req, res) => {
    try {
      const clientes = await db.query("SELECT * FROM customers;");
      res.json(clientes.rows);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/clientes", async (req, res) => {
    const { name, phone, cpf} = req.body;
    try {
      await db.query(
        `INSERT INTO customers (name, phone,cpf) VALUES ($1, $2, $3);`,
        [name, phone, cpf]
      );
      res.status(201).json({ message: "cliente inserido com sucesso!" });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  //ALUGUEL

  app.get("/aluguel", async (req, res) => {
    try {
      const aluguel = await db.query("SELECT * FROM rentals;");
      res.json(aluguel.rows);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/aluguel", async (req, res) => {
    const { clienteID, gameID, daysRented} = req.body;
    try {
        await db.query(
            `INSERT INTO rentals (clienteID, gameID,daysRented) VALUES ($1, $2, $3);`,
            [clienteID, gameID, daysRented]
          );
          res.status(201).json({ message: "aluguel inserido com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
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
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

  

  
app.listen(5000, () => {
  console.log("Rodando liso na porta 5000 ");
});
