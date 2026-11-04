import React, { useState, useEffect } from 'react';
import QTMascot from './QTMascot';
import { ShoppingCart, Lock, ArrowRight, Zap } from 'lucide-react';
import {
  createShopifyCheckoutUrl,
  safeRedirectToCheckout,
  getShopifyProducts,
  type ShopifyImage,
} from '../lib/shopify/client';
import {
  getStoredCart,
  addToCart as addToCartStore,
  updateCartQuantity,
  type CartLineItem,
} from '../lib/shopify/cartStore';

export interface ProductVariantItem {
  id: string;
  title: string;
  price: number;
  availableForSale: boolean;
}

export interface ProductItem {
  id: string;
  variantId?: string;
  handle?: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: 'Books' | 'Games' | 'Learning Kits' | 'Stationery' | 'QShala Merch';
  subtitle: string;
  description: string;
  imageSrc: string;
  images?: ShopifyImage[];
  badge?: string;
  cardColor: string;
  mascotVariant: 'idea' | 'reading' | 'holding_money' | 'trophy' | 'curious';
  variants?: ProductVariantItem[];
  availableForSale?: boolean;
}

// Fallback initial list if API is completely unreachable
const REAL_SHOPIFY_PRODUCTS: ProductItem[] = [
  {
    id: 'gid://shopify/Product/9177260785882',
    variantId: 'gid://shopify/ProductVariant/47622830031066',
    handle: 'qs-financequest',
    title: 'Finance Quest: The Wonders of Money!',
    price: 250,
    originalPrice: 350,
    category: 'Books',
    subtitle: 'Starting early with financial literacy for students aged 11-14',
    description: 'An interactive illustrated quiz book introducing kids to saving, budgeting, compound interest, banking, and practical money skills through fun scenarios.',
    imageSrc: 'https://cdn.shopify.com/s/files/1/0810/5748/0922/files/Book_-_Front_Cover.jpg?v=1776234852',
    badge: 'Bestseller',
    cardColor: '#FFF8E1',
    mascotVariant: 'holding_money',
    availableForSale: true,
  },
  {
    id: 'gid://shopify/Product/9242775781594',
    variantId: 'gid://shopify/ProductVariant/47819613765850',
    handle: 'myindia-quest',
    title: 'MyIndia Quest',
    price: 799,
    originalPrice: 999,
    category: 'Games',
    subtitle: 'Educational card game exploring Indian heritage, geography & culture',
    description: 'An educational card game for young learners featuring two gameplay formats: Incredible India and Quriosity Clash to build knowledge and curiosity through play.',
    imageSrc: 'https://cdn.shopify.com/s/files/1/0810/5748/0922/files/GameBoxFront.png?v=1777548227',
    badge: 'Popular',
    cardColor: '#E8F6FD',
    mascotVariant: 'curious',
    availableForSale: true,
  },
  {
    id: 'gid://shopify/Product/9271149625562',
    variantId: 'gid://shopify/ProductVariant/47982313242842',
    handle: 'ready-for-the-law-challenge-law-quiz-for-curious-minds',
    title: 'Ready for the Law Challenge: Law Quiz for Curious Minds',
    price: 499,
    originalPrice: 650,
    category: 'Books',
    subtitle: 'Over 300+ sharp legal trivia and constitutional questions',
    description: 'Packed with 20 chapters tackling the Indian Constitution, landmark judgments, women’s rights, and international legal order.',
    imageSrc: 'https://cdn.shopify.com/s/files/1/0810/5748/0922/files/ReadyForLawChallengeMockup_1.png?v=1779889241',
    badge: 'Quizmasters Pick',
    cardColor: '#EDF7E5',
    mascotVariant: 'trophy',
    variants: [
      {
        id: 'gid://shopify/ProductVariant/47982313242842',
        title: 'Signed Copy By Raghav',
        price: 499,
        availableForSale: true,
      },
      {
        id: 'gid://shopify/ProductVariant/47982314356954',
        title: 'Standard Copy',
        price: 499,
        availableForSale: true,
      },
    ],
    availableForSale: true,
  },
];

interface ShopStorefrontProps {
  initialProducts?: ProductItem[];
}

export default function ShopStorefront({ initialProducts }: ShopStorefrontProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<ProductItem[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : REAL_SHOPIFY_PRODUCTS
  );
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState<number>(0);
  const [quickViewQuantity, setQuickViewQuantity] = useState<number>(1);
  const [quickViewVariantId, setQuickViewVariantId] = useState<string>('');

  // Track user-selected variant for each product ID
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Dynamic Categories derived from current products
  const dynamicCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // 1. Sync cart with global store & check URL query params
  useEffect(() => {
    setCart(getStoredCart());

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openCart') === 'true') {
        setIsCartOpen(true);
      }

      const viewHandle = params.get('view');
      if (viewHandle) {
        const found = products.find((p) => p.handle === viewHandle);
        if (found) {
          openQuickView(found);
        }
      }
    }

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
  }, [products]);

  // 2. Real-time background sync: query Shopify Storefront API on mount
  // If the merchant added new products or changed prices, the UI updates dynamically!
  useEffect(() => {
    let isMounted = true;
    getShopifyProducts()
      .then((liveItems) => {
        if (!isMounted || !liveItems || liveItems.length === 0) return;
        setProducts(
          liveItems.map((item) => ({
            id: item.id,
            variantId: item.variantId,
            handle: item.handle,
            title: item.title,
            price: item.price,
            originalPrice: item.originalPrice,
            category: item.category,
            subtitle: item.subtitle,
            description: item.description,
            imageSrc: item.imageSrc,
            images: item.images,
            badge: item.badge,
            cardColor: item.cardColor,
            mascotVariant: item.mascotVariant,
            variants: item.variants,
            availableForSale: item.availableForSale,
          }))
        );
      })
      .catch((err) => {
        console.warn('[ShopStorefront] Real-time Shopify refresh note:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSelectVariant = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.stopPropagation();
    e.preventDefault();

    const activeVariantId = selectedVariants[product.id] || product.variantId || '';
    const activeVariant = product.variants?.find((v) => v.id === activeVariantId);
    const price = activeVariant ? activeVariant.price : product.price;

    addToCartStore({
      id: product.id,
      variantId: activeVariantId,
      title: product.title,
      editionTitle: activeVariant && activeVariant.title !== 'Default Title' ? activeVariant.title : undefined,
      price,
      imageSrc: product.imageSrc,
      quantity: 1,
    });

    setToastMessage(`Added "${product.title}" to cart!`);
    setIsCartOpen(true);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openQuickView = (product: ProductItem) => {
    setQuickViewProduct(product);
    setQuickViewImageIndex(0);
    setQuickViewQuantity(1);
    setQuickViewVariantId(product.variantId || product.variants?.[0]?.id || '');
  };

  const handleQuickViewAddToCart = () => {
    if (!quickViewProduct) return;
    const activeVariant = quickViewProduct.variants?.find((v) => v.id === quickViewVariantId);
    const price = activeVariant ? activeVariant.price : quickViewProduct.price;

    addToCartStore({
      id: quickViewProduct.id,
      variantId: quickViewVariantId,
      title: quickViewProduct.title,
      editionTitle: activeVariant && activeVariant.title !== 'Default Title' ? activeVariant.title : undefined,
      price,
      imageSrc: quickViewProduct.images?.[0]?.url || quickViewProduct.imageSrc,
      quantity: quickViewQuantity,
    });

    setToastMessage(`Added "${quickViewProduct.title}" (${quickViewQuantity}) to cart!`);
    setQuickViewProduct(null);
    setIsCartOpen(true);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickViewBuyNow = async () => {
    if (!quickViewProduct) return;
    setIsCheckingOut(true);
    try {
      const line = [{ variantId: quickViewVariantId, quantity: quickViewQuantity }];
      const { checkoutUrl, error } = await createShopifyCheckoutUrl(line);
      if (checkoutUrl && safeRedirectToCheckout(checkoutUrl)) {
        return;
      } else {
        alert(error || 'Failed to initialize secure checkout.');
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      alert(err?.message || 'Checkout failed.');
      setIsCheckingOut(false);
    }
  };

  const handleShopifyCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const lines = cart
        .filter((item) => item.variantId)
        .map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }));

      if (lines.length === 0) {
        setIsCheckingOut(false);
        return;
      }

      const { checkoutUrl, error } = await createShopifyCheckoutUrl(lines);

      if (checkoutUrl && safeRedirectToCheckout(checkoutUrl)) {
        return;
      } else {
        setCheckoutError(error || 'Could not initiate secure checkout. Please try again.');
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Checkout failed.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-[#FDB913] text-sm font-black flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FDB913]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#FDB913] text-slate-950 font-black text-xs uppercase font-heading">
              Official Store
            </span>
            <QTMascot variant="holding_money" size="sm" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight mt-2">
            Quriosity Store
          </h1>
          <p className="text-slate-600 text-sm font-semibold pt-1">
            Official hands-on books, socratic games, and quiz decks from QShala.
          </p>
        </div>

        {/* Dynamic Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {dynamicCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-black text-xs font-heading transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full pt-2">
        {filteredProducts.map((product) => {
          const hasMultipleVariants = product.variants && product.variants.length > 1;
          const currentVariantId = selectedVariants[product.id] || product.variantId;
          const currentVariant = product.variants?.find((v) => v.id === currentVariantId);
          const displayPrice = currentVariant ? currentVariant.price : product.price;
          const productUrl = product.handle ? `/shop/${product.handle}` : `/shop`;

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group relative"
            >
              {/* Mascot Badge */}
              <div className="absolute top-4 right-4 z-10 scale-90 origin-top-right">
                <QTMascot variant={product.mascotVariant} size="sm" />
              </div>

              <div className="space-y-4">
                {/* Product Image Frame: Aspect 4/5 portrait ratio with object-contain to display books and game boxes without cropping */}
                <a
                  href={productUrl}
                  className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-200/50 border border-slate-200/80 shadow-xs flex items-center justify-center p-4 block cursor-pointer group-hover:border-slate-300 transition-colors"
                >
                  <img
                    src={product.imageSrc}
                    alt={product.title}
                    className="max-h-full max-w-full w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900 text-white font-black text-[10px] uppercase font-heading shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </a>

                {/* Product Info */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider font-heading bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
                    {product.category}
                  </span>

                  <a href={productUrl} className="block group-hover:text-[#30B2E7] transition-colors">
                    <h3 className="text-xl font-black text-slate-900 font-heading leading-snug">
                      {product.title}
                    </h3>
                  </a>

                  <p className="text-slate-800 text-xs font-bold font-heading line-clamp-2">
                    {product.subtitle}
                  </p>

                  <p className="text-slate-600 text-xs font-semibold leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Multiple Variant Selector */}
                  {hasMultipleVariants && product.variants && (
                    <div className="pt-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                        Select Edition:
                      </label>
                      <select
                        value={currentVariantId}
                        onChange={(e) => handleSelectVariant(product.id, e.target.value)}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#30B2E7]"
                      >
                        {product.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.title} — ₹{v.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Add to Cart Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-2xl font-black text-slate-900 font-heading">
                    ₹{displayPrice}/-
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-slate-400 line-through ml-2 font-heading">
                      ₹{product.originalPrice}/-
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={productUrl}
                    className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs font-heading transition-colors"
                  >
                    Details
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className="px-4 py-2 rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal (For instant inspection of photos and purchasing) */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto scroll-touch">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 flex items-center justify-center font-black text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Image Frame */}
              <div className="space-y-3">
                <div className="rounded-2xl aspect-[4/5] bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 p-4 flex items-center justify-center">
                  <img
                    src={quickViewProduct.images?.[quickViewImageIndex]?.url || quickViewProduct.imageSrc}
                    alt={quickViewProduct.title}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                </div>
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto py-2.5 px-2 scrollbar-none">
                    {quickViewProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuickViewImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl p-1 bg-white shrink-0 cursor-pointer transition-all border-2 ${
                          idx === quickViewImageIndex ? 'border-[#30B2E7] ring-1 ring-inset ring-[#30B2E7]/40 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt="" className="max-h-full max-w-full object-contain pointer-events-none" />
                      </button>
                    ))}
                    <div className="w-2 shrink-0 pointer-events-none" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Product Info & Actions */}
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] uppercase font-heading">
                  {quickViewProduct.category}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {quickViewProduct.title}
                </h2>

                <div className="text-2xl font-black text-slate-900 font-heading">
                  ₹{quickViewProduct.price}/-
                </div>

                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Variant Selector */}
                {quickViewProduct.variants && quickViewProduct.variants.length > 1 && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">
                      Choose Edition:
                    </label>
                    <select
                      value={quickViewVariantId}
                      onChange={(e) => setQuickViewVariantId(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2"
                    >
                      {quickViewProduct.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} — ₹{v.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-700">Quantity:</span>
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button
                      onClick={() => setQuickViewQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-full bg-white font-bold"
                    >
                      -
                    </button>
                    <span className="font-black text-xs px-2">{quickViewQuantity}</span>
                    <button
                      onClick={() => setQuickViewQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-full bg-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleQuickViewAddToCart}
                    className="w-full py-3 rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider font-heading shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleQuickViewBuyNow}
                    disabled={isCheckingOut}
                    className="w-full py-3 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider font-heading shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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

                  {quickViewProduct.handle && (
                    <a
                      href={`/shop/${quickViewProduct.handle}`}
                      className="block text-center text-xs font-black text-[#30B2E7] hover:underline pt-1"
                    >
                      View Full Product Page &rarr;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-md bg-[#FFFDF5] h-[100dvh] shadow-2xl border-l border-slate-200 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto scroll-touch animate-in slide-in-from-right duration-300"
            style={{
              paddingTop: 'max(1.5rem, env(safe-area-inset-top, 0px))',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
              paddingRight: 'max(1.5rem, env(safe-area-inset-right, 0px))',
              paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 0px))'
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
                    Start Shopping
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
                  onClick={handleShopifyCheckout}
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
    </div>
  );
}
