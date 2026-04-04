'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Package, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'indian',
    image: '',
    discount: '0',
    featured: false,
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '#',
    active: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Note: In production, check if user.isAdmin
    fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const response = await fetch('/api/admin/products', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setProducts(data.products);
      } else if (activeTab === 'banners') {
        const response = await fetch('/api/admin/banners', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setBanners(data.banners);
      } else if (activeTab === 'orders') {
        const response = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product added successfully');
        setShowAddProduct(false);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: 'indian',
          image: '',
          discount: '0',
          featured: false,
        });
        fetchData();
      } else {
        toast.error(data.message || 'Failed to add product');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bannerForm),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Banner added successfully');
        setShowAddBanner(false);
        setBannerForm({
          title: '',
          description: '',
          image: '',
          link: '#',
          active: true,
        });
        fetchData();
      } else {
        toast.error(data.message || 'Failed to add banner');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product deleted');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Banner deleted');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage your store</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === 'products' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Products
            {activeTab === 'products' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === 'banners' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Banners
            {activeTab === 'banners' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === 'orders' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Orders
            {activeTab === 'orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6">
              <Button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-white text-black hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showAddProduct && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8"
              >
                <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
                    >
                      <option value="indian">Indian</option>
                      <option value="western">Western</option>
                      <option value="korean">Korean</option>
                      <option value="jeans">Jeans</option>
                      <option value="tops">Tops</option>
                    </select>
                  </div>
                  <div>
                    <Label>Discount %</Label>
                    <Input
                      type="number"
                      value={productForm.discount}
                      onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Image URL</Label>
                    <Input
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      required
                      placeholder="https://..."
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" className="bg-white text-black hover:bg-gray-200">
                      Add Product
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                    <p className="text-lg font-bold mb-3">₹{product.price}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div>
            <div className="mb-6">
              <Button
                onClick={() => setShowAddBanner(!showAddBanner)}
                className="bg-white text-black hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </div>

            {showAddBanner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8"
              >
                <h3 className="text-xl font-semibold mb-4">Add New Banner</h3>
                <form onSubmit={handleAddBanner} className="space-y-4">
                  <div>
                    <Label>Banner Title</Label>
                    <Input
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      required
                      placeholder="https://..."
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <Button type="submit" className="bg-white text-black hover:bg-gray-200">
                    Add Banner
                  </Button>
                </form>
              </motion.div>
            )}

            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex gap-4">
                  <img src={banner.image} alt={banner.title} className="w-32 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{banner.title}</h3>
                    <p className="text-sm text-gray-400">{banner.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No orders yet</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">₹{order.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
