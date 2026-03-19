// parser.js
const { parse } = require('node-html-parser');
const { transform } = require('stream-transform');
const { promisify } = require('util');
const { console } = require('console');

const parseHtml = promisify(parse);

async function parseDocument(html) {
  const root = await parseHtml(html);
  return transform(root, async (node) => {
    if (node.type === 'text') {
      return node.text.trim();
    } else if (node.type === 'element') {
      return {
        type: 'element',
        tagName: node.tagName,
        attributes: node.attributes,
        children: await Promise.all(node.children.map(parseDocument)),
      };
    } else {
      return null;
    }
  });
}

module.exports = parseDocument;