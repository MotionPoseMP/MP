const controller = {};
const path = require('path');
const bcrypt = require('bcrypt');

controller.view = async (req, res)=>{
    if(req.session.loggedin != true){
        res.sendFile(path.join(__dirname, '..', 'view', 'login.html'));
    }else{
        res.redirect('/lobby');
    }
};
controller.post = async (req, res) => {
    console.log("controller.post");
    let Exito;
    let contrasena =  req.body.contrasena;
    let msg;
    if (req.body.correo == '' || req.body.correo === undefined) {
        Exito = false;
        msg = "El correo no puede estár vacío.";
        console.error(msg);
        res.json({Exito: Exito, msg: msg});
    }else{
        req.getConnection((error, conexion) =>{
            console.log("myconn");
            if(error) {
                Exito = false;
                msg = "Ha ocurrido un error inesperado en la consulta getConnection.";
                console.error(msg);
                res.json({Exito: Exito, msg: msg});
            }else {
                //console.log("Llegue");
                conexion.query('SELECT * FROM usuario WHERE correo = ? AND estado = 1', [req.body.correo], (error, filas) => {
                    //console.log(filas);
                    if (filas != undefined){
                        if(filas.length == 0){
                            Exito = false;
                            msg = "No se encontró el correo.";
                            console.error(msg);
                            res.json({Exito: Exito, msg: msg});
                        }else{
                            if(error){
                                Exito = false;
                                msg = error.code;
                                console.error(msg);
                                res.json({Exito: Exito, msg: msg});
                            }else{
                                filas = filas[0];
                                bcrypt.compare(req.body.contrasena, filas.contrasena, (error, coinciden) => {
                                    if (error){
                                        Exito = false;
                                        msg = "Ha ocurrido un error inesperado en la consulta bcrypt.";
                                        console.error(msg);
                                        res.json({Exito: Exito, msg: msg});
                                    }else{
                                        if(coinciden == true) {
                                            msg = "Iniciando sesión...";
                                            Exito = true;
                                            req.session.loggedin = true;
                                            req.session.nombre_usuario = filas.nombre;
                                            req.session.correo = filas.correo;
                                            req.session.id_usuario = filas.id_usuario;
                                            req.session.contrasena = filas.contrasena;
                                            req.session.id_tipo = filas.id_tipo;
                                            res.json({Exito: Exito, msg: msg, correo: req.body.correo, contrasena: contrasena});
                                        }else{
                                            msg = "Correo o contraseña incorrecta."
                                            Exito = false;
                                            res.json({Exito: Exito, msg: msg});
                                        }
                                    }
                                });
                            }
                        }
                    }
                    

                    
                });
            }
        });
    }
}

module.exports = controller;
