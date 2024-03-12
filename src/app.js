const express = require('express');
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const session = require("express-session");
const FileStore = require("session-file-store");
const fileStore = FileStore(session);
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.routes");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
require("./database.js");

//Configuramos handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret: "secretcoder",
    resave: true, 
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://janostra:4fZ2bd5ATBeIuUE1@cluster0.oyi4lr4.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })

}))

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

// Puerto en el que escuchará el servidor
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

//Debo obtener el array:
const ProductManager = require("./controllers/product-manager-db.js");
const MessageModel = require('./models/messages.model.js');
const productManager = new ProductManager();

//Creamos el server de socket.io:
const io = socket(httpServer);
io.on("connection", async (socket) => {
  console.log("Un cliente se conecto al servidor.");

  //Enviamos el array de productos al cliente que se conectó:
  socket.emit("productos", await productManager.getProduct())

  //Recibimos el evento eliminarProducto desde el cliente:
  socket.on("eliminarProducto", async (_id)=>{
      await productManager.deleteProduct(_id);

      //Enviar lista actualizada al cliente:
      io.sockets.emit("productos", await productManager.getProduct());
  })

  //Recibimos el evento agregarProducto desde el cliente:
  socket.on("agregarProducto", async (title, description, price, img, code, stock ,category, thumbnail) => {
    await productManager.addProduct({title, description, price, img, code, stock ,category, thumbnail});

    //Enviar lista actualizda al cliente:
    io.sockets.emit("productos", await productManager.getProduct());
  })

})

//Aca comienza la logica del chat

let messages = [];

io.on("connection", (socket) => {
  console.log("Un cliente conectado");

  socket.on("message", async data => {
      //Recibo la data del cliente y lo voy a pushear en el array que declaramos arriba: 
      messages.push(data);
      //Llevamos el mensaje a Mongo:
      const newMessage = new MessageModel({
            user: data.user,
            message: data.message
        });
        await newMessage.save();
      //Utilizamos el método emit que nos permite emitir eventos desde el servidor hacia el cliente.
      io.emit("messagesLogs", messages);
  })
})
//----------------------------------------------------------------
//Logica de agregar producto a un carrito determinado desde la vista products.handlebars(lado servidor)
const CartManager = require('./controllers/cart-manager-db.js');
const cartManager = new CartManager();

io.on('connection', (socket) => {
    socket.on('agregarAlCarrito', async (data) => {
        const cartId = '65e6648ed719f7e4eda63331';
        const productId = data.productId;

        try {
            await cartManager.agregarProductoAlCarrito(cartId, productId);
            console.log('Producto agregado al carrito correctamente');
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
        }
    });
});