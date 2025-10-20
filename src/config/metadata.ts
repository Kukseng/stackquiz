/**
 * Centralized SEO Metadata Configuration
 * All metadata for the application is defined here for consistency and easy maintenance
 * This file helps with SEO optimization and serves as a single source of truth
 */

import type { Metadata } from "next";

// Base configuration
/**
 * Constants for SEO configuration
 */
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stackquiz-two.vercel.app';
const brandName = 'StackQuiz';
const brandTagline = 'Interactive Real-time Quiz Platform';
const description = 'Interactive Real-time Quiz Platform';
const defaultImage = "https://stackquiz.me/bg-meta.png";
const defaultLanguage = "en";

/**
 * Base metadata applied to all pages
 * Override specific fields in page-level metadata
 */
export const baseMetadata: Metadata = {
  title: {
    template: `%s | ${brandName}`,
    default: `${brandName} - ${brandTagline}`,
  },
  description:
    "Create and participate in engaging real-time quizzes with live leaderboards and instant feedback. Perfect for education, training, and entertainment.",
  keywords: [
    "quiz",
    "real-time quiz",
    "interactive quiz",
    "live quiz",
    "quiz platform",
    "online quiz",
    "leaderboard",
    "education",
    "learning",
    "knowledge test",
  ],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
    languages: {
      en: `${baseUrl}/en`,
      km: `${baseUrl}/km`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: brandName,
    title: `${brandName} - ${brandTagline}`,
    description:
      "Create and participate in engaging real-time quizzes with live leaderboards and instant feedback.",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: `${brandName} - ${brandTagline}`,
        type: "image/png",
      },
      {
        url: defaultImage,
        width: 800,
        height: 600,
        alt: `${brandName} Logo`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} - ${brandTagline}`,
    description:
      "Create and participate in engaging real-time quizzes with live leaderboards and instant feedback.",
    images: [defaultImage],
    creator: "@stackquiz",
    site: "@stackquiz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
  },
};

/**
 * Page-specific metadata configurations
 * Use these to override base metadata for specific routes
 */
export const pageMetadata = {
  home: {
    title: "Interactive Real-time Quiz Platform",
    description:
      "Join or create engaging real-time quizzes with live leaderboards. Experience interactive learning and knowledge testing.",
    keywords: "quiz, real-time, interactive, leaderboard, education",
    openGraph: {
      title: "StackQuiz - Interactive Real-time Quiz Platform",
      description:
        "Join or create engaging real-time quizzes with live leaderboards.",
      url: baseUrl,
    },
  },
  explore: {
    title: "Explore Quizzes",
    description:
      "Discover and explore thousands of quizzes across different categories. Find the perfect quiz to test your knowledge.",
    keywords: "explore, quiz categories, browse quizzes, quiz discovery",
    openGraph: {
      title: "Explore Quizzes - StackQuiz",
      description:
        "Discover thousands of quizzes across different categories.",
      url: `${baseUrl}/explore`,
    },
  },
  dashboard: {
    title: "My Dashboard",
    description:
      "Access your quiz statistics, history, and saved quizzes all in one place. Track your progress and performance.",
    keywords: "dashboard, my quizzes, quiz history, statistics, progress",
    openGraph: {
      title: "My Dashboard - StackQuiz",
      description:
        "View your quiz statistics, history, and saved quizzes.",
      url: `${baseUrl}/dashboard`,
    },
  },
  create: {
    title: "Create Quiz",
    description:
      "Create your own interactive quiz in minutes. Add questions, options, and share with others. Start creating now!",
    keywords: "create quiz, quiz builder, quiz creator, make quiz",
    openGraph: {
      title: "Create Quiz - StackQuiz",
      description:
        "Create your own interactive quiz with our powerful quiz builder.",
      url: `${baseUrl}/quizbuilder`,
    },
  },
  joinLive: {
    title: "Join Live Quiz",
    description:
      "Join a live quiz session with other participants. Enter the session code and start competing now!",
    keywords: "join quiz, live quiz, session code, join session",
    openGraph: {
      title: "Join Live Quiz - StackQuiz",
      description: "Join a live quiz session with other participants.",
      url: `${baseUrl}/join-room`,
    },
  },
  play: {
    title: "Play Quiz",
    description:
      "Answer quiz questions and compete with others. Get instant feedback and see your rank on the leaderboard.",
    keywords: "play quiz, answer questions, quiz game, leaderboard",
    openGraph: {
      title: "Play Quiz - StackQuiz",
      description: "Answer quiz questions and compete with others.",
      url: `${baseUrl}/play`,
    },
  },
  leaderboard: {
    title: "Leaderboard",
    description:
      "Check the leaderboard to see top performers. Compare your score with others and track your ranking.",
    keywords: "leaderboard, rankings, scores, top performers, competition",
    openGraph: {
      title: "Leaderboard - StackQuiz",
      description: "View rankings and top performers on our leaderboard.",
      url: `${baseUrl}/leaderboard`,
    },
  },
  about: {
    title: "About Us",
    description:
      "Learn more about StackQuiz - our mission, team, and vision for revolutionizing interactive learning.",
    keywords: "about, company, mission, team, vision",
    openGraph: {
      title: "About Us - StackQuiz",
      description:
        "Learn more about StackQuiz and our mission to revolutionize learning.",
      url: `${baseUrl}/about`,
    },
  },
  login: {
    title: "Login",
    description:
      "Sign in to your StackQuiz account to access your quizzes and participate in live sessions.",
    keywords: "login, sign in, account, authentication",
    openGraph: {
      title: "Login - StackQuiz",
      description: "Sign in to your StackQuiz account.",
      url: `${baseUrl}/login`,
    },
  },
  signup: {
    title: "Sign Up",
    description:
      "Create a new StackQuiz account and start creating or taking quizzes today!",
    keywords: "signup, register, create account, join",
    openGraph: {
      title: "Sign Up - StackQuiz",
      description: "Create a new StackQuiz account.",
      url: `${baseUrl}/signup`,
    },
  },
  quizDetail: {
    title: (quizTitle: string) => `${quizTitle} - Quiz Details`,
    description:
      "View quiz details including questions, options, and creator information. Start taking this quiz now!",
    keywords: "quiz detail, quiz info, quiz questions",
    openGraph: {
      title: (quizTitle: string) => `${quizTitle} - StackQuiz`,
      description: "View quiz details and start taking this quiz.",
      url: `${baseUrl}/quiz`,
    },
  },
  hostDashboard: {
    title: "Host Dashboard",
    description:
      "Manage and host your quiz sessions. View real-time participant data and results.",
    keywords: "host, quiz session, manage quiz, host dashboard",
    openGraph: {
      title: "Host Dashboard - StackQuiz",
      description: "Manage and host your quiz sessions.",
      url: `${baseUrl}/dashboard/host`,
    },
  },
  report: {
    title: "Quiz Report",
    description:
      "View detailed analysis and reports of quiz sessions. Track participant performance and responses.",
    keywords: "report, analytics, quiz results, performance",
    openGraph: {
      title: "Quiz Report - StackQuiz",
      description: "View detailed analysis of your quiz sessions.",
      url: `${baseUrl}/report`,
    },
  },
};

/**
 * Generate metadata for dynamic pages
 * Used for pages with dynamic parameters (e.g., quiz ID, session code)
 */
export const generateDynamicMetadata = (
  pageType: string,
  params?: Record<string, string | number>
) => {
  const metadata = pageMetadata[pageType as keyof typeof pageMetadata];
  if (!metadata) return baseMetadata;

  return {
    ...metadata,
    openGraph: {
      ...baseMetadata.openGraph,
      ...metadata.openGraph,
      url: params?.id
        ? `${baseUrl}/${pageType}/${params.id}`
        : `${baseUrl}/${pageType}`,
    },
  };
};

/**
 * Generate structured data for SEO
 * Helps search engines understand your content
 */
export const generateStructuredData = (type: string, data?: any) => {
  switch (type) {
    case "organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brandName,
        description: brandTagline,
        url: baseUrl,
        logo: defaultImage,
        sameAs: [
          "https://www.facebook.com/stackquiz",
          "https://twitter.com/stackquiz",
          "https://www.linkedin.com/company/stackquiz",
          "https://github.com/stackquiz",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Support",
          email: "support@stackquiz.me",
          url: `${baseUrl}/contact`,
        },
      };

    case "website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: brandName,
        url: baseUrl,
        description: baseMetadata.description,
        image: defaultImage,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/explore?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };

    case "quiz":
      return {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: data?.title || "Quiz",
        description: data?.description || "Take this quiz and test your knowledge",
        url: data?.url || baseUrl,
        image: data?.image || defaultImage,
        author: {
          "@type": "Person",
          name: data?.author || "StackQuiz User",
        },
        numberOfQuestions: data?.questionCount || 0,
        difficulty: data?.difficulty || "Medium",
      };

    case "breadcrumb":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data?.items || [],
      };

    default:
      return null;
  }
};

/**
 * SEO utilities for common tasks
 */
export const seoUtils = {
  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbs: (items: Array<{ label: string; url: string }>) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `${baseUrl}${item.url}`,
      })),
    };
  },

  /**
   * Generate FAQ structured data
   */
  generateFAQ: (
    faqs: Array<{ question: string; answer: string }>
  ) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  },

  /**
   * Generate Article structured data
   */
  generateArticle: (article: {
    headline: string;
    description: string;
    image?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
  }) => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.headline,
      description: article.description,
      image: article.image || defaultImage,
      author: {
        "@type": "Person",
        name: article.author || "StackQuiz Team",
      },
      datePublished: article.datePublished || new Date().toISOString(),
      dateModified: article.dateModified || new Date().toISOString(),
    };
  },
};

/**
 * Export all configuration
 */
const metadataConfig = {
  baseMetadata,
  pageMetadata,
  generateDynamicMetadata,
  generateStructuredData,
  seoUtils,
};

export default metadataConfig;
