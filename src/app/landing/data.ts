// src/app/landing/data.ts
// Pure data export - no components

export const COURSES = [
  { 
    name: "SSC CGL Course", 
    icon: "💊", 
    learnmaxPrice: "₹99/mo", 
    originalPrice: "₹1,349", 
    savings: "93%" 
  },
  { 
    name: "UPSC Course", 
    icon: "🖊️", 
    learnmaxPrice: "₹199/mo", 
    originalPrice: "₹1,349", 
    savings: "85%" 
  },
  { 
    name: "CLAT Course", 
    icon: "💉", 
    learnmaxPrice: "₹199/mo", 
    originalPrice: "₹1,028", 
    savings: "81%" 
  },
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
    answer: "The website currently lists select high-demand competitive exam courses including CAT, UPSC, SSC CGL, and CLAT. We are working to expand the list."
  },
  {
    id: "account-needed",
    question: "Do I need to create an account or register on learnmax?",
    answer: "No account is needed to browse prices. To enroll in courses, you will follow a simple checkout process with secure payment."
  },
  {
    id: "cost",
    question: "Does learnmax cost anything?",
    answer: "There is no cost to use learnmax. You simply pay the listed Most-Favored-Learning price for your course."
  }
] as const;