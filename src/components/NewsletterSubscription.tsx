import React, { useState } from 'react';
import { saveLead } from '../lib/leadsStore';

interface Props {
  variant?: 'qshots' | 'digest' | 'qql';
  className?: string;
  placeholder?: string;
  buttonLabel?: string;
  paymentUrl?: string;
  isDirectLink?: boolean;
}

export const RAZORPAY_QQL_PAYMENT_URL = 'https://pages.razorpay.com/QQLClub';

export default function NewsletterSubscription({
  variant = 'qql',
  className = '',
  placeholder = 'Enter your email address',
  buttonLabel = 'Subscribe',
  paymentUrl = RAZORPAY_QQL_PAYMENT_URL,
  isDirectLink = true,
}: Props) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Button to Razorpay Payment Link (per Dev Notes 2 & Website Copy specs)
  if (isDirectLink) {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 w-full ${className}`}>
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Subscribe to QQL Club via Razorpay"
          className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-900 text-white font-black text-xs sm:text-sm uppercase font-heading hover:bg-[#75B543] hover:text-white transition-all whitespace-nowrap shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shrink-0 min-h-[48px]"
        >
          <span>{buttonLabel}</span>
          <span className="ml-2 font-bold">&rarr;</span>
        </a>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      saveLead({
        type: 'newsletter_subscription',
        name: 'Subscriber',
        email,
        phone: 'N/A',
        organization: variant === 'digest' ? 'Quriosity Digest' : 'QQL Club',
        audienceType: 'Newsletter Reader',
        message: `Subscribed to ${variant === 'digest' ? 'Weekly Quriosity Digest' : 'QQL Club'}`,
      });
      setIsSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`p-4 rounded-full bg-white border border-[#75B543] text-center flex items-center justify-center gap-2 shadow-sm ${className}`}>
        <span className="w-6 h-6 rounded-full bg-[#75B543] text-white flex items-center justify-center text-xs font-black shrink-0">
          ✓
        </span>
        <span className="text-xs sm:text-sm font-black text-slate-900 font-heading">
          You&apos;re subscribed! Welcome to {variant === 'digest' ? 'Quriosity Digest' : 'QQL Club'}.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 relative z-10 w-full ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address for subscription"
        placeholder={placeholder}
        className="flex-grow px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#75B543] focus:ring-4 focus:ring-[#75B543]/10 shadow-sm transition-all"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-slate-900 text-white font-black text-xs uppercase font-heading hover:bg-[#75B543] transition-colors whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shrink-0 min-h-[44px]"
      >
        {isSubmitting ? 'Subscribing...' : buttonLabel}
      </button>
    </form>
  );
}
