import { useState, type SyntheticEvent, useEffect } from 'react';
import { saveLead, generateWhatsAppBookingUrl } from '../lib/leadsStore';

type BookingStep = 1 | 2 | 3 | 4;

const AUDIENCE_MAPPING: Record<string, string> = {
  school: 'School & Students (K-12)',
  college: 'College Campus Fest',
  company: 'Corporate Offsite / Team',
  corporate: 'Corporate Offsite / Team',
  community: 'Neighborhood Community',
  custom: 'Custom / Unconventional Venue'
};

const TEAM_CONTACT_NOTE: Record<string, string> = {
  'School & Students (K-12)': 'School Academic & Quriosity Club Sales Team',
  'College Campus Fest': 'Higher Education & Inter-College Quizmasters',
  'Corporate Offsite / Team': 'Corporate L&D & Employee Engagement Team',
  'Neighborhood Community': 'Community, Weddings & Convention Specialists',
  'Custom / Unconventional Venue': 'Special Experience & Custom Quiz Team'
};

export default function MultiStepBooking() {
  const [step, setStep] = useState<BookingStep>(1);
  const [formData, setFormData] = useState({
    audienceType: 'School & Students (K-12)',
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventDate: '',
    expectedAudience: '50-100 Participants',
    preferredTopic: 'General Quriosity & Science',
    additionalNotes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type') || params.get('segment') || params.get('audience');
      if (typeParam && AUDIENCE_MAPPING[typeParam.toLowerCase()]) {
        setFormData(prev => ({
          ...prev,
          audienceType: AUDIENCE_MAPPING[typeParam.toLowerCase()]
        }));
      }
    }
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((prev) => (prev < 4 ? ((prev + 1) as BookingStep) : prev));
  const handlePrev = () => setStep((prev) => (prev > 1 ? ((prev - 1) as BookingStep) : prev));

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveLead({
      type: 'quiz_booking',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      audienceType: formData.audienceType,
      eventDate: formData.eventDate,
      message: `Expected: ${formData.expectedAudience} | Topic: ${formData.preferredTopic} | Notes: ${formData.additionalNotes}`
    });
    setIsSubmitted(true);
  };

  const salesTeamName = TEAM_CONTACT_NOTE[formData.audienceType] || 'QShala Quriosity Team';
  const whatsappUrl = generateWhatsAppBookingUrl({
    name: formData.name,
    organization: formData.organization,
    audienceType: formData.audienceType,
    eventDate: formData.eventDate,
    email: formData.email,
    phone: formData.phone,
    notes: formData.additionalNotes
  });

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-5">
        <span className="px-4 py-1.5 rounded-full bg-[#75B543] text-white font-black text-xs uppercase border border-black font-heading inline-block">
          Request Routed to {salesTeamName}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">You&apos;re All Set for Quriosity!</h2>
        <p className="text-slate-700 text-sm font-semibold max-w-md mx-auto leading-relaxed">
          Thank you <span className="font-black text-slate-900">{formData.name}</span>! Your inquiry for <span className="font-black text-[#30B2E7]">{formData.audienceType}</span> has been logged and routed directly to our <strong>{salesTeamName}</strong>. We will contact you at <span className="font-black break-all">{formData.email}</span> within 24 hours.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs uppercase tracking-wider font-heading shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <span>💬 Instant Connect via WhatsApp</span>
            <span>&rarr;</span>
          </a>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs uppercase tracking-wider font-heading transition-all min-h-[44px]"
          >
            Book Another Experience
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-3xl mx-auto">
      
      {/* Route Badge */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFFDF5] p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#30B2E7] animate-ping shrink-0"></span>
          <span className="text-xs font-black uppercase text-slate-700 font-heading">
            Sales Pipeline: <span className="text-[#30B2E7]">{salesTeamName}</span>
          </span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-heading self-start sm:self-auto">
          {formData.audienceType}
        </span>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500 mb-2 font-heading">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? 'Audience Segment' : step === 2 ? 'Contact Information' : step === 3 ? 'Event Details' : 'Confirmation'}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-black">
          <div
            className="h-full bg-[#FDB913] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 font-heading">Who is this quiz experience for?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'School & Students (K-12)', 
                'College Campus Fest', 
                'Corporate Offsite / Team', 
                'Neighborhood Community',
                'Custom / Unconventional Venue'
              ].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => updateField('audienceType', type)}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all ${
                    formData.audienceType === type
                      ? 'border-black bg-[#30B2E7] text-white shadow-md'
                      : 'border-black bg-[#FFFDF5] text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 font-heading">Your Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Sunita Sharma"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="sunita@dpsbangalore.edu.in"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Institution / Company / Organization</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => updateField('organization', e.target.value)}
                  placeholder="DPS Bangalore / Flipkart / Community Club"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 font-heading">Event &amp; Audience Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Expected Audience Size</label>
                <select
                  value={formData.expectedAudience}
                  onChange={(e) => updateField('expectedAudience', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
                >
                  <option value="Under 50 Participants">Under 50 Participants</option>
                  <option value="50-100 Participants">50-100 Participants</option>
                  <option value="100-500 Participants">100-500 Participants</option>
                  <option value="500+ Large Convention / Campus">500+ Large Convention / Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Target Date (Approximate)</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => updateField('eventDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Preferred Quiz Theme / Topic Focus</label>
              <input
                type="text"
                value={formData.preferredTopic}
                onChange={(e) => updateField('preferredTopic', e.target.value)}
                placeholder="e.g. Science & Socratic Storytelling, Law/Finance, Brand Trivia, Public Policy"
                className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 font-heading">Review &amp; Submit Inquiry</h3>
            <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-black space-y-2 text-sm font-semibold">
              <div><span className="font-black text-slate-500 text-xs uppercase font-heading">Segment:</span> {formData.audienceType}</div>
              <div><span className="font-black text-slate-500 text-xs uppercase font-heading">Handling Team:</span> {salesTeamName}</div>
              <div><span className="font-black text-slate-500 text-xs uppercase font-heading">Contact:</span> {formData.name} ({formData.email}, {formData.phone})</div>
              <div><span className="font-black text-slate-500 text-xs uppercase font-heading">Organization:</span> {formData.organization}</div>
              <div><span className="font-black text-slate-500 text-xs uppercase font-heading">Theme:</span> {formData.preferredTopic}</div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">Special Requests / Specific Questions</label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder="Tell us any specific requirements (e.g. wedding quiz, annual convention, campus fest)..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-[#FFFDF5] text-sm font-semibold"
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3 rounded-full bg-white text-slate-800 font-black text-xs border-2 border-black font-heading hover:bg-slate-100 cursor-pointer active:scale-95 transition-transform w-full sm:w-auto text-center min-h-[44px]"
            >
              &larr; Back
            </button>
          ) : <div className="hidden sm:block" />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 rounded-full bg-[#FDB913] hover:bg-amber-400 text-black font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-heading cursor-pointer active:scale-95 transition-transform w-full sm:w-auto text-center min-h-[44px]"
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#75B543] hover:bg-emerald-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-heading cursor-pointer active:scale-95 transition-transform w-full sm:w-auto text-center min-h-[44px]"
            >
              Submit to {salesTeamName} &rarr;
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
