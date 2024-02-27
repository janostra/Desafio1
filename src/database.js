//Conexion con MongoDB

const mongoose = require("mongoose");

//Conectar la base de datos

mongoose.connect("mongodb+srv://1@cluster0.oyi4lr4.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("Conexion exitosa"))
    .catch(()=>console.log("Error en la conexion"))

    //FALTA CONECTARSE CON EL SERVIDOR, SE QUITÓ USUARIO Y CONTRASEÑA