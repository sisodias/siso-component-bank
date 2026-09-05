'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Briefcase,
  Globe,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Building,
  Hash,
  AtSign,
  FileText,
  Star,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

// ============================================
// Type Definitions
// ============================================

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  service: string;
  budget: string;
  timeline: string;
}

type FormErrors = {
  [K in keyof FormData]?: string;
}

interface InputFieldProps {
  id: keyof FormData;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
}

interface SelectFieldProps extends Omit<InputFieldProps, 'type'> {
  options: { value: string; label: string }[];
}

interface TextAreaFieldProps extends Omit<InputFieldProps, 'type'> {
  rows?: number;
  maxLength?: number;
}

interface ContactInfo {
  icon: LucideIcon;
  title: string;
  value: string;
  link?: string;
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

// ============================================
// Constants
// ============================================

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  service: '',
  budget: '',
  timeline: ''
};

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-app', label: 'Mobile App Development' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'consulting', label: 'Technical Consulting' },
  { value: 'other', label: 'Other' }
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k+', label: '$50,000+' }
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select timeline' },
  { value: 'asap', label: 'ASAP' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-months+', label: '6+ months' }
];

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@example.com',
    link: 'mailto:hello@example.com'
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  },
  {
    icon: MapPin,
    title: 'Address',
    value: '123 Tech Street, Silicon Valley, CA 94025'
  }
];

// ============================================
// Utility Functions
// ============================================

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone: string): boolean {
  const re = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && re.test(phone);
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  if (!data.service) {
    errors.service = 'Please select a service';
  }

  return errors;
}

// ============================================
// Custom Hooks
// ============================================

function useContactForm() {
  const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<FormStatus>('idle');
  const [touched, setTouched] = React.useState<Set<keyof FormData>>(new Set());

  const updateField = React.useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => new Set(prev).add(field));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setStatus('success');
      setFormData(INITIAL_FORM_DATA);
      setTouched(new Set());
      
      // Reset success status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      console.error('Form submission error:', error);
    }
  }, [formData]);

  const resetForm = React.useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setStatus('idle');
    setTouched(new Set());
  }, []);

  return {
    formData,
    errors,
    status,
    touched,
    updateField,
    handleSubmit,
    resetForm
  };
}

// ============================================
// Reusable Components
// ============================================

const InputField = React.memo<InputFieldProps>(({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  icon: Icon,
  required = false,
  disabled = false
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-foreground">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-lg border bg-background px-4 py-3 text-foreground
          transition-all duration-200
          ${Icon ? 'pl-11' : ''}
          ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
        `}
      />
      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <p className="text-sm text-red-500 animate-in slide-in-from-top-1">{error}</p>
    )}
  </div>
));
InputField.displayName = 'InputField';

const SelectField = React.memo<SelectFieldProps>(({
  id,
  label,
  value,
  onChange,
  error,
  options,
  icon: Icon,
  required = false,
  disabled = false
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-foreground">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full rounded-lg border bg-background px-4 py-3 text-foreground
          transition-all duration-200 appearance-none cursor-pointer
          ${Icon ? 'pl-11' : ''}
          ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
        `}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {error && (
      <p className="text-sm text-red-500 animate-in slide-in-from-top-1">{error}</p>
    )}
  </div>
));
SelectField.displayName = 'SelectField';

const TextAreaField = React.memo<TextAreaFieldProps>(({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  rows = 4,
  maxLength = 500
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-foreground">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full rounded-lg border bg-background px-4 py-3 text-foreground
          transition-all duration-200 resize-none
          ${Icon ? 'pl-11' : ''}
          ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'}
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
        `}
      />
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
        {value.length}/{maxLength}
      </div>
    </div>
    {error && (
      <p className="text-sm text-red-500 animate-in slide-in-from-top-1">{error}</p>
    )}
  </div>
));
TextAreaField.displayName = 'TextAreaField';

const ContactInfoCard = React.memo<{ info: ContactInfo }>(({ info }) => (
  <div className="group flex items-start gap-4 rounded-xl bg-background/50 p-4 backdrop-blur-sm transition-all hover:bg-background/80">
    <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
      <info.icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-foreground">{info.title}</h3>
      {info.link ? (
        <a
          href={info.link}
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          {info.value}
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">{info.value}</p>
      )}
    </div>
  </div>
));
ContactInfoCard.displayName = 'ContactInfoCard';

const AnimatedBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-4 top-20 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-30" />
    <div className="animation-delay-2000 absolute -right-4 top-40 h-72 w-72 animate-blob rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-30" />
    <div className="animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-30" />
    
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        >
          <Sparkles className="h-3 w-3 text-primary" />
        </div>
      ))}
    </div>
  </div>
));
AnimatedBackground.displayName = 'AnimatedBackground';

const SuccessMessage = React.memo(() => (
  <div className="flex flex-col items-center justify-center space-y-4 py-12 animate-in fade-in zoom-in duration-500">
    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
      <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
    </div>
    <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
    <p className="text-center text-muted-foreground">
      Thank you for reaching out. We'll get back to you within 24 hours.
    </p>
  </div>
));
SuccessMessage.displayName = 'SuccessMessage';

// ============================================
// Main Component
// ============================================

export const Component = () => {
  const { formData, errors, status, updateField, handleSubmit, resetForm } =
    useContactForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let's Build Something
            <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear about it. Send us a
            message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left duration-700 animation-delay-200">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-purple-600/5 to-pink-600/5 p-8 backdrop-blur-xl">
              <AnimatedBackground />

              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form and our team will get back to you within
                    24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  {CONTACT_INFO.map((info, index) => (
                    <ContactInfoCard key={index} info={info} />
                  ))}
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-medium text-foreground mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right duration-700 animation-delay-400">
            <div className="rounded-2xl bg-card p-8 shadow-xl">
              {status === "success" ? (
                <SuccessMessage />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InputField
                      id="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={(value) => updateField("name", value)}
                      error={errors.name}
                      placeholder="John Doe"
                      icon={User}
                      required
                      disabled={status === "loading"}
                    />
                    <InputField
                      id="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => updateField("email", value)}
                      error={errors.email}
                      placeholder="john@example.com"
                      icon={Mail}
                      required
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Phone and Company Row */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InputField
                      id="phone"
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => updateField("phone", value)}
                      error={errors.phone}
                      placeholder="+1 (555) 123-4567"
                      icon={Phone}
                      disabled={status === "loading"}
                    />
                    <InputField
                      id="company"
                      label="Company"
                      value={formData.company}
                      onChange={(value) => updateField("company", value)}
                      error={errors.company}
                      placeholder="Acme Inc."
                      icon={Building}
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Service and Budget Row */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <SelectField
                      id="service"
                      label="Service"
                      value={formData.service}
                      onChange={(value) => updateField("service", value)}
                      error={errors.service}
                      options={SERVICE_OPTIONS}
                      icon={Briefcase}
                      required
                      disabled={status === "loading"}
                    />
                    <SelectField
                      id="budget"
                      label="Budget"
                      value={formData.budget}
                      onChange={(value) => updateField("budget", value)}
                      error={errors.budget}
                      options={BUDGET_OPTIONS}
                      icon={Hash}
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Timeline and Subject Row */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <SelectField
                      id="timeline"
                      label="Timeline"
                      value={formData.timeline}
                      onChange={(value) => updateField("timeline", value)}
                      error={errors.timeline}
                      options={TIMELINE_OPTIONS}
                      icon={Calendar}
                      disabled={status === "loading"}
                    />
                    <InputField
                      id="subject"
                      label="Subject"
                      value={formData.subject}
                      onChange={(value) => updateField("subject", value)}
                      error={errors.subject}
                      placeholder="Project inquiry"
                      icon={FileText}
                      required
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Message */}
                  <TextAreaField
                    id="message"
                    label="Message"
                    value={formData.message}
                    onChange={(value) => updateField("message", value)}
                    error={errors.message}
                    placeholder="Tell us about your project..."
                    icon={MessageSquare}
                    required
                    disabled={status === "loading"}
                    rows={6}
                    maxLength={1000}
                  />

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="
                        group relative flex-1 inline-flex items-center justify-center gap-2
                        rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground
                        transition-all duration-200
                        hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        disabled:cursor-not-allowed disabled:opacity-50
                      "
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="
                          inline-flex items-center justify-center gap-2
                          rounded-lg border border-border bg-background px-6 py-4
                          font-medium text-foreground
                          transition-all duration-200
                          hover:bg-muted
                          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        "
                      >
                        <X className="h-5 w-5" />
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Status Messages */}
                  {status === "error" && Object.keys(errors).length > 0 && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 animate-in slide-in-from-top-2">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-red-800 dark:text-red-200">
                            Please fix the following errors:
                          </h3>
                          <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                            {Object.values(errors).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};