const express = require('express');
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const session = require("express-session");
const FileStore = require("session-file-store");
const fileStore = FileStore(session);
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.routes");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
require("./database.js");
const manejadorError = require("./middleware/error.js");
const addLogger = require("./utils/logger.js");


const swaggerOptions = {
  definition: {
      openapi: "3.0.1",
      info: {
          title: "Documentación de la App ",
          description: "App Web dedicada"
      }
  },
  apis: ["./src/docs/**/*.yaml"]
}

//Conectamos Swagger a nuestro servidor de Express: 

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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
        mongoUrl: "mongodb+srv://janostra:4fZ2bd5ATBeIuUE1@cluster0.oyi4lr4.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100000
    })
}))
app.use(addLogger);

app.use(manejadorError);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.get("/loggerTest", (req, res) => {
  req.logger.error("Vamos a morir"); 
  req.logger.warning("Cuidado! Hombre radiactivo!"); 
  req.logger.info("Estamos navegando la app");

  res.send("Logs generados!");
})

// Puerto en el que escuchará el servidor
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

//Debo obtener el array:
const MessageModel = require('./models/messages.model.js');
const ProductRepository = require("./repositories/product.repository.js");
const productRepository = new ProductRepository();

//Creamos el server de socket.io:
const io = socket(httpServer);
io.on("connection", async (socket) => {
  console.log("Un cliente se conecto al servidor.");

  //Enviamos el array de productos al cliente que se conectó:
  socket.emit("productos", await productRepository.traerTodo())

  //Recibimos el evento eliminarProducto desde el cliente:
  socket.on("eliminarProducto", async (_id)=>{
      await productRepository.borrarProducto(_id);

      //Enviar lista actualizada al cliente:
      io.sockets.emit("productos", await productRepository.traerTodo());
  })

  socket.on("actualizarProducto", async (_id, nuevoProducto)=> {
      await productRepository.actualizarProducto(_id, nuevoProducto);

      io.sockets.emit("productos", await productRepository.traerTodo());
  })

  //Recibimos el evento agregarProducto desde el cliente:
  socket.on("agregarProducto", async (title, description, price, img, code, stock ,category, thumbnail, owner) => {
    await productRepository.crear(title, description, price, img, code, stock ,category, thumbnail, owner);

    //Enviar lista actualizda al cliente:
    io.sockets.emit("productos", await productRepository.traerTodo());
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
//responsabilidades
//actualizar producto