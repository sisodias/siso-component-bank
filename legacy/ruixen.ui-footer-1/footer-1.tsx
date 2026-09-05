"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { LucideIcon, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "./button";

interface FooterLink {
  label: string;
  href: string;
  badge?: string; // optional, e.g., "Pro", "New", "Hiring"
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface FooterProps {
  logoSrc: string;
  logoAlt: string;
  description: string;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  copyright?: string;
}

export const Footer: FC<FooterProps> = ({
  logoSrc,
  logoAlt,
  description,
  columns,
  socialLinks,
  copyright = `© ${new Date().getFullYear()} Ruixen. All Rights Reserved.`,
}) => {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-0">
          {/* Logo + Description + Social */}
          <div className="flex flex-col gap-4 md:w-1/3">
          <Link 
          href="https://21st.dev/?ref=ruixen"
          alt="ruixen-ui"
           >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={40}
              className="object-contain"
            />
            </Link>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
            <div className="flex space-x-4 mt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-8 md:w-2/3">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col space-y-2 min-w-[120px]">
                <h4 className="text-gray-900 dark:text-white font-semibold">{col.title}</h4>
                {col.links.map(({ label, href, badge }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
                  >
                    {label}
                    {badge && (
                      <span className="bg-[#B5FF21] dark:bg-green-600 text-xs px-1 rounded">
                        {badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>{copyright}</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
