const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/product-manager-db.js');

// Instancia de ProductManager
const productManager = new ProductManager();


// Endpoint para obtener todos los productos con límite opcional
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit, 10); // Obtén el valor del parámetro limit de la consulta
  
    try {
      let productos;
      if (isNaN(limit) || limit <= 0) {
        // Si el límite no es válido o no se proporciona, devuelve todos los productos
        productos = await productManager.getProduct();
      } else {
        // Si se proporciona un límite válido, devuelve la cantidad especificada
        productos = await productManager.getProduct(limit);
      }
  
      res.json(productos);
    } catch (error) {
      // Manejar errores, por ejemplo, enviar un código de estado 500 en caso de error
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });
  
  // Endpoint para obtener un producto por ID
  router.get('/:id', async (req, res) => {
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
  
  // Endpoint para agregar un nuevo producto
  router.post('/', async (req, res) => {
    
    try {
        const { title, description, price, img, code, stock, category, thumbnail } = req.body;
        await productManager.addProduct({title, description, price, img, code, stock, category, thumbnail});
        res.status(201).json({ message: 'Producto creado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
  });
  
  // Endpoint para actualizar un producto por su ID
  router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const value = req.body;
  
    try {
        await productManager.updateProduct(productId, value);
        res.json({ message: `El producto con ID ${productId} actualizado correctamente` });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });
  
  // Endpoint para eliminar un producto por su ID
  router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
        await productManager.deleteProduct(productId);
        res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });

module.exports = router;