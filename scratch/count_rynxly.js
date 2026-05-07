const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
const searchPattern = /rynxly/i;

function countInDir(dir, stats = { total: 0, files: {} }) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(process.cwd(), fullPath);

        if (fs.statSync(fullPath).isDirectory()) {
            if (!excludeDirs.includes(file)) {
                countInDir(fullPath, stats);
            }
        } else {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(new RegExp(searchPattern, 'g'));
            if (matches) {
                stats.total += matches.length;
                stats.files[relativePath] = matches.length;
            }
        }
    }
    return stats;
}

const results = countInDir(process.cwd());
console.log(JSON.stringify(results, null, 2));
