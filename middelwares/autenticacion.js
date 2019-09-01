var jwt = require('jsonwebtoken')
var SEED = require('../config/config').SEED;

//************************************************
 // Verificar token
 //************************************************
exports.verificaToken = function(req,res,next){    
    var token = req.query.token;

    jwt.verify(token, SEED, (err,decoded)=>{  //decoded es la info del usuario
        if (err){
            return res.status(401).json({
                    ok:false,
                    mensaje:'TOKEN incorrecto',
                    errors: err
            })
        }

        req.usuario = decoded.usuario;

        next();
        
        
        //return res.status(200).json({
        //    ok:true,
        //    decode:decoded
        //})
    })
}

