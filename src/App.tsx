import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Kanjeevaram Silk Saree',
    category: 'Sarees',
    price: '₹14,999',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    description: 'Pure zari woven Kanjeevaram silk saree with rich pallu.'
  },
  {
    id: 2,
    name: 'Tassel & Bead Kuchu Work',
    category: 'Custom Kuchu',
    price: '₹1,499',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    description: 'Handcrafted traditional silk thread Kuchu with pearl embellishments.'
  },
  {
    id: 3,
    name: 'Banarasi Soft Silk Saree',
    category: 'Sarees',
    price: '₹9,800',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=600',
    description: 'Lightweight Banarasi silk with floral brocade pattern.'
  },
  {
    id: 4,
    name: 'Bridal Heavy Ring Kuchu',
    category: 'Custom Kuchu',
    price: '₹2,299',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600',
    description: 'Intricate grand bridal Kuchu design customized to match pallu colors.'
  }
];

export default function App() {
  const [filter, setFilter] = useState<'All' | 'Sarees' | 'Custom Kuchu'>('All');

  const filteredProducts = filter === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#fdf8f6', color: '#333', minHeight: '100vh', margin: 0 }}>
      {/* Navigation Header */}
      <header style={{ backgroundColor: '#6e1a3a', color: '#fff', padding: '1.5rem 2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <h1 style={{ margin: 0, fontSize: '2.4rem', letterSpacing: '1px' }}>Mala Royale</h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '1rem', fontStyle: 'italic', opacity: 0.9 }}>
          Exclusive Sarees & Bespoke Kuchu Craftsmanship
        </p>
      </header>

      {/* Hero Banner */}
      <section style={{ textAlignment: 'center', padding: '3rem 1.5rem', backgroundColor: '#f7ebe8', textAlign: 'center' }}>
        <h2 style={{ color: '#6e1a3a', fontSize: '1.8rem', marginTop: 0 }}>Elegance Woven Into Every Detail</h2>
        <p style={{ maxWidth: '600px', margin: '0.5rem auto 1.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Explore our handpicked saree collections and personalize your garments with custom handcrafted saree tassels (Kuchu).
        </p>
        <div>
          {(['All', 'Sarees', 'Custom Kuchu'] as const).map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              style={{
                backgroundColor: filter === category ? '#6e1a3a' : '#fff',
                color: filter === category ? '#fff' : '#6e1a3a',
                border: '1px solid #6e1a3a',
                padding: '0.6rem 1.4rem',
                margin: '0.3rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <main style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6e1a3a', fontWeight: 'bold', letterSpacing: '0.5px' }}>{product.category}</span>
                  <h3 style={{ margin: '0.4rem 0', fontSize: '1.2rem', color: '#222' }}>{product.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>{product.description}</p>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6e1a3a' }}>{product.price}</span>
                  <button 
                    onClick={() => alert(`Enquiring about ${product.name}`)}
                    style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2d0a17', color: '#fdf8f6', padding: '2rem 1.5rem', textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ margin: 0, fontSize: '1rem' }}>© Mala Royale Boutique. All rights reserved.</p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Available on Web & Android APK</p>
      </footer>
    </div>
  );
}
