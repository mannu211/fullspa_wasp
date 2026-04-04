import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'orders@wasp.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'WASP Fashion';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'contact@wasp.com';
const BUSINESS_WHATSAPP = process.env.BUSINESS_WHATSAPP || '+919876543210';

if (SENDGRID_API_KEY && SENDGRID_API_KEY !== 'SG.DUMMY_KEY_CHANGE_LATER') {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendOrderConfirmationEmail(order, userEmail) {
  // Skip sending if using dummy key
  if (!SENDGRID_API_KEY || SENDGRID_API_KEY === 'SG.DUMMY_KEY_CHANGE_LATER') {
    console.log('📧 SendGrid not configured. Order details:', {
      orderId: order.id,
      email: userEmail,
      total: order.total,
    });
    return { success: true, message: 'Email sending skipped (demo mode)' };
  }

  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.size}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
        </tr>`
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${order.shippingAddress?.name || 'Customer'},</p>
        
        <p>Your order has been received and is being processed. We'll send you another email when your order ships.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #667eea; margin-top: 0;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Size</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px;">Grand Total:</td>
                <td style="padding: 15px 10px; font-weight: bold; font-size: 18px; color: #667eea;">₹${order.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">Shipping Address</h3>
          <p style="margin: 5px 0;">${order.shippingAddress?.name}</p>
          <p style="margin: 5px 0;">${order.shippingAddress?.address}</p>
          <p style="margin: 5px 0;">${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</p>
          <p style="margin: 5px 0;">Phone: ${order.shippingAddress?.phone}</p>
          <p style="margin: 5px 0;">Email: ${order.shippingAddress?.email}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>Need Help?</strong></p>
          <p style="margin: 5px 0; color: #856404;">Contact us at ${FROM_EMAIL} or call ${BUSINESS_WHATSAPP}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">Follow us for the latest trends and offers</p>
          <div style="margin: 10px 0;">
            <a href="#" style="display: inline-block; margin: 0 5px; color: #667eea; text-decoration: none;">Facebook</a>
            <a href="#" style="display: inline-block; margin: 0 5px; color: #667eea; text-decoration: none;">Instagram</a>
            <a href="#" style="display: inline-block; margin: 0 5px; color: #667eea; text-decoration: none;">Twitter</a>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>This is an automated email. Please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} WASP Fashion. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Send to customer
    await sgMail.send({
      to: userEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()} - WASP Fashion`,
      html: htmlContent,
    });

    // Send notification to business owner
    await sendOrderNotificationToOwner(order, userEmail);

    return { success: true, message: 'Emails sent successfully' };
  } catch (error) {
    console.error('SendGrid Error:', error);
    return { success: false, message: error.message };
  }
}

export async function sendOrderNotificationToOwner(order, customerEmail) {
  if (!SENDGRID_API_KEY || SENDGRID_API_KEY === 'SG.DUMMY_KEY_CHANGE_LATER') {
    console.log('📧 Owner notification (demo mode):', {
      orderId: order.id,
      customer: customerEmail,
      total: order.total,
      whatsapp: `https://wa.me/${BUSINESS_WHATSAPP.replace(/[^0-9]/g, '')}`,
    });
    return;
  }

  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.name} (Size: ${item.size}) x ${item.quantity} = ₹${item.price * item.quantity}</li>`
    )
    .join('');

  const whatsappLink = `https://wa.me/${BUSINESS_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `New Order #${order.id.slice(0, 8).toUpperCase()}\nCustomer: ${order.shippingAddress?.name}\nTotal: ₹${order.total}`
  )}`;

  const ownerHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #d32f2f;">🔔 New Order Received!</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Order Short ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
      <p><strong>Total Amount:</strong> ₹${order.total}</p>
      <hr>
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${order.shippingAddress?.name}</li>
        <li><strong>Email:</strong> ${order.shippingAddress?.email || customerEmail}</li>
        <li><strong>Phone:</strong> ${order.shippingAddress?.phone}</li>
        <li><strong>Address:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</li>
      </ul>
      <hr>
      <h3>Order Items:</h3>
      <ul>
        ${itemsList}
      </ul>
      <hr>
      <p><a href="${whatsappLink}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Open in WhatsApp</a></p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Login to admin panel to manage this order.</p>
    </body>
    </html>
  `;

  try {
    await sgMail.send({
      to: BUSINESS_EMAIL,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: `🔔 New Order #${order.id.slice(0, 8).toUpperCase()} - ₹${order.total}`,
      html: ownerHtml,
    });
  } catch (error) {
    console.error('Error sending owner notification:', error);
  }
}
