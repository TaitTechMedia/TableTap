const fs = require('fs');
const path = require('path');

// Function to walk through directory
function walkDirectory(directory, callback) {
    fs.readdirSync(directory).forEach((file) => {
        const absolutePath = path.join(directory, file);

        // Ignore node_modules, .git, package-lock.json, and .DS_Store
        if (absolutePath.includes('node_modules') || absolutePath.includes('.git') ||
            absolutePath.includes('package-lock.json') || absolutePath.includes('.DS_Store')) return;

        if (fs.statSync(absolutePath).isDirectory()) {
            // Recursive call for sub-directory
            walkDirectory(absolutePath, callback);
        } else {
            callback(absolutePath);
        }
    });
}

// Create a directory chart
let directoryChart = '--- Directory Chart ---\n';

function createDirectoryChart(directory) {
    walkDirectory(directory, (filePath) => {
        const relativePath = path.relative(__dirname, filePath);
        directoryChart += relativePath + '\n';
    });
}

// Function to import all code from files
let allCode = '\n--- Code ---\n';

function importAllCode(directory) {
    walkDirectory(directory, (filePath) => {
        // Ignore image files when importing code
        if (!['.png', '.jpg', '.jpeg', '.gif'].includes(path.extname(filePath))) {
            const code = fs.readFileSync(filePath, 'utf8');
            allCode += `/* ${filePath} */\n${code}\n\n`;
        }
    });
}

// Main directory (one directory above the current directory)
const mainDirectory = path.resolve(__dirname, '..');

createDirectoryChart(mainDirectory);
importAllCode(mainDirectory);

// Write all data to a single file
fs.writeFileSync('project_info.txt', directoryChart + allCode);