const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
      this.products = [];
      this.productIdCounter = 1;
      this.path = path;
    }
  
    async addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return null;
      }
  
      if (await this.isCodeDuplicate(code)) {
        console.log("El código ya está en uso. Por favor, elija otro código.");
        return null;
      }
  
      const array = await this.readFile();

      const product = {
        id: this.productIdCounter++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      array.push(product);

      await this.saveFile(array);
    }
  
    async isCodeDuplicate(code) {
      const products = await this.readFile();
      return products.some(product => product.code === code);
    }
  
    async getAllProducts() {
      return this.readFile();
    }
  
    async getProductById(id) {
      try {
        const array = await this.readFile()
        const p = array.find(item => item.id === id);
        if (p) {
          return p;
        } else {
          console.log("No hubo coincidencias");
          return null;
        }
      } catch (error) {
        console.log("No se encontró el producto", error);
      }
    }

    async readFile(){
      try {
        const answer = await fs.readFile(this.path, "utf-8");
        const array = JSON.parse(answer);
        return array;
      } catch (error) {
        console.log("Error al leer el archivo", error);
      }
    }

    async saveFile(array){
      try {
        await fs.writeFile(this.path, JSON.stringify(array, null, 2));
      } catch (error) {
        console.log("Error al guardar el archivo", error);
      }
    }
  }

// Uso de la clase
const productManager = new ProductManager('./Productos.JSON');
productManager.addProduct("Producto 4", "Descripción 4", 20, "imagen1.jpg", "CODE4", 100);
const allProducts = productManager.getAllProducts();
console.log(allProducts);