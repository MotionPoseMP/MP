const controller = {};
const path = require('path');
let usuariosLista = [];
let Exito;
function getUsuarios() {
    return usuariosLista;
}
function getExito(){
    return Exito;
}

controller.list = (req, res)=>{
    req.getConnection((error, conexion) =>{
        conexion.query('SELECT correo, contrasena FROM usuarios', (error, filas) => {
            if(error){
                Exito = false;
            }else{
                //res.json(filas[0]);
                usuariosLista = filas;
                //console.log(filas[1].);
                Exito = true;
            }
            //usuariosLista.unshift({ Exito });
            
            res.sendFile(path.join(__dirname, '..', 'view', 'login.html'));
        });
    });
};
controller.view = (req, res) => {
    res.json({nombre: "Adulto"});
}

module.exports = controller;
module.exports.getUsuarios = getUsuarios;
module.exports.getExito = getExito;
