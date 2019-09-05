var express = require('express');
var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

 //************************************************
 // Traer todos los hospitales
 //************************************************
 app.get('/', (req,res,next)=>{//get recibe 3 parametros
    var desde = req.query.desde || 0;
    desde = Number(desde);


    Hospital.find({})// busca todos los campos y solo mostrame estos campos
            .populate('usuario', 'nombre email')
            .skip(desde) //salta el nro de registros especificados
            .limit(5)
            .exec(
                (err,hospitales)=>{
                    if (err){
                        return res.status(500).json({
                                ok:false,
                                mensaje:'Error cargando usuarios',
                                errors: err
                        })
                    }

                    Hospital.count({},(err,conteo)=>{
                        res.status(200).json({
                            ok:true,
                            mensaje:hospitales,
                            total:conteo            
                        })
                    })                
                }
            )
})

app.post('/', mdAutenticacion.verificaToken,(req,res)=>{
    var hospital = req.body;

    var hospital = new Hospital({
        nombre : hospital.nombre,    
        usuario : req.usuario._id
    })

    hospital.save((err,hospitalGuardado)=>{
        if (err){
            return res.status(400).json({
                    ok:false,
                    mensaje:'Error al crear el hospital',
                    errors: err
            })
        }

        res.status(201).json({
            ok:true,
            hospital:hospitalGuardado,          
        })
    })
})

app.put('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id,(err, hospital)=>{
        if (err){
            return res.status(500).json({
                    ok:false,
                    mensaje:'Error al buscar hospital',
                    errors: err
            })
        }

        if (!hospital){
            if (err){
                return res.status(400).json({
                        ok:false,
                        mensaje:'El hospital con este id no existe',
                        errors: {message: 'No existe un hospital con ese ID'}
                })
            }
        }

        hospital.nombre = body.nombre;        
        hospital.usuario = req.usuario._id;

        hospital.save((err,hospitalActualizado)=>{
            if (err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al actualizar hospital',
                    errors: err
                })
            }

            res.status(200).json({
                ok:true,
                hospital:hospitalActualizado
            })
        })
    })

})

app.delete('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;    

    Hospital.findOneAndDelete(id,(err,hospitalBorrado)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar hospital',
                errors: err
            })
        }

        if (!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'El hospital con este id no existe',
                errors: {message: 'No existe un hospital con ese ID'}
            })
        }

        res.status(200).json({
            ok:true,
            hospital:hospitalBorrado
        })
    })
})

module.exports = app;