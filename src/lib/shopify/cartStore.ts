/**
 * Global QShala Cart Store
 * Synchronizes cart items across Navbar, Store Catalog, and Product Detail pages using localStorage and custom events.
 */

export interface CartLineItem {
  id: string; // product id
  variantId: string;
  title: string;
  editionTitle?: string;
  price: number;
  imageSrc: string;
  quantity: number;
}

const STORAGE_KEY = 'qshala_cart_v1';

export function getStoredCart(): CartLineItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('[CartStore] Failed to parse stored cart:', e);
    return [];
  }
}

export function saveCart(cart: CartLineItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('qshala-cart-updated', { detail: { cart } }));
  } catch (e) {
    console.error('[CartStore] Failed to save cart:', e);
  }
}

export function addToCart(item: {
  id: string;
  variantId: string;
  title: string;
  editionTitle?: string;
  price: number;
  imageSrc: string;
  quantity?: number;
}) {
  const current = getStoredCart();
  const qty = item.quantity || 1;
  const existingIndex = current.findIndex(
    (i) => i.id === item.id && i.variantId === item.variantId
  );

  let updated: CartLineItem[];
  if (existingIndex > -1) {
    updated = [...current];
    updated[existingIndex].quantity += qty;
  } else {
    updated = [
      ...current,
      {
        id: item.id,
        variantId: item.variantId,
        title: item.title,
        editionTitle: item.editionTitle,
        price: item.price,
        imageSrc: item.imageSrc,
        quantity: qty,
      },
    ];
  }

  saveCart(updated);
  return updated;
}

export function updateCartQuantity(variantId: string, delta: number) {
  const current = getStoredCart();
  const updated = current
    .map((item) => {
      if (item.variantId === variantId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean) as CartLineItem[];

  saveCart(updated);
  return updated;
}

export function clearCart() {
  saveCart([]);
}

export function triggerOpenCartDrawer() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('qshala-open-cart'));
}
