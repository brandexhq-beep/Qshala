import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const { mapShopifyProductNode } = await import('../src/lib/shopify/client.ts');

describe('Shopify Node Normalization', () => {
  test('should correctly map GraphQL product node into ShopifyProductItem', () => {
    const mockNode = {
      id: 'gid://shopify/Product/12345',
      title: 'Finance Quest: The Wonders of Money!',
      handle: 'finance-quest',
      description: 'An interactive financial literacy card game for families.',
      descriptionHtml: '<p>An interactive financial literacy card game.</p>',
      availableForSale: true,
      priceRange: {
        minVariantPrice: {
          amount: '799.0',
          currencyCode: 'INR'
        }
      },
      images: {
        edges: [
          { node: { url: 'https://cdn.shopify.com/image1.jpg', altText: 'Front Box' } },
          { node: { url: 'https://cdn.shopify.com/image2.jpg', altText: 'Cards Deck' } }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/67890',
              title: 'Default Title',
              availableForSale: true,
              price: { amount: '799.0', currencyCode: 'INR' },
              compareAtPrice: { amount: '999.0', currencyCode: 'INR' }
            }
          }
        ]
      }
    };

    const item = mapShopifyProductNode(mockNode, 0);

    assert.equal(item.shopifyProductId, 'gid://shopify/Product/12345');
    assert.equal(item.title, 'Finance Quest: The Wonders of Money!');
    assert.equal(item.handle, 'finance-quest');
    assert.equal(item.price, 799);
    assert.equal(item.originalPrice, 999);
    assert.equal(item.category, 'Books');
    assert.equal(item.mascotVariant, 'holding_money');
    assert.equal(item.images.length, 2);
    assert.equal(item.variants.length, 1);
    assert.equal(item.availableForSale, true);
    assert.equal(item.badge, 'Bestseller');
  });

  test('should detect Games category when title contains Quest or Deck', () => {
    const mockGame = {
      id: 'gid://shopify/Product/99999',
      title: 'MyIndia Quest Trivia Card Deck',
      handle: 'myindia-quest',
      variants: { edges: [] },
      images: { edges: [] }
    };

    const item = mapShopifyProductNode(mockGame, 1);
    assert.equal(item.category, 'Games');
    assert.equal(item.mascotVariant, 'curious');
    assert.equal(item.badge, 'Popular');
  });
});
