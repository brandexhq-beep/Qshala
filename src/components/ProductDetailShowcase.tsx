import { useState, useEffect, useRef } from 'react';
import QTMascot from './QTMascot';
import {
  ShoppingCart,
  Zap,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';
import type { ShopifyProductItem, ShopifyImage, ShopifyVariant } from '../lib/shopify/client';
import { createShopifyCheckoutUrl, safeRedirectToCheckout } from '../lib/shopify/client';
import {
  addToCart as addToCartStore,
  getStoredCart,
  updateCartQuantity,
  type CartLineItem,
} from '../lib/shopify/cartStore';

interface ProductDetailShowcaseProps {
  product: ShopifyProductItem;
}

export default function ProductDetailShowcase({ product }: ProductDetailShowcaseProps) {
  const images: ShopifyImage[] = product.images && product.images.length > 0
    ? product.images
    : [{ url: product.imageSrc, altText: product.title }];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variantId || (product.variants && product.variants[0]?.id) || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Swipe gesture tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Thumbnail refs for smooth scrolling into view
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    thumbnailRefs.current[activeImageIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeImageIndex]);

  // Keyboard navigation for gallery & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Sync cart with global store
  useEffect(() => {
    setCart(getStoredCart());

    const handleCartUpdate = (e: any) => {
      setCart(e.detail?.cart || getStoredCart());
    };

    const handleOpenDrawer = () => {
      setIsCartOpen(true);
    };

    window.addEventListener('qshala-cart-updated', handleCartUpdate);
    window.addEventListener('qshala-open-cart', handleOpenDrawer);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('qshala-cart-updated', handleCartUpdate);
      window.removeEventListener('qshala-open-cart', handleOpenDrawer);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const activeVariant: ShopifyVariant | undefined = product.variants?.find(
    (v) => v.id === selectedVariantId
  ) || product.variants?.[0];

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentCompareAtPrice = activeVariant?.compareAtPrice || product.originalPrice;
  const savings = currentCompareAtPrice && currentCompareAtPrice > currentPrice
    ? currentCompareAtPrice - currentPrice
    : 0;

  const handleAddToCart = () => {
    addToCartStore({
      id: product.id,
      variantId: selectedVariantId,
      title: product.title,
      editionTitle: activeVariant && activeVariant.title !== 'Default Title' ? activeVariant.title : undefined,
      price: currentPrice,
      imageSrc: images[0]?.url || product.imageSrc,
      quantity,
    });

    setToastMessage(`Added "${product.title}" (${quantity}) to cart!`);
    setIsCartOpen(true);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const line = [{ variantId: selectedVariantId, quantity }];
      const { checkoutUrl, error } = await createShopifyCheckoutUrl(line);
      if (checkoutUrl && safeRedirectToCheckout(checkoutUrl)) {
        return;
      } else {
        setCheckoutError(error || 'Failed to initialize secure checkout. Please try again or order via WhatsApp.');
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Checkout failed. Please order via WhatsApp.');
      setIsCheckingOut(false);
    }
  };

  const handleDrawerCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const lines = cart.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }));

      const { checkoutUrl, error } = await createShopifyCheckoutUrl(lines);
      if (checkoutUrl && safeRedirectToCheckout(checkoutUrl)) {
        return;
      } else {
        setCheckoutError(error || 'Failed to initialize secure checkout.');
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Checkout error. Please try again.');
      setIsCheckingOut(false);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="w-full space-y-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-[#FDB913] text-sm font-black flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FDB913]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Display Frame - Locked height to eliminate layout shift (CLS) */}
          <div 
            className="relative rounded-3xl bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-200/50 border border-slate-200/90 shadow-sm overflow-hidden h-[380px] sm:h-[480px] md:h-[520px] w-full flex items-center justify-center select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Mascot Accent */}
            <div className="absolute top-4 right-4 z-10 scale-90 sm:scale-100">
              <QTMascot variant={product.mascotVariant} size="sm" />
            </div>

            {/* Badge */}
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full bg-slate-900 text-white font-black text-xs uppercase font-heading shadow-sm">
                {product.badge}
              </span>
            )}

            {/* Previous Image Arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous product photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md hover:shadow-lg border border-slate-200/80 flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:scale-105 backdrop-blur-xs"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Click to Enlarge / Look Into It Container */}
            <div 
              className="w-full h-full flex items-center justify-center p-6 sm:p-10 cursor-zoom-in group"
              onClick={() => setIsLightboxOpen(true)}
              title="Click to view high-resolution photo"
            >
              <img
                key={activeImage.url}
                src={activeImage.url}
                alt={activeImage.altText || product.title}
                className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105 select-none"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            {/* Next Image Arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next product photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md hover:shadow-lg border border-slate-200/80 flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:scale-105 backdrop-blur-xs"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Enlarge / Zoom In Prompt */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Enlarge image full screen"
              className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-sm hover:shadow-md border border-slate-200/80 text-xs font-bold font-heading flex items-center gap-1.5 transition-all backdrop-blur-xs cursor-pointer active:scale-95"
            >
              <ZoomIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Enlarge</span>
            </button>

            {/* Image Counter Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-black font-heading shadow-xs select-none">
                {activeImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Multiple Image Thumbnails Row - Padded container prevents ring clipping */}
          {images.length > 1 && (
            <div className="relative">
              <div className="flex items-center gap-3.5 overflow-x-auto py-3.5 px-3 sm:px-4 scrollbar-none scroll-smooth">
                {images.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={`${img.url}-${idx}`}
                      ref={(el) => { thumbnailRefs.current[idx] = el; }}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View photo ${idx + 1} of ${images.length}`}
                      className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl p-2 transition-all cursor-pointer bg-slate-50 flex items-center justify-center shrink-0 border-2 ${
                        isActive
                          ? 'border-[#30B2E7] ring-2 ring-inset ring-[#30B2E7]/40 bg-white shadow-md'
                          : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.altText || `Thumbnail ${idx + 1}`}
                        className="max-h-full max-w-full object-contain pointer-events-none"
                      />
                    </button>
                  );
                })}
                {/* Trailing spacer ensures the last thumbnail never touches the scroll boundary */}
                <div className="w-3 shrink-0 pointer-events-none" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Editions, Actions & Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-xs uppercase tracking-wider font-heading">
                {product.category}
              </span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-heading">
                ✓ In Stock • Ready to Ship
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Pricing Stack */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                ₹{currentPrice}/-
              </span>
              {currentCompareAtPrice && currentCompareAtPrice > currentPrice && (
                <span className="text-lg font-bold text-slate-400 line-through font-heading">
                  ₹{currentCompareAtPrice}/-
                </span>
              )}
              {savings > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#75B543] text-white font-black text-xs font-heading">
                  Save ₹{savings}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs font-medium">
              Taxes included. 100% encrypted &amp; secure checkout.
            </p>
          </div>

          {/* Multiple Editions / Variants (e.g. Signed copy vs Standard) */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider font-heading block">
                Choose Edition:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#30B2E7] bg-sky-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="font-black text-xs sm:text-sm text-slate-900 font-heading">
                        {variant.title}
                      </div>
                      <div className="text-xs font-bold text-[#30B2E7] mt-0.5">
                        ₹{variant.price}/-
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Counter & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider font-heading">
                Quantity:
              </span>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center border border-slate-200 active:scale-95 cursor-pointer shadow-xs"
                >
                  -
                </button>
                <span className="font-black text-xs px-2 min-w-[20px] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center border border-slate-200 active:scale-95 cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {checkoutError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {checkoutError}
              </div>
            )}

            {/* Primary Action Buttons Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider font-heading shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-heading shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isCheckingOut ? (
                  <span>Redirecting...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 stroke-[2.5] fill-current" />
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>

            {/* Alternative Concierge WhatsApp Button */}
            {(() => {
              const waText = `*Inquiry for ${product.title}*\n\nEdition: ${activeVariant?.title || 'Standard'}\nQuantity: ${quantity}\nPrice: ₹${currentPrice * quantity}/-\n\nPlease confirm delivery availability.`;
              const waUrl = `https://wa.me/918971676100?text=${encodeURIComponent(waText)}`;
              return (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-xs uppercase tracking-wider font-heading text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Prefer to order via WhatsApp? Chat with our team</span>
                </a>
              );
            })()}
          </div>

          {/* Highlights & Trust Points */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-black text-xs text-slate-900 font-heading">Pan-India Delivery</div>
                <div className="text-[11px] text-slate-500 font-medium">Dispatches in 24–48 hrs</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-black text-xs text-slate-900 font-heading">Encrypted &amp; Secure</div>
                <div className="text-[11px] text-slate-500 font-medium">Safe &amp; Protected Checkout</div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-black text-slate-900 font-heading">About This Product</h3>
            <div className="text-slate-700 text-sm font-semibold leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-[#FFFDF5] h-[100dvh] shadow-2xl border-l border-slate-200 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto scroll-touch animate-in slide-in-from-right duration-300"
            style={{
              paddingTop: 'max(1.5rem, env(safe-area-inset-top, 0px))',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
              paddingRight: 'max(1.5rem, env(safe-area-inset-right, 0px))',
              paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 0px))',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-heading text-slate-900">Your Cart</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FDB913] text-slate-950 font-black text-xs">
                    {totalCartCount} items
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <QTMascot variant="curious" size="md" />
                  <p className="text-slate-600 font-bold text-sm">Your cart is currently empty!</p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 rounded-full bg-[#30B2E7] text-white font-black text-xs uppercase font-heading shadow-sm hover:shadow-md min-h-[44px]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-6">
                  {cart.map((item) => (
                    <div
                      key={item.variantId}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-14 h-14 object-contain rounded-xl border border-slate-100 bg-slate-50 shrink-0 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-slate-900 text-sm font-heading truncate">
                          {item.title}
                        </h4>
                        {item.editionTitle && (
                          <p className="text-[10px] text-slate-500 font-bold">
                            Edition: {item.editionTitle}
                          </p>
                        )}
                        <div className="text-xs font-black text-[#30B2E7] font-heading">
                          ₹{item.price}/-
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variantId, -1)}
                          aria-label={`Decrease quantity of ${item.title}`}
                          className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center border border-slate-200 active:scale-95 cursor-pointer shadow-xs"
                        >
                          -
                        </button>
                        <span className="font-black text-xs px-1.5">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variantId, 1)}
                          aria-label={`Increase quantity of ${item.title}`}
                          className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center border border-slate-200 active:scale-95 cursor-pointer shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3 bg-[#FFFDF5]">
                <div className="flex items-center justify-between text-lg font-black text-slate-900 font-heading">
                  <span>Subtotal:</span>
                  <span>₹{subtotalPrice}/-</span>
                </div>

                {checkoutError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {checkoutError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDrawerCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider font-heading shadow-md hover:shadow-lg text-center transition-all min-h-[48px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isCheckingOut ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Redirecting to secure checkout...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 font-medium">
                  Encrypted &amp; secure 256-bit SSL checkout
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div 
            className="flex items-center justify-between z-10 w-full max-w-6xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <h3 className="font-black text-sm sm:text-base font-heading truncate max-w-xs sm:max-w-md">
                {product.title}
              </h3>
              <p className="text-xs text-slate-400 font-bold">
                Image {activeImageIndex + 1} of {images.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close enlarged view"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Lightbox Center Image & Floating Navigation */}
          <div 
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 max-w-5xl mx-auto w-full min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            <img
              src={activeImage.url}
              alt={activeImage.altText || product.title}
              className="max-h-[70vh] max-w-[90vw] object-contain drop-shadow-2xl select-none"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails Strip */}
          {images.length > 1 && (
            <div 
              className="w-full max-w-xl mx-auto overflow-x-auto py-2 px-2 flex items-center justify-center gap-2 z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={`lightbox-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1 bg-white/10 shrink-0 border transition-all cursor-pointer flex items-center justify-center ${
                    idx === activeImageIndex
                      ? 'border-[#30B2E7] ring-2 ring-[#30B2E7] bg-white/20'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
