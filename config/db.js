const { Sequelize } = require('sequelize'); 
const dotenv = require('dotenv');

// Cargar variables de entorno desde un archivo .env
dotenv.config();    

// Configuración de Sequelize para conectarse a la base de datos
// Los valores son tomados de las variables de entorno definidas en el archivo .env
const sequelize = new Sequelize(
    process.env.DB_NAME, // Nombre de la base de datos
    process.env.DB_USER, // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña de la base de datos
    {
        host: process.env.DB_HOST, // Dirección del servidor de la base de datos
        dialect: 'mysql' // Tipo de base de datos (en este caso, MySQL)
    }
);

// Probar la conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log('Conectado a la base de datos')) // Conexión exitosa
    .catch(err => console.error('Error conectando a la base de datos', err)); // Manejo de errores

// Exportar la instancia de Sequelize para que pueda ser utilizada en otros módulos
module.exports = sequelize;
        