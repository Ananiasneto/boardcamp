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
