// src/domain/entities/Product.js
export class Product {
  constructor({
    id,
    name,
    price,
    image,
    stock = 0,
    category = 'general',
    description = '',
    sku = ''
  }) {
    this.id = id;
    this.name = name;
    this.price = parseFloat(price) || 0;
    this.image = image;
    this.stock = parseInt(stock) || 0;
    this.category = category;
    this.description = description;
    this.sku = sku;
    this.createdAt = new Date().toISOString();
  }

  // Validaciones de dominio
  isValid() {
    return this.name && 
           this.price > 0 && 
           this.id && 
           this.image;
  }

  hasStock(quantity = 1) {
    return this.stock >= quantity;
  }

  calculateTotal(quantity) {
    return this.price * quantity;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      image: this.image,
      stock: this.stock,
      category: this.category,
      description: this.description,
      sku: this.sku,
      createdAt: this.createdAt
    };
  }

  static fromJSON(data) {
    return new Product(data);
  }
}