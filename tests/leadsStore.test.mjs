import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage and window
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

const { saveLead, getStoredLeads, generateWhatsAppBookingUrl } = await import('../src/lib/leadsStore.ts');

describe('LeadsStore & Booking Inquiries Handler', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  test('should return empty list when no leads are stored', () => {
    assert.deepEqual(getStoredLeads(), []);
  });

  test('should create and serialize a new contact inquiry lead', () => {
    const lead = saveLead({
      type: 'contact_inquiry',
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      phone: '+91 98765 43210',
      message: 'Interested in school curiosity clubs'
    });

    assert.ok(lead.id.startsWith('LEAD-'));
    assert.equal(lead.name, 'Rohan Sharma');
    assert.equal(lead.email, 'rohan@example.com');
    assert.equal(lead.phone, '+91 98765 43210');
    assert.equal(lead.status, 'New');

    const stored = getStoredLeads();
    assert.equal(stored.length, 1);
    assert.equal(stored[0].id, lead.id);
  });

  test('should format a valid WhatsApp deep link with URI encoding', () => {
    const url = generateWhatsAppBookingUrl({
      name: 'Pooja Verma',
      organization: 'DPS Bengaluru',
      audienceType: 'School & Students (K-12)',
      eventDate: '2026-12-15',
      email: 'pooja@dps.edu.in',
      phone: '+91 91234 56789',
      notes: 'Annual Quiz Festival'
    });

    assert.ok(url.startsWith('https://wa.me/918971676100?text='));
    assert.ok(url.includes('Pooja%20Verma'));
    assert.ok(url.includes('DPS%20Bengaluru'));
    assert.ok(url.includes('2026-12-15'));
  });
});
