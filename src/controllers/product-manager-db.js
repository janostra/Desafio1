const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 

class ProductManager {
    
    async addProduct (req, res) {
        
        const { title, description, price, img, code, stock, category, thumbnail } = req.body;
    
        if (!title || !description || !price || !code || !stock || !category )
        {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const existeProducto = await productRepository.traerUno({code: code});

        if (existeProducto){
            return res.status(400).json({ mensaje: "El producto ya se encuentra cargado" });
        }

        try {
            await productRepository.crear(title, description, price, img, code, stock, category, thumbnail);
            res.status(200).send("producto creado");
        }catch(error) {
            res.status(500).json("Error del servidor");  
        }
    }

    async getProduct(req, res) {
        try {
          let productos
          productos = await productRepository.traerTodo();
          res.status(200).json(productos);
        } catch (error) {
          // Manejar errores, por ejemplo, enviar un código de estado 500 en caso de error
          res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    async getProductPaginate(req, res) {
      const limit = parseInt(req.query.limit, 10) || 10; // Obtén el valor del parámetro limit de la consulta
      const page = req.query.page || 1; //Obtenemos el valor del parámetro page de la consulta
      const query = req.query.query || '{}';
      const orden = parseInt(req.query.sort, 10) || 0;
      let sort = {}; // Inicializar el objeto sort vacío por defecto
      const user = req.session.user;
  
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
    
        productos = await productRepository.traerTodoPaginado(filter, options);
  
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
          nextLink: nextLink,
          user: user
        });
      } catch (error) {
        // Manejar errores, por ejemplo, enviar un código de estado 500 en caso de error
        res.status(500).json({ error: 'Error al obtener productos' });
      }
  }

    async getProductById(req, res){
        const productId = req.params.id;
        try {
          const producto = await productRepository.traerProductoPorId(productId);
          if (producto) {
            res.json(producto);
          } else {
            res.status(404).json({ error: 'Producto no encontrado' });
          }
        } catch (error) {
          // Manejar errores, por ejemplo, enviar un código de estado 500 en caso de error
          res.status(500).json({ error: 'Error al obtener el producto por ID' });
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params; // Se obtiene el ID del producto de los parámetros de la solicitud
        const productoActualizado = req.body; // Se obtiene el producto actualizado del cuerpo de la solicitud
        console.log(id);
        try {
            // Llama al método del repositorio para actualizar el producto
            const producto = await productRepository.actualizarProducto(id, productoActualizado);
            // console.log(producto);
            if (!producto) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }
            return res.status(200).json(producto);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al actualizar el producto" });
        }
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            // Llama al método del repositorio para eliminar el producto
            const productoEliminado = await productRepository.borrarProducto(id);
    
            if (!productoEliminado) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }
    
            return res.status(200).json({ mensaje: "Producto eliminado correctamente", producto: productoEliminado });
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al eliminar el producto" });
        }
    }
}

module.exports = ProductManager;