export interface FooterPageContent {
  title: string
  paragraphs: string[]
}

export const FOOTER_PAGE_SLUGS = [
  'about',
  'careers',
  'contact',
  'blog',
  'get-the-app',
  'teach',
  'plans-pricing',
  'help-support',
  'business',
  'accessibility',
  'privacy',
  'sitemap',
  'terms',
] as const

export type FooterPageSlug = (typeof FOOTER_PAGE_SLUGS)[number]

export const footerPages: Record<FooterPageSlug, FooterPageContent> = {
  about: {
    title: 'About Us',
    paragraphs: [
      'The Learning Studio is a small collective of educators and makers focused on quality online learning. We believe in hands-on, practical courses and sustainable growth—helping learners across India and the world build real skills through structured, project-based content.',
      'We work closely with the local learning community. Our instructors teach live workshops and partner with institutions to bring industry-relevant curricula to students. We collaborate with organisations that share our mission: making education accessible, relevant, and rooted in real-world application.',
      'We support learning made with care: fair opportunities for instructors, transparent pricing in Indian Rupees, and content that respects your time and goals. We believe in the value of consistent effort, curiosity, and an honest commitment to getting better. Equal opportunity for every learner.',
    ],
  },
  careers: {
    title: 'Careers',
    paragraphs: [
      'The Learning Studio is always looking for talented people who care about education. We hire for product, engineering, content, and customer success roles.',
      'We offer a flexible, inclusive culture, competitive pay, and the chance to shape how millions of people learn. If you want to build something that lasts and helps others grow, we would like to hear from you.',
      'Open roles are listed on our careers board. Send your resume and a short note to careers@learningstudio.example.com. We review every application and get back to candidates within two weeks.',
    ],
  },
  contact: {
    title: 'Contact Us',
    paragraphs: [
      'Have a question, feedback, or need support? We are here to help.',
      'General inquiries: support@learningstudio.example.com. For course or billing issues, log in and use the Help option in your account. For instructor or business enquiries, write to partners@learningstudio.example.com.',
      'We aim to respond within 24–48 hours on business days. Our support team is available Monday–Friday, 9:00 AM–6:00 PM IST.',
    ],
  },
  blog: {
    title: 'Blog',
    paragraphs: [
      'The Learning Studio blog is where we share learning tips, product updates, and stories from our community.',
      'You will find articles on how to study effectively, career advice, new course launches, and behind-the-scenes updates from our team and instructors.',
      'Visit the blog from the link in the footer or follow us for the latest posts. We publish regularly and welcome your ideas and feedback.',
    ],
  },
  'get-the-app': {
    title: 'Get the App',
    paragraphs: [
      'Learn on the go with The Learning Studio mobile app. Download our app for iOS and Android to access your courses, track progress, and watch videos offline.',
      'The app includes all the features you need: browse and enrol in courses, stream or download lessons, get notifications for new content, and pick up where you left off on any device.',
      'Search for "The Learning Studio" in the App Store or Google Play to download. Your account and progress stay in sync across web and mobile.',
    ],
  },
  teach: {
    title: 'Teach on Learning Studio',
    paragraphs: [
      'Share your expertise with millions of learners. The Learning Studio instructor program lets you create and publish courses, set your own curriculum, and earn when students enrol.',
      'We provide the platform, tools, and support so you can focus on teaching. You get a dedicated dashboard, analytics, and guidance on creating engaging content. Many of our instructors have built a lasting audience and a steady income.',
      'If you have experience in tech, business, design, or any in-demand skill, apply to become an instructor. Submit your profile and a short course idea at teach.learningstudio.example.com.',
    ],
  },
  'plans-pricing': {
    title: 'Plans and Pricing',
    paragraphs: [
      'The Learning Studio offers flexible options so you can learn at your own pace and budget.',
      'Individual courses are priced in Indian Rupees (₹). You pay once per course and get lifetime access to the content, including updates. We also offer subscription plans for learners who want unlimited access to a curated library.',
      'Pricing is shown on each course page. Discounts and promotions may apply during sales. For teams and businesses, see Learning Studio for Business for volume and custom pricing.',
    ],
  },
  'help-support': {
    title: 'Help and Support',
    paragraphs: [
      'Need help with your account, a course, or payment? Our Help and Support section has answers to the most common questions.',
      'You can search our help centre by topic: account and login, enrolling and accessing courses, payments and refunds, certificates, and technical issues. We also provide step-by-step guides and short videos.',
      'If you cannot find what you need, contact us from the Help page or email support@learningstudio.example.com. We are here to help you succeed.',
    ],
  },
  business: {
    title: 'Learning Studio Business',
    paragraphs: [
      'Learning Studio for Business helps teams and organisations upskill with curated courses, tracking, and dedicated support.',
      'We offer team plans with admin dashboards, usage reports, and the ability to assign courses and track progress. Custom content and integrations can be arranged for larger organisations.',
      'To learn more or request a demo, visit business.learningstudio.example.com or email business@learningstudio.example.com. Our team will tailor a plan to your goals and size.',
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    paragraphs: [
      'The Learning Studio is committed to making its platform accessible to all users, including people with disabilities. We aim to meet or exceed applicable accessibility standards and to improve our product over time.',
      'We work to ensure that our website and learning experience are perceivable, operable, understandable, and robust. This includes keyboard navigation, screen reader compatibility, and clear visual contrast where possible.',
      'If you encounter an accessibility barrier or have suggestions, please contact us at accessibility@learningstudio.example.com. We take feedback seriously and will work to address it.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    paragraphs: [
      'The Learning Studio respects your privacy. This policy describes what data we collect, how we use it, and your choices.',
      'We collect information you provide when you register, enrol in courses, make purchases, or contact support. We also collect usage data (e.g. device, IP address, progress) to improve our services and personalise your experience. We do not sell your personal data to third parties for marketing.',
      'You can access, correct, or delete your data from your account settings. You may also opt out of marketing communications at any time. For full details, including data retention and international transfers, please read our complete Privacy Policy.',
    ],
  },
  sitemap: {
    title: 'Sitemap',
    paragraphs: [
      'A quick overview of the main sections of The Learning Studio:',
      'Home — Browse and search courses; featured and recommended learning paths. Dashboard — Your enrolled courses and quick links. Profile & Progress — Your profile, course progress, and certificates. Assignments — Quizzes and assignments for your courses. Cart — Your shopping cart and checkout. Login / Register — Sign in or create an account.',
      'Footer pages: About Us, Careers, Contact Us, Blog, Get the App, Teach on Learning Studio, Plans and Pricing, Help and Support, Learning Studio Business, Accessibility Statement, Privacy Policy, Terms of Use.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    paragraphs: [
      'By using The Learning Studio, you agree to these Terms of Use. Please read them carefully.',
      'You must use the platform only for lawful purposes and in line with our policies. You may not copy, redistribute, or misuse course content; harass others; or attempt to circumvent security or payment systems. We may suspend or terminate accounts that violate these terms.',
      'Course content is licensed for your personal, non-commercial use. Instructors retain ownership of their content. Refunds are handled according to our refund policy. We may update these terms from time to time; continued use after changes means you accept the updated terms. For questions, contact legal@learningstudio.example.com.',
    ],
  },
}

export function getFooterPage(slug: string): FooterPageContent | undefined {
  if (FOOTER_PAGE_SLUGS.includes(slug as FooterPageSlug)) {
    return footerPages[slug as FooterPageSlug]
  }
  return undefined
}
