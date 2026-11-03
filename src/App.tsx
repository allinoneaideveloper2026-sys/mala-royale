import React, { useState } from 'react';
import { TRANSLATIONS, Language } from './i18n';
import { CONFIG } from './config';
import { UserRole, Order, OrderStage } from './domain/types';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [userEmail, setUserEmail] = useState('customer@gmail.com');
  
  // App state
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courierAccepted, setCourierAccepted] = useState(false);
  const [utr, setUtr] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Auto-switch role based on email configuration
  const handleEmailChange = (email: string) => {
    setUserEmail(email);
    if (CONFIG.developerEmails.includes(email)) {
      setRole('DEVELOPER');
    } else if (email.endsWith('@malaroyale.com')) {
      setRole('OWNER');
    } else {
      setRole('CUSTOMER');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Mala Royale',
      text: t.tagline,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('App link copied to clipboard!');
    }
  };

  const dummyPlaceOrder = () => {
    if (!courierAccepted) {
      alert(t.acceptCourierNotice);
      return;
    }
    const mockOrder: Order = {
      orderId: 'MR-1001',
      userId: 'USR-789',
      items: [{ id: 1, name: 'Kanjeevaram Silk Saree', price: 14999, category: 'Sarees' }],
      itemTotal: 14999,
      stage: 'ORDER_RECEIVED',
      isWithheld: false,
      courierNoticeAccepted: true,
      address: {
        fullName: 'Test Customer',
        phone: '9876543210',
        street: 'MG Road',
        landmark1: 'Near Metro',
        pincode: '560001',
        googleMapsPin: 'https://maps.app.goo.gl/example',
        consentTimestamp: new Date().toISOString(),
      },
      itemPayment: {
        paymentId: 'PAY-1001',
        kind: 'ITEM',
        amount: 14999,
        utr: utr || '123456789012',
        screenshotUrl: 'https://via.placeholder.com/150',
        verified: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveOrder(mockOrder);
    setStep(3);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fdf8f6', color: '#333', minHeight: '100vh' }}>
      {/* Top Bar / Role & Lang Control */}
      <div style={{ backgroundColor: '#2d0a17', color: '#fff', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
        <div>
          <span>Role: <strong>{role}</strong> ({userEmail})</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select value={lang} onChange={(e) => setLang(e.target.value as Language)} style={{ borderRadius: '4px', padding: '0.2rem' }}>
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
          <select value={userEmail} onChange={(e) => handleEmailChange(e.target.value)} style={{ borderRadius: '4px', padding: '0.2rem' }}>
            <option value="customer@gmail.com">Customer View</option>
            <option value="owner@malaroyale.com">Owner / Host View</option>
            <option value="allinoneaideveloper2026@gmail.com">Developer View</option>
          </select>
        </div>
      </div>

      {/* Main Header */}
      <header style={{ backgroundColor: '#6e1a3a', color: '#fff', padding: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>{t.appName}</h1>
        <p style={{ margin: '0.3rem 0 0', fontStyle: 'italic', opacity: 0.9 }}>{t.tagline}</p>
      </header>

      {/* Developer Banner */}
      {role === 'DEVELOPER' && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem', borderBottom: '1px solid #ffeeba' }}>
          🛠️ <strong>Developer Workspace:</strong> Version {CONFIG.version} | No customer PII displayed.
        </div>
      )}

      {/* Content Area */}
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {role === 'CUSTOMER' && (
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {/* Courier Notice Box */}
            <div style={{ backgroundColor: '#fff8e7', borderLeft: '4px solid #d97706', padding: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#92400e' }}>{t.courierNoticeTitle}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{t.courierNoticeBody}</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
                <input 
                  type="checkbox" 
                  checked={courierAccepted} 
                  onChange={(e) => setCourierAccepted(e.target.checked)} 
                />
                {t.acceptCourierNotice}
              </label>
            </div>

            {/* 3-Step Checkout Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: step === 1 ? 'bold' : 'normal', color: step === 1 ? '#6e1a3a' : '#888' }}>{t.step1Address}</span>
              <span style={{ fontWeight: step === 2 ? 'bold' : 'normal', color: step === 2 ? '#6e1a3a' : '#888' }}>{t.step2Payment}</span>
              <span style={{ fontWeight: step === 3 ? 'bold' : 'normal', color: step === 3 ? '#6e1a3a' : '#888' }}>{t.step3Confirm}</span>
            </div>

            {step === 1 && (
              <div>
                <h3>Delivery Address</h3>
                <input type="text" placeholder="Full Name" defaultValue="Sample Customer" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
                <input type="text" placeholder="Pincode (e.g. 560001)" defaultValue="560001" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
                <input type="text" placeholder="Google Maps Pin URL" defaultValue="https://maps.app.goo.gl/sample" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} />
                <button onClick={() => setStep(2)} style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}>Next: Payment</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3>Item Payment (₹14,999)</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Scan UPI QR or pay to UPI ID: <code>malaroyale@upi</code></p>
                <input 
                  type="text" 
                  placeholder={t.enterUtr} 
                  value={utr} 
                  onChange={(e) => setUtr(e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} 
                />
                <button onClick={dummyPlaceOrder} style={{ backgroundColor: '#6e1a3a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}>{t.placeOrder}</button>
              </div>
            )}

            {step === 3 && activeOrder && (
              <div>
                <h3 style={{ color: '#2e7d32' }}>✓ Order Placed! ID: {activeOrder.orderId}</h3>
                <p>Status: <strong>{activeOrder.stage}</strong></p>
                {activeOrder.courierBill ? (
                  <div style={{ backgroundColor: '#e8f5e9', padding: '1rem', borderRadius: '6px' }}>
                    <p style={{ margin: 0 }}>Courier: {activeOrder.courierBill.courierName}</p>
                    <p style={{ margin: '0.3rem 0' }}>Tracking ID: <strong>{activeOrder.courierBill.trackingId}</strong></p>
                    <p style={{ margin: 0 }}>Courier Charge: ₹{activeOrder.courierBill.amount}</p>
                  </div>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#666' }}>Courier bill will be attached once packed by host.</p>
                )}
              </div>
            )}
          </div>
        )}

        {(role === 'OWNER' || role === 'HELPER') && (
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>Host Order Verification & Dispatch Panel</h3>
            {activeOrder ? (
              <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '6px' }}>
                <p><strong>Order ID:</strong> {activeOrder.orderId}</p>
                <p><strong>Stage:</strong> {activeOrder.stage}</p>
                <p><strong>UTR:</strong> {activeOrder.itemPayment?.utr}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => setActiveOrder({ ...activeOrder, stage: 'ITEM_PAYMENT_VERIFIED' })}
                    style={{ backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Verify Payment
                  </button>
                  <button 
                    onClick={() => setActiveOrder({
                      ...activeOrder,
                      stage: 'COURIER_RECEIPT_UPLOADED',
                      courierBill: { billId: 'CB-101', courierName: 'DTDC', trackingId: 'DT123456', amount: 150, receiptPhotoUrl: '' }
                    })}
                    style={{ backgroundColor: '#0288d1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Attach Courier Receipt
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: '#666' }}>No active incoming orders to verify right now. Switch to Customer View to place a test order.</p>
            )}
          </div>
        )}

        {/* Global Share Action */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={handleShare} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
            📲 {t.shareApp}
          </button>
        </div>
      </main>
    </div>
  );
}
