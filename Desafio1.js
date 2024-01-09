class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return null;
      }
  
      if (this.isCodeDuplicate(code)) {
        console.log("El código ya está en uso. Por favor, elija otro código.");
        return null;
      }
  
      const product = {
        id: this.productIdCounter++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      this.products.push(product);
      return product;
    }
  
    isCodeDuplicate(code) {
      return this.products.some(product => product.code === code);
    }
  
    getAllProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        console.log("Producto no encontrado");
        return null;
      }
    }
  }
  
  // Ejemplo de uso
  const productManager = new ProductManager();
  
  const product1 = productManager.addProduct("Product 1", "Description 1", 19.99, "thumbnail1.jpg", "P001", 100);
  const product2 = productManager.addProduct("Product 2", "Description 2", 29.99, "thumbnail2.jpg", "P002", 50);
  
  console.log(productManager.getAllProducts());
  
  const productById = productManager.getProductById(1);
  console.log(productById);
  
  const nonExistentProduct = productManager.getProductById(100);

  console.log(nonExistentProduct);
  