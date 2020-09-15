const fs = require('fs');
const dirTree = require('directory-tree');

const tree = dirTree('./src/assets/notes', { extension: /\.md/ });

fs.writeFileSync('./src/app/notes/data/articles.json', JSON.stringify(tree, null, 2), 'utf-8');
