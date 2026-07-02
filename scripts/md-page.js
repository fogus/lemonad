#!/usr/bin/env node

const fs = require("fs");
const { marked } = require("marked");

const input = process.argv[2];
const output = process.argv[3];
const title = process.argv[4] || "API";

if (!input || !output) {
  console.error("usage: node scripts/md-page.js <input.md> <output.html> [title]");
  process.exit(1);
}

const markdown = fs.readFileSync(input, "utf8");
const body = marked.parse(markdown);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/screen.css">
</head>
<body>
${body}
</body>
</html>
`;

fs.writeFileSync(output, html);

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
