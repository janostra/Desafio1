const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/product-manager-db.js');
const ProductModel = require("../models/product.model.js");

// Instancia de ProductManager
const productManager = new ProductManager();


// Endpoint para obtener todos los productos con límite opcional
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10; // Obtén el valor del parámetro limit de la consulta
    const page = req.query.page || 1; //Obtenemos el valor del parámetro page de la consulta
    const query = req.query.query || '{}';
    const orden = parseInt(req.query.sort, 10) || 0;
    let sort = {}; // Inicializar el objeto sort vacío por defecto

    // Verificar si se especificó un valor de ordenamiento
    if (orden === 1 || orden === -1) {
        sort = { "price": orden };
    }

    let filter = {};

    try {
      let productos

      const parsedQuery = JSON.parse(query);

      if (parsedQuery && Object.keys(parsedQuery).length > 0) {
        filter = { ...parsedQuery };
      }
      const options = { limit, page, sort };
  
      productos = await ProductModel.paginate(filter, options);

      //Recuperamos el docs:

      const productosFinal = productos.docs.map( productos => {
        const {_id, ...rest} = productos.toObject();
        return { _id, ...rest };
      })


      const prevLink = productos.hasPrevPage ? `/api/products?page=${productos.prevPage}&limit=${limit}&sort=${orden}&query=${query}` : null;
      const nextLink = productos.hasNextPage ? `/api/products?page=${productos.nextPage}&limit=${limit}&sort=${orden}&query=${query}` : null;

      res.render("products", {
        payLoad: productosFinal,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        currentPage: productos.page,
        totalPages: productos.totalPages,
        prevLink: prevLink,
        nextLink: nextLink
      });
    } catch (error) {
      console.log("Error en la paginacion", error);
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