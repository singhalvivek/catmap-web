// NodeDescription — description section with view/edit modes and empty-state contribution nudge
"use client";

export default function NodeDescription({
  originalDesc,
  editMode,
  descText,
  onDescChange,
  onSuggestEdit,
}: {
  originalDesc: string;
  editMode: boolean;
  descText: string;
  onDescChange: (text: string) => void;
  onSuggestEdit: () => void;
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-trust-navy mb-2">Description</h3>

      {!editMode ? (
        originalDesc ? (
          <p className="leading-relaxed text-gray-700">{originalDesc}</p>
        ) : (
          <div className="rounded-lg border border-dashed border-calm-border bg-calm-bg p-4 text-sm text-gray-500">
            No description yet.{" "}
            <button
              onClick={onSuggestEdit}
              className="text-hope-teal underline hover:no-underline"
            >
              Be the first to suggest one.
            </button>
          </div>
        )
      ) : (
        <textarea
          value={descText}
          onChange={(e) => onDescChange(e.target.value)}
          className="w-full min-h-[120px] border rounded-md p-2 text-sm"
          placeholder="Edit description..."
        />
      )}
    </section>
  );
}
