const express = require('express');
const app = express();
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.routes");
const exphbs = require("express-handlebars");
const socket = require("socket.io");

//Configuramos handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Puerto en el que escuchará el servidor
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

//Debo obtener el array:
const ProductManager = require("./controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/Products.JSON");

//Creamos el server de socket.io:
const io = socket(httpServer);
io.on("connection", async (socket) => {
  console.log("Un cliente se conecto al servidor.");

  //Enviamos el array de productos al cliente que se conectó:
  socket.emit("productos", await productManager.getAllProducts())

  //Recibimos el evento eliminarProducto desde el cliente:
  socket.on("eliminarProducto", async (id)=>{
      await productManager.deleteProduct(id);

      //Enviar lista actualizada al cliente:
      io.sockets.emit("productos", await productManager.getAllProducts());
  })

  //Recibimos el evento agregarProducto desde el cliente:
  socket.on("agregarProducto", async (title, description, price, thumbnail, code, category, stock) => {
    await productManager.addProduct(title, description, price, thumbnail, code, category, stock);

    //Enviar lista actualizda al cliente:
    io.sockets.emit("productos", await productManager.getAllProducts());
  })

})