const ProductModel = require ("../models/product.model.js");

class ProductManager {
    
    async addProduct ({title, description, price, img, code, stock, category, thumbnail}) {
        try {

            if (!title || !description || !price || !code || !stock || !category )
            {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProducto = await ProductModel.findOne({code: code});

            if (existeProducto){
                console.log("El producto ya se encuentra cargado");
                return;
            }

            const nuevoProducto = new ProductModel ({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                thumbnail: thumbnail || [],
                status: true
            });

            await nuevoProducto.save();

        }
        catch(error) {
            console.log("Error al cargar el producto", error);  
        }
    }

    async getProduct() {
        try {
            const productos = await ProductModel.find();
            return productos
        } catch (error) {
            console.log("Error al traer los productos"); 
            throw error;
        }
    }

    async getProductById(_id){
        try {
            const producto = await ProductModel.getProductById(_id);

            if(!producto){
                console.log("Producto no encontrado");
                return null;
            };

            console.log("Producto encontrado");
            return producto
        } catch (error) {
            console.log("Error al traer el producto"); 
            throw error;
        }
    }

    async updateProduct (_id, productoActualizado){
        try {
            const producto = await ProductModel.findByIdAndUpdate(id, productoActualizado);

            if(!producto){
                console.log("Producto no encontrado");
                return null;
            };

            console.log("Producto actualizado");
            return producto;
        } catch (error) {
            console.log("Error al actualizar el producto"); 
            throw error;
        }
    }

    async deleteProduct (_id){
        try {
            const producto = await ProductModel.findByIdAndDelete(_id);

            if(!producto){
                console.log("Producto no encontrado");
                return null;
            };

            console.log("Producto eliminado");
        } catch (error) {
            console.log("Error al eliminar el producto"); 
            throw error;
        }
    }
}

module.exports = ProductManager;