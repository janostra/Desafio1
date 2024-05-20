const ProductModel = require("../models/product.model.js");

class ProductRepository {

    async traerTodoPaginado(filter, options) {
        try {
            const productos = await ProductModel.paginate(filter, options);
            return productos;
        } catch (error) {
            console.error("Error al obtener los productos ", error);
        }
    }

    async traerTodo() {
        try {
            const productos = await ProductModel.find();
            return productos;
        } catch (error) {
            console.error("Error al encontrar productos: ", error);
        }
    }

    async crear(title, description, price, img, code, stock, category, thumbnail, owner) {
        const nuevoProducto = new ProductModel ({
            title:title,
            description:description,
            price:price,
            img:img,
            code:code,
            stock:stock,
            category:category,
            thumbnail: thumbnail || [],
            status: true,
            owner:owner
        });
        
        try {
            return await ProductModel.create(nuevoProducto);
        } catch (error) {
            console.error("Error al crear un producto ", error);
        }
    }

    async traerUno(codigo) {
        try {
            const existeProducto = await ProductModel.findOne(codigo);
            return existeProducto;
        } catch (error) {
            console.error("Error al encontrar producto: ", error);
        }
    }

    async traerProductoPorId(_id) {
        try {
            const producto = await ProductModel.findById(_id);
            return producto
        } catch (error) {
            console.error("Error al encontrar producto: ", error);
        }
    }
    
    async actualizarProducto(productId, productoActualizado) {
        try {
            const producto = await ProductModel.findByIdAndUpdate(productId, productoActualizado);
            return producto;
        } catch (error) {
            console.error("Error al encontrar o actualizar producto: ", error);
        }
    }

    async borrarProducto(id) {
        try {
            const productoEliminado = await ProductModel.findByIdAndDelete(id);
            return productoEliminado;
        } catch (error) {
            console.error("Error al borrar producto: ", error);
        }
    }
}

module.exports = ProductRepository;