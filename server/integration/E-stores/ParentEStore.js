class ParentEStore {
  constructor(baseUrl, identifier) {
    if (this.constructor === ParentEStore) {
      throw new Error("Abstract class ParentEStore cannot be instantiated directly");
    }
    this.baseUrl = baseUrl;
    this.identifier = identifier;
  }

  // Product Management
  async createProduct(productDetails) {
    throw new Error("Method 'createProduct' must be implemented");
  }

  async updateProduct(productId, updates) {
    throw new Error("Method 'updateProduct' must be implemented");
  }

  async deleteProduct(productId) {
    throw new Error("Method 'deleteProduct' must be implemented");
  }

  async getProduct(productId) {
    throw new Error("Method 'getProduct' must be implemented");
  }

  async listProducts(filters) {
    throw new Error("Method 'listProducts' must be implemented");
  }

  // Inventory Management
  async updateStock(productId, quantity) {
    throw new Error("Method 'updateStock' must be implemented");
  }

  async getStock(productId) {
    throw new Error("Method 'getStock' must be implemented");
  }

  // Order Management
  async getOrders(filters) {
    throw new Error("Method 'getOrders' must be implemented");
  }

  async getOrderDetails(orderId) {
    throw new Error("Method 'getOrderDetails' must be implemented");
  }

  async updateOrderStatus(orderId, status) {
    throw new Error("Method 'updateOrderStatus' must be implemented");
  }

  // Price Management
  async updatePrice(productId, price) {
    throw new Error("Method 'updatePrice' must be implemented");
  }

  async getPricing(productId) {
    throw new Error("Method 'getPricing' must be implemented");
  }

  // Store Settings & Configuration
  async getStoreSettings() {
    throw new Error("Method 'getStoreSettings' must be implemented");
  }

  async updateStoreSettings(settings) {
    throw new Error("Method 'updateStoreSettings' must be implemented");
  }

  // Authentication & Authorization
  async authenticate() {
    throw new Error("Method 'authenticate' must be implemented");
  }

  async validateCredentials() {
    throw new Error("Method 'validateCredentials' must be implemented");
  }

  // Utility Methods
  async syncProducts() {
    throw new Error("Method 'syncProducts' must be implemented");
  }

  async handleWebhook(payload) {
    throw new Error("Method 'handleWebhook' must be implemented");
  }
}

export default ParentEStore;
