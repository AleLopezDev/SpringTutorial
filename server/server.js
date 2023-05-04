const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "springtutorial",
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
});

app.get("/api/secciones", (req, res) => {
  connection.query(
    "SELECT id, nombre FROM secciones ORDER BY id ASC",
    (error, results) => {
      if (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los datos");
        return;
      }
      res.json(results);
    }
  );
});

app.get("/api/lecciones", (req, res) => {
  connection.query(
    "SELECT id, seccion_id, nombre, video_url FROM lecciones ORDER BY id ASC",
    (error, results) => {
      if (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los datos");
        return;
      }
      res.json(results);
    }
  );
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
