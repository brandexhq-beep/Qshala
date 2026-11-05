import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock browser localStorage and window dispatchEvent
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new LocalStorageMock();
globalThis.window = {
  dispatchEvent: () => true
};
globalThis.CustomEvent = class {
  constructor(name, opts) {
    this.name = name;
    this.detail = opts?.detail;
  }
};

const { addToCart, getStoredCart, updateCartQuantity, clearCart } = await import('../src/lib/shopify/cartStore.ts');

describe('Shopify CartStore State Management', () => {
  beforeEach(() => {
    clearCart();
  });

  test('should initially return an empty cart', () => {
    assert.deepEqual(getStoredCart(), []);
  });

  test('should add a new product item to cart', () => {
    const item = {
      id: 'prod-1',
      variantId: 'var-1',
      title: 'Finance Quest: The Wonders of Money',
      price: 799,
      imageSrc: '/assets/products/financequest.webp',
      quantity: 1
    };

    const updated = addToCart(item);
    assert.equal(updated.length, 1);
    assert.equal(updated[0].id, 'prod-1');
    assert.equal(updated[0].quantity, 1);
    assert.equal(updated[0].price, 799);
  });

  test('should increment quantity when same variant is added again', () => {
    const item = {
      id: 'prod-1',
      variantId: 'var-1',
      title: 'Finance Quest',
      price: 799,
      imageSrc: '/assets/products/financequest.webp',
      quantity: 1
    };

    addToCart(item);
    const updated = addToCart({ ...item, quantity: 2 });
    assert.equal(updated.length, 1);
    assert.equal(updated[0].quantity, 3);
  });

  test('should increment and decrement quantity with updateCartQuantity', () => {
    addToCart({
      id: 'prod-1',
      variantId: 'var-1',
      title: 'Finance Quest',
      price: 799,
      imageSrc: '/assets/products/financequest.webp',
      quantity: 2
    });

    const plusOne = updateCartQuantity('var-1', 1);
    assert.equal(plusOne[0].quantity, 3);

    const minusOne = updateCartQuantity('var-1', -1);
    assert.equal(minusOne[0].quantity, 2);

    // Decrementing below 1 removes the item
    const removed = updateCartQuantity('var-1', -2);
    assert.equal(removed.length, 0);
  });

  test('should clear all items with clearCart', () => {
    addToCart({
      id: 'prod-1',
      variantId: 'var-1',
      title: 'Product 1',
      price: 500,
      imageSrc: '/img.webp',
      quantity: 1
    });
    addToCart({
      id: 'prod-2',
      variantId: 'var-2',
      title: 'Product 2',
      price: 600,
      imageSrc: '/img.webp',
      quantity: 1
    });

    assert.equal(getStoredCart().length, 2);
    clearCart();
    assert.equal(getStoredCart().length, 0);
  });
});
