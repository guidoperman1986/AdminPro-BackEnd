//requieres

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

//body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Importar rutas
var appRoutes = require('./routes/app')
var busquedaRoutes = require('./routes/busqueda')
var hospitalRoutes = require('./routes/hospital')
var medicoRoutes = require('./routes/medico')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload')
var imagenesRoutes = require('./routes/imagenes')
//coneccion con mongodb
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res)=>{
    if (err) throw err; //throw detiene todo el proceso
    
    console.log("Base de datos mongodb: \x1b[32m%s\x1b[0m",'online')
})

//server index config
/* var serveIndex = require('serve-index'); */
/* app.use(express.static(__dirname + '/')) */
/* app.use('/uploads', serveIndex(__dirname + '/uploads')); */

//Rutas
app.use('/img', imagenesRoutes)
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);



//Escuchar peticiones

app.listen(3000,()=>{
    console.log("Aplicacion escuchando en el puerto 3000: \x1b[32m%s\x1b[0m",'online')
})