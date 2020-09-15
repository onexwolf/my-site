const fs = require('fs');
const dirTree = require('directory-tree');

const tree = dirTree('./src/assets/notes', { extension: /\.md/, exclude: /DS_Store/ });

fs.writeFileSync('./src/app/notes/data/notes.json', JSON.stringify(tree, null, 2), 'utf-8');
