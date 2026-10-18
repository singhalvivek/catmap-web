// Wordmark — the StudyNaksha brand lockup, shared by the header, home masthead and footer
import Link from "next/link";
import SNLogo from "@/app/cat-prep/components/SNLogo";

type Props = {
  /** Display size of the name. The strapline and logo scale with it. */
  size?: "sm" | "md";
  /** False on dark ground, where the strapline would otherwise go invisible. */
  onDark?: boolean;
  /** Hidden when the lockup sits beside other labelling, as in the footer. */
  strapline?: boolean;
  href?: string;
};

export default function Wordmark({
  size = "md",
  onDark = false,
  strapline = true,
  href = "/",
}: Props) {
  const nameSize = size === "sm" ? 21 : 24;
  const logoSize = size === "sm" ? 28 : 32;

  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 11,
        textDecoration: "none",
      }}
    >
      <SNLogo size={logoSize} />
      <span>
        <span
          className="display"
          style={{
            display: "block",
            fontSize: nameSize,
            lineHeight: 1,
            color: onDark ? "#fff" : "var(--ink)",
          }}
        >
          StudyNaksha
        </span>
        {strapline && (
          <span
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: onDark ? "var(--accent-bright)" : "var(--accent-text)",
              marginTop: 3,
            }}
          >
            Free CAT preparation
          </span>
        )}
      </span>
    </Link>
  );
}
