import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackMessage } from '../types';

export default function Contact() {
  const [form, setForm] = useState<FeedbackMessage>({
    name: '',
    email: '',
    phone: '',
    subject: 'product_inquiry',
    message: '',
    newsletter: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Live-clear errors as user fixes them
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Validate Input
  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.phone.trim() && !/^\+?[0-9\s\-()]{7,15}$/.test(form.phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Message content is required.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate premium server-side handler
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: 'product_inquiry',
        message: '',
        newsletter: true
      });
    }, 1200);
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
            CONCIERGE COMMUNICATIONS
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2 leading-tight">
            Consult With Our Team.
          </h2>
          <p className="font-sans text-secondary dark:text-neutral-400 text-sm md:text-base max-w-xl mt-3">
            Whether you require tailored product advice, order tracking, or warranty concierge assistance, our engineering squad is ready to assist.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Column 1: Info and Cards */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Quick Contact Info */}
            <div className="p-8 rounded-xl border border-hairline dark:border-neutral-800 bg-pure-white dark:bg-neutral-900/30 shadow-sm space-y-6">
              <h3 className="font-display font-semibold text-lg text-pure-black dark:text-pure-white">
                Direct Touchpoints
              </h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-400">Concierge Helpline</h4>
                  <p className="text-sm font-semibold text-pure-black dark:text-pure-white mt-1">+1 (800) 955-KREV</p>
                  <p className="text-xs text-tertiary dark:text-neutral-500 mt-0.5">Mon–Fri, 9:00 AM – 6:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-400">Support Mailroom</h4>
                  <p className="text-sm font-semibold text-pure-black dark:text-pure-white mt-1">concierge@krevvy.com</p>
                  <p className="text-xs text-tertiary dark:text-neutral-500 mt-0.5">We respond within 12 business hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-400">HQ Enterprise Coordinates</h4>
                  <p className="text-sm font-semibold text-pure-black dark:text-pure-white mt-1">Prowess Click Kart Enterprise</p>
                  <p className="text-xs text-tertiary dark:text-neutral-500 mt-0.5">1407 Premium tech park, Sector 5, Bangalore, India</p>
                </div>
              </div>
            </div>

            {/* Warranty Reminder Card */}
            <div className="p-8 rounded-xl border border-hairline/60 dark:border-neutral-800 bg-surface dark:bg-neutral-900/10 text-left">
              <h4 className="font-display font-semibold text-base text-pure-black dark:text-pure-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-copper" />
                Purchased on Amazon?
              </h4>
              <p className="text-xs text-tertiary dark:text-neutral-400 mt-2 leading-relaxed">
                If you recently acquired your Krevvy device through our official Amazon partner channel, make sure to activate your 3-Year Extended Warranty. Send your Order ID and name in this form to initiate automatic registry.
              </p>
            </div>
          </div>

          {/* Column 2: Form Wrapper */}
          <div className="lg:col-span-7 bg-pure-white dark:bg-neutral-900/20 rounded-2xl p-8 md:p-10 border border-hairline dark:border-neutral-800 shadow-sm">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-2">
                      Full Name <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full bg-surface dark:bg-neutral-900 px-4 py-3.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-copper/30 ${
                        errors.name 
                          ? 'border-error/60 focus:border-error' 
                          : 'border-hairline dark:border-neutral-800 focus:border-pure-black dark:focus:border-pure-white'
                      }`}
                      placeholder="e.g., Srisanjai Kumar"
                    />
                    {errors.name && (
                      <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Dual row for email and phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-2">
                        Email Address <span className="text-copper">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full bg-surface dark:bg-neutral-900 px-4 py-3.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-copper/30 ${
                          errors.email 
                            ? 'border-error/60 focus:border-error' 
                            : 'border-hairline dark:border-neutral-800 focus:border-pure-black dark:focus:border-pure-white'
                        }`}
                        placeholder="sanjai@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full bg-surface dark:bg-neutral-900 px-4 py-3.5 rounded-lg border border-hairline dark:border-neutral-800 focus:border-pure-black dark:focus:border-pure-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-copper/30 ${
                          errors.phone ? 'border-error/60 focus:border-error' : ''
                        }`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && (
                        <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject select */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-2">
                      Inquiry Category
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-surface dark:bg-neutral-900 px-4 py-3.5 rounded-lg border border-hairline dark:border-neutral-800 focus:border-pure-black dark:focus:border-pure-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-copper/30"
                    >
                      <option value="product_inquiry">Pre-Purchase Consultation</option>
                      <option value="amazon_support">Amazon Order &amp; Delivery Help</option>
                      <option value="warranty_registry">Extended Warranty Activation</option>
                      <option value="technical_feedback">Technical Engineering Feedback</option>
                    </select>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-2">
                      Message Content <span className="text-copper">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className={`w-full bg-surface dark:bg-neutral-900 px-4 py-3.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-copper/30 ${
                        errors.message 
                          ? 'border-error/60 focus:border-error' 
                          : 'border-hairline dark:border-neutral-800 focus:border-pure-black dark:focus:border-pure-white'
                      }`}
                      placeholder="Please details your questions, tech requests, or Amazon Order IDs..."
                    />
                    {errors.message && (
                      <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Newsletter sign-up */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
                      className="mt-1 h-4.5 w-4.5 rounded border-hairline text-copper focus:ring-copper"
                    />
                    <label htmlFor="newsletter" className="text-xs text-tertiary dark:text-neutral-400 leading-normal select-none">
                      Subscribe to Krevvy Engineering newsletters. Receive technical breakdowns, product update notifications, and exclusive invitations to customer launch previews.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-4 px-6 rounded-full font-semibold text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-75 disabled:cursor-wait"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting...
                      </span>
                    ) : (
                      <>
                        <span>Send Transmission</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="py-12 px-6 text-center space-y-6"
                >
                  <div className="inline-flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl text-pure-black dark:text-pure-white">
                      Transmission Successful
                    </h3>
                    <p className="text-sm text-tertiary dark:text-neutral-400 max-w-md mx-auto">
                      Thank you. Your inquiry has been routed to our technical support desk. A Krevvy engineer will contact you shortly.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-hairline dark:border-neutral-800/80 max-w-sm mx-auto text-xs text-tertiary dark:text-neutral-500">
                    Ticket Reference Code: <span className="font-mono text-pure-black dark:text-pure-white font-bold">#KRV-{Math.floor(Math.random() * 90000) + 10000}</span>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary px-6 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider mt-4 cursor-pointer"
                  >
                    Send Another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
