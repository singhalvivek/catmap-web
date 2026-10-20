// DifficultyBadge — question difficulty as an ordinal, not as a borrowed status colour

/**
 * Difficulty is an ordered scale, not a verdict. It was painted in the semantic status
 * tints — Easy in the correct-answer green, Hard in the wrong-answer red — ten pixels above
 * a set of options that use those exact tints to mean correct and wrong. So on a question
 * you got right, the badge and the answer said the same thing in the same colour by
 * coincidence, and on a hard one they contradicted each other.
 *
 * `.ed-badge[data-level]` carries it as rule weight instead, which has the ordering built
 * in and survives greyscale.
 */
const LEVELS: Record<string, 1 | 2 | 3> = {
  Easy: 1,
  Medium: 2,
  "Medium-Hard": 3,
  Hard: 3,
};

export default function DifficultyBadge({ level }: { level: string }) {
  // Unknown labels sit in the middle rather than defaulting to the hardest, which is what
  // the previous ternaries did by falling through to their last branch.
  const weight = LEVELS[level] ?? 2;
  return (
    <span className="ed-badge" data-level={weight}>
      {level}
    </span>
  );
}
