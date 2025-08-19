import React, { useState, useEffect } from 'react';

const PaymentMenu = ({ 
  payments, 
  setPayments, 
  profile, 
  setProfile, 
  darkMode, 
  onProcessPayment, 
  showNotification 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: '',
    recipient: '',
    type: 'job_posting', // job_posting, premium_upgrade, feature_boost
    dueDate: ''
  });
  const [paymentMethodForm, setPaymentMethodForm] = useState({
    type: 'card', // card, bank, paypal
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    bankAccount: '',
    routingNumber: '',
    paypalEmail: ''
  });

  // Calculate payment statistics
  const stats = {
    totalPaid: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    totalProcessing: payments.filter(p => p.status === 'processing').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    thisMonth: payments.filter(p => {
      const paymentDate = new Date(p.timestamp);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentForm.amount || !paymentForm.description || !paymentForm.recipient) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (parseFloat(paymentForm.amount) <= 0) {
      showNotification('Amount must be greater than 0', 'error');
      return;
    }

    if (profile.paymentMethods.length === 0) {
      showNotification('Please add a payment method first', 'error');
      setShowAddMethod(true);
      return;
    }

    onProcessPayment({
      ...paymentForm,
      amount: parseFloat(paymentForm.amount),
      paymentMethod: profile.paymentMethods[0], // Use first payment method
      currency: profile.preferences.currency || 'USD'
    });

    setPaymentForm({
      amount: '',
      description: '',
      recipient: '',
      type: 'job_posting',
      dueDate: ''
    });
    setShowAddPayment(false);
  };

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();

    let newMethod;
    if (paymentMethodForm.type === 'card') {
      if (!paymentMethodForm.cardNumber || !paymentMethodForm.expiryDate || !paymentMethodForm.cvv || !paymentMethodForm.cardholderName) {
        showNotification('Please fill in all card details', 'error');
        return;
      }
      newMethod = {
        id: Date.now().toString(),
        type: 'card',
        last4: paymentMethodForm.cardNumber.slice(-4),
        cardholderName: paymentMethodForm.cardholderName,
        expiryDate: paymentMethodForm.expiryDate,
        brand: getCardBrand(paymentMethodForm.cardNumber),
        isDefault: profile.paymentMethods.length === 0
      };
    } else if (paymentMethodForm.type === 'bank') {
      if (!paymentMethodForm.bankAccount || !paymentMethodForm.routingNumber) {
        showNotification('Please fill in all bank details', 'error');
        return;
      }
      newMethod = {
        id: Date.now().toString(),
        type: 'bank',
        last4: paymentMethodForm.bankAccount.slice(-4),
        routingNumber: paymentMethodForm.routingNumber,
        isDefault: profile.paymentMethods.length === 0
      };
    } else {
      if (!paymentMethodForm.paypalEmail) {
        showNotification('Please enter PayPal email', 'error');
        return;
      }
      newMethod = {
        id: Date.now().toString(),
        type: 'paypal',
        email: paymentMethodForm.paypalEmail,
        isDefault: profile.paymentMethods.length === 0
      };
    }

    setProfile(prev => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, newMethod]
    }));

    setPaymentMethodForm({
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      bankAccount: '',
      routingNumber: '',
      paypalEmail: ''
    });
    setShowAddMethod(false);
    showNotification('Payment method added successfully! 💳', 'success');
  };

  const getCardBrand = (cardNumber) => {
    const firstFour = cardNumber.substring(0, 4);
    if (firstFour.startsWith('4')) return 'Visa';
    if (firstFour.startsWith('5') || firstFour.startsWith('2')) return 'Mastercard';
    if (firstFour.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--gradient-success)';
      case 'processing': return 'var(--gradient-warning)';
      case 'pending': return 'var(--gradient-secondary)';
      case 'failed': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      case 'pending': return '⏱️';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile.preferences.currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="payment-menu">
      {/* Payment Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="payment-card">
          <div className="payment-amount">{formatCurrency(stats.totalPaid)}</div>
          <div className="payment-status">Total Paid</div>
        </div>
        <div className="payment-card" style={{ background: 'var(--gradient-warning)' }}>
          <div className="payment-amount">{formatCurrency(stats.totalPending)}</div>
          <div className="payment-status">Pending</div>
        </div>
        <div className="payment-card" style={{ background: 'var(--gradient-secondary)' }}>
          <div className="payment-amount">{formatCurrency(stats.totalProcessing)}</div>
          <div className="payment-status">Processing</div>
        </div>
        <div className="payment-card" style={{ background: 'var(--gradient-accent)' }}>
          <div className="payment-amount">{formatCurrency(stats.thisMonth)}</div>
          <div className="payment-status">This Month</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border-light)' }}>
        {['overview', 'methods', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              borderRadius: '12px 12px 0 0',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'overview' && '📊'} 
            {tab === 'methods' && '💳'} 
            {tab === 'history' && '📋'} 
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>💰 Payment Overview</h2>
            <button 
              onClick={() => setShowAddPayment(true)}
              className="btn btn-primary"
            >
              + New Payment
            </button>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <h3>Recent Transactions</h3>
            {payments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💸</div>
                <p>No transactions yet</p>
                <button 
                  onClick={() => setShowAddPayment(true)}
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  Make Your First Payment
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {payments.slice(-5).reverse().map(payment => (
                  <div 
                    key={payment.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: 'var(--bg-glass)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>{getStatusIcon(payment.status)}</div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>{payment.description}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                          To: {payment.recipient} • {new Date(payment.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '18px' }}>
                        {formatCurrency(payment.amount)}
                      </div>
                      <div 
                        style={{ 
                          color: getStatusColor(payment.status),
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {payment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>💳 Payment Methods</h2>
            <button 
              onClick={() => setShowAddMethod(true)}
              className="btn btn-primary"
            >
              + Add Method
            </button>
          </div>

          <div className="card">
            {profile.paymentMethods && profile.paymentMethods.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                <p>No payment methods added yet</p>
                <button 
                  onClick={() => setShowAddMethod(true)}
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  Add Your First Method
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {profile.paymentMethods.map(method => (
                  <div 
                    key={method.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px',
                      background: method.isDefault ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                      color: method.isDefault ? 'white' : 'var(--text-primary)',
                      borderRadius: '16px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '32px' }}>
                        {method.type === 'card' && '💳'}
                        {method.type === 'bank' && '🏦'}
                        {method.type === 'paypal' && '💙'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>
                          {method.type === 'card' && `${method.brand} •••• ${method.last4}`}
                          {method.type === 'bank' && `Bank •••• ${method.last4}`}
                          {method.type === 'paypal' && method.email}
                        </div>
                        {method.type === 'card' && (
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            {method.cardholderName} • Expires {method.expiryDate}
                          </div>
                        )}
                        {method.isDefault && (
                          <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
                            🌟 DEFAULT
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div>
          <h2>📋 Payment History</h2>
          <div className="card">
            {payments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📜</div>
                <p>No payment history yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {payments.map(payment => (
                  <div 
                    key={payment.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '20px' }}>{getStatusIcon(payment.status)}</div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{payment.description}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                          {payment.type.replace('_', ' ').toUpperCase()} • {new Date(payment.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '600' }}>{formatCurrency(payment.amount)}</div>
                      <div style={{ color: getStatusColor(payment.status), fontSize: '12px', fontWeight: '600' }}>
                        {payment.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="welcome-modal">
          <div className="welcome-content" style={{ maxWidth: '500px' }}>
            <h2>💸 New Payment</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                  placeholder="What is this payment for?"
                  required
                />
              </div>
              <div className="form-group">
                <label>Recipient *</label>
                <input
                  type="text"
                  value={paymentForm.recipient}
                  onChange={(e) => setPaymentForm({...paymentForm, recipient: e.target.value})}
                  placeholder="Who are you paying?"
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Type</label>
                <select
                  value={paymentForm.type}
                  onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value})}
                >
                  <option value="job_posting">Job Posting</option>
                  <option value="premium_upgrade">Premium Upgrade</option>
                  <option value="feature_boost">Feature Boost</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-success">
                  💳 Process Payment
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddPayment(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddMethod && (
        <div className="welcome-modal">
          <div className="welcome-content" style={{ maxWidth: '500px' }}>
            <h2>💳 Add Payment Method</h2>
            <form onSubmit={handleAddPaymentMethod}>
              <div className="form-group">
                <label>Payment Method Type</label>
                <select
                  value={paymentMethodForm.type}
                  onChange={(e) => setPaymentMethodForm({...paymentMethodForm, type: e.target.value})}
                >
                  <option value="card">💳 Credit/Debit Card</option>
                  <option value="bank">🏦 Bank Account</option>
                  <option value="paypal">💙 PayPal</option>
                </select>
              </div>

              {paymentMethodForm.type === 'card' && (
                <>
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      value={paymentMethodForm.cardholderName}
                      onChange={(e) => setPaymentMethodForm({...paymentMethodForm, cardholderName: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      value={paymentMethodForm.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 16) {
                          setPaymentMethodForm({...paymentMethodForm, cardNumber: value});
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentMethodForm.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          if (value.length <= 5) {
                            setPaymentMethodForm({...paymentMethodForm, expiryDate: value});
                          }
                        }}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>CVV *</label>
                      <input
                        type="text"
                        value={paymentMethodForm.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setPaymentMethodForm({...paymentMethodForm, cvv: value});
                          }
                        }}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethodForm.type === 'bank' && (
                <>
                  <div className="form-group">
                    <label>Account Number *</label>
                    <input
                      type="text"
                      value={paymentMethodForm.bankAccount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPaymentMethodForm({...paymentMethodForm, bankAccount: value});
                      }}
                      placeholder="123456789"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Routing Number *</label>
                    <input
                      type="text"
                      value={paymentMethodForm.routingNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 9) {
                          setPaymentMethodForm({...paymentMethodForm, routingNumber: value});
                        }
                      }}
                      placeholder="021000021"
                      maxLength="9"
                      required
                    />
                  </div>
                </>
              )}

              {paymentMethodForm.type === 'paypal' && (
                <div className="form-group">
                  <label>PayPal Email *</label>
                  <input
                    type="email"
                    value={paymentMethodForm.paypalEmail}
                    onChange={(e) => setPaymentMethodForm({...paymentMethodForm, paypalEmail: e.target.value})}
                    placeholder="user@paypal.com"
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-success">
                  💾 Add Method
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddMethod(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMenu;