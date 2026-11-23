import ts from 'typescript';
import type { MiniappRelease } from './manifest.ts';
import { slugPattern, validateRelease } from './manifest.ts';

interface Registration {
  slug: string;
  published: boolean;
}

function unwrap(node: ts.Expression): ts.Expression {
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  )
    return unwrap(node.expression);
  return node;
}

/** Interpret the documented static registry shape; never evaluate source code. */
export function registrations(source: string): Registration[] {
  const parsed = ts.createSourceFile(
    'registry.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const bindings = new Map<string, string>();
  let registry: ts.ArrayLiteralExpression | undefined;
  for (const statement of parsed.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const match = /^\.\/([a-z0-9-]+)\/metadata$/.exec(
        statement.moduleSpecifier.text,
      );
      if (!match) continue;
      const imports = statement.importClause?.namedBindings;
      if (
        !imports ||
        !ts.isNamedImports(imports) ||
        imports.elements.length !== 1
      )
        throw new Error(
          'Registry metadata must use one named import per miniapp.',
        );
      const binding = imports.elements[0];
      if (
        (binding.propertyName ?? binding.name).text !== 'metadata' ||
        !slugPattern.test(match[1])
      )
        throw new Error('Unsupported miniapp metadata import.');
      bindings.set(binding.name.text, match[1]);
    }
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        declaration.name.text !== 'miniappRegistry' ||
        !declaration.initializer
      )
        continue;
      let value = unwrap(declaration.initializer);
      if (
        ts.isCallExpression(value) &&
        ts.isIdentifier(value.expression) &&
        value.expression.text === 'validateRegistry' &&
        value.arguments.length === 1
      )
        value = unwrap(value.arguments[0]);
      if (!ts.isArrayLiteralExpression(value) || registry)
        throw new Error('Unsupported miniappRegistry declaration.');
      registry = value;
    }
  }
  if (!registry) throw new Error('A static miniappRegistry array is required.');
  const seen = new Set<string>();
  return registry.elements.map((element) => {
    if (!ts.isObjectLiteralExpression(element))
      throw new Error('Registry spreads and computed entries are unsupported.');
    const properties = new Map<string, ts.Expression>();
    for (const property of element.properties) {
      if (
        !ts.isPropertyAssignment(property) ||
        !ts.isIdentifier(property.name) ||
        properties.has(property.name.text) ||
        !['descriptor', 'loadEntry'].includes(property.name.text)
      )
        throw new Error('Unsupported registry property.');
      properties.set(property.name.text, property.initializer);
    }
    const descriptor = properties.get('descriptor');
    const slug =
      descriptor && ts.isIdentifier(descriptor)
        ? bindings.get(descriptor.text)
        : undefined;
    if (!slug || seen.has(slug))
      throw new Error('Unknown or duplicate registry descriptor.');
    seen.add(slug);
    const loader = properties.get('loadEntry');
    if (loader) {
      if (
        !ts.isArrowFunction(loader) ||
        loader.parameters.length !== 0 ||
        !ts.isCallExpression(loader.body) ||
        loader.body.expression.kind !== ts.SyntaxKind.ImportKeyword ||
        loader.body.arguments.length !== 1 ||
        !ts.isStringLiteral(loader.body.arguments[0]) ||
        loader.body.arguments[0].text !== `./${slug}/entry.astro`
      )
        throw new Error(
          'Miniapp loader must directly import its own entry.astro.',
        );
    }
    return { slug, published: loader !== undefined };
  });
}

export function productionRegistry(source: string, release: MiniappRelease) {
  validateRelease(release);
  const registered = registrations(source);
  const selected = new Map(
    release.miniapps.map((entry) => [entry.slug, entry]),
  );
  for (const slug of selected.keys()) {
    if (!registered.some((entry) => entry.slug === slug && entry.published))
      throw new Error(`Unknown or draft miniapp in production: ${slug}`);
  }
  // Keep catalogue order from the canonical source, independently of input order.
  const entries = registered.filter((entry) => selected.has(entry.slug));
  return [
    `import { validateRegistry, type MiniappRegistration } from '../lib/miniapp-registry';`,
    ...entries.map(
      ({ slug }, index) =>
        `import { metadata as app${index} } from './${slug}/metadata';`,
    ),
    ...entries.map(
      ({ slug }, index) =>
        `if (app${index}.slug !== ${JSON.stringify(slug)} || app${index}.status !== 'published') throw new Error('Registry metadata does not match the authorized miniapp.');`,
    ),
    'export const miniappRegistry = validateRegistry([',
    ...entries.map(
      ({ slug }, index) =>
        `  { descriptor: { ...app${index}, publishedAt: ${JSON.stringify(selected.get(slug)!.plannedReleaseDate)} }, loadEntry: () => import('./${slug}/entry.astro') },`,
    ),
    '] satisfies readonly MiniappRegistration[]);',
  ].join('\n');
}
