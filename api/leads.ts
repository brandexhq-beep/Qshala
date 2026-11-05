/**
 * Vercel Serverless Endpoint for Inbound Leads & Booking Inquiries
 * Handles POST requests from ContactForm and MultiStepBooking, logs inquiries, and dispatches to remote webhooks/CRM.
 */

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const lead = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!lead || !lead.name || !lead.email) {
      return res.status(400).json({ error: 'Missing required lead fields: name, email' });
    }

    console.log('[Lead Ingestion API] New lead logged:', {
      id: lead.id,
      type: lead.type,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      organization: lead.organization,
      audienceType: lead.audienceType,
      eventDate: lead.eventDate,
      createdAt: lead.createdAt || new Date().toISOString()
    });

    // Forward to remote webhook (Slack, CRM, Formspree, Make, etc.) if configured
    const remoteWebhook = process.env.REMOTE_LEADS_WEBHOOK_URL || process.env.PUBLIC_LEADS_WEBHOOK_URL;
    if (remoteWebhook && !remoteWebhook.includes('/api/leads')) {
      try {
        await fetch(remoteWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
      } catch (dispatchErr) {
        console.warn('[Lead Ingestion API] Failed to forward to remote webhook:', dispatchErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry received and processed',
      leadId: lead.id
    });
  } catch (err: any) {
    console.error('[Lead Ingestion API] Error processing inquiry:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
