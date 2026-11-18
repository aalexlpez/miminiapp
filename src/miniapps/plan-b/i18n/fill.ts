/** Single pass preserves user text that itself contains placeholder syntax. */
export function fill(
  template: string,
  values: Readonly<Record<string, string | number>>,
) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    String(values[key] ?? placeholder),
  );
}
