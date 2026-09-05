import React, { useState, type FC, type ReactNode } from 'react';
import { clsx } from 'clsx';

const cn = (...inputs: Parameters<typeof clsx>) => clsx(...inputs);

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logoSrc: string;
  companyName?: string;
  description?: string;
  usefulLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  newsletterTitle?: string;
  onSubscribe?: (email: string) => Promise<boolean>;
}

const DummyIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="h-5 w-5 text-muted-foreground">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
  </svg>
);

export const Footer: FC<FooterProps> = ({
  logoSrc,
  companyName = 'Acme Inc.',
  description = 'Building great products for great people.',
  usefulLinks = [
    { label: 'Products', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  socialLinks = [
    { label: 'Facebook', href: '#', icon: <DummyIcon /> },
    { label: 'Instagram', href: '#', icon: <DummyIcon /> },
    { label: 'Twitter (X)', href: '#', icon: <DummyIcon /> },
  ],
  newsletterTitle = 'Subscribe to our newsletter',
  onSubscribe,
  className,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;
    setIsSubmitting(true);
    const success = await onSubscribe(email);
    setSubscriptionStatus(success ? 'success' : 'error');
    setIsSubmitting(false);
    if (success) setEmail('');
    setTimeout(() => setSubscriptionStatus('idle'), 3000);
  };

  return (
    <footer className={cn('bg-muted/50 text-foreground', className)} {...props}>
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt={`${companyName} Logo`} className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold">{companyName}</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold">Useful Links</h3>
          <ul className="space-y-2">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold">Follow Us</h3>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} aria-label={link.label} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  {link.icon}<span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-base font-semibold">{newsletterTitle}</h3>
          <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                required
                aria-label="Email for newsletter"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm pr-28 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                className="absolute right-0 top-0 h-full rounded-l-none rounded-r-md px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {(subscriptionStatus === 'success' || subscriptionStatus === 'error') && (
              <div key={subscriptionStatus} className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 text-center backdrop-blur-sm">
                {subscriptionStatus === 'success' ? (
                  <span className="font-semibold text-green-500">Subscribed!</span>
                ) : (
                  <span className="font-semibold text-destructive">Failed. Try again.</span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
