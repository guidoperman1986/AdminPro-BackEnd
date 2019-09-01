var express = require('express');

var app = express();

//rutas
app.get('/', (req,res,next)=>{//get recibe 3 parametros
    res.status(200).json({
        ok:true,
        mensaje:'Peticion realizada correctamente'
    })
})

module.exports = app;