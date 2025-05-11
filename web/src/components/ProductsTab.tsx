import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct, updateProduct } from '../store/slices/productSlice';
import type { RootState, AppDispatch } from '../store';
import type { Product } from '../store/slices/productSlice';

interface ProductsTabProps {
  storeId: string | undefined;
  userId: string | undefined;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ storeId, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stockAmount: 0,
    brand: '',
    image: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    console.log("storeId", storeId);
    if (storeId) {
      dispatch(fetchProducts(storeId));
    }
  }, [dispatch, storeId]);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !userId) return;
    setModalLoading(true);
    setModalError(null);
    try {
      if (isEditing && currentProduct._id) {
        await dispatch(updateProduct({ 
          storeId, 
          productId: currentProduct._id, 
          data: { 
            ...currentProduct,
            store: storeId,
            addedBy: userId 
          } 
        })).unwrap();
      } else {
        await dispatch(createProduct({ 
          storeId, 
          data: { 
            ...currentProduct, 
            store: storeId,
            addedBy: userId 
          } 
        })).unwrap();
      }
      setIsModalOpen(false);
      resetModal();
    } catch (err: any) {
      setModalError(err || `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    resetModal();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      stockAmount: 0,
      brand: '',
      image: '',
    });
    setModalError(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    setDeleteLoading(productId);
    try {
      await dispatch(deleteProduct({ pid: productId })).unwrap();
    } catch (err: any) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Products</h2>
        <button
          className="px-4 py-2 bg-[#1a73e8] text-white rounded hover:bg-[#1557b0]"
          onClick={handleAddClick}
        >
          Add Product
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            {/* <th className="px-4 py-2 text-gray-900 dark:text-white">ID</th> */}
            <th className="px-4 py-2 text-gray-900 dark:text-white">Name</th>
            <th className="px-4 py-2 text-gray-900 dark:text-white">Brand</th>
            <th className="px-4 py-2 text-gray-900 dark:text-white">Stock</th>
            <th className="px-4 py-2 text-gray-900 dark:text-white">Price</th>
            <th className="px-4 py-2 text-gray-900 dark:text-white">Description</th>
            <th className="px-4 py-2 text-gray-900 dark:text-white">Created At</th>
            <th className="px-4 py-2 text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id.toString()}>
              {/* <td className="px-4 py-2 text-gray-900 dark:text-white">{product._id}</td> */}
              <td className="px-4 py-2 text-gray-900 dark:text-white">{product.name}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{product.brand}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{product.stockAmount}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{product.price}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{product.description}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{new Date(product.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={deleteLoading === product._id}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {isEditing ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.name}
                  onChange={e => setCurrentProduct(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Brand</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.brand}
                  onChange={e => setCurrentProduct(p => ({ ...p, brand: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Stock</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.stockAmount}
                  onChange={e => setCurrentProduct(p => ({ ...p, stockAmount: Number(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Price</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.price}
                  onChange={e => setCurrentProduct(p => ({ ...p, price: Number(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.description}
                  onChange={e => setCurrentProduct(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              {modalError && <div className="text-red-500 text-sm">{modalError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetModal();
                  }}
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#1a73e8] text-white hover:bg-[#1761c7]"
                  disabled={modalLoading}
                >
                  {modalLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab; 