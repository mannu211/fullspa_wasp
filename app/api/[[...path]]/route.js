import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKeyId } from '@/lib/razorpay';
import { sendOrderConfirmationEmail } from '@/lib/sendgrid';

const JWT_SECRET = process.env.JWT_SECRET || 'wasp-secret-key-change-in-production';

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// GET Handler
export async function GET(request, { params }) {
  const path = params?.path?.join('/') || '';
  const { searchParams } = new URL(request.url);

  try {
    // Root endpoint
    if (!path || path === '') {
      return NextResponse.json({ 
        success: true, 
        message: 'WASP API is running',
        endpoints: {
          products: '/api/products',
          categories: '/api/categories',
          banners: '/api/banners',
          auth: '/api/auth',
          admin: '/api/admin'
        }
      });
    }

    // Products endpoints
    if (path === 'products') {
      const collection = await getCollection('products');
      const category = searchParams.get('category');
      const featured = searchParams.get('featured');
      const limit = parseInt(searchParams.get('limit')) || 20;
      const skip = parseInt(searchParams.get('skip')) || 0;

      let query = {};
      if (category) query.category = category;
      if (featured === 'true') query.featured = true;

      const products = await collection
        .find(query)
        .limit(limit)
        .skip(skip)
        .toArray();

      return NextResponse.json({ success: true, products });
    }

    if (path.startsWith('products/')) {
      const productId = path.split('/')[1];
      const collection = await getCollection('products');
      const product = await collection.findOne({ id: productId });

      if (!product) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, product });
    }

    // Categories endpoint
    if (path === 'categories') {
      const collection = await getCollection('categories');
      const categories = await collection.find({}).toArray();
      return NextResponse.json({ success: true, categories });
    }

    // Banners endpoint
    if (path === 'banners') {
      const collection = await getCollection('banners');
      const banners = await collection.find({ active: true }).toArray();
      return NextResponse.json({ success: true, banners });
    }

    // User profile endpoint
    if (path === 'user/profile') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const collection = await getCollection('users');
      const user = await collection.findOne({ id: decoded.userId }, { projection: { password: 0 } });

      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, user });
    }

    // Orders endpoint
    if (path === 'orders') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const collection = await getCollection('orders');
      const orders = await collection.find({ userId: decoded.userId }).sort({ createdAt: -1 }).toArray();

      return NextResponse.json({ success: true, orders });
    }

    // Admin - Get all products
    if (path === 'admin/products') {
      const decoded = verifyToken(request);
      if (!decoded || !decoded.isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const collection = await getCollection('products');
      const products = await collection.find({}).toArray();

      return NextResponse.json({ success: true, products });
    }

    // Admin - Get all orders
    if (path === 'admin/orders') {
      const decoded = verifyToken(request);
      if (!decoded || !decoded.isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const collection = await getCollection('orders');
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();

      return NextResponse.json({ success: true, orders });
    }

    // Admin - Get all banners
    if (path === 'admin/banners') {
      const decoded = verifyToken(request);
      if (!decoded || !decoded.isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const collection = await getCollection('banners');
      const banners = await collection.find({}).toArray();

      return NextResponse.json({ success: true, banners });
    }

    return NextResponse.json({ success: false, message: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

// POST Handler
export async function POST(request, { params }) {
  const path = params?.path?.join('/') || '';

  try {
    const body = await request.json();

    // Auth - Register
    if (path === 'auth/register') {
      const { email, password, name } = body;

      if (!email || !password || !name) {
        return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
      }

      const collection = await getCollection('users');
      const existingUser = await collection.findOne({ email });

      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
      };

      await collection.insertOne(user);

      const token = jwt.sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
      });
    }

    // Auth - Login
    if (path === 'auth/login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
      }

      const collection = await getCollection('users');
      const user = await collection.findOne({ email });

      if (!user) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
      });
    }

    // Create Order
    if (path === 'orders') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const { items, total, shippingAddress, paymentMethod } = body;

      if (!items || !total || !shippingAddress) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
      }

      const order = {
        id: uuidv4(),
        userId: decoded.userId,
        items,
        total,
        shippingAddress,
        paymentMethod: paymentMethod || 'demo',
        status: 'pending',
        createdAt: new Date(),
      };

      const collection = await getCollection('orders');
      await collection.insertOne(order);

      // Send order confirmation email
      try {
        const userEmail = shippingAddress.email || decoded.email;
        await sendOrderConfirmationEmail(order, userEmail);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the order if email fails
      }

      return NextResponse.json({ success: true, order });
    }

    // Create Razorpay Order
    if (path === 'payment/create-order') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const { amount, currency, receipt } = body;

      if (!amount) {
        return NextResponse.json({ success: false, message: 'Amount is required' }, { status: 400 });
      }

      try {
        const razorpayOrder = await createRazorpayOrder(
          Math.round(amount * 100), // Convert to paise
          currency || 'INR',
          receipt || `order_${Date.now()}`
        );

        return NextResponse.json({
          success: true,
          order: razorpayOrder,
          key_id: getRazorpayKeyId(),
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: error.message,
        }, { status: 500 });
      }
    }

    // Verify Razorpay Payment
    if (path === 'payment/verify') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

      try {
        const isValid = await verifyRazorpayPayment(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );

        if (isValid) {
          return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
          });
        } else {
          return NextResponse.json({
            success: false,
            message: 'Payment verification failed',
          }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: error.message,
        }, { status: 500 });
      }
    }

    // Admin - Create Product
    if (path === 'admin/products') {
      const decoded = verifyToken(request);
      if (!decoded || !decoded.isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const { name, description, price, category, image, sizes, discount, featured } = body;

      if (!name || !price || !category || !image) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
      }

      const product = {
        id: uuidv4(),
        name,
        description: description || '',
        price: parseFloat(price),
        salePrice: discount ? parseFloat(price) * (1 - discount / 100) : parseFloat(price),
        category,
        image,
        images: [image],
        sizes: sizes || ['S', 'M', 'L', 'XL'],
        discount: discount || 0,
        featured: featured || false,
        isNew: true,
        stock: 100,
        createdAt: new Date(),
      };

      const collection = await getCollection('products');
      await collection.insertOne(product);

      return NextResponse.json({ success: true, product });
    }

    // Admin - Create Banner
    if (path === 'admin/banners') {
      const decoded = verifyToken(request);
      if (!decoded || !decoded.isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const { title, description, image, link, active } = body;

      if (!title || !image) {
        return NextResponse.json({ success: false, message: 'Title and image are required' }, { status: 400 });
      }

      const banner = {
        id: uuidv4(),
        title,
        description: description || '',
        image,
        link: link || '#',
        active: active !== false,
        createdAt: new Date(),
      };

      const collection = await getCollection('banners');
      await collection.insertOne(banner);

      return NextResponse.json({ success: true, banner });
    }

    // Seed initial products
    if (path === 'seed/products') {
      const collection = await getCollection('products');
      const count = await collection.countDocuments();
      
      if (count > 0) {
        return NextResponse.json({ success: false, message: 'Products already seeded' }, { status: 400 });
      }

      const products = body.products || [];
      
      if (products.length > 0) {
        await collection.insertMany(products);
        return NextResponse.json({ success: true, message: 'Products seeded', count: products.length });
      }

      return NextResponse.json({ success: false, message: 'No products provided' }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(request, { params }) {
  const path = params?.path?.join('/') || '';

  try {
    const body = await request.json();
    const decoded = verifyToken(request);

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Admin - Update Product
    if (path.startsWith('admin/products/')) {
      const productId = path.split('/')[2];
      const collection = await getCollection('products');

      const updateData = { ...body };
      delete updateData.id;
      
      if (body.price && body.discount) {
        updateData.salePrice = parseFloat(body.price) * (1 - body.discount / 100);
      }

      const result = await collection.updateOne(
        { id: productId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Product updated' });
    }

    // Admin - Update Banner
    if (path.startsWith('admin/banners/')) {
      const bannerId = path.split('/')[2];
      const collection = await getCollection('banners');

      const updateData = { ...body };
      delete updateData.id;

      const result = await collection.updateOne(
        { id: bannerId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Banner updated' });
    }

    // Admin - Update Order Status
    if (path.startsWith('admin/orders/')) {
      const orderId = path.split('/')[2];
      const collection = await getCollection('orders');

      const result = await collection.updateOne(
        { id: orderId },
        { $set: { status: body.status } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Order updated' });
    }

    return NextResponse.json({ success: false, message: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(request, { params }) {
  const path = params?.path?.join('/') || '';

  try {
    const decoded = verifyToken(request);

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Admin - Delete Product
    if (path.startsWith('admin/products/')) {
      const productId = path.split('/')[2];
      const collection = await getCollection('products');

      const result = await collection.deleteOne({ id: productId });

      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Product deleted' });
    }

    // Admin - Delete Banner
    if (path.startsWith('admin/banners/')) {
      const bannerId = path.split('/')[2];
      const collection = await getCollection('banners');

      const result = await collection.deleteOne({ id: bannerId });

      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Banner deleted' });
    }

    return NextResponse.json({ success: false, message: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}
