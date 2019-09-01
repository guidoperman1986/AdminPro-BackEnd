var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

var app = express();

var Usuario = require('../models/usuario');

var SEED = require('../config/config').SEED;

app.post('/',(req,res)=>{
    var body = req.body;

    Usuario.findOne({email:body.email}, (err, usuarioDB)=>{
        if (err){
            if (err){
                return res.status(500).json({
                        ok:false,
                        mensaje:'Error al buscar usuarios',
                        errors: err
                })
            }
        }

        if (!usuarioDB){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - email',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - Password',
                errors: err
            })
        }

        // Cread un token
        usuarioDB.password = ":-="
        var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn: 14400}) //4 horas hata expirar

        res.status(200).send({
            ok:true,
            usuario:usuarioDB,
            token: token,
            id: usuarioDB._id
        })

    })

})




module.exports = app;