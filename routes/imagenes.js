var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

//rutas
app.get('/:tipo/:img', (req,res,next)=>{//get recibe 3 parametros
    var tipo = req.params.tipo;
    var img = req.params.img;
    
    var pathImagen = path.resolve( __dirname, `../uploads/${tipo}/${img}` );

    if (fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg')
        res.sendFile(pathNoImage)
    }


    //res.status(200).json({
    //    ok:true,
    //    mensaje:'Peticion realizada correctamente'
    //})
})

module.exports = app;