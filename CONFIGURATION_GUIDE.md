# 🎯 WASP E-COMMERCE - CONFIGURATION GUIDE

This file contains all the settings you need to customize for your WASP Fashion e-commerce website.
Simply edit the values below and restart the application.

---

## 📝 HOW TO EDIT THIS FILE

1. Open `/app/.env` file in any text editor
2. Replace the DUMMY values with your real API keys and information
3. Save the file
4. Restart the application: `sudo supervisorctl restart nextjs`

---

## 💳 RAZORPAY PAYMENT GATEWAY

To enable real payments, sign up at https://razorpay.com and get your API keys:

1. Go to https://dashboard.razorpay.com/
2. Navigate to Settings → API Keys
3. Generate API keys (Test Mode for testing, Live Mode for production)
4. Replace the values below:

```
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**Current Status**: Demo Mode (No real payments, orders will be created without payment)

---

## 📧 SENDGRID EMAIL NOTIFICATIONS

To enable email notifications, sign up at https://sendgrid.com (Free: 100 emails/day):

1. Go to https://app.sendgrid.com/
2. Navigate to Settings → API Keys
3. Create a new API key with "Full Access" permission
4. Verify your sender email in SendGrid (Settings → Sender Authentication)
5. Replace the values below:

```
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=orders@yourdomain.com (must be verified in SendGrid)
SENDGRID_FROM_NAME=Your Store Name
```

**What happens when configured**:
- Customers receive order confirmation emails with order details
- You (business owner) receive email notifications for every new order
- Emails include all customer details, items ordered, and shipping address

**Current Status**: Demo Mode (Emails won't be sent, order details logged to console)

---

## 📞 BUSINESS CONTACT INFORMATION

Edit these with your real business details. These appear in the footer and emails:

```
BUSINESS_EMAIL=contact@yourdomain.com
BUSINESS_SUPPORT_EMAIL=support@yourdomain.com
BUSINESS_PHONE=+91 XXXXXXXXXX
BUSINESS_WHATSAPP=+91XXXXXXXXXX (no spaces, e.g., +919876543210)
BUSINESS_ADDRESS=Your full business address including city, state, and pincode
```

**Where these appear**:
- Website footer (contact section)
- Order confirmation emails
- Customer support links
- WhatsApp chat button

---

## 🎨 ADVANCED CUSTOMIZATION

### Changing Colors and Styling
- Edit `/app/app/globals.css` for global styles
- Edit `/app/tailwind.config.js` for theme colors
- Component files in `/app/components/` for individual sections

### Changing Product Images
- Upload products via Admin Panel at `/admin`
- Or edit seed data in `/app/scripts/seed.js`

### Changing Footer Content
- Edit `/app/components/Footer.jsx`
- Modify sections, links, social media URLs

### Changing Hero Slider Images and Text
- Edit `/app/app/page.js`
- Find the `heroSlides` array
- Change images, titles, descriptions

---

## 📱 WHATSAPP NOTIFICATIONS

**How it works**: When you receive an order notification email, it includes a "Open in WhatsApp" button that opens WhatsApp with pre-filled customer details.

**To receive WhatsApp notifications**:
1. Set your WhatsApp number in `BUSINESS_WHATSAPP`
2. When you get order email, click "Open in WhatsApp" button
3. It will open WhatsApp Web/App with customer details
4. You can directly message the customer

**Alternative** (for automated WhatsApp using Twilio):
1. Sign up at https://www.twilio.com/whatsapp
2. Get WhatsApp Business API access
3. Additional code integration required (contact support)

---

## 🔒 SECURITY SETTINGS

### JWT Secret (for user authentication)
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Change this to a random string in production!

### Create Admin User

To access the admin panel (`/admin`):

1. Register a normal account on your website
2. Connect to MongoDB and update your user:

```javascript
use wasp_ecommerce
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

3. Login and access `/admin`

---

## 🧪 TESTING MODE vs PRODUCTION MODE

### Current Mode: DEMO/TESTING

- **Razorpay**: Using dummy keys (no real payments)
- **SendGrid**: Using dummy key (no real emails)
- **Orders**: Will be created in database but no payment/email

### To Enable PRODUCTION Mode:

1. Replace ALL dummy values in this file with real API keys
2. Restart the application
3. Test with small amounts first!

---

## 🚀 QUICK START CHECKLIST

- [ ] Replace Razorpay API keys
- [ ] Replace SendGrid API key
- [ ] Verify sender email in SendGrid
- [ ] Update business contact information
- [ ] Test order flow with dummy data
- [ ] Create admin user in database
- [ ] Test admin panel functionality
- [ ] Update footer social media links
- [ ] Customize hero slider images
- [ ] Add real product images
- [ ] Test payment gateway (use Razorpay test cards)
- [ ] Test email notifications
- [ ] Verify WhatsApp link works
- [ ] Review and update terms/privacy pages

---

## 📞 SUPPORT

If you need help configuring any of these settings:

1. Check the README.md file for detailed documentation
2. Visit Razorpay docs: https://razorpay.com/docs/
3. Visit SendGrid docs: https://docs.sendgrid.com/

---

## 🔄 HOW TO RESTART AFTER CHANGES

After editing this file:

```bash
cd /app
sudo supervisorctl restart nextjs
```

Or restart all services:

```bash
sudo supervisorctl restart all
```

Check if services are running:

```bash
sudo supervisorctl status
```

---

**Last Updated**: $(date)
**Version**: 1.0.0
