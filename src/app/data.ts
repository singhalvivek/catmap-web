// app/data.ts
// Pure data export - no components, no logic

export const COURSES = [
  { 
    name: "CAT Complete Prep", 
    icon: "📚", 
    learnmaxPrice: "₹599", 
    originalPrice: "₹24,999", 
    savings: "98%" 
  },
] as const;

export const FAQS = [
  {
    id: "what-is-learnmax",
    question: "What is learnmax?",
    answer: "learnmax is a student-first initiative that allows Indian students to purchase competitive exam courses at Most-Favored-Learning prices — the lowest prices available anywhere, powered by open-source structured learning content."
  },
  {
    id: "which-courses",
    question: "Which courses are listed on the website?",
    answer: "The website currently lists select high-demand competitive exam courses including CAT, UPSC, SSC CGL, and CLAT. We are working to expand the list. Sign up for notifications to be alerted when new courses are added."
  },
  {
    id: "account-needed",
    question: "Do I need to create an account or register on learnmax?",
    answer: "No account is needed to browse prices. To enroll in courses, you will follow a simple checkout process with secure payment. No hidden registrations."
  },
  {
    id: "local-access",
    question: "Can I access learnmax courses offline or through local centers?",
    answer: "learnmax works through digital delivery. All course content is accessible online via any device. We partner with select learning centers for hybrid support — check course pages for details."
  },
  {
    id: "teacher-content",
    question: "How do teachers contribute content to learnmax?",
    answer: "Educators can submit open-source structured learning modules through our contributor portal. All content is reviewed for quality and aligned with exam syllabi before being added."
  },
  {
    id: "cost",
    question: "Does learnmax cost anything?",
    answer: "There is no cost to use learnmax. You simply pay the listed Most-Favored-Learning price for your course. No subscription fees, no hidden charges."
  },
  {
    id: "insurance",
    question: "Can I use scholarships or financial aid with learnmax?",
    answer: "learnmax prices are offered as direct affordable pricing. Many courses qualify for additional student scholarships. The MFN price is often lower than traditional coaching center fees."
  },
  {
    id: "content-difference",
    question: "Why does course content look different than other platforms?",
    answer: "Content on this site is curated for clarity and exam-focus. While presentation may vary, all material covers the same syllabus and learning objectives as premium courses — just at a fraction of the cost."
  }
] as const;