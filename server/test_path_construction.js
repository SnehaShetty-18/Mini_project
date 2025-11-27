const path = require('path');
const fs = require('fs');

// Simulate the path construction in mlService.js
const imageUrl = '/uploads/image-1763703941276-476630183.jpg';
const imagePath = path.join(__dirname, '..', imageUrl);

console.log('Current __dirname:', __dirname);
console.log('Constructed imagePath:', imagePath);
console.log('File exists:', fs.existsSync(imagePath));

// Let's also check what the actual file path should be
const actualFilePath = path.join(__dirname, '..', 'uploads', 'image-1763703941276-476630183.jpg');
console.log('Actual file path:', actualFilePath);
console.log('Actual file exists:', fs.existsSync(actualFilePath));