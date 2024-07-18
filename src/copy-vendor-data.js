
const fs = require('fs');
const path = require('path');

const sourcePath = '/home/anusha/PP1/src-tauri/vendor_data.json';
const destPath = path.resolve(__dirname, '..', 'src-tauri', 'vendor_data.json');

fs.copyFile(sourcePath, destPath, (err) => {
    if (err) {
        console.error('Error copying vendor_data.json:', err);
    } else {
        console.log('vendor_data.json copied successfully!');
    }
});
