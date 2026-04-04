'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const businessInfo = {
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'contact@wasp.com',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@wasp.com',
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91 98765 43210',
    whatsapp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || '+919876543210',
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '123 Fashion Street, Bandra West, Mumbai, Maharashtra 400050, India',
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I need help with WASP Fashion');
    window.open(`https://wa.me/${businessInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Indian Wear', href: '/category/indian' },
        { name: 'Western', href: '/category/western' },
        { name: 'Korean Fashion', href: '/category/korean' },
        { name: 'Jeans', href: '/category/jeans' },
        { name: 'Tops', href: '/category/tops' },
      ]
    },
    {
      title: 'Help & Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Shipping & Delivery', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Track Order', href: '/track-order' },
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Story', href: '/our-story' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
      ]
    },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-20">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Stay in Style</h3>
            <p className="text-gray-400 mb-6">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-white to-gray-300 rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span className="text-black font-black text-xl">W</span>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">WASP</h2>
                <p className="text-xs text-gray-400 -mt-1">Fashion</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Your destination for premium women's fashion. Discover the perfect blend of traditional elegance and contemporary style.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 mb-6">
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wide">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Email Us</h4>
                <a href={`mailto:${businessInfo.email}`} className="text-gray-400 text-sm hover:text-white block">
                  {businessInfo.email}
                </a>
                <a href={`mailto:${businessInfo.supportEmail}`} className="text-gray-400 text-sm hover:text-white block">
                  {businessInfo.supportEmail}
                </a>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Call Us</h4>
                <a href={`tel:${businessInfo.phone}`} className="text-gray-400 text-sm hover:text-white">
                  {businessInfo.phone}
                </a>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">WhatsApp</h4>
                <button 
                  onClick={handleWhatsAppClick}
                  className="text-gray-400 text-sm hover:text-white text-left"
                >
                  {businessInfo.whatsapp}
                </button>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Visit Us</h4>
                <p className="text-gray-400 text-sm">{businessInfo.address}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Section - More Prominent */}
        <div className="mt-12 pt-8 border-t border-zinc-900">
          <div className="mb-4 text-center">
            <h3 className="text-2xl font-bold mb-2">Find Our Store</h3>
            <p className="text-gray-400">Visit us at our physical location</p>
          </div>
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="h-80 relative">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=400&fit=crop" 
                alt="Store Location Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <MapPin className="w-16 h-16 mx-auto mb-4 text-white drop-shadow-lg" />
                <h4 className="text-2xl font-bold mb-2 drop-shadow-lg">123 Fashion Street, Mumbai</h4>
                <p className="text-gray-200 mb-6 drop-shadow-lg">Bandra West, Maharashtra 400050</p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://maps.google.com/?q=Mumbai+Fashion+Street+Bandra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-xl"
                >
                  <ExternalLink className="w-5 h-5" />
                  View on Google Maps
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-zinc-900">
          <div className="text-center">
            <h4 className="text-sm font-semibold mb-4 text-gray-400">WE ACCEPT</h4>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <motion.div whileHover={{ y: -2 }} className="px-4 py-2 bg-zinc-900 rounded text-xs font-semibold hover:bg-zinc-800 transition-all">Razorpay</motion.div>
              <motion.div whileHover={{ y: -2 }} className="px-4 py-2 bg-zinc-900 rounded text-xs font-semibold hover:bg-zinc-800 transition-all">Credit Card</motion.div>
              <motion.div whileHover={{ y: -2 }} className="px-4 py-2 bg-zinc-900 rounded text-xs font-semibold hover:bg-zinc-800 transition-all">Debit Card</motion.div>
              <motion.div whileHover={{ y: -2 }} className="px-4 py-2 bg-zinc-900 rounded text-xs font-semibold hover:bg-zinc-800 transition-all">UPI</motion.div>
              <motion.div whileHover={{ y: -2 }} className="px-4 py-2 bg-zinc-900 rounded text-xs font-semibold hover:bg-zinc-800 transition-all">Net Banking</motion.div>
              <motion.div whileHover={{ y: -2 }} className="px-4 py-2 bg-zinc-900 rounded text-xs font-semibold hover:bg-zinc-800 transition-all">Wallets</motion.div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} WASP Fashion. All rights reserved. Made with ❤️ in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
