const path = require('path');
const fs = require('fs');

// Test the final path construction
const imageUrl = '/uploads/image-1763703941276-476630183.jpg';
const imagePath = path.join(__dirname, '..', 'server', 'uploads', path.basename(imageUrl));

console.log('Current __dirname:', __dirname);
console.log('Final imagePath:', imagePath);
console.log('File exists:', fs.existsSync(imagePath));