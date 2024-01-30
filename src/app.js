const express = require('express');
const app = express();
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Puerto en el que escuchará el servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
