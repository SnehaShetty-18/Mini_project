const path = require('path');
const fs = require('fs');

// Test the fixed path construction
const imageUrl = '/uploads/image-1763703941276-476630183.jpg';
const imagePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));

console.log('Current __dirname:', __dirname);
console.log('Fixed imagePath:', imagePath);
console.log('File exists:', fs.existsSync(imagePath));