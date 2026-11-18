// Manual prototype packaging only. Reads repository assets; makes no network calls.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const folder = new URL('./', import.meta.url);
const read = (name) => readFile(new URL(name, folder), 'utf8');
let html = await read('index.html');
let css = await read('prototype.css');
let js = await read('prototype.js');
for (const name of ['DMSans', 'SpaceGrotesk']) {
  const file = `../../../../public/fonts/${name}.woff2`;
  const bytes = await readFile(new URL(file, folder));
  css = css.replaceAll(
    file,
    `data:font/woff2;base64,${bytes.toString('base64')}`,
  );
}
for (const name of ['wordmark-compact', 'wordmark-compact-dark']) {
  const file = `../../../../public/brand/${name}.svg`;
  const bytes = await readFile(new URL(file, folder));
  const uri = `data:image/svg+xml;base64,${bytes.toString('base64')}`;
  html = html.replaceAll(file, uri);
  js = js.replaceAll(file, uri);
}
const notices = await Promise.all(
  ['DMSans', 'SpaceGrotesk'].map((name) =>
    read(`../../../../public/fonts/${name}-OFL.txt`),
  ),
);
const normalizedNotices = notices.map((notice) =>
  notice
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n'),
);
html = html.replace(
  '<link rel="stylesheet" href="prototype.css" />',
  `<style>${css}</style>`,
);
html = html.replace(
  '<script src="prototype.js" type="module"></script>',
  `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>`,
);
html = html.replace(
  '</body>',
  `<script type="text/plain" id="font-licenses">${normalizedNotices.join('\n\n')}</script></body>`,
);
const output = new URL('standalone.html', folder);
await writeFile(output, html);
process.stdout.write(
  `${fileURLToPath(output)} (${Buffer.byteLength(html)} bytes)\n`,
);
