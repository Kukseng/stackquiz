/**
 * ExternalLink Component
 * Safe external link component with security best practices
 * - Opens in new tab
 * - Includes rel="noopener noreferrer" for security
 * - Accessible with sr-only text
 * - SEO-friendly
 */

import React from 'react';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export function ExternalLink({
  href,
  children,
  className = 'text-blue-600 hover:text-blue-800 hover:underline',
  title,
  ariaLabel,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title || 'Opens in new tab'}
      aria-label={ariaLabel}
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

export default ExternalLink;
