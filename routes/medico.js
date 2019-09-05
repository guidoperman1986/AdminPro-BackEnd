var express = require('express');
var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();

var Medico = require('../models/medico');

app.get('/',(req,res)=>{
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})// busca todos los campos y solo mostrame estos campos
            .populate('usuario', 'nombre email')
            .populate('hospital')            
            .skip(desde) //salta el nro de registros especificados
            .limit(5)
            .exec(
                (err,medicos)=>{
                    if (err){
                        return res.status(500).json({
                                ok:false,
                                mensaje:'Error cargando medicos',
                                errors: err
                        })
                    }
                    

                    Medico.count({},(err,conteo)=>{
                        res.status(200).json({
                            ok:true,
                            mensaje:medicos,
                            total:conteo
                        })
                    })
                }

            )
})

app.post('/', mdAutenticacion.verificaToken,(req,res)=>{
    var medico = req.body;
    var body = req.body;

    medico = new Medico({
        nombre: medico.nombre,        
        usuario : req.usuario._id,
        hospital : body.hospital
    })

    medico.save((err,medicoGuardado)=>{
        if (err){
            return res.status(400).json({
                    ok:false,
                    mensaje:'Error al crear el hospital',
                    errors: err
            })
        }

        res.status(201).json({
            ok:true,
            medico:medicoGuardado,          
        })
    })
})

app.put('/:id', mdAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id,(err,medico)=>{
        if (err){
            return res.status(500).json({
                    ok:false,
                    mensaje:'Error cargando medicos',
                    errors: err
            })
        }

        if (!medico){
            if (err){
                return res.status(400).json({
                        ok:false,
                        mensaje:'El medico con este id no existe',
                        errors: {message: 'No existe un medico con ese ID'}
                })
            }
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err,medicoActualizado)=>{
            if (err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al actualizar medico',
                    errors: err
                })
            }

            res.status(200).json({
                ok:true,
                medico:medicoActualizado
            })
        })
    })
})

app.delete('/:id', mdAutenticacion.verificaToken, (req,res)=>{
    var id = req.params.id;

    Medico.findOneAndDelete(id,(err,medicoBorrado)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar medico',
                errors: err
            })
        }

        if (!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'El medico con este id no existe',
                errors: {message: 'No existe un medico con ese ID'}
            })
        }

        res.status(200).json({
            ok:true,
            hospital:medicoBorrado
        })
    })
})

module.exports = app;