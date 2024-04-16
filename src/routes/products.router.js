const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/product-manager-db.js');

// Instancia de ProductManager
const productManager = new ProductManager();

  // Endpoint para obtener todos los productos con límite opcional
  router.get('/', productManager.getProductPaginate);
  
  // Endpoint para obtener un producto por ID
  router.get('/:id', productManager.getProductById);
  
  // Endpoint para agregar un nuevo producto
  router.post('/', productManager.addProduct);
  
  // Endpoint para actualizar un producto por su ID
  router.put('/:id', productManager.updateProduct);
  
  // Endpoint para eliminar un producto por su ID
  router.delete('/:id', productManager.deleteProduct);

module.exports = router;