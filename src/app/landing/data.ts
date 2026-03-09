// src/app/landing/data.ts
// Pure data export - no components

export const COURSES = [
  { 
    name: "CAT Complete Roadmap", 
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
    answer: "This platform organizes the best free learning resources into structured roadmaps for competitive exams."
  },
  {
    id: "which-courses",
    question: "Which roadmaps are available?",
    answer: "The first roadmap currently focuses on CAT preparation. We are working to expand the list."
  },
  {
    id: "account-needed",
    question: "Do I need to create an account or register on learnmax?",
    answer: "No account is needed."
  },
  {
    id: "cost",
    question: "Does learnmax cost anything?",
    answer: "The learning material is free. The platform simply organizes the best freely available resources."
  }
] as const;