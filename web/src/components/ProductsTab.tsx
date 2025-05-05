import React, { useState } from 'react';

const ProductsTab: React.FC = () => {
  // Mock product data
  const initialProducts = [
    { id: 'PRD-001', name: 'Apple iPhone 15', category: 'Smartphones', stock: 12, price: '$999', status: 'Active' },
    { id: 'PRD-002', name: 'Samsung Galaxy S23', category: 'Smartphones', stock: 0, price: '$899', status: 'Active' },
    { id: 'PRD-003', name: 'Sony WH-1000XM5', category: 'Headphones', stock: 5, price: '$349', status: 'Active' },
    { id: 'PRD-004', name: 'Apple MacBook Pro', category: 'Laptops', stock: 2, price: '$1999', status: 'Non Active' },
    { id: 'PRD-005', name: 'Dell XPS 13', category: 'Laptops', stock: 8, price: '$1299', status: 'Active' },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setEditForm({ ...product });
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    setProducts(products.map(p => p.id === editingProduct.id ? { ...editForm } : p));
    closeEdit();
  };

  // Calculate status for display
  const getStatus = (product: any) => {
    if (product.status !== 'Active') return 'Non Active';
    if (Number(product.stock) === 0) return 'Out of Stock';
    if (Number(product.stock) > 0 && Number(product.stock) <= 5) return 'Low Stock';
    return 'Active';
  };

  // Badge color
  const getStatusBadge = (status: string) => {
    if (status === 'Active') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (status === 'Out of Stock') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-[#1a73e8] focus:border-[#1a73e8] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => {
              const status = getStatus(product);
              return (
                <tr key={product.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{product.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.stock}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.price}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <button
                      className="px-3 py-1 bg-[#1a73e8] text-white rounded hover:bg-[#1761c7] transition"
                      onClick={() => openEdit(product)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit Product</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
                <input
                  name="category"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={editForm.category}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={editForm.stock}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Price</label>
                <input
                  name="price"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={editForm.price}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={editForm.status}
                  onChange={handleEditChange}
                >
                  <option value="Active">Active</option>
                  <option value="Non Active">Non Active</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={closeEdit}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#1a73e8] text-white hover:bg-[#1761c7]"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsTab; 