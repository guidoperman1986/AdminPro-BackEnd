var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs')

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

//rutas
app.put('/:tipo/:id', (req,res,next)=>{//get recibe 3 parametros
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales','medicos','usuarios'];

    if (tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            mensaje:'Tipo de coleccion no valido',
            errors: {message: 'El tipo de coleccion no es valido'}
        })
    }

    if (!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'No se selecciono nada',
            errors: {message: 'Debe seleccionar una imagen'}
        })
    }

    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length -1];

    //extensiones permitidas
    var extensionesValidas = ['png','jpg','gif','jpeg']
    
    if (extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            mensaje:'Extension no valida',
            errors: {message: 'Las extensiones validas son '+ extensionesValidas.join(', ')}
        })
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path,err=>{
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al mover el archivo',
                errors: err
            })
        }
        
        subirPorTipo(tipo, id, nombreArchivo, res);
        //res.status(200).json({
        //    ok:true,
        //    mensaje:'Archivo movido'
        //})
    })


})

function subirPorTipo(tipo, id, nombreArchivo, res){   
    console.log("TIPO "+tipo) 
    if (tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario)=>{            
            if (!usuario){
                return res.status(400).json({
                    ok:false,
                    mensaje:'El usuario no existe',
                    errors: {message: 'El usuario no existe'}
                })
            }

            var pathViejo = './uploads/usuarios/'+usuario.img;
                        
            //si ya hay una imagen con ese path la borro            
            if (!fs.existsSync(pathViejo)) {
            } else {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al reemplazar la Imagen',
                            errors: err
                        });
                    }
                });
            }      

            usuario.img = nombreArchivo;
            usuario.save((err,usuarioActualizado) =>{

                usuarioActualizado.passWord = ':->';

                if (err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'Error al mover el archivo',
                        errors: err
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de usuario Actualizado',
                    usuario:usuarioActualizado
                })
            
            })
        })
    }

    if (tipo === 'medicos'){
        Medico.findById(id, (err, medico)=>{       
            if (!medico){
                return res.status(400).json({
                    ok:false,
                    mensaje:'El medico no existe',
                    errors: {message: 'El medico no existe'}
                })
            }
            
            var pathViejo = './uploads/medicos/'+medico.img;

            //si ya hay una imagen con ese path la borro            
            if (!fs.existsSync(pathViejo)) {
            } else {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al reemplazar la Imagen',
                            errors: err
                        });
                    }
                });
            }      

            medico.img = nombreArchivo;
            medico.save((err,medicoActualizado) =>{
                medicoActualizado.passWord = ':->'

                if (err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'Error al mover el archivo',
                        errors: err
                    })
                }
                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de medico Actualizado',
                    medico:medicoActualizado
                })            
            })
        })
    }
    if (tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital)=>{            
            if (!hospital){
                return res.status(400).json({
                    ok:false,
                    mensaje:'El hospital no existe',
                    errors: {message: 'El hospital no existe'}
                })
            }

            var pathViejo = './uploads/hospital/'+hospital.img;
                        
            //si ya hay una imagen con ese path la borro            
            if (!fs.existsSync(pathViejo)) {
            } else {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al reemplazar la Imagen',
                            errors: err
                        });
                    }
                });
            }      
                      
            hospital.img = nombreArchivo;
            hospital.save((err,hospitalActualizado) =>{
                hospitalActualizado.passWord = ':->'

                if (err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'Error al mover el archivo',
                        errors: err
                    })
                }
                return res.status(200).json({
                    ok:true,
                    mensaje:'Imagen de hospital Actualizado',
                    hospital:hospitalActualizado
                })
            
            })
        })
    }
}

module.exports = app;