const express = require('express');
const morgan = require('morgan');
const path = require("path");
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const bodyParser = require('body-parser');
// Manejar solicitudes JSON
app.use(express.json());


// Configuración de acceso a la base de datos
const hostDB = "localhost";
const userDB = "root";
const passwordDB = "";
const portDB = 3306;
const databaseDB = 'motionpose';

// Importación de rutas
const usuarioRuta = require('./routes/usuarios');
const registroRuta = require('./routes/registroRuta');
// Configuración
app.set('port', process.env.PORT || 5555);

// Middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: hostDB,
    user: userDB,
    password: passwordDB,
    port: portDB,
    database: databaseDB
}, 'single'));

// Rutas
app.use('/login', usuarioRuta); 
app.use('/registro', registroRuta);
// Archivos estáticos
app.use(express.static('public'));

// API
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'view', 'index.html'))
}); 

app.listen(app.get('port'), ()=>{
    console.log('Server corriendo en puerto: ' + app.get('port'));
});