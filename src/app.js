// app.js

const express = require('express');
const app = express();
const ProductManager = require('../ProductManager');

// Instancia de ProductManager
const productManager = new ProductManager('./Products.JSON');

app.get('/', (req, res) => {
    res.send('Hola mundooooo, modifica la raiz para obtener tus productos')
});

// Endpoint para obtener todos los productos con límite opcional
app.get('/productos', async (req, res) => {
  const limit = parseInt(req.query.limit, 10); // Obtén el valor del parámetro limit de la consulta

  try {
    let productos;
    if (isNaN(limit) || limit <= 0) {
      // Si el límite no es válido o no se proporciona, devuelve todos los productos
      productos = await productManager.getAllProducts();
    } else {
      // Si se proporciona un límite válido, devuelve la cantidad especificada
      productos = await productManager.getAllProducts(limit);
    }

    res.json(productos);
  } catch (error) {
    // Manejar errores, por ejemplo, enviar un código de estado 500 en caso de error
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/productos/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const producto = await productManager.getProductById(productId);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    // Manejar errores, por ejemplo, enviar un código de estado 500 en caso de error
    res.status(500).json({ error: 'Error al obtener el producto por ID' });
  }
});

// Puerto en el que escuchará el servidor
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
