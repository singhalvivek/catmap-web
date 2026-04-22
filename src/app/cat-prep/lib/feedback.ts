// Centralized feedback submission logic
export async function submitFeedback(payload: {
  parentId: number;
  nodeTitle: string;
  description: string;
  resources: {
    title: string;
    type: "VIDEO" | "ARTICLE";
    link: string;
  }[];
  name: string;
  email: string;
  comment: string;
}) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }

  return res.json();
}
