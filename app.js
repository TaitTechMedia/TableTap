/* /Users/atgehrhardt/Dev/TableTap/app.js */
const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read the images from the 'boards' directory
const boardsDirectory = path.join(__dirname, 'public', 'boards');

const getBoardImages = async (dir = boardsDirectory, prefix = '') => {
  let boardImages = [];
  const files = fs.readdirSync(dir);

  for (let file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      boardImages = [...boardImages, ...await getBoardImages(filePath, `${prefix}${file}/`)];
    } else {
      const extension = path.extname(file).toLowerCase();
      if (extension === '.jpg' || extension === '.png' || extension === '.svg') {
        const modalFilePath = path.join(dir, 'modal.json');
        let modalContent = {};
        try {
          modalContent = JSON.parse(await readFile(modalFilePath, 'utf-8'));
        } catch (err) {
          console.error(err);
        }
        boardImages.push({ image: `${prefix}${file.slice(file.lastIndexOf('/') + 1)}`, modalContent });
      }
    }
  }

  return boardImages;
};

// Render the index page with the board images
app.get('/', async (req, res) => {
  const boardImages = await getBoardImages();
  res.render('index', { activeView: 'boards', boardImages });
});

// Start the server
const port = 7777;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});