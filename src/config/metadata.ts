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
    default: `${brandName} - Interactive Real-time Quiz Platform`,
  },
  description:
    "StackQuiz is an interactive real-time quiz platform. Create live quizzes, engage participants with instant feedback, compete on leaderboards, and revolutionize learning. Perfect for education, training, corporate events, and entertainment.",
  keywords: [
    "quiz",
    "real-time quiz",
    "interactive quiz",
    "live quiz",
    "quiz platform",
    "online quiz",
    "quiz game",
    "quiz maker",
    "leaderboard",
    "education platform",
    "interactive learning",
    "knowledge test",
    "live leaderboard",
    "real-time leaderboard",
    "quiz competition",
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
    title: `${brandName} - Interactive Real-time Quiz Platform`,
    description:
      "Create and participate in engaging real-time quizzes with live leaderboards and instant feedback. Perfect for education, training, and entertainment.",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: `${brandName} - Interactive Real-time Quiz Platform`,
        type: "image/png",
      },
      {
        url: defaultImage,
        width: 800,
        height: 600,
        alt: `${brandName} Logo - Quiz Platform`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} - Interactive Real-time Quiz Platform`,
    description:
      "Create and participate in engaging real-time quizzes with live leaderboards and instant feedback. Perfect for education, training, and entertainment.",
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
    title: "Join a Live Quiz - StackQuiz Interactive Quiz Platform",
    description:
      "Join or create engaging real-time quizzes with live leaderboards and instant feedback. Enter a session code and compete with participants worldwide on StackQuiz.",
    keywords: "join quiz, live quiz, session code, real-time quiz, interactive learning",
    openGraph: {
      type: "website",
      title: "Join a Live Quiz - StackQuiz",
      description:
        "Join or create engaging real-time quizzes with live leaderboards.",
      url: baseUrl,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Join a Live Quiz",
          type: "image/png",
        },
      ],
    },
  },
  explore: {
    title: "Explore Quizzes - Discover 1000s of Topics",
    description:
      "Discover and explore thousands of interactive quizzes across different categories. Find the perfect quiz to test your knowledge in science, history, technology, and more. Browse by difficulty and rating.",
    keywords: "explore quizzes, browse quizzes, quiz categories, quiz discovery, find quizzes, educational quizzes",
    openGraph: {
      type: "website",
      title: "Explore Quizzes - StackQuiz",
      description:
        "Discover thousands of quizzes across different categories and topics.",
      url: `${baseUrl}/explore`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Explore Quizzes",
          type: "image/png",
        },
      ],
    },
  },
  dashboard: {
    title: "My Dashboard - Quiz Statistics & History",
    description:
      "Access your quiz statistics, history, created quizzes, and saved quizzes all in one place. Track your progress, performance, and achievements on StackQuiz.",
    keywords: "dashboard, my quizzes, quiz history, statistics, progress tracking, quiz performance, achievements",
    openGraph: {
      type: "website",
      title: "My Dashboard - StackQuiz",
      description:
        "View your quiz statistics, history, and saved quizzes.",
      url: `${baseUrl}/dashboard`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - My Dashboard",
          type: "image/png",
        },
      ],
    },
  },
  create: {
    title: "Create Quiz - Quiz Builder & Question Designer",
    description:
      "Create your own interactive quiz in minutes using our powerful quiz builder. Add questions, options, set difficulty levels, and share with friends and students. Start creating engaging quizzes now!",
    keywords: "create quiz, quiz builder, quiz creator, make quiz, question builder, quiz designer, quiz templates",
    openGraph: {
      type: "website",
      title: "Create Quiz - StackQuiz",
      description:
        "Create your own interactive quiz with our powerful quiz builder.",
      url: `${baseUrl}/quizbuilder`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Create Quiz",
          type: "image/png",
        },
      ],
    },
  },
  joinLive: {
    title: "Join Live Quiz Session - Real-time Competition",
    description:
      "Join a live quiz session with other participants in real-time. Enter the session code and start competing now on StackQuiz. Compete with friends or participants worldwide.",
    keywords: "join quiz, live quiz session, session code, real-time competition, quiz competition, online quiz",
    openGraph: {
      type: "website",
      title: "Join Live Quiz - StackQuiz",
      description: "Join a live quiz session and compete with other participants.",
      url: `${baseUrl}/join-room`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Join Live Quiz",
          type: "image/png",
        },
      ],
    },
  },
  play: {
    title: "Play Quiz - Answer Questions & Compete",
    description:
      "Answer quiz questions in real-time and compete with others. Get instant feedback on your answers, track your rank on the leaderboard, and improve your knowledge with StackQuiz.",
    keywords: "play quiz, answer questions, quiz game, leaderboard, real-time feedback, competition, quiz challenge",
    openGraph: {
      type: "website",
      title: "Play Quiz - StackQuiz",
      description: "Answer quiz questions and compete with others on the leaderboard.",
      url: `${baseUrl}/play`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Play Quiz",
          type: "image/png",
        },
      ],
    },
  },
  leaderboard: {
    title: "Leaderboard - Top Quiz Performers & Rankings",
    description:
      "Check the leaderboard to see top performers in real-time. Compare your score with others, track your ranking, and see who's winning on StackQuiz. Compete and climb the rankings.",
    keywords: "leaderboard, rankings, scores, top performers, competition, real-time rankings, high scores",
    openGraph: {
      type: "website",
      title: "Leaderboard - StackQuiz",
      description: "View rankings and top performers on our real-time leaderboard.",
      url: `${baseUrl}/leaderboard`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Leaderboard",
          type: "image/png",
        },
      ],
    },
  },
  about: {
    title: "About StackQuiz - Our Mission & Team",
    description:
      "Learn more about StackQuiz - our mission to revolutionize interactive learning through real-time quizzes. Meet our team and discover our vision for the future of education and engagement.",
    keywords: "about StackQuiz, company, mission, team, vision, company story, interactive learning revolution",
    openGraph: {
      type: "website",
      title: "About Us - StackQuiz",
      description:
        "Learn more about StackQuiz and our mission to revolutionize learning.",
      url: `${baseUrl}/about`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - About Us",
          type: "image/png",
        },
      ],
    },
  },
  login: {
    title: "Login - Sign in to StackQuiz Account",
    description:
      "Sign in to your StackQuiz account to access your quizzes, participate in live sessions, and track your progress. Secure authentication with Google, GitHub, and email.",
    keywords: "login, sign in, account, authentication, user account, StackQuiz login, secure login",
    openGraph: {
      type: "website",
      title: "Login - StackQuiz",
      description: "Sign in to your StackQuiz account to access your quizzes.",
      url: `${baseUrl}/login`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Login",
          type: "image/png",
        },
      ],
    },
  },
  signup: {
    title: "Sign Up - Create Your StackQuiz Account",
    description:
      "Create a new StackQuiz account in seconds using email, Google, or GitHub. Start creating quizzes, participating in live sessions, and competing with others today!",
    keywords: "signup, register, create account, join StackQuiz, new account, free account, user registration",
    openGraph: {
      type: "website",
      title: "Sign Up - StackQuiz",
      description: "Create a new StackQuiz account and start taking quizzes.",
      url: `${baseUrl}/signup`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Sign Up",
          type: "image/png",
        },
      ],
    },
  },
  quizDetail: {
    title: (quizTitle: string) => `${quizTitle} - Quiz Details on StackQuiz`,
    description:
      "View quiz details including questions, options, difficulty level, and creator information. Start taking this interactive quiz now on StackQuiz!",
    keywords: "quiz detail, quiz info, quiz questions, quiz difficulty, start quiz, take quiz",
    openGraph: {
      type: "article",
      title: (quizTitle: string) => `${quizTitle} - StackQuiz`,
      description: "View quiz details and start taking this interactive quiz.",
      url: `${baseUrl}/quiz`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Quiz Detail",
          type: "image/png",
        },
      ],
    },
  },
  hostDashboard: {
    title: "Host Dashboard - Manage Live Quiz Sessions",
    description:
      "Manage and host your quiz sessions with real-time analytics. View participant data, responses, scores, and results. Control your quiz session and engage with participants on StackQuiz.",
    keywords: "host, quiz session, manage quiz, host dashboard, real-time analytics, participant data, quiz management",
    openGraph: {
      type: "website",
      title: "Host Dashboard - StackQuiz",
      description: "Manage and host your quiz sessions with real-time analytics.",
      url: `${baseUrl}/dashboard/host`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Host Dashboard",
          type: "image/png",
        },
      ],
    },
  },
  report: {
    title: "Quiz Report - Analytics & Performance Analysis",
    description:
      "View detailed analysis and reports of your quiz sessions. Track participant performance, response time, answer accuracy, and detailed insights. Download reports for further analysis.",
    keywords: "report, analytics, quiz results, performance analysis, participant data, quiz insights, detailed report",
    openGraph: {
      type: "article",
      title: "Quiz Report - StackQuiz",
      description: "View detailed analysis and reports of your quiz sessions.",
      url: `${baseUrl}/report`,
      siteName: brandName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "StackQuiz - Quiz Report",
          type: "image/png",
        },
      ],
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
