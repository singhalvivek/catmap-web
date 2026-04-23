export const COURSES = [
  {
    name: "CAT Roadmap",
    icon: "📚"
  },
] as const;

export const FAQS = [
  {
    id: "what-is-studynaksha",
    question: "What is StudyNaksha?",
    answer: "This platform organizes the best free learning resources into structured roadmaps for competitive exams."
  },
  {
    id: "which-courses",
    question: "Which roadmaps are available?",
    answer: "The first roadmap currently focuses on CAT preparation. We are working to expand the list."
  },
  {
    id: "account-needed",
    question: "Do I need to create an account or register on StudyNaksha?",
    answer: "No account is needed to browse roadmaps and resources. Sign in with Google only if you want to save your progress across sessions."
  },
  {
    id: "cost",
    question: "Does StudyNaksha cost anything?",
    answer: "The learning material is free. The platform simply organizes the best freely available resources."
  },
  {
    id: "track-progress",
    question: "How do I track progress?",
    answer: "Open any roadmap, click a subtopic, and mark it as In Progress or Completed using the status picker. Your overall progress percentage updates instantly across the tree."
  },
  {
    id: "progress-without-login",
    question: "Does my progress save if I am not logged in?",
    answer: "No. Progress is tied to your Google account and saved to the cloud. Without signing in, any status changes are lost when you close the tab."
  },
  {
    id: "suggest-resource",
    question: "How do I suggest a new resource?",
    answer: "Open any subtopic in the roadmap and click 'Suggest an edit'. Fill in the resource title, type, and link along with your name and email, then submit. The team reviews all suggestions before adding them."
  },
  {
    id: "data-updates",
    question: "Is the data updated regularly?",
    answer: "Yes. Resources and roadmap content are updated based on community suggestions and periodic reviews. If you spot an outdated link or missing topic, use the suggest-edit feature to let us know."
  }
] as const;
