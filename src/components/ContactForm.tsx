import { useState, type SyntheticEvent } from 'react';
import { saveLead } from '../lib/leadsStore';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      saveLead({
        type: 'contact_inquiry',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: 'Direct Website Contact',
        audienceType: 'General Inquiry',
        message: formData.message
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit contact message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `*New QShala Contact Inquiry* 🐾
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'N/A'}
*Message:* ${formData.message}`;

  const whatsappUrl = `https://wa.me/918971676100?text=${encodeURIComponent(whatsappMessage)}`;

  if (isSubmitted) {
    return (
      <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm text-center space-y-4">
        <span className="w-12 h-12 rounded-full bg-[#75B543] text-white flex items-center justify-center text-xl font-black mx-auto shadow-xs">
          ✓
        </span>
        <h3 className="text-2xl font-black text-slate-900 font-heading">
          Message Received!
        </h3>
        <p className="text-slate-700 text-sm font-semibold max-w-md mx-auto leading-relaxed">
          Thank you, <span className="font-black text-slate-900">{formData.name}</span>. Your message has been routed to the QShala team. We will get back to you at <span className="font-black break-all">{formData.email}</span> within 24 hours.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <span>💬 Fast-Track via WhatsApp</span>
            <span>&rarr;</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setFormData({ name: '', email: '', phone: '', message: '' });
              setIsSubmitted(false);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs uppercase tracking-wider font-heading transition-all min-h-[44px]"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label htmlFor="contact-name" className="block text-xs font-black uppercase text-slate-900 mb-1 font-heading">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-[#FFFDF5] text-slate-900 text-base sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7] shadow-xs"
          placeholder="e.g. Ananya Sharma"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className="block text-xs font-black uppercase text-slate-900 mb-1 font-heading">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-[#FFFDF5] text-slate-900 text-base sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7] shadow-xs"
            placeholder="ananya@example.com"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-xs font-black uppercase text-slate-900 mb-1 font-heading">
            Phone Number (Optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-[#FFFDF5] text-slate-900 text-base sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7] shadow-xs"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-black uppercase text-slate-900 mb-1 font-heading">
          How can we help? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-[#FFFDF5] text-slate-900 text-base sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30B2E7] shadow-xs"
          placeholder="Tell us about your school, company offsite, or inquiry..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-black rounded-2xl font-heading shadow-sm hover:shadow-md uppercase tracking-wider text-xs transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
      >
        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
        <span>&rarr;</span>
      </button>
    </form>
  );
}
