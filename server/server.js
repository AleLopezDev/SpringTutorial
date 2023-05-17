const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    "SELECT id, nombre, descripcion FROM secciones ORDER BY id ASC",
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

app.post("/api/progreso", (req, res) => {
  const { usuario_id, seccion_id } = req.body;

  // Verificar si todas las lecciones en la sección han sido completadas
  connection.query(
    "SELECT COUNT(*) as totalLecciones FROM lecciones WHERE seccion_id = ?",
    [seccion_id],
    (error, results) => {
      if (error) {
        console.error("Error al verificar las lecciones:", error);
        res.status(500).send("Error al verificar las lecciones");
        return;
      }

      const totalLecciones = results[0].totalLecciones;

      connection.query(
        "SELECT COUNT(*) as leccionesCompletadas FROM progreso WHERE usuario_id = ? AND seccion_id = ?",
        [usuario_id, seccion_id],
        (error, results) => {
          if (error) {
            console.error("Error al verificar el progreso:", error);
            res.status(500).send("Error al verificar el progreso");
            return;
          }

          const leccionesCompletadas = results[0].leccionesCompletadas;

          if (leccionesCompletadas >= totalLecciones) {
            // Todas las lecciones en la sección han sido completadas, marcar la sección como completada
            connection.query(
              "INSERT INTO progreso (usuario_id, seccion_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE seccion_id = ?",
              [usuario_id, seccion_id, seccion_id],
              (error, results) => {
                if (error) {
                  console.error("Error al actualizar el progreso:", error);
                  res.status(500).send("Error al actualizar el progreso");
                  return;
                }
                res.json({ message: "Progreso actualizado con éxito" });
              }
            );
          } else {
            // No todas las lecciones en la sección han sido completadas, no se puede marcar la sección como completada
            res
              .status(400)
              .send(
                "Debes completar todas las lecciones en la sección antes de poder marcarla como completada"
              );
          }
        }
      );
    }
  );
});

app.get("/api/lecciones/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM lecciones WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los datos");
        return;
      }
      res.json(results[0]);
    }
  );
});

app.post("/api/registro", async (req, res) => {
  console.log("Recibida solicitud de registro");
  const { nombre, correo_electronico, contrasena } = req.body;

  // Encriptar la contraseña
  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  // Almacenar el usuario en la base de datos
  connection.query(
    "INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)",
    [nombre, correo_electronico, contrasenaEncriptada],
    (error, results) => {
      if (error) {
        console.error("Error al registrar al usuario:", error);
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send("El correo electrónico ya está en uso.");
        } else {
          res.status(500).send("Error al registrar al usuario.");
        }
        return;
      }
      res.json({ message: "Usuario registrado con éxito" });
    }
  );
});

app.post("/api/login", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  // Buscar al usuario en la base de datos
  connection.query(
    "SELECT * FROM usuarios WHERE correo_electronico = ? ",
    [correo_electronico],
    async (error, results) => {
      if (error) {
        console.error("Error al buscar al usuario:", error);
        res.status(500).send("Error al buscar al usuario");
        return;
      }

      if (results.length > 0) {
        const user = results[0];

        // Verificar que la contraseña proporcionada sea correcta
        const isPasswordCorrect = await bcrypt.compare(
          contrasena,
          user.contrasena
        );

        if (isPasswordCorrect) {
          // Crear un token de autenticación para el usuario
          const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
            expiresIn: "1h",
          });

          // Enviar el token al cliente
          res.json({ token, user });
        } else {
          res.status(401).send("Contraseña incorrecta");
        }
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  );
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Api ejecutándose en el puerto ${PORT}`);
});
