// JsonLd — renders a JSON-LD structured data script tag for schema.org rich snippets

type Props = { data: object };

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
