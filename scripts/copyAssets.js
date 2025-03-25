const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../assets');
const destination = path.join(__dirname, '../dist/assets');

function copyAssets() {
  if (fs.existsSync(source)) {
    fs.cpSync(source, destination, { recursive: true });
    console.log('📂 Carpeta "assets" copiada a "dist/assets"');
  } else {
    console.log('⚠️ No se encontró la carpeta "assets" para copiar.');
  }
}

copyAssets();
