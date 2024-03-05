//Conexion con MongoDB

const mongoose = require("mongoose");

//Conectar la base de datos

mongoose.connect("mongodb+srv://janostra:4fZ2bd5ATBeIuUE1@cluster0.oyi4lr4.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("Conexion exitosa"))
    .catch(()=>console.log("Error en la conexion"))

