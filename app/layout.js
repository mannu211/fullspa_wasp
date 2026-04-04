'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initAuth } from '@/lib/authSlice';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import { Toaster } from 'sonner';
import './globals.css';

function AuthInit({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(initAuth({ token, user }));
        } catch (e) {
          console.error('Failed to parse user from localStorage');
        }
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>WASP - Premium Women's Fashion</title>
        <meta name="description" content="Discover elegant Indian, Western, and Korean fashion at WASP" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white antialiased">
        <Provider store={store}>
          <AuthInit>
            <Navbar />
            <CartSidebar />
            <main>{children}</main>
            <Toaster position="top-right" theme="dark" />
          </AuthInit>
        </Provider>
      </body>
    </html>
  );
}
