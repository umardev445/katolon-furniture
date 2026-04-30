import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload
} from 'lucide-react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order, Message, UserProfile } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'messages'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Sofa',
    image: '',
    stock: 10
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Access denied. Admins only.');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [prodSnap, orderSnap, msgSnap, userSnap] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'users'))
      ]);

      const productsData = prodSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      } as Product));
      
      console.log('Fetched products:', productsData);
      setProducts(productsData);
      setOrders(orderSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
      setUsers(userSnap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));

    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const seedProductsData = async () => {
    if (products.length > 0) return;
    setLoading(true);
    try {
      for (const p of INITIAL_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...p,
          createdAt: serverTimestamp()
        });
      }
      toast.success('Initial data seeded successfully');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Seeding failed');
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Max 2MB. Please compress the image.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    setUploadingImage(true);
    toast.loading('Uploading image...', { id: 'upload' });
    
    try {
      const base64String = await convertToBase64(file);
      setProductForm({ ...productForm, image: base64String });
      toast.success('Image uploaded successfully!', { id: 'upload' });
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please try again or use Image URL.', { id: 'upload' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.image) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }
    
    setLoading(true);
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        image: productForm.image,
        stock: Number(productForm.stock)
      };
      
      console.log('Saving product:', productData);
      
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...productData,
          updatedAt: serverTimestamp()
        });
        toast.success('Product updated');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
        toast.success('Product added');
      }
      setIsAddingProduct(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: 0, category: 'Sofa', image: '', stock: 10 });
      await fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      toast.success('Order status updated');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  const getImageUrl = (imageUrl: string, productId: string) => {
    if (imageError[productId]) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    if (!imageUrl) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    return imageUrl;
  };

  if (authLoading || !isAdmin) return <div className="h-screen flex items-center justify-center">Authenticating Admin...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F7F6F3]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#2C1810] text-[#E5E1DA] p-6 space-y-8">
         <div className="flex items-center space-x-3 pb-8 border-b border-white/10">
            <Package className="h-8 w-8 text-[#A67B5B]" />
            <span className="text-xl font-bold tracking-tight">ADMIN PANEL</span>
         </div>
         
         <nav className="space-y-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'messages', icon: MessageSquare, label: 'Messages' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id ? 'bg-[#A67B5B] text-white shadow-lg' : 'hover:bg-white/5 text-white/60'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
         </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-[#2C1810] capitalize">{activeTab}</h2>
            {activeTab === 'products' && (
              <button 
                onClick={() => setIsAddingProduct(true)}
                className="flex items-center space-x-2 bg-[#5C4033] text-white px-6 py-3 rounded-full hover:bg-[#4A3329] transition-all shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span className="font-bold text-sm">Add New Product</span>
              </button>
            )}
            {activeTab === 'overview' && products.length === 0 && (
              <button 
                onClick={seedProductsData}
                className="bg-white border-2 border-[#5C4033] text-[#5C4033] px-6 py-2 rounded-full font-bold hover:bg-[#5C4033] hover:text-white transition-all shadow-sm"
              >
                Seed Sample Data
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Sales', value: `$${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600' },
                  { label: 'Active Orders', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-orange-500' },
                  { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-500' },
                  { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'text-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-[#E5E1DA] shadow-sm flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8E7F71]">{stat.label}</span>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-4xl font-bold text-[#2C1810]">{stat.value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#E5E1DA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="bg-[#FAF9F6]">
                        <tr>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Product</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Category</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Price</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Stock</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E1DA]">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                            <td className="p-6">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img 
                                    src={getImageUrl(p.image, p.id)} 
                                    alt={p.name}
                                    className="h-full w-full object-cover"
                                    onError={() => handleImageError(p.id)}
                                  />
                                </div>
                                <span className="font-bold text-[#2C1810]">{p.name}</span>
                              </div>
                            </td>
                            <td className="p-6 text-[#8E7F71]">{p.category}</td>
                            <td className="p-6 font-bold text-[#2C1810]">${(p.price || 0).toLocaleString()}</td>
                            <td className="p-6 font-semibold">{p.stock || 0}</td>
                            <td className="p-6">
                              <div className="flex space-x-3">
                                <button 
                                  onClick={() => { 
                                    setEditingProduct(p); 
                                    setProductForm({
                                      name: p.name,
                                      description: p.description || '',
                                      price: p.price,
                                      category: p.category,
                                      image: p.image || '',
                                      stock: p.stock
                                    }); 
                                    setIsAddingProduct(true); 
                                  }} 
                                  className="p-2 bg-gray-100 hover:bg-[#5C4033] hover:text-white rounded-lg transition-all"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => deleteProduct(p.id)} 
                                  className="p-2 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg transition-all text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-[#8E7F71]">
                              No products found. Click "Add New Product" to create one.
                             </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {orders.length === 0 && (
                  <p className="text-center py-20 text-[#8E7F71]">No orders found.</p>
                )}
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-3xl border border-[#E5E1DA] shadow-sm space-y-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <p className="text-xs font-bold text-[#8E7F71] uppercase tracking-widest">Order ID: {order.id?.slice(-8)}</p>
                        <h3 className="text-xl font-bold text-[#2C1810] mt-1">{order.customerDetails?.name || 'Unknown'}</h3>
                        <p className="text-sm text-[#8E7F71]">{order.customerDetails?.address || 'No address'}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id!, e.target.value)}
                          className="bg-[#F5F2EE] border border-[#E5E1DA] rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#5C4033] focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <span className="text-lg font-bold text-[#5C4033]">${(order.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E5E1DA]">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E1DA]">
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={item.image || 'https://via.placeholder.com/32x32?text=No+Image'} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/32x32?text=Error';
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold">{item.name} (x{item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-white p-8 rounded-3xl border border-[#E5E1DA] shadow-sm space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-[#5C4033] text-white rounded-full flex items-center justify-center font-bold">{msg.name?.[0] || 'U'}</div>
                      <div>
                        <h4 className="font-bold text-[#2C1810]">{msg.name || 'Unknown'}</h4>
                        <p className="text-xs text-[#8E7F71]">{msg.email || 'No email'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#2C1810] leading-relaxed bg-[#FAF9F6] p-4 rounded-xl italic">"{msg.message}"</p>
                    <p className="text-[10px] uppercase font-bold text-[#8E7F71] text-right">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center col-span-2 py-20 text-[#8E7F71]">No messages found.</p>}
              </motion.div>
            )}
            
            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl border border-[#E5E1DA] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[#FAF9F6]">
                      <tr>
                        <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">User</th>
                        <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Email</th>
                        <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Role</th>
                        <th className="p-6 text-xs font-bold uppercase tracking-widest text-[#8E7F71]">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E1DA]">
                      {users.map(u => (
                        <tr key={u.uid} className="hover:bg-[#FAF9F6]">
                          <td className="p-6 font-bold">{u.name || 'Unknown'}</td>
                          <td className="p-6 text-[#8E7F71]">{u.email || 'No email'}</td>
                          <td className="p-6">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-[#5C4033] text-white' : 'bg-[#E5E1DA] text-[#8E7F71]'}`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="p-6 text-xs text-[#8E7F71]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Add/Edit Product */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold text-[#2C1810]">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button 
                  onClick={() => { 
                    setIsAddingProduct(false); 
                    setEditingProduct(null); 
                  }} 
                  className="hover:bg-[#F5F2EE] p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Product Name *</label>
                  <input 
                    required 
                    value={productForm.name} 
                    onChange={e => setProductForm({...productForm, name: e.target.value})} 
                    className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Description *</label>
                  <textarea 
                    required 
                    value={productForm.description} 
                    onChange={e => setProductForm({...productForm, description: e.target.value})} 
                    className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none" 
                    rows={3} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Price ($) *</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      step="0.01"
                      value={productForm.price} 
                      onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} 
                      className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Stock *</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={productForm.stock} 
                      onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} 
                      className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Category *</label>
                  <select 
                    value={productForm.category} 
                    onChange={e => setProductForm({...productForm, category: e.target.value})} 
                    className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none bg-white"
                  >
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                    <option value="Table">Table</option>
                    <option value="Chair">Chair</option>
                    <option value="Decor">Decor</option>
                  </select>
                </div>
                
                {/* Mobile-Friendly Image Upload Section */}
                <div className="border-t border-[#E5E1DA] pt-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-3">
                    📸 Product Image
                  </label>
                  
                  {/* Upload Button for Mobile */}
                  <div className="mb-4">
                    <label className="flex items-center justify-center w-full px-5 py-4 bg-[#F5F2EE] rounded-xl border-2 border-dashed border-[#C4B5A5] cursor-pointer hover:bg-[#EDE8E2] transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                        capture="environment"
                      />
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-[#5C4033] mb-2" />
                        <span className="text-sm font-medium text-[#5C4033]">
                          {uploadingImage ? 'Uploading...' : '📱 Tap to take photo or select from gallery'}
                        </span>
                        <p className="text-xs text-[#8E7F71] mt-1">
                          Max 2MB (JPEG, PNG)
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {/* OR Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E5E1DA]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-[#8E7F71]">OR</span>
                    </div>
                  </div>
                  
                  {/* Image URL Field (Backup) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">
                      Image URL
                    </label>
                    <input 
                      type="url"
                      value={productForm.image} 
                      onChange={e => setProductForm({...productForm, image: e.target.value})} 
                      className="w-full px-5 py-3 rounded-xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/20 focus:outline-none" 
                      placeholder="https://i.ibb.co/xxx/image.jpg"
                    />
                    <p className="text-xs text-[#8E7F71] mt-1">
                      💡 Tip: Upload to imgbb.com and paste the "Direct URL" here
                    </p>
                  </div>
                  
                  {/* Image Preview */}
                  {productForm.image && (
                    <div className="mt-4 p-3 bg-[#FAF9F6] rounded-xl">
                      <p className="text-xs font-bold text-[#8E7F71] mb-2">Preview:</p>
                      <img 
                        src={productForm.image} 
                        alt="Preview" 
                        className="h-32 w-32 rounded-lg object-cover border border-[#E5E1DA]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/128x128?text=Invalid+URL';
                          toast.error('Invalid image URL. Please check or upload again.');
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || uploadingImage} 
                  className="w-full bg-[#5C4033] text-white py-5 rounded-full font-bold hover:bg-[#4A3329] transition-all transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || uploadingImage ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}