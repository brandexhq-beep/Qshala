/**
 * Inbound Leads & Booking Inquiries Handler
 * Manages customer inquiries, event booking submissions, and dispatch to external webhooks.
 */

export interface BookingLead {
  id: string;
  type: 'quiz_booking' | 'contact_inquiry' | 'newsletter_subscription';
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  audienceType?: string;
  eventDate?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Confirmed';
  createdAt: string;
}

const STORAGE_KEY = 'qshala_booking_leads_v1';
const EVENT_NAME = 'qshala_leads_updated';

export function getStoredLeads(): BookingLead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('[LeadsStore] Failed to read leads from localStorage:', err);
  }
  return [];
}

/**
 * Saves an inbound lead locally and asynchronously forwards to an external webhook if configured.
 */
export function saveLead(
  leadData: Omit<BookingLead, 'id' | 'createdAt' | 'status'> & Partial<Pick<BookingLead, 'id' | 'createdAt' | 'status'>>
): BookingLead {
  const newLead: BookingLead = {
    id: leadData.id || `LEAD-${Date.now().toString().slice(-6)}`,
    type: leadData.type,
    name: leadData.name.trim(),
    email: leadData.email.trim(),
    phone: leadData.phone?.trim() || 'N/A',
    organization: leadData.organization?.trim() || 'Direct Inquiry',
    audienceType: leadData.audienceType || 'General Inquiry',
    eventDate: leadData.eventDate || new Date().toISOString().split('T')[0],
    message: leadData.message?.trim(),
    status: leadData.status || 'New',
    createdAt: leadData.createdAt || new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getStoredLeads();
      const updated = [newLead, ...current.filter(l => l.id !== newLead.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    } catch (err) {
      console.error('[LeadsStore] Failed to save lead to localStorage:', err);
    }

    // Forward to remote webhook endpoint or serverless /api/leads
    const rawWebhook =
      (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_LEADS_WEBHOOK_URL) ||
      (typeof process !== 'undefined' && process.env?.PUBLIC_LEADS_WEBHOOK_URL) ||
      '/api/leads';

    let webhookUrl = rawWebhook;
    if (typeof window !== 'undefined' && rawWebhook.startsWith('/')) {
      const origin = window.location?.origin || '';
      webhookUrl = origin ? `${origin}${rawWebhook}` : '';
    }

    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      }).catch(err => {
        console.warn('[LeadsStore] Background webhook dispatch warning:', err);
      });
    }
  }

  return newLead;
}

export function generateWhatsAppBookingUrl(lead: {
  name: string;
  organization?: string;
  audienceType: string;
  eventDate?: string;
  email?: string;
  phone?: string;
  notes?: string;
}): string {
  const text = `*New QShala Booking Inquiry* 🐾
*Name:* ${lead.name}
*Organization:* ${lead.organization || 'Individual / Family'}
*Audience Segment:* ${lead.audienceType}
*Preferred Date:* ${lead.eventDate || 'Flexible'}
*Email:* ${lead.email || 'N/A'}
*Phone:* ${lead.phone || 'N/A'}
${lead.notes ? `*Notes:* ${lead.notes}` : ''}

_Sent via QShala Web Platform_`;

  return `https://wa.me/918971676100?text=${encodeURIComponent(text)}`;
}
