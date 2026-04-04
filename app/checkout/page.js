'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearCart } from '@/lib/cartSlice';
import { toast } from 'sonner';
import { CreditCard, MapPin, Package, Shield } from 'lucide-react';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const { isAuthenticated, token, user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 2000 ? 0 : 99;
  const grandTotal = total + shipping;

  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setScriptLoaded(loaded);
      if (!loaded) {
        console.warn('Razorpay SDK failed to load');
      }
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
          <Button onClick={() => router.push('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRazorpayPayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment gateway is loading. Please try again.');
      return;
    }

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error('Failed to create payment order');
        return;
      }

      // Check if it's demo mode
      if (orderData.order.demo) {
        // Demo mode - proceed without Razorpay popup
        toast.info('Demo Mode: Processing order without payment');
        await createOrder('demo');
        return;
      }

      // Real Razorpay payment
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'WASP Fashion',
        description: 'Premium Women\'s Fashion',
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            await createOrder('razorpay', response.razorpay_payment_id);
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initialization failed');
      setLoading(false);
    }
  };

  const createOrder = async (paymentMethod, paymentId = null) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          total: grandTotal,
          shippingAddress: formData,
          paymentMethod,
          paymentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push('/order-success');
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('An error occurred while placing order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleRazorpayPayment();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Please login to checkout</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="House No., Street, Area"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg p-6 mb-4">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Secure Payment with Razorpay</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs">💳 Cards</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs">📱 UPI</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs">🏦 Net Banking</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs">💰 Wallets</span>
                      </div>
                    </div>
                  </div>
                </div>

                {(!scriptLoaded || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_DUMMY_KEY_ID_CHANGE_LATER') && (
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 text-yellow-200 text-sm">
                    <p className="font-semibold">⚠️ Demo Mode</p>
                    <p className="mt-1 text-xs text-yellow-300">
                      Payment gateway is in demo mode. Orders will be created without actual payment.
                      Add your Razorpay API keys in .env to enable live payments.
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-xs text-gray-400">Size: {item.size} × {item.quantity}</p>
                      <p className="text-sm font-semibold mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-400">✓ Free shipping on orders over ₹2000</p>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                  🔒 Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
