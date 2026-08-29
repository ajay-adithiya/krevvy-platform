import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackMessage } from '../types';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { useGlobalContent } from '../contexts/GlobalContentContext';

export default function Contact() {
  const { content: globalContent } = useGlobalContent();
  const { data: contactData, loading: dataLoading } = useFetch(api.getContactContent);
  const contactContent = contactData?.content;
  const inquiryOptions = contactData?.inquiryOptions || [];

  const [form, setForm] = useState<FeedbackMessage>({
    name: '',
    email: '',
    phone: '',
    subject: inquiryOptions.length > 0 ? inquiryOptions[0].value : 'product_inquiry',
    message: '',
    newsletter: true
  });

  // Update default subject when inquiryOptions load
  React.useEffect(() => {
    if (inquiryOptions.length > 0 && form.subject === 'product_inquiry' && !inquiryOptions.some(opt => opt.value === 'product_inquiry')) {
      setForm(prev => ({ ...prev, subject: inquiryOptions[0].value }));
    }
  }, [inquiryOptions]);

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
        subject: inquiryOptions.length > 0 ? inquiryOptions[0].value : 'product_inquiry',
        message: '',
        newsletter: true
      });
    }, 1200);
  };

  if (dataLoading) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-6xl mx-auto animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-surface-container rounded-full mb-4"></div>
          <div className="h-10 w-64 bg-surface-container rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-surface-container rounded-full"></div>
        </div>
      </section>
    );
  }

  if (!contactContent) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-6xl mx-auto text-center text-secondary dark:text-neutral-500">Contact content is currently empty.</div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-6xl mx-auto">

        {/* Header Title */}
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
            {contactContent.pageEyebrow}
          </span>
          <h2
            className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2 leading-tight"
            dangerouslySetInnerHTML={{ __html: (contactContent.pageTitle || "").replace(/\n/g, '<br />') }}
          />
          <p className="font-sans text-secondary dark:text-neutral-400 text-sm md:text-base max-w-xl mt-3 whitespace-pre-wrap">
            {contactContent.pageSubtitle}
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Column 1: Info and Cards */}
          <div className="lg:col-span-5 space-y-8 text-left">

            {/* Quick Contact Info */}
            <div className="p-8 rounded-xl border border-hairline dark:border-neutral-800 bg-pure-white dark:bg-neutral-900/30 shadow-sm space-y-6">
              {contactContent.contactTouchpointsHeading && (
                <h3 className="font-display font-semibold text-lg text-pure-black dark:text-pure-white">
                  {contactContent.contactTouchpointsHeading}
                </h3>
              )}

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  {contactContent.contactPhoneHeading && (
                    <h4 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-400">{contactContent.contactPhoneHeading}</h4>
                  )}
                  {globalContent?.contactPhone && (
                    <p className="text-sm font-semibold text-pure-black dark:text-pure-white mt-1">{globalContent.contactPhone}</p>
                  )}
                  <p className="text-xs text-tertiary dark:text-neutral-500 mt-0.5">{globalContent?.businessHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  {contactContent.contactEmailHeading && (
                    <h4 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-400">{contactContent.contactEmailHeading}</h4>
                  )}
                  {globalContent?.contactEmail && (
                    <p className="text-sm font-semibold text-pure-black dark:text-pure-white mt-1">{globalContent.contactEmail}</p>
                  )}
                  <p className="text-xs text-tertiary dark:text-neutral-500 mt-0.5">We respond within 12 business hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  {contactContent.contactAddressHeading && (
                    <h4 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-400">{contactContent.contactAddressHeading}</h4>
                  )}
                  {globalContent?.companyName && (
                    <p className="text-sm font-semibold text-pure-black dark:text-pure-white mt-1">{globalContent.companyName}</p>
                  )}
                  <p className="text-xs text-tertiary dark:text-neutral-500 mt-0.5 whitespace-pre-wrap">{globalContent?.contactAddress}</p>
                </div>
              </div>
            </div>

            {/* Warranty Reminder Card */}
            {(contactContent.warrantyHeading || contactContent.warrantyText) && (
              <div className="p-8 rounded-xl border border-hairline/60 dark:border-neutral-800 bg-surface dark:bg-neutral-900/10 text-left">
                <h4 className="font-display font-semibold text-base text-pure-black dark:text-pure-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-copper" />
                  {contactContent.warrantyHeading}
                </h4>
                <p className="text-xs text-tertiary dark:text-neutral-400 mt-2 leading-relaxed whitespace-pre-wrap">
                  {contactContent.warrantyText}
                </p>
              </div>
            )}
          </div>

          {/* Column 2: Form Wrapper */}
          <div className="lg:col-span-7 bg-pure-white dark:bg-neutral-900/20 rounded-2xl p-8 md:p-10 border border-hairline dark:border-neutral-800 shadow-sm">
            {contactContent.formHeading && (
              <h3 className="font-display font-semibold text-2xl text-pure-black dark:text-pure-white mb-6">
                {contactContent.formHeading}
              </h3>
            )}
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
                      {contactContent.formNameLabel} <span className="text-copper">*</span>
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
                        {contactContent.formEmailLabel} <span className="text-copper">*</span>
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
                        {contactContent.formPhoneLabel}
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
                      {contactContent.formSubjectLabel}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-surface dark:bg-neutral-900 px-4 py-3.5 rounded-lg border border-hairline dark:border-neutral-800 focus:border-pure-black dark:focus:border-pure-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-copper/30"
                    >
                      {inquiryOptions.map((option) => (
                        <option key={option.id} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-2">
                      {contactContent.formMessageLabel} <span className="text-copper">*</span>
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
                        {contactContent.formLoadingMessage}
                      </span>
                    ) : (
                      <>
                        <span>{contactContent.formSubmitLabel}</span>
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
                    {contactContent.formSuccessMessage && (
                      <h3 className="font-display font-bold text-2xl text-pure-black dark:text-pure-white">
                        {contactContent.formSuccessMessage}
                      </h3>
                    )}
                    {contactContent.formFailureMessage && (
                      <p className="text-sm text-tertiary dark:text-neutral-400 max-w-md mx-auto whitespace-pre-wrap">
                        {contactContent.formFailureMessage}
                      </p>
                    )}
                  </div>

                  {contactContent.successTicketPrefixLabel && (
                    <div className="pt-4 border-t border-hairline dark:border-neutral-800/80 max-w-sm mx-auto text-xs text-tertiary dark:text-neutral-500">
                      {contactContent.successTicketPrefixLabel} <span className="font-mono text-pure-black dark:text-pure-white font-bold">#KRV-{Math.floor(Math.random() * 90000) + 10000}</span>
                    </div>
                  )}

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
