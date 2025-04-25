class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.image = product.image;
        this.category = product.category;
        this.stock = product.stock;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }
}