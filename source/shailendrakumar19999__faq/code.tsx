'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  Book,
  Shield,
  Zap,
  CreditCard,
  Users,
  Settings,
  Globe,
  Lock,
  Sparkles,
  Star,
  ArrowRight,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Lightbulb,
  FileText,
  Headphones,
  Send,
  X,
  Filter
} from 'lucide-react';

// ============================================
// Type Definitions
// ============================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  helpful?: number;
  views?: number;
  updated?: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  count?: number;
}

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  linkText: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  category: string;
}

interface HelpfulVote {
  faqId: string;
  helpful: boolean;
}

// ============================================
// Constants
// ============================================

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    description: 'Common questions about our service',
    color: 'from-blue-500 to-cyan-500',
    count: 8
  },
  {
    id: 'pricing',
    name: 'Pricing',
    icon: CreditCard,
    description: 'Billing and subscription questions',
    color: 'from-green-500 to-emerald-500',
    count: 6
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: Settings,
    description: 'Technical support and troubleshooting',
    color: 'from-purple-500 to-pink-500',
    count: 7
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    description: 'Privacy and security concerns',
    color: 'from-red-500 to-orange-500',
    count: 5
  },
  {
    id: 'account',
    name: 'Account',
    icon: Users,
    description: 'Account management and settings',
    color: 'from-indigo-500 to-purple-500',
    count: 6
  },
  {
    id: 'features',
    name: 'Features',
    icon: Zap,
    description: 'Product features and capabilities',
    color: 'from-yellow-500 to-orange-500',
    count: 8
  }
];

const FAQ_DATA: FAQItem[] = [
  // General
  {
    id: '1',
    question: 'What is your service and how does it work?',
    answer: 'Our service is a comprehensive platform that helps businesses streamline their operations through innovative technology solutions. We provide tools for project management, team collaboration, and data analytics. Getting started is simple: sign up for an account, choose your plan, and begin inviting team members to collaborate.',
    category: FAQ_CATEGORIES[0],
    tags: ['getting-started', 'overview', 'basics'],
    helpful: 245,
    views: 1250,
    updated: '2024-01-15'
  },
  {
    id: '2',
    question: 'Do you offer a free trial?',
    answer: 'Yes! We offer a 14-day free trial with full access to all premium features. No credit card is required to start your trial. After the trial period, you can choose to continue with a paid plan or downgrade to our free tier with limited features.',
    category: FAQ_CATEGORIES[0],
    tags: ['trial', 'free', 'getting-started'],
    helpful: 189,
    views: 980
  },
  {
    id: '3',
    question: 'What platforms do you support?',
    answer: 'Our platform is accessible through web browsers on all major operating systems (Windows, macOS, Linux). We also offer native mobile apps for iOS and Android devices. Additionally, we provide API access for custom integrations with your existing tools.',
    category: FAQ_CATEGORIES[0],
    tags: ['platforms', 'compatibility', 'devices'],
    helpful: 156,
    views: 720
  },
  // Pricing
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for enterprise customers. All payments are processed securely through our payment partners with industry-standard encryption.',
    category: FAQ_CATEGORIES[1],
    tags: ['payment', 'billing', 'credit-card'],
    helpful: 134,
    views: 890
  },
  {
    id: '5',
    question: 'Can I change my subscription plan?',
    answer: 'Absolutely! You can upgrade or downgrade your subscription at any time from your account settings. When upgrading, you\'ll have immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.',
    category: FAQ_CATEGORIES[1],
    tags: ['subscription', 'upgrade', 'downgrade'],
    helpful: 98,
    views: 560
  },
  {
    id: '6',
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service within the first 30 days, contact our support team for a full refund. After 30 days, refunds are evaluated on a case-by-case basis.',
    category: FAQ_CATEGORIES[1],
    tags: ['refund', 'guarantee', 'money-back'],
    helpful: 112,
    views: 670
  },
  // Technical
  {
    id: '7',
    question: 'What are the system requirements?',
    answer: 'For web access, you need a modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with JavaScript enabled. Mobile apps require iOS 13+ or Android 8+. For optimal performance, we recommend at least 4GB RAM and a stable internet connection.',
    category: FAQ_CATEGORIES[2],
    tags: ['requirements', 'technical', 'specifications'],
    helpful: 87,
    views: 430
  },
  {
    id: '8',
    question: 'How do I integrate with other tools?',
    answer: 'We offer native integrations with popular tools like Slack, Google Workspace, Microsoft 365, and more. You can also use our REST API or webhooks for custom integrations. Detailed documentation and SDKs are available in our developer portal.',
    category: FAQ_CATEGORIES[2],
    tags: ['integration', 'API', 'third-party'],
    helpful: 156,
    views: 820
  },
  // Security
  {
    id: '9',
    question: 'How do you protect my data?',
    answer: 'We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All data is stored in SOC 2 certified data centers with redundant backups. We also conduct regular security audits and penetration testing to ensure your data remains secure.',
    category: FAQ_CATEGORIES[3],
    tags: ['security', 'encryption', 'privacy'],
    helpful: 201,
    views: 1100
  },
  {
    id: '10',
    question: 'Are you GDPR compliant?',
    answer: 'Yes, we are fully GDPR compliant. We provide tools for data portability, right to deletion, and consent management. Our privacy policy details how we collect, process, and protect personal data. We also offer Data Processing Agreements (DPA) for enterprise customers.',
    category: FAQ_CATEGORIES[3],
    tags: ['GDPR', 'compliance', 'privacy'],
    helpful: 145,
    views: 780
  },
  // Account
  {
    id: '11',
    question: 'How do I reset my password?',
    answer: 'Click the "Forgot Password" link on the login page and enter your email address. We\'ll send you a secure link to reset your password. For security reasons, this link expires after 24 hours. If you don\'t receive the email, check your spam folder or contact support.',
    category: FAQ_CATEGORIES[4],
    tags: ['password', 'reset', 'login'],
    helpful: 89,
    views: 920
  },
  {
    id: '12',
    question: 'Can I have multiple users on one account?',
    answer: 'Yes! Our team plans support multiple users with role-based access control. You can invite team members, set permissions, and manage user access from your admin dashboard. The number of users depends on your subscription plan.',
    category: FAQ_CATEGORIES[4],
    tags: ['users', 'team', 'collaboration'],
    helpful: 167,
    views: 650
  },
  // Features
  {
    id: '13',
    question: 'What features are included in each plan?',
    answer: 'Our Basic plan includes core features for individuals. Pro plan adds team collaboration, advanced analytics, and priority support. Enterprise plan includes custom integrations, dedicated support, SSO, and advanced security features. Visit our pricing page for a detailed comparison.',
    category: FAQ_CATEGORIES[5],
    tags: ['features', 'plans', 'comparison'],
    helpful: 223,
    views: 1450
  },
  {
    id: '14',
    question: 'Do you offer custom features for enterprise?',
    answer: 'Yes, we work closely with enterprise customers to develop custom features and integrations. Our enterprise team can help tailor the platform to your specific needs, including custom workflows, white-labeling options, and dedicated infrastructure.',
    category: FAQ_CATEGORIES[5],
    tags: ['enterprise', 'custom', 'features'],
    helpful: 134,
    views: 580
  }
];

const CONTACT_METHODS: ContactMethod[] = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    icon: Mail,
    link: 'mailto:support@example.com',
    linkText: 'support@example.com'
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Chat with our team in real-time',
    icon: MessageCircle,
    link: '#',
    linkText: 'Start Chat'
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Talk to our support team',
    icon: Phone,
    link: 'tel:+1234567890',
    linkText: '+1 (234) 567-890'
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Browse our comprehensive guides',
    icon: Book,
    link: '#',
    linkText: 'View Docs'
  }
];

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: 'How to reset password', category: 'account' },
  { id: '2', text: 'Pricing plans comparison', category: 'pricing' },
  { id: '3', text: 'API documentation', category: 'technical' },
  { id: '4', text: 'Data security measures', category: 'security' },
  { id: '5', text: 'Getting started guide', category: 'general' }
];

// ============================================
// Utility Functions
// ============================================

function filterFAQs(
  faqs: FAQItem[],
  searchQuery: string,
  selectedCategory: string | null
): FAQItem[] {
  let filtered = faqs;
  
  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter(faq => faq.category.id === selectedCategory);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  return filtered;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded px-1">{part}</mark>
      : part
  );
}

// ============================================
// Custom Hooks
// ============================================

function useFAQSearch() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const [helpfulVotes, setHelpfulVotes] = React.useState<Map<string, boolean>>(new Map());
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const toggleExpanded = React.useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const voteHelpful = React.useCallback((faqId: string, helpful: boolean) => {
    setHelpfulVotes(prev => new Map(prev).set(faqId, helpful));
  }, []);

  const filteredFAQs = React.useMemo(
    () => filterFAQs(FAQ_DATA, searchQuery, selectedCategory),
    [searchQuery, selectedCategory]
  );

  const expandAll = React.useCallback(() => {
    setExpandedItems(new Set(filteredFAQs.map(faq => faq.id)));
  }, [filteredFAQs]);

  const collapseAll = React.useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    expandedItems,
    toggleExpanded,
    helpfulVotes,
    voteHelpful,
    filteredFAQs,
    showSuggestions,
    setShowSuggestions,
    expandAll,
    collapseAll
  };
}

// ============================================
// Reusable Components
// ============================================

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
}

const SearchBar = React.memo<SearchBarProps>(({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Search FAQs...'
}) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className="
        w-full rounded-2xl bg-background/80 backdrop-blur-sm
        pl-12 pr-4 py-4 text-foreground
        border-2 border-border transition-all duration-300
        focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20
        placeholder:text-muted-foreground/60
      "
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    )}
  </div>
));
SearchBar.displayName = 'SearchBar';

interface CategoryFilterProps {
  categories: FAQCategory[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

const CategoryFilter = React.memo<CategoryFilterProps>(({
  categories,
  selected,
  onSelect
}) => (
  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => onSelect(null)}
      className={`
        inline-flex items-center gap-2 rounded-xl px-4 py-2 transition-all
        ${!selected || selected === 'all'
          ? 'bg-primary text-primary-foreground shadow-lg'
          : 'bg-card hover:bg-card/80 border border-border'
        }
      `}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">All</span>
    </button>
    
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onSelect(category.id)}
        className={`
          inline-flex items-center gap-2 rounded-xl px-4 py-2 transition-all
          ${selected === category.id
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-card hover:bg-card/80 border border-border'
          }
        `}
      >
        <category.icon className="h-4 w-4" />
        <span className="font-medium">{category.name}</span>
        {category.count && (
          <span className="ml-1 text-xs opacity-70">({category.count})</span>
        )}
      </button>
    ))}
  </div>
));
CategoryFilter.displayName = 'CategoryFilter';

interface FAQItemCardProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
  onVote: (helpful: boolean) => void;
  hasVoted: boolean | undefined;
  searchQuery: string;
}

const FAQItemCard = React.memo<FAQItemCardProps>(({
  item,
  isExpanded,
  onToggle,
  onVote,
  hasVoted,
  searchQuery
}) => (
  <div className="group relative rounded-2xl bg-card/50 backdrop-blur-sm border border-border transition-all hover:border-primary/50 hover:shadow-lg">
    {/* Category Badge */}
    <div className={`absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${item.category.color} px-3 py-1`}>
      <item.category.icon className="h-3 w-3 text-white" />
      <span className="text-xs font-medium text-white">{item.category.name}</span>
    </div>
    
    {/* Question Header */}
    <button
      onClick={onToggle}
      className="w-full px-6 pt-8 pb-4 text-left transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground pr-4">
          {highlightText(item.question, searchQuery)}
        </h3>
        <ChevronDown 
          className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>
      
      {/* Meta Info */}
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {item.views && (
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            {item.views} views
          </span>
        )}
        {item.helpful && (
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {item.helpful} found helpful
          </span>
        )}
        {item.updated && (
          <span>Updated: {item.updated}</span>
        )}
      </div>
    </button>
    
    {/* Answer Content */}
    <div
      className={`
        overflow-hidden transition-all duration-300
        ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div className="px-6 pb-6">
        <div className="border-t border-border pt-4">
          <p className="text-muted-foreground leading-relaxed">
            {highlightText(item.answer, searchQuery)}
          </p>
          
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Helpful Voting */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Was this helpful?</span>
            <div className="flex gap-2">
              <button
                onClick={() => onVote(true)}
                className={`
                  inline-flex items-center gap-1 rounded-lg px-3 py-1 transition-all
                  ${hasVoted === true
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }
                `}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Yes</span>
              </button>
              <button
                onClick={() => onVote(false)}
                className={`
                  inline-flex items-center gap-1 rounded-lg px-3 py-1 transition-all
                  ${hasVoted === false
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }
                `}
              >
                <X className="h-4 w-4" />
                <span className="text-sm">No</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
FAQItemCard.displayName = 'FAQItemCard';

const ContactCard = React.memo<{ method: ContactMethod }>(({ method }) => (
  <a
    href={method.link}
    className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border p-6 transition-all hover:border-primary/50 hover:shadow-lg"
  >
    <div className="relative z-10">
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
        <method.icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{method.title}</h3>
      <p className="mb-3 text-sm text-muted-foreground">{method.description}</p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        {method.linkText}
        <ExternalLink className="h-3 w-3" />
      </span>
    </div>
    
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
  </a>
));
ContactCard.displayName = 'ContactCard';

const FloatingShapes = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated SVG Patterns */}
    <svg className="absolute top-0 left-0 w-full h-full opacity-5">
      <defs>
        <pattern id="faq-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary">
            <animate attributeName="r" values="30;45;30" dur="8s" repeatCount="indefinite" />
          </circle>
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" transform="rotate(45 50 50)">
            <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="20s" repeatCount="indefinite" />
          </rect>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#faq-pattern)" />
    </svg>
    
    {/* Floating Question Marks */}
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float"
        style={{
          left: `${20 + i * 15}%`,
          top: `${10 + (i % 2) * 60}%`,
          animationDelay: `${i * 2}s`,
          animationDuration: `${15 + i * 2}s`
        }}
      >
        <HelpCircle className="h-8 w-8 text-primary opacity-10" />
      </div>
    ))}
    
    {/* Gradient Orbs */}
    <div className="absolute top-1/4 right-1/4 h-64 w-64 animate-blob rounded-full bg-purple-400 opacity-10 mix-blend-multiply blur-xl filter dark:opacity-5" />
    <div className="animation-delay-2000 absolute bottom-1/4 left-1/4 h-64 w-64 animate-blob rounded-full bg-blue-400 opacity-10 mix-blend-multiply blur-xl filter dark:opacity-5" />
    <div className="animation-delay-4000 absolute top-1/2 left-1/2 h-64 w-64 animate-blob rounded-full bg-pink-400 opacity-10 mix-blend-multiply blur-xl filter dark:opacity-5" />
  </div>
));
FloatingShapes.displayName = 'FloatingShapes';

const SearchSuggestions = React.memo<{ 
  suggestions: SearchSuggestion[]; 
  onSelect: (text: string) => void;
  show: boolean;
}>(({ suggestions, onSelect, show }) => {
  if (!show) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 z-20 mt-2 rounded-xl bg-card border border-border shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-2">
        <p className="px-3 py-2 text-xs font-medium text-muted-foreground">Popular searches</p>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.text)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm text-foreground">{suggestion.text}</span>
            <span className="text-xs text-muted-foreground">{suggestion.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
SearchSuggestions.displayName = 'SearchSuggestions';

// ============================================
// Main Component
// ============================================

export const Component = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    expandedItems,
    toggleExpanded,
    helpfulVotes,
    voteHelpful,
    filteredFAQs,
    showSuggestions,
    setShowSuggestions,
    expandAll,
    collapseAll,
  } = useFAQSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="relative">
        <FloatingShapes />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">
                Help Center
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
              How Can We
              <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Help You Today?
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Find answers to common questions, explore our documentation, or
              get in touch with our support team.
            </p>
          </div>

          {/* Search Section */}
          <div className="mx-auto max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 animation-delay-200">
            <div className="relative">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for answers..."
              />
              <SearchSuggestions
                suggestions={SEARCH_SUGGESTIONS}
                onSelect={setSearchQuery}
                show={showSuggestions && !searchQuery}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 animation-delay-400">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Browse by Category
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-card hover:bg-card/80 border border-border transition-all"
                >
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-card hover:bg-card/80 border border-border transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                  Collapse All
                </button>
              </div>
            </div>

            <CategoryFilter
              categories={FAQ_CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* FAQ Items */}
          <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 animation-delay-600">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item) => (
                <FAQItemCard
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.has(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                  onVote={(helpful) => voteHelpful(item.id, helpful)}
                  hasVoted={helpfulVotes.get(item.id)}
                  searchQuery={searchQuery}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse by category
                </p>
              </div>
            )}
          </div>

          {/* Still Need Help Section */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-purple-600/5 to-pink-600/5 p-8 sm:p-12 backdrop-blur-sm border border-border animate-in fade-in slide-in-from-bottom-4 duration-700 animation-delay-800">
            <div className="text-center mb-8">
              <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Still Need Help?
              </h2>
              <p className="text-muted-foreground">
                Our support team is here to assist you
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CONTACT_METHODS.map((method) => (
                <ContactCard key={method.id} method={method} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};