"use client";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PlayStoreButton } from "@/components/ui/play-store-button";
import { AppStoreButton } from "@/components/ui/app-store-button";

const footerLinks = [
  {
    title: "Company",
    links: [
      { href: "#", label: "The Linomore Blog" },
      { href: "#", label: "Engineering Blog" },
      { href: "#", label: "Marketplace" },
      { href: "#", label: "What’s New" },
      { href: "#", label: "About" },
      { href: "#", label: "Press" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Link in Bio" },
      { href: "#", label: "Social Good" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "#", label: "Linktree for Enterprise" },
      { href: "#", label: "2023 Creator Report" },
      { href: "#", label: "2022 Creator Report" },
      { href: "#", label: "Charities" },
      { href: "#", label: "What’s Trending" },
      { href: "#", label: "Creator Profile Directory" },
      { href: "#", label: "Explore Templates" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#", label: "Help Topics" },
      { href: "#", label: "Getting Started" },
      { href: "#", label: "Linoree Pro" },
      { href: "#", label: "Features & How-tos" },
      { href: "#", label: "FAQs" },
      { href: "#", label: "Report a Violation" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Terms & Conditions" },
      { href: "#", label: "Privacy Notice" },
      { href: "#", label: "Cookie Notice" },
      { href: "#", label: "Trust Center" },
      { href: "#", label: "Cookie Preferences" },
      { href: "#", label: "Transparency Report" },
      { href: "#", label: "Law Enforcement Access Policy" },
    ],
  },
];

const socialLinks = [
  { icon: FacebookIcon, href: "#" },
  { icon: InstagramIcon, href: "#" },
  { icon: LinkedinIcon, href: "#" },
  { icon: TwitterIcon, href: "#" },
];

export function Footer2() {
  return (
    <footer className="bg-card/60 border-t">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Grid container with headings and links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          {footerLinks.map((item, i) => (
            <div key={i}>
              <h3 className="mb-4 text-xs">{item.title}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {item.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-border" />
        {/* Social Buttons + App Links */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a
                href={href}
                className={buttonVariants({
                  variant: "outline",
                  size: "icon",
                })}
                key={i}
              >
                <Icon className="size-5 text-muted-foreground" />
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            <a href="#">
              <AppStoreButton />
            </a>

            <a href="#">
              <PlayStoreButton />
            </a>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="text-center text-xs text-muted-foreground py-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://x.com/sshahaider"
              className="hover:text-foreground hover:underline"
            >
              sshahaider
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
