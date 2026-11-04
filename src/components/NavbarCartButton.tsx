import React, { useState, useEffect } from 'react';
import { getStoredCart, triggerOpenCartDrawer } from '../lib/shopify/cartStore';

export default function NavbarCartButton() {
  const [itemCount, setItemCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const updateCount = () => {
      const cart = getStoredCart();
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(total);
    };

    updateCount();

    const handleUpdate = () => updateCount();
    window.addEventListener('qshala-cart-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('qshala-cart-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/shop' || path.startsWith('/shop/')) {
        triggerOpenCartDrawer();
      } else {
        window.location.href = '/shop?openCart=true';
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Shopping Cart with ${itemCount} items`}
      title="View Shopping Cart"
      className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 shadow-xs hover:shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7]"
    >
      <svg className="w-5 h-5 fill-current text-slate-800" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>

      {isMounted && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#FDB913] text-slate-950 font-black text-[11px] font-heading flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75 duration-200">
          {itemCount}
        </span>
      )}
    </button>
  );
}
