//requieres

var express = require('express');
var mongoose = require('mongoose');


//Inicializar variables
var app = express();

//coneccion con mongodb
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res)=>{
    if (err) throw err; //throw detiene todo el proceso
    
    console.log("Base de datos mongodb: \x1b[32m%s\x1b[0m",'online')
})


//rutas
app.get('/', (req,res,next)=>{//get recibe 3 parametros
    res.status(200).json({
        ok:true,
        mensaje:'Peticion realizada correctamente'
    })
})

//Escuchar peticiones

app.listen(3000,()=>{
    console.log("Aplicacion escuchando en el puerto 3000: \x1b[32m%s\x1b[0m",'online')
})