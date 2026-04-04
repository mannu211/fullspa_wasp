import Razorpay from 'razorpay';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance = null;

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_ID !== 'rzp_test_DUMMY_KEY_ID_CHANGE_LATER' && RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

export async function createRazorpayOrder(amount, currency = 'INR', receipt) {
  // Return demo mode if keys not configured
  if (!razorpayInstance) {
    console.log('💳 Razorpay not configured. Creating demo order for ₹', amount / 100);
    return {
      id: `order_DEMO${Date.now()}`,
      amount,
      currency,
      receipt,
      status: 'created',
      demo: true,
    };
  }

  try {
    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  if (!razorpayInstance) {
    console.log('💳 Razorpay verification skipped (demo mode)');
    return true;
  }

  try {
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    return false;
  }
}

export function getRazorpayKeyId() {
  return RAZORPAY_KEY_ID || 'rzp_test_DUMMY_KEY_ID_CHANGE_LATER';
}

export function isRazorpayConfigured() {
  return razorpayInstance !== null;
}
