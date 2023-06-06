const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Configura el transporte de correo
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aprendespringboot@gmail.com", // Tu correo electrónico
    pass: "kxhrchihfvddicyx", // Tu contraseña
  },
});

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

app.post("/api/forgot-password", async (req, res) => {
  const { correo_electronico } = req.body;

  // Envía el correo electrónico de notificación
  let mailOptions = {
    from: "aprendespringboot@gmail.com",
    to: "aprendespringboot@gmail.com",
    subject: "Notificación de olvido de contraseña",
    text: `El usuario con el correo electrónico ${correo_electronico} ha olvidado su contraseña.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send("Error al enviar el correo electrónico de notificación");
    } else {
      res.send(
        "Se ha enviado un correo electrónico de notificación a aprendespringboot@gmail.com"
      );
    }
  });
});

app.get("/api/usuarios", (req, res) => {
  // Obtén el token de autenticación del encabezado de la solicitud
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("No se proporcionó un token de autenticación");
    return;
  }

  // El encabezado de autorización generalmente tiene el formato "Bearer [token]"
  const token = authHeader.split(" ")[1];

  try {
    // Decodifica el token para obtener el ID del usuario
    const decodedToken = jwt.verify(token, "your_jwt_secret");
    const userId = decodedToken.id;
    connection.query(
      "SELECT id, nombre, correo_electronico, ultima_leccion_vista, imagen_url, admin FROM usuarios",
      (error, results) => {
        if (error) {
          console.error("Error al obtener los datos:", error);
          res.status(500).send("Error al obtener los datos");
          return;
        }
        res.json(results);
      }
    );
  } catch (error) {
    res.status(401).send("Token inválido");
    return;
  }
});

// Actualzar nombre usuario
app.put("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  connection.query(
    "UPDATE usuarios SET nombre = ? WHERE id = ?",
    [nombre, id],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar el nombre del usuario:", error);
        res.status(500).send("Error al actualizar el nombre del usuario");
        return;
      }
      res.status(200).send("Nombre del usuario actualizado con éxito.");
    }
  );
});

app.get("/api/examenes", (req, res) => {
  connection.query("SELECT * FROM Examenes", (error, results) => {
    if (error) {
      console.error("Error al obtener los exámenes:", error);
      res.status(500).send("Error al obtener los exámenes");
      return;
    }
    res.json(results);
  });
});

app.get("/api/examenes/:seccion_id", (req, res) => {
  connection.query(
    "SELECT * FROM examenes WHERE seccion_id = ?",
    [req.params.seccion_id],
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

app.get("/api/leccionesOrdenadas", (req, res) => {
  // Obtén el token de autenticación del encabezado de la solicitud
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("No se proporcionó un token de safas");
    return;
  }

  // El encabezado de autorización generalmente tiene el formato "Bearer [token]"
  const token = authHeader.split(" ")[1];

  try {
    // Decodifica el token para obtener el ID del usuario
    const decodedToken = jwt.verify(token, "your_jwt_secret");

    connection.query(
      "SELECT id, seccion_id, nombre, video_url FROM lecciones ORDER BY seccion_id ASC, id ASC",
      (error, results) => {
        if (error) {
          console.error("Error al obtener los datos:", error);
          res.status(500).send("Error al obtener los datos");
          return;
        }
        res.json(results);
      }
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).send("Token de autenticación expirado");
    } else {
      console.error("Error al decodificar el token de autenticación:", error);
      res.status(401).send("Token de autenticación inválido");
    }
  }
});

app.get("/api/lecciones_completadas/:userId", (req, res) => {
  const { userId } = req.params;

  connection.query(
    "SELECT lecciones_completadas.*, lecciones.nombre FROM lecciones_completadas INNER JOIN lecciones ON lecciones_completadas.leccion_id = lecciones.id WHERE lecciones_completadas.usuario_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener las lecciones completadas:", error);
        res.status(500).send("Error al obtener las lecciones completadas");
        return;
      }

      res.json(results); // Devuelve todos los registros obtenidos
    }
  );
});

app.get("/api/pregunta_aleatoria/:leccionId", (req, res) => {
  const { leccionId } = req.params;

  connection.query(
    "SELECT * FROM preguntas WHERE leccion_id = ? ORDER BY RAND() LIMIT 1",
    [leccionId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener la pregunta:", error);
        res.status(500).send("Error al obtener la pregunta");
        return;
      }

      if (results.length === 0) {
        res.status(404).send("No se encontraron preguntas para esta lección");
        return;
      }

      res.json([results[0]]);
    }
  );
});

// Insertar las lecciones completadas por el usuario
app.post("/api/lecciones_completadas", (req, res) => {
  const { leccion_id, usuario_id, completada } = req.body;

  // Comprobar si el usuario ya ha completado esta lección
  connection.query(
    "SELECT * FROM lecciones_completadas WHERE leccion_id = ? AND usuario_id = ?",
    [leccion_id, usuario_id],
    (err, existingEntry) => {
      if (err) {
        console.error("Error al seleccionar de lecciones_completadas:", err);
        res
          .status(500)
          .send("Hubo un error al comprobar si la lección fue completada.");
        return;
      }

      if (existingEntry.length > 0) {
        res
          .status(409)
          .send("La lección ya ha sido completada por este usuario.");
        return;
      }

      const fecha_completada = new Date();

      connection.query(
        "INSERT INTO lecciones_completadas (leccion_id, usuario_id, fecha) VALUES (?, ?, ?)",
        [leccion_id, usuario_id, fecha_completada],
        (err) => {
          if (err) {
            console.error("Error al insertar en lecciones_completadas:", err);
            res
              .status(500)
              .send("Hubo un error al registrar la lección completada.");
            return;
          }

          res.status(201).send("Lección completada registrada con éxito.");
        }
      );
    }
  );
});

app.get("/api/progreso/:userId", (req, res) => {
  const { userId } = req.params;

  // Obtén el número total de lecciones
  connection.query(
    "SELECT COUNT(*) as totalLecciones FROM lecciones",
    (error, results) => {
      if (error) {
        console.error("Error al obtener el total de lecciones:", error);
        res.status(500).send("Error al obtener el total de lecciones");
        return;
      }

      const totalLecciones = results[0].totalLecciones;

      // Obtén el número de lecciones que el usuario ha completado, si ha hecho bien el test la lección se considera completada
      connection.query(
        "SELECT COUNT(*) as leccionesCompletadas FROM lecciones_completadas WHERE usuario_id = ?",
        [userId],
        (error, results) => {
          if (error) {
            console.error("Error al obtener las lecciones completadas:", error);
            res.status(500).send("Error al obtener las lecciones completadas");
            return;
          }

          const leccionesCompletadas = results[0].leccionesCompletadas;

          // Calcula el porcentaje de lecciones completadas
          const porcentajeCompletado = Math.round(
            (leccionesCompletadas / totalLecciones) * 100
          );

          res.json({ porcentajeCompletado });
        }
      );
    }
  );
});

app.get("/api/lecciones/:id", (req, res) => {
  const { id } = req.params;

  // Obtén el token de autenticación del encabezado de la solicitud
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("No se proporcionó un token de autenticación");
    return;
  }

  // El encabezado de autorización generalmente tiene el formato "Bearer [token]"
  const token = authHeader.split(" ")[1];

  try {
    // Decodifica el token para obtener el ID del usuario
    const decodedToken = jwt.verify(token, "your_jwt_secret");
    const userId = decodedToken.id;

    connection.query(
      "SELECT * FROM lecciones WHERE id = ?",
      [id],
      (error, results) => {
        if (error) {
          console.error("Error al obtener los datos:", error);
          res.status(500).send("Error al obtener los datos");
          return;
        }

        // Si no se encontró ninguna lección con el ID proporcionado, devolver un error
        if (results.length === 0) {
          res.status(404).send("Lección no encontrada");
          return;
        }

        // Actualizar la última lección vista por el usuario
        if (id !== "null") {
          connection.query(
            "UPDATE usuarios SET ultima_leccion_vista = ? WHERE id = ?",
            [id, userId],
            (error) => {
              if (error) {
                console.error(
                  "Error al actualizar la última lección vista:",
                  error
                );
                res
                  .status(500)
                  .send("Error al actualizar la última lección vista");
                return;
              }
            }
          );
        } else {
          console.error("Error: id de lección es null");
          res.status(400).send("Error: id de lección es null");
          return;
        }
        res.json(results[0]);
      }
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).send("Token de autenticación expirado");
    } else {
      console.error("Error al decodificar el token de autenticación:", error);
      res.status(401).send("Token de autenticación inválido");
    }
  }
});

app.get("/api/ultima_leccion_vista/:userId", (req, res) => {
  const { userId } = req.params;

  // Obtén el token de autenticación del encabezado de la solicitud
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("No se proporcionó un token de autenticación");
    return;
  }

  // El encabezado de autorización generalmente tiene el formato "Bearer [token]"
  const token = authHeader.split(" ")[1];

  try {
    // Decodifica el token para obtener el ID del usuario
    const decodedToken = jwt.verify(token, "your_jwt_secret");
    const tokenUserId = decodedToken.id;

    // Verifica que el ID del usuario del token coincide con el ID del usuario de la ruta
    if (tokenUserId !== parseInt(userId)) {
      res.status(403).send("No tienes permiso para acceder a estos datos");
      return;
    }

    connection.query(
      "SELECT ultima_leccion_vista FROM usuarios WHERE id = ?",
      [userId],
      (error, results) => {
        if (error) {
          console.error("Error al obtener la última lección vista:", error);
          res.status(500).send("Error al obtener la última lección vista");
          return;
        }

        res.json({ leccionId: results[0].ultima_leccion_vista });
      }
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).send("Token de autenticación expirado");
    } else {
      console.error("Error al decodificar el token de autenticación:", error);
      res.status(401).send("Token de autenticación inválido");
    }
  }
});

app.post("/api/registro", async (req, res) => {
  const { nombre, correo_electronico, contrasena, imagen_url } = req.body;

  // Encriptar la contraseña
  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  // Almacenar el usuario en la base de datos
  connection.query(
    "INSERT INTO usuarios (nombre, correo_electronico, contrasena, ultima_leccion_vista, imagen_url) VALUES (?, ?, ?, 1, ?)",
    [nombre, correo_electronico, contrasenaEncriptada, imagen_url],
    (error, results) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send("El correo electrónico ya está en uso.");
        } else {
          res.status(500).send("Error al registrar al usuario.");
        }
        return;
      }

      // Después de que el registro del usuario se complete con éxito:
      let mailOptions = {
        from: "aprendespringboot@gmail.com",
        to: req.body.correo_electronico, // correo del usuario
        subject: "Registro Exitoso",
        text: `Hola ${req.body.nombre}, ¡bienvenido! Te has registrado con éxito.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Correo enviado: " + info.response);
        }
      });

      // Crear un token de autenticación para el usuario
      const token = jwt.sign({ id: results.insertId }, "your_jwt_secret", {
        expiresIn: "2h",
      });

      // Enviar el token y los datos del usuario al cliente
      res.json({
        token,
        user: {
          id: results.insertId, // Obtener el ID del usuario recién registrado para crear el token
          nombre: nombre,
          correo_electronico: correo_electronico,
          imagen_url: imagen_url,
          admin: false,
        },
      });
    }
  );
});

app.post("/api/login", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  // Buscar al usuario en la base de datos
  connection.query(
    "SELECT id, nombre, correo_electronico, contrasena, imagen_url FROM usuarios WHERE correo_electronico = ? ",
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

          // Enviar el token y los datos del usuario al cliente
          res.json({
            token,
            user: {
              id: user.id,
              nombre: user.nombre,
              correo_electronico: user.correo_electronico,
              imagen_url: user.imagen_url,
              admin: false,
            },
          });
        } else {
          res.status(401).send("Contraseña incorrecta");
        }
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  );
});

// Insertar las secciones completadas por el usuario
app.post("/api/secciones_completadas", (req, res) => {
  const { seccion_id, usuario_id } = req.body;

  // Comprobar si el usuario ya ha completado esta sección
  connection.query(
    "SELECT * FROM secciones_completadas WHERE seccion_id = ? AND usuario_id = ?",
    [seccion_id, usuario_id],
    (err, existingEntry) => {
      if (err) {
        console.error("Error al seleccionar de secciones_completadas:", err);
        res
          .status(500)
          .send("Hubo un error al comprobar si la sección fue completada.");
        return;
      }

      if (existingEntry.length > 0) {
        res
          .status(409)
          .send("La sección ya ha sido completada por este usuario.");
        return;
      }

      const fecha_completada = new Date();

      connection.query(
        "INSERT INTO secciones_completadas (seccion_id, usuario_id, fecha_completada) VALUES (?, ?, ?)",
        [seccion_id, usuario_id, fecha_completada],
        (err) => {
          if (err) {
            console.error("Error al insertar en secciones_completadas:", err);
            res
              .status(500)
              .send("Hubo un error al registrar la sección completada.");
            return;
          }

          res.status(201).send("Sección completada registrada con éxito.");
        }
      );
    }
  );
});

app.get("/api/secciones_completadas/:userId", (req, res) => {
  const { userId } = req.params;

  connection.query(
    "SELECT * FROM secciones_completadas WHERE usuario_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener las secciones completadas:", error);
        res.status(500).send("Error al obtener las secciones completadas");
        return;
      }

      res.json(results); // Devuelve todos los registros obtenidos
    }
  );
});

// Relacionado con los examenes
app.get("/api/examen/:seccionId", (req, res) => {
  const { seccionId } = req.params;

  connection.query(
    "SELECT * FROM Examenes WHERE seccion_id = ?",
    [seccionId],
    (error, examenes) => {
      if (error) {
        console.error("Error al obtener los examenes:", error);
        res.status(500).send("Error al obtener los examenes");
        return;
      }

      res.json(examenes);
    }
  );
});

app.get("/api/PreguntasExamen/:examenId", (req, res) => {
  const { examenId } = req.params;

  connection.query(
    "SELECT * FROM PreguntasExamen WHERE idExamen = ? ORDER BY RAND() LIMIT 5",
    [examenId],
    (error, preguntas) => {
      if (error) {
        console.error("Error al obtener las preguntas:", error);
        res.status(500).send("Error al obtener las preguntas");
        return;
      }

      res.json(preguntas);
    }
  );
});

app.get("/api/RespuestasExamen/:preguntaId", (req, res) => {
  const { preguntaId } = req.params;

  connection.query(
    "SELECT * FROM RespuestasExamen WHERE idPregunta = ? ORDER BY RAND()",
    [preguntaId],
    (error, respuestas) => {
      if (error) {
        console.error("Error al obtener las respuestas:", error);
        res.status(500).send("Error al obtener las respuestas");
        return;
      }

      res.json(respuestas);
    }
  );
});

// Obtener los exámenes completados por el usuario
app.get("/api/examenes_completados/:userId", (req, res) => {
  const { userId } = req.params;

  connection.query(
    "SELECT * FROM examenes_completados WHERE usuario_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener los exámenes completados:", error);
        res.status(500).send("Error al obtener los exámenes completados");
        return;
      }

      res.json(results); // Devuelve todos los registros obtenidos
    }
  );
});

app.post("/api/examenes_completados", (req, res) => {
  const { examen_id, usuario_id } = req.body;

  // Primero, verifica si el usuario ya ha completado el examen
  connection.query(
    "SELECT * FROM examenes_completados WHERE examen_id = ? AND usuario_id = ?",
    [examen_id, usuario_id],
    (error, results) => {
      if (error) {
        console.error("Error al verificar el examen:", error);
        res.status(500).send("Error al verificar el examen");
        return;
      }

      // Si el usuario ya ha completado el examen, no se realiza la inserción
      if (results.length > 0) {
        res.status(409).send("El usuario ya ha completado este examen.");
        return;
      }

      // Si el usuario no ha completado el examen, se realiza la inserción
      connection.query(
        "INSERT INTO examenes_completados (examen_id, usuario_id) VALUES (?, ?)",
        [examen_id, usuario_id],
        (error) => {
          if (error) {
            console.error("Error al marcar el examen como completado:", error);
            res.status(500).send("Error al marcar el examen como completado");
            return;
          }

          res.status(201).send("Examen marcado como completado con éxito.");
        }
      );
    }
  );
});

// Agregar una nueva sección
app.post("/api/secciones", (req, res) => {
  const { nombre, descripcion } = req.body;

  connection.query(
    "INSERT INTO secciones (nombre, descripcion) VALUES (?, ?)",
    [nombre, descripcion],
    (error, results) => {
      if (error) {
        console.error("Error al agregar la sección:", error);
        res.status(500).send("Error al agregar la sección");
        return;
      }
      res.status(201).send("Sección agregada con éxito.");
    }
  );
});

// Editar una sección existente
app.put("/api/secciones/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  connection.query(
    "UPDATE secciones SET nombre = ?, descripcion = ? WHERE id = ?",
    [nombre, descripcion, id],
    (error, results) => {
      if (error) {
        console.error("Error al editar la sección:", error);
        res.status(500).send("Error al editar la sección");
        return;
      }
      res.status(200).send("Sección editada con éxito.");
    }
  );
});

// Agregar leccion
app.post("/api/lecciones", (req, res) => {
  const { nombre, seccion_id, video_url, contenido } = req.body;

  connection.query(
    "INSERT INTO lecciones (nombre, seccion_id, video_url, contenido) VALUES (?, ?, ?, ?)",
    [nombre, seccion_id, video_url, contenido],
    (error, results) => {
      if (error) {
        console.error("Error al agregar la lección:", error);
        res.status(500).send("Error al agregar la lección");
        return;
      }
      res.status(201).send("Lección agregada con éxito.");
    }
  );
});

// Editar leccion
app.put("/api/lecciones/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, seccion_id, video_url, contenido } = req.body;

  connection.query(
    "UPDATE lecciones SET nombre = ?, seccion_id = ?, video_url = ?, contenido = ? WHERE id = ?",
    [nombre, seccion_id, video_url, contenido, id],
    (error, results) => {
      if (error) {
        console.error("Error al editar la lección:", error);
        res.status(500).send("Error al editar la lección");
        return;
      }
      res.status(200).send("Lección editada con éxito.");
    }
  );
});

// Eliminar leccion
app.delete("/api/lecciones/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM lecciones_completadas WHERE leccion_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error al eliminar las lecciones completadas:", error);
        res.status(500).send("Error al eliminar las lecciones completadas");
        return;
      }

      connection.query(
        "DELETE FROM lecciones WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error("Error al eliminar la lección:", error);
            res.status(500).send("Error al eliminar la lección");
            return;
          }
          if (results.affectedRows === 0) {
            res
              .status(404)
              .send("No se encontró la lección con el id especificado");
            return;
          }
          res.status(200).send("Lección eliminada con éxito.");
        }
      );
    }
  );
});

/* EXAMEN */
// Agregar examen
app.post("/api/examenes", (req, res) => {
  const { nombre, seccion_id } = req.body;

  connection.query(
    "INSERT INTO Examenes (nombre, seccion_id) VALUES (?, ?)",
    [nombre, seccion_id],
    (error, results) => {
      if (error) {
        console.error("Error al agregar el examen:", error);
        res.status(500).send("Error al agregar el examen");
        return;
      }
      res.status(201).send("Examen agregado con éxito.");
    }
  );
});

// Comprobación de examen
app.get("/api/examenes/seccion/:seccionId", (req, res) => {
  const { seccionId } = req.params;

  connection.query(
    "SELECT * FROM Examenes WHERE seccion_id = ?",
    [seccionId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el examen:", error);
        res.status(500).send("Error al obtener el examen");
        return;
      }

      if (results.length > 0) {
        res.status(409).send("Ya existe un examen para esta sección");
      } else {
        res.status(200).send("No existe un examen para esta sección");
      }
    }
  );
});

// Editar examen
app.put("/api/examenes/:id", (req, res) => {
  const { nombre } = req.body;
  const { id } = req.params;

  connection.query(
    "UPDATE Examenes SET nombre = ? WHERE id = ?",
    [nombre, id],
    (error, results) => {
      if (error) {
        console.error("Error al editar el examen:", error);
        res.status(500).send("Error al editar el examen");
        return;
      }
      if (results.affectedRows === 0) {
        res
          .status(404)
          .send("No se encontró el examen con el id especificado.");
        return;
      }
      res.status(200).send("Examen editado con éxito.");
    }
  );
});

// Eliminar examen
app.delete("/api/examenes/:id", (req, res) => {
  const { id } = req.params;

  // Primero, elimina los examenes completados asociados al examen
  connection.query(
    "DELETE FROM examenes_completados WHERE examen_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error al eliminar los examenes completados:", error);
        res.status(500).send("Error al eliminar los examenes completados");
        return;
      }

      // Luego, elimina las respuestas del examen
      connection.query(
        "DELETE RespuestasExamen FROM RespuestasExamen INNER JOIN PreguntasExamen ON RespuestasExamen.idPregunta = PreguntasExamen.id WHERE PreguntasExamen.idExamen = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error(
              "Error al eliminar las respuestas del examen:",
              error
            );
            res.status(500).send("Error al eliminar las respuestas del examen");
            return;
          }

          // Luego, elimina las preguntas del examen
          connection.query(
            "DELETE FROM PreguntasExamen WHERE idExamen = ?",
            [id],
            (error, results) => {
              if (error) {
                console.error(
                  "Error al eliminar las preguntas del examen:",
                  error
                );
                res
                  .status(500)
                  .send("Error al eliminar las preguntas del examen");
                return;
              }

              // Finalmente, elimina el examen
              connection.query(
                "DELETE FROM Examenes WHERE id = ?",
                [id],
                (error, results) => {
                  if (error) {
                    console.error("Error al eliminar el examen:", error);
                    res.status(500).send("Error al eliminar el examen");
                    return;
                  }
                  res.status(200).send("Examen eliminado con éxito.");
                }
              );
            }
          );
        }
      );
    }
  );
});

// Agregar una pregunta
app.post("/api/preguntasExamen", (req, res) => {
  const { idExamen, pregunta } = req.body;

  connection.query(
    "INSERT INTO PreguntasExamen (idExamen, pregunta) VALUES (?, ?)",
    [idExamen, pregunta],
    (error, results) => {
      if (error) {
        console.error("Error al agregar la pregunta:", error);
        res.status(500).send("Error al agregar la pregunta");
        return;
      }

      // Devuelve el id de la pregunta recién creada
      res.status(200).json({ id: results.insertId });
    }
  );
});

// Agregar una respuesta
app.post("/api/respuestasExamen", (req, res) => {
  const { idPregunta, respuesta, correcta } = req.body;

  connection.query(
    "INSERT INTO RespuestasExamen (idPregunta, respuesta, correcta) VALUES (?, ?, ?)",
    [idPregunta, respuesta, correcta],
    (error, results) => {
      if (error) {
        console.error("Error al agregar la respuesta:", error);
        res.status(500).send("Error al agregar la respuesta");
        return;
      }

      res.status(200).send("Respuesta agregada con éxito.");
    }
  );
});

// Admin

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Api ejecutándose en el puerto ${PORT}`);
});
