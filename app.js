const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read the images from the 'boards' directory
const boardsDirectory = path.join(__dirname, 'public', 'boards');

const getBoardImages = () => {
  return fs.readdirSync(boardsDirectory).filter(file => {
    const extension = path.extname(file).toLowerCase();
    return extension === '.jpg' || extension === '.png' || extension === '.svg';
  });
};

// Render the index page with the board images
app.get('/', (req, res) => {
  const boardImages = getBoardImages();
  res.render('index', { boardImages });
});

// Start the server
const port = 7777;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});