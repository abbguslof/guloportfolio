// src/plugins/remark-reading-time.mjs
// Custom zero-dependency Remark plugin calculating real reading time for thoughts

function nodeToString(node) {
  if (!node) return '';
  if (node.value) return node.value;
  if (node.children) return node.children.map(nodeToString).join(' ');
  return '';
}

export function remarkReadingTime() {
  return function (tree, { data }) {
    const text = nodeToString(tree);
    const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));

    if (!data.astro) data.astro = {};
    if (!data.astro.frontmatter) data.astro.frontmatter = {};

    data.astro.frontmatter.readingTime = {
      minutes,
      words,
      textEn: `~${minutes} min read`,
      textSv: `~${minutes} min läsning`,
    };
  };
}
