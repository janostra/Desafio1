// const fs = require('fs').promises;

// class CartsManager {
//     constructor(path) {
//         this.carts = [];
//         this.path = path;
//     }


// async createCart() {

//     const array = await this.loadCarts();

//     const maxId = array.length > 0 ? Math.max(...array.map(cart => cart.id)) : 0;
//     const newCartId = maxId + 1;

//     // Crear un nuevo carrito con una estructura específica
//     const newCart = {
//         id: newCartId,
//         products: []
//     };

//     // Agregar el nuevo carrito a la lista de carritos
//     array.push(newCart);
//     await this.saveCarts(array);
//     return newCartId;
// }

// async getCartById(cartId) {
//     // Obtener el array de productos de un carrito específico
//     try {
//         const array = await this.loadCarts()
//         const cart = array.find(cart => cart.id === parseInt(cartId, 10));

//         if (cart) {
//           return cart;
//         } else {
//           console.log("No hubo coincidencias");
//           return null;
//         }
//       } catch (error) {
//         console.log("No se encontró el producto", error);
//       }
// }

// async addProductToCart(cartId, productId) {
//     // Agregar un producto al carrito seleccionado
//     const array = await this.loadCarts();

//     const cart = array.find(cart => cart.id === parseInt(cartId, 10));

//     if (!cart) {
//         console.log(`No se encontró un carrito con ID ${cartId}.`);
//         return;
//     }

//     // Verificar si el producto ya está en el carrito
//     const existingProduct = cart.products.find(item => item.product === productId);

//     if (existingProduct) {
//         // Si el producto ya existe, incrementar la cantidad
//         existingProduct.quantity += 1;
//         console.log("aca")
//     } else {
//         // Si el producto no existe, agregarlo al carrito
//         console.log("eh")
//         cart.products.push({
//             product: productId,
//             quantity: 1
//         });
//     }

//     // Guardar los cambios en el archivo
//     await this.saveCarts(array);
// }


// async loadCarts() {
//     try {
//         const answer = await fs.readFile(this.path, "utf-8");

//         if (!answer.trim()) {
//             return [];
//         }

//         const array = JSON.parse(answer);
//         return array;
//     } catch (error) {
//         console.log("Error al leer el archivo", error.message);
//         return [];
//     }
// }

// async saveCarts(array) {
//     try {
//         await fs.writeFile(this.path, JSON.stringify(array, null, 2));
//     } catch (error) {
//         console.log("Error al guardar el archivo", error);
//     }
// }

// }

// module.exports = CartsManager;