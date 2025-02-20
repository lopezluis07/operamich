// 1. Importar Módulos Básicos
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Para cargar las variables de entorno

// 2. Importar Configuración de Base de Datos
const { sequelize } = require('./models'); // Importar la instancia de sequelize correctamente desde models

// 3. Importar Rutas
const loginRoutes = require('./routes/loginRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const registrosRoutes = require('./routes/registrosOperariosRoutes');
const actividadesRoutes = require('./routes/actividadesRoutes');
const subactividadesRoutes = require('./routes/subactividadesRoutes');
const seccionesRoutes = require('./routes/seccionesRoutes');
const lotesRoutes = require('./routes/lotesRoutes');
const registroRoutes = require('./routes/registroRoutes');
const driverRoutes = require ('./routes/driverRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const gruposRoutes = require('./routes/gruposRoutes');
const cookieParser = require('cookie-parser');


// 4. Importar Middlewares
const verifyToken = require('./middlewares/verifyToken');
const errorHandler = require('./middlewares/errorHandler'); // Middleware para manejar errores

// 5. Inicializar la Aplicación
const app = express();

// 6. Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000', 
  'http://192.168.1.99:3000', 
  'http://34.239.151.13',
  'https://appsupervisores.juxn3.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true // Permitir cookies o encabezados de autenticación
}));

// 7. Middlewares Básicos
app.use(bodyParser.json()); // Para parsear JSON

// 8. Rutas de la API
app.use('/api/login', loginRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/registros-operarios', registrosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/subactividades', subactividadesRoutes);
app.use('/api/secciones', seccionesRoutes);
app.use('/api/lotes', lotesRoutes);
app.use("/api", registroRoutes);
app.use("/api", driverRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api', gruposRoutes);
app.use(cookieParser());


// 9. Rutas de Prueba o Protegidas
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Accediste a una ruta protegida.' });
});

// 10. Middleware para Manejar Errores
app.use(errorHandler);

// 11. Conectar a la Base de Datos y Arrancar el Servidor
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);

    // Mensaje más detallado sobre problemas de conexión
    if (err.original && err.original.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error de conexión: Verifica tu usuario y contraseña de la base de datos.');
    } else {
      console.error('Error de conexión: Verifica la configuración del servidor de la base de datos.');
    }
  });

module.exports = app;
