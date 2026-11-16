import { useState, type SyntheticEvent } from 'react';
import { saveLead, generateWhatsAppInquiryUrl } from '../lib/leadsStore';

export default function MultiStepBooking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    // 1. Full Name is mandatory
    if (!trimmedName) {
      setValidationError('Please enter your full name.');
      return;
    }

    // 2. Either Phone OR Email is mandatory
    if (!trimmedPhone && !trimmedEmail) {
      setValidationError('Please provide either a phone number or an email address so we can reach you.');
      return;
    }

    // 3. Email syntax validation if email provided
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address (or leave it blank if you provided a phone number).');
      return;
    }

    setIsSubmitting(true);

    const accessKey =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_WEB3FORMS_ACCESS_KEY) ||
      'ebcc3a75-bd60-4c56-ad57-75fc47f37925';

    // Dispatch to Web3Forms API ensuring all fields pass through cleanly
    const web3Payload = {
      access_key: accessKey,
      name: trimmedName,
      phone: trimmedPhone || 'Not provided (email given)',
      email: trimmedEmail || 'no-email-provided@qshala.com',
      message: trimmedMessage || 'General Inquiry',
      inquiry_topic: 'General Inquiry',
      from_name: 'QShala Website Inquiry',
      subject: `New Quiz Inquiry from ${trimmedName}`,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(web3Payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || (result && !result.success)) {
        console.warn('Web3Forms response notification:', result);
      }
    } catch (err) {
      console.warn('Web3Forms dispatch warning:', err);
    }

    // Save lead in local store
    saveLead({
      type: 'quiz_booking',
      name: trimmedName,
      email: trimmedEmail || undefined,
      phone: trimmedPhone || undefined,
      organization: 'General Inquiry',
      audienceType: 'General Inquiry',
      eventDate: 'To be discussed',
      message: trimmedMessage || 'General Inquiry'
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const whatsappUrl = generateWhatsAppInquiryUrl({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    message: formData.message
  });

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#75B543] text-white flex items-center justify-center text-2xl font-black shadow-xs">
          ✓
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Thank you, {formData.name.trim()}!
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-semibold max-w-lg mx-auto leading-relaxed">
            We have your details and will be in touch within a day. If you&apos;d like to talk sooner, drop us a message on WhatsApp.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider font-heading shadow-sm hover:shadow-md hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 transition-all min-h-[48px]"
          >
            <span>💬 Message Us on WhatsApp</span>
            <span>&rarr;</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setFormData({ name: '', phone: '', email: '', message: '' });
              setIsSubmitted(false);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs sm:text-sm uppercase tracking-wider font-heading transition-all min-h-[48px] cursor-pointer"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Full Name */}
        <div>
          <label htmlFor="inquiry-name" className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 font-heading">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="inquiry-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Sunita Sharma"
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-black bg-[#FFFDF5] text-slate-900 font-semibold text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#30B2E7] transition-all"
          />
        </div>

        {/* Contact Details (Phone & Email side-by-side on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <label htmlFor="inquiry-phone" className="block text-xs font-black uppercase tracking-wider text-slate-800 font-heading">
                Phone Number
              </label>
              <span className="text-[10px] font-bold text-slate-700 font-heading">
                * if no email
              </span>
            </div>
            <input
              id="inquiry-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-black bg-[#FFFDF5] text-slate-900 font-semibold text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#30B2E7] transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <label htmlFor="inquiry-email" className="block text-xs font-black uppercase tracking-wider text-slate-800 font-heading">
                Email Address
              </label>
              <span className="text-[10px] font-bold text-slate-700 font-heading">
                * if no phone
              </span>
            </div>
            <input
              id="inquiry-email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="sunita@example.com"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-black bg-[#FFFDF5] text-slate-900 font-semibold text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#30B2E7] transition-all"
            />
          </div>
        </div>

        {/* Optional Message Field */}
        <div>
          <label htmlFor="inquiry-message" className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2 font-heading">
            What would you like to tell us? <span className="text-slate-600 font-bold normal-case text-[11px]">(Optional)</span>
          </label>
          <textarea
            id="inquiry-message"
            rows={3}
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="A rough idea is plenty: who it's for, roughly when, or just a question."
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-black bg-[#FFFDF5] text-slate-900 font-semibold text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#30B2E7] transition-all resize-y"
          />
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-8 rounded-full bg-[#FDB913] hover:bg-amber-400 active:scale-[0.99] disabled:opacity-70 text-slate-950 font-black text-sm sm:text-base border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-heading cursor-pointer transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            {isSubmitting ? (
              <span>Sending Details...</span>
            ) : (
              <>
                <span>Get in Touch</span>
                <span>&rarr;</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 font-semibold">
          🔒 No spam, ever. We only reach out regarding your inquiry.
        </p>
      </form>
    </div>
  );
}
