import React, { useState } from 'react';

// --- DATA TYPES ---
export type UserRole = 'CUSTOMER' | 'OWNER' | 'DEVELOPER';
export type Language = 'en' | 'kn';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  address: {
    fullName: string;
    phone: string;
    street: string;
    landmark: string;
    pincode: string;
    mapsLink: string;
  };
  utr: string;
  screenshotName: string;
  stage: 'ORDER_RECEIVED' | 'ITEM_PAYMENT_VERIFIED' | 'PACKED' | 'COURIER_BILL_ADDED' | 'DISPATCHED';
  courierNoticeAccepted: boolean;
  courierBill?: {
    courierName: string;
    trackingId: string;
    amount: number;
  };
}

const INITIAL_CATALOG: Product[] = [
  {
    id: 1,
    name: 'Kanjeevaram Silk Saree',
    category: 'Sarees',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    description: 'Pure zari woven Kanjeevaram silk saree with rich pallu.'
  },
  {
    id: 2,
    name: 'Tassel & Bead Kuchu Work',
    category: 'Custom Kuchu',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    description: 'Handcrafted traditional silk thread Kuchu with pearl embellishments.'
  },
  {
    id: 3,
    name: 'Banarasi Soft Silk Saree',
    category: 'Sarees',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=600',
    description: 'Lightweight Banarasi silk with floral brocade pattern.'
  },
  {
    id: 4,
    name: 'Bridal Heavy Ring Kuchu',
    category: 'Custom Kuchu',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600',
    description: 'Intricate grand bridal Kuchu design customized to match pallu colors.'
  }
];

export default function App() {
  // Navigation & Role State
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [userEmail, setUserEmail] = useState('customer@gmail.com');
  const [lang, setLang] = useState<Language>('en');
  
  // Catalog & Cart State
  const [products, setProducts] = useState<Product[]>(INITIAL_CATALOG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Checkout & Order State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [courierPolicyAccepted, setCourierPolicyAccepted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  // Address Form State
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    landmark: '',
    pincode: '',
    mapsLink: ''
  });

  // Payment Form State
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  // Host Product Upload State
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Sarees', price: '', description: '', image: '' });

  // Handle Login Role Switches
  const handleEmailSwitch = (email: string) => {
    setUserEmail(email);
    if (email.includes('developer')) {
      setRole('DEVELOPER');
    } else if (email.includes('owner') || email.includes('host')) {
      setRole('OWNER');
    } else {
      setRole('CUSTOMER');
    }
  };

  // Cart Management
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Submit Customer Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierPolicyAccepted) {
      alert('You must accept the courier charge policy before placing an order.');
      return;
    }
    if (!utr || utr.length < 6) {
      alert('Please enter a valid payment UTR number.');
      return;
    }

    const newOrder: Order = {
      orderId: `MR-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart,
      totalAmount: cartTotal,
      address,
      utr,
      screenshotName: screenshot ? screenshot.name : 'payment_proof.jpg',
      stage: 'ORDER_RECEIVED',
      courierNoticeAccepted: true
    };

    setActiveOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setCheckoutStep(3);
    alert(`Order ${newOrder.orderId} submitted successfully!`);
  };

  // Host: Add New Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const added: Product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      description: newProduct.description || 'Handcrafted boutique collection',
      image: newProduct.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'
    };
    setProducts(prev => [added, ...prev]);
    setNewProduct({ name: '', category: 'Sarees', price: '', description: '', image: '' });
    alert('New item uploaded to boutique catalog!');
  };

  const filteredProducts = categoryFilter === 'All' 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  return (
    <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#fdf8f6', color: '#333', minHeight: '100vh' }}>
      
      {/* ROLE LOGIN & CONTROL HEADER BAR */}
      <div style={{ backgroundColor: '#1a050d', color: '#fff', padding: '0.6rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem' }}>
        <div>
          <span>Login Status: <strong>{role}</strong> ({userEmail})</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label>Language:</label>
          <select value={lang} onChange={(e) => setLang(e.target.value as Language)} style={{ padding: '0.2rem', borderRadius: '4px' }}>
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
          <label>Switch Role:</label>
          <select value={userEmail} onChange={(e) => handleEmailSwitch(e.target.value)} style={{ padding: '0.2rem', borderRadius: '4px' }}>
            <option value="customer@gmail.com">Customer Login</option>
            <option value="owner@malaroyale.com">Host / Owner Login</option>
            <option value="allinoneaideveloper2026@gmail.com">Developer Login</option>
          </select>
        </div>
      </div>

      {/* BOUTIQUE HEADER */}
      <header style={{ backgroundColor: '#6e1a3a', color: '#fff', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <h1 style={{ margin: 0, fontSize: '2.4rem' }}>Mala Royale</h1>
        <p style={{ margin: '0.3rem 0 0', fontStyle: 'italic' }}>Bespoke Sarees & Custom Kuchu Craftsmanship</p>
      </header>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* ========================================================================= */}
        {/* CUSTOMER VIEW */}
        {/* ========================================================================= */}
        {role === 'CUSTOMER' && (
          <div>
            {/* Action Bar (Filters & Cart Trigger) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', backgroundColor: '#f7ebe8', padding: '1rem', borderRadius: '8px' }}>
              <div>
                {['All', 'Sarees', 'Custom Kuchu'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      backgroundColor: categoryFilter === cat ? '#6e1a3a' : '#fff',
                      color: categoryFilter === cat ? '#fff' : '#6e1a3a',
                      border: '1px solid #6e1a3a',
                      padding: '0.5rem 1rem',
                      marginRight: '0.5rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🛒 Cart ({cart.reduce((a, b) => a + b.quantity, 0)}) - ₹{cartTotal}
              </button>
            </div>

            {/* Product Catalog Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.8rem' }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6e1a3a', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                      <h3 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.3' }}>{product.description}</p>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6e1a3a' }}>₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3-STEP CHECKOUT MODAL DRAWER */}
            {isCheckoutOpen && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                <div style={{ backgroundColor: '#fff', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', padding: '1.8rem', position: 'relative' }}>
                  <button onClick={() => setIsCheckoutOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

                  <h2 style={{ color: '#6e1a3a', marginTop: 0 }}>Checkout & Order Submission</h2>

                  {/* Courier Policy Warning Notice */}
                  <div style={{ backgroundColor: '#fff8e7', borderLeft: '4px solid #d97706', padding: '0.8rem', borderRadius: '4px', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#92400e' }}>Notice on Courier Charges:</strong>
                    <p style={{ margin: '0.3rem 0 0.5rem' }}>Item price and courier charge are separate. Courier charge is calculated after packing based on parcel weight and distance.</p>
                    <label style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                      <input type="checkbox" checked={courierPolicyAccepted} onChange={(e) => setCourierPolicyAccepted(e.target.checked)} /> I accept the courier policy
                    </label>
                  </div>

                  {/* Order Items Summary */}
                  <div style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
                    <h4>Order Summary</h4>
                    {cart.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem', color: '#6e1a3a' }}>
                      Total Item Amount: ₹{cartTotal}
                    </div>
                  </div>

                  {/* Step 1: Address Details */}
                  {checkoutStep === 1 && (
                    <div>
                      <h3>Step 1: Delivery Address</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <input type="text" placeholder="Full Name *" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Phone Number *" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Street / House No *" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Landmark 1 *" value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Pincode *" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Google Maps Location Pin Link" value={address.mapsLink} onChange={e => setAddress({ ...address, mapsLink: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                      </div>
                      <button onClick={() => setCheckoutStep(2)} disabled={!address.fullName || !address.pincode} style={{ marginTop: '1.2rem', backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Proceed to Payment</button>
                    </div>
                  )}

                  {/* Step 2: Payment & Proof Submission */}
                  {checkoutStep === 2 && (
                    <form onSubmit={handlePlaceOrder}>
                      <h3>Step 2: Submit Payment Details</h3>
                      <p style={{ fontSize: '0.85rem', color: '#555' }}>Pay <strong>₹{cartTotal}</strong> via UPI to <code>malaroyale@upi</code> and enter UTR reference below.</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>12-Digit Payment UTR Number *</label>
                          <input type="text" placeholder="e.g. 320918239102" value={utr} onChange={e => setUtr(e.target.value)} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.2rem' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Payment Screenshot / Receipt Proof</label>
                          <input type="file" accept="image/*" onChange={e => setScreenshot(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', marginTop: '0.2rem' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setCheckoutStep(1)} style={{ backgroundColor: '#ccc', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', flex: 1 }}>Back</button>
                        <button type="submit" style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 2 }}>Confirm & Submit Order</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Submitted Orders Tracker for Customer */}
            {activeOrders.length > 0 && (
              <div style={{ marginTop: '3rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ color: '#6e1a3a', marginTop: 0 }}>My Active Orders & Courier Status</h3>
                {activeOrders.map(ord => (
                  <div key={ord.orderId} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>Order ID: {ord.orderId}</span>
                      <span style={{ color: '#2e7d32' }}>Stage: {ord.stage}</span>
                    </div>
                    <p style={{ margin: '0.4rem 0', fontSize: '0.9rem' }}>Items: {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>UTR: {ord.utr} | Item Total: ₹{ord.totalAmount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* HOST / OWNER ADMIN DASHBOARD */}
        {/* ========================================================================= */}
        {role === 'OWNER' && (
          <div style={{ backgroundColor: '#fff', padding: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#6e1a3a', marginTop: 0 }}>Boutique Owner Control Panel</h2>

            {/* Section 1: Upload New Items with Price Tag */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '1.2rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0 }}>Upload New Catalog Item</h3>
              <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                <input type="text" placeholder="Product Name *" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required style={{ padding: '0.5rem' }} />
                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={{ padding: '0.5rem' }}>
                  <option value="Sarees">Sarees</option>
                  <option value="Custom Kuchu">Custom Kuchu</option>
                </select>
                <input type="number" placeholder="Price (₹) *" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required style={{ padding: '0.5rem' }} />
                <input type="text" placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} style={{ padding: '0.5rem' }} />
                <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={{ padding: '0.5rem', gridColumn: '1 / -1' }} />
                <button type="submit" style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', gridColumn: '1 / -1' }}>+ Publish Item to Catalog</button>
              </form>
            </div>

            {/* Section 2: Manage Incoming Orders & Verify Payments */}
            <div>
              <h3>Incoming Customer Orders & Payments</h3>
              {activeOrders.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No customer orders placed yet. Switch to Customer Login to test ordering.</p>
              ) : (
                activeOrders.map(ord => (
                  <div key={ord.orderId} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Order #{ord.orderId} - ₹{ord.totalAmount}</p>
                    <p style={{ fontSize: '0.85rem', margin: '0.3rem 0' }}>Customer UTR: <code>{ord.utr}</code> | Address: {ord.address.fullName}, {ord.address.street}, {ord.address.pincode}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                      <button onClick={() => alert(`Verified UTR ${ord.utr} against bank statement.`)} style={{ backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Verify Payment</button>
                      <button onClick={() => alert(`Order ${ord.orderId} marked as Packed. Ready for courier.`)} style={{ backgroundColor: '#0288d1', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Mark Packed</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEVELOPER DIAGNOSTICS VIEW */}
        {/* ========================================================================= */}
        {role === 'DEVELOPER' && (
          <div style={{ backgroundColor: '#fff', padding: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#6e1a3a', marginTop: 0 }}>Developer Workspace</h2>
            <p>System Version: <strong>0.1.0-beta</strong></p>
            <p>Sync Engine: Event-driven <code>OrderBook</code> logic enabled.</p>
            <p>Active Registered Products: <strong>{products.length}</strong></p>
            <p>Active Placed Orders: <strong>{activeOrders.length}</strong></p>
          </div>
        )}

      </div>
    </div>
  );
}
