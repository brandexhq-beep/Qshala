/**
 * Shopify Storefront API Client for QShala Headless E-Commerce
 * Enables live product querying, multiple image gallery retrieval, and headless checkout URL generation.
 */

export interface ShopifyImage {
  url: string;
  altText?: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
}

export interface ShopifyProductItem {
  id: string;
  shopifyProductId: string;
  variantId: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: 'Books' | 'Games' | 'Learning Kits' | 'Stationery' | 'QShala Merch';
  imageSrc: string;
  images: ShopifyImage[];
  badge?: string;
  cardColor: string;
  mascotVariant: 'idea' | 'reading' | 'holding_money' | 'trophy' | 'curious';
  variants: ShopifyVariant[];
  availableForSale: boolean;
}

const DEFAULT_STORE_DOMAIN = 'shop.qshala.com';
const DEFAULT_SF_TOKEN = '71386c677ca47211e5b241cf476e1a9a';
const API_VERSION = '2025-01';

export function getShopifyConfig() {
  const storeDomain =
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SHOPIFY_STORE_DOMAIN) ||
    (typeof process !== 'undefined' && process.env?.PUBLIC_SHOPIFY_STORE_DOMAIN) ||
    DEFAULT_STORE_DOMAIN;

  const storefrontToken =
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
    (typeof process !== 'undefined' && process.env?.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
    DEFAULT_SF_TOKEN;

  return { storeDomain, storefrontToken };
}

/**
 * Execute GraphQL query against Shopify Storefront API
 */
export async function shopifyStorefrontFetch<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T | null> {
  const { storeDomain, storefrontToken } = getShopifyConfig();

  if (!storeDomain || !storefrontToken) {
    console.warn('[Shopify] Store domain or Storefront token is missing.');
    return null;
  }

  try {
    const endpoint = `https://${storeDomain}/api/${API_VERSION}/graphql.json`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error(`[Shopify] API HTTP error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    if (json.errors) {
      console.error('[Shopify] GraphQL errors:', json.errors);
      return null;
    }

    return json.data as T;
  } catch (error) {
    console.error('[Shopify] Network error calling Storefront API:', error);
    return null;
  }
}

/**
 * Helper to normalize Shopify Product GraphQL node into clean ShopifyProductItem
 */
export function mapShopifyProductNode(node: any, index: number = 0): ShopifyProductItem {
  const rawVariants: ShopifyVariant[] = node.variants?.edges?.map((e: any) => ({
    id: e.node.id,
    title: e.node.title,
    price: Number.parseFloat(e.node.price?.amount || '0'),
    compareAtPrice: e.node.compareAtPrice?.amount ? Number.parseFloat(e.node.compareAtPrice.amount) : undefined,
    availableForSale: Boolean(e.node.availableForSale),
  })) || [];

  const firstAvailableVariant = rawVariants.find((v) => v.availableForSale) || rawVariants[0];
  const variantId = firstAvailableVariant?.id || '';
  const price = Number.parseFloat(node.priceRange?.minVariantPrice?.amount || '0') || firstAvailableVariant?.price || 299;

  const images: ShopifyImage[] = (node.images?.edges || []).map((e: any) => ({
    url: e.node.url,
    altText: e.node.altText || node.title,
  }));

  const fallbackImage = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop';
  const imageSrc = images[0]?.url || fallbackImage;

  // Detect category and mascot variant based on title/handle
  let category: ShopifyProductItem['category'] = 'Books';
  let mascotVariant: ShopifyProductItem['mascotVariant'] = 'idea';
  let cardColor = '#FFF8E1';

  const lower = (node.title + ' ' + (node.handle || '')).toLowerCase();
  if (lower.includes('game') || lower.includes('deck') || lower.includes('clash') || lower.includes('quest')) {
    category = 'Games';
    mascotVariant = 'curious';
    cardColor = '#E8F6FD';
  }
  if (lower.includes('money') || lower.includes('finance')) {
    category = 'Books';
    mascotVariant = 'holding_money';
    cardColor = '#FFF8E1';
  }
  if (lower.includes('law') || lower.includes('quiz')) {
    category = 'Books';
    mascotVariant = 'trophy';
    cardColor = '#EDF7E5';
  }
  if (lower.includes('plush') || lower.includes('merch') || lower.includes('toy')) {
    category = 'QShala Merch';
    mascotVariant = 'idea';
    cardColor = '#FDF2F8';
  }

  // Derive badge
  let badge: string | undefined = undefined;
  if (index === 0) badge = 'Bestseller';
  else if (index === 1) badge = 'Popular';
  else if (lower.includes('law')) badge = 'Quizmasters Pick';

  return {
    id: node.id,
    shopifyProductId: node.id,
    variantId,
    title: node.title,
    handle: node.handle,
    description: node.description || '',
    descriptionHtml: node.descriptionHtml || '',
    subtitle: node.description ? node.description.slice(0, 80).trim() + '...' : '',
    price,
    originalPrice: firstAvailableVariant?.compareAtPrice || Math.round(price * 1.25),
    category,
    imageSrc,
    images: images.length > 0 ? images : [{ url: fallbackImage, altText: node.title }],
    badge,
    cardColor,
    mascotVariant,
    variants: rawVariants,
    availableForSale: Boolean(node.availableForSale),
  };
}

/**
 * Fetch all active products from Shopify with up to 10 images each
 */
export async function getShopifyProducts(): Promise<ShopifyProductItem[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyStorefrontFetch<{ products: { edges: Array<{ node: any }> } }>(query, {
    first: 20,
  });

  if (!data?.products?.edges) {
    return [];
  }

  return data.products.edges.map(({ node }, index) => mapShopifyProductNode(node, index));
}

/**
 * Fetch a single product by its handle
 */
export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProductItem | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyStorefrontFetch<{ product: any }>(query, { handle });
  if (!data?.product) {
    return null;
  }

  return mapShopifyProductNode(data.product);
}

/**
 * Creates a Shopify Cart and generates the direct Checkout URL
 */
export async function createShopifyCheckoutUrl(
  items: Array<{ variantId: string; quantity: number }>
): Promise<{ checkoutUrl: string | null; cartId: string | null; error?: string }> {
  const lines = items
    .filter((item) => item.variantId && item.quantity > 0)
    .map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

  if (lines.length === 0) {
    return { checkoutUrl: null, cartId: null, error: 'No valid merchandise items in cart' };
  }

  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await shopifyStorefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: Array<{ code: string; message: string }>;
    };
  }>(mutation, {
    input: { lines },
  });

  if (!data?.cartCreate) {
    return { checkoutUrl: null, cartId: null, error: 'Failed to communicate with Shopify' };
  }

  if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
    const errorMsg = data.cartCreate.userErrors.map((e) => e.message).join(', ');
    return { checkoutUrl: null, cartId: null, error: errorMsg };
  }

  return {
    checkoutUrl: data.cartCreate.cart?.checkoutUrl || null,
    cartId: data.cartCreate.cart?.id || null,
  };
}

/**
 * Safely redirects browser to Shopify checkout after strict protocol and domain validation (mitigating Open Redirect attacks)
 */
export function safeRedirectToCheckout(checkoutUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const url = new URL(checkoutUrl);
    if (url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    const isAllowedDomain =
      host.endsWith('myshopify.com') ||
      host.endsWith('shopify.com') ||
      host === 'shop.qshala.com' ||
      host === 'qshala.com' ||
      host.endsWith('.qshala.com');
    if (isAllowedDomain) {
      window.location.assign(url.href);
      return true;
    }
  } catch (e) {
    console.error('[Shopify] Invalid checkout URL format:', e);
  }
  return false;
}
