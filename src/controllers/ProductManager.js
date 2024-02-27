// const fs = require('fs').promises;

// class ProductManager {
//     constructor(path) {
//       this.products = [];
//       this.path = path;
//     }
  
// //Añadir producto
//     async addProduct(title, description, price, thumbnail, code, category, stock) {
//       if (!title || !description || !price || !category || !code || !stock) {
//         console.log("Todos los campos son obgatorios");
//         return null;
//       }
  
//       if (await this.isCodeDuplicate(code)) {
//         console.log("El código ya está en uso. Por favor, elija otro código.");
//         return null;
//       }
  
//       const array = await this.readFile();

//       const maxId = array.length > 0 ? Math.max(...array.map(product => product.id)) : 0;
//       const newProductId = maxId + 1;

//       const product = {
//         id: newProductId,
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         category,
//         status: true,
//         stock
//       };
  
//       array.push(product);

//       await this.saveFile(array);
//     }

// //Checkeo de codigo existente
//     async isCodeDuplicate(code) {
//       const products = await this.readFile();
//       return products.some(product => product.code === code);
//     }

// //Obtener todos los productos
//     async getAllProducts(limit) {
//       const productos = await this.readFile();

//       if (limit) {
//         return productos.slice(0, parseInt(limit, 10));
//       } else {
//         return productos;
//       }
//     }
  
// //Obtener productos por ID
//     async getProductById(id) {
//       try {
//         const array = await this.readFile()
//         const p = array.find(item => item.id === parseInt(id, 10));

//         if (p) {
//           return p;
//         } else {
//           console.log("No hubo coincidencias");
//           return null;
//         }
//       } catch (error) {
//         console.log("No se encontró el producto", error);
//       }
//     }

// //Borrar producto por ID
// async deleteProduct(id) {
//   try {
//       let array = await this.getAllProducts();
//       const index = array.findIndex(product => product.id === id);

//       if (index !== -1) {
//           array.splice(index, 1);
//           console.log(`Producto con ID ${id} eliminado correctamente.`);
//           await this.saveFile(array);
//       } else {
//           console.log(`No se encontró un producto con ID ${id}.`);
//       }
//   } catch (error) {
//       console.log("Error al eliminar el producto", error.message);
//   }
// }




// //Actualizar campo de producto por ID
//   async updateProduct(id, field, value) {
//       try {
//           let array = await this.readFile();
//           const productIndex = array.findIndex(product => product.id === id);

//           if (productIndex !== -1) {
//               array[productIndex][field] = value;
//               await this.saveFile(array);
//               console.log(`Campo ${field} del producto con ID ${id} actualizado correctamente.`);
//           } else {
//               console.log(`No se encontró un producto con ID ${id}.`);
//           }
//       } catch (error) {
//           console.log("Error al actualizar el producto", error);
//       }
//   }

// //Leer archivo
//   async readFile() {
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

// //Guardar archivo
// async saveFile(array) {
//   try {
//       await fs.writeFile(this.path, JSON.stringify(array, null, 2));
//   } catch (error) {
//       console.log("Error al guardar el archivo", error);
//   }
// }
//   }


// module.exports = ProductManager;
// // Uso de la clase
// // async function main() {
// //   const productManager = new ProductManager('./Products.JSON');

// //   await productManager.addProduct("Producto 6", "Descripción 6", 60, "imagen6.jpg", "CODE6", 600);
// //   await productManager.addProduct("Producto 7", "Descripción 7", 70, "imagen7.jpg", "CODE7", 700);
// //   await productManager.addProduct("Producto 8", "Descripción 8", 80, "imagen8.jpg", "CODE8", 800);
// //   await productManager.addProduct("Producto 9", "Descripción 9", 90, "imagen9.jpg", "CODE9", 900);
// //   await productManager.addProduct("Producto 10", "Descripción 10", 100, "imagen10.jpg", "CODE10", 1000);
// //   await productManager.addProduct("Producto 11", "Descripción 11", 110, "imagen11.jpg", "CODE11", 1100);
// //   await productManager.deleteProduct(1);


// //   const allProducts = await productManager.getAllProducts();
// //   console.log(allProducts);
// // }

// // main();