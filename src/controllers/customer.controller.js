import { db } from "../database/database.conection.js";
import { checaCpfExistente } from "../services/customer.service.js";

export async function listarClientes (req, res){
    try {
      const clientes = await db.query("SELECT * FROM customers;");
      return res.status(200).send(clientes.rows);
    } catch (error) {
        return res.status(500).send("erro no servidor");
    }
  };

  export async function inserirClientes (req, res){
        const { name, phone, cpf} = req.body;
        const cpfExiste = await checaCpfExistente(cpf);
                if (cpfExiste) {
                    return res.status(409).send("Já existe um usuário com esse cpf");
                }
        try {
          await db.query(
            `INSERT INTO customers (name, phone,cpf) VALUES ($1, $2, $3);`,
            [name, phone, cpf]
          );
          res.sendStatus(201);
        } catch (error) {
          console.error(error); 
          return res.status(500).send("erro no servidor");
        }
  }
  export async function  listarClientePorId (req, res){
       const id = req.params.id;
       try {
         const cliente = await db.query("SELECT * FROM customers WHERE id = $1;", [id]); 
         if (cliente.rows.length === 0) {
           return res.status(404).send("cliente não encontrado"); 
         }
         res.send(cliente.rows[0]); 
       } catch (error) {
           return res.status(500).send("erro no servidor");
       }
   }

